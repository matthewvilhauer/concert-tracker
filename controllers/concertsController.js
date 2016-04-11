var db = require('../models');


// GET /api/concerts
function index(req, res) {
  var allConcerts;
  var allBands;

  db.Concert.find(function(err, concerts) {
      if (err) { console.log("Error retrieving all concerts", err); }
      res.json(concerts);
    });
}

function list(req, res) {
  var allConcerts;
  var allBands;

  db.Concert.find()
  .populate('band')
  .exec(function(err, concerts) {
      if (err) { console.log("Error retrieving all concerts", err); }
      allConcerts = concerts;

      // find Bands to use to populate band select options on concerts index.
      db.Band.find(function(err, bands) {
          if (err) { console.log("Error retrieving all bands", err); }
          allBands = bands;

          // return concerts and bands as JSON
          res.json({
            concerts: allConcerts,
            bands: allBands
          });
      });
  });
}

function create(req, res) {
  console.log('concerts create', req.body);

  var eventName = req.body.eventName;
  var concertDate = req.body.concertDate;
  var location = req.body.location;
  var setlist = req.body.setlist;
  var description = req.body.description;
  var image_url = req.body.image_url;
  var recording_url = req.body.recording_url;

  var bandId = req.body.bandId;

  // find band in db by id
  db.Band.findOne({ _id: bandId }, function (err, foundBand) {

    var updatedBand = foundBand;
    var updatedBandId = updatedBand._id;

    var newConcertEntry = {
      eventName: eventName,
      band: updatedBand._id,
      date: concertDate,
      location: location,
      setlist: setlist,
      description: description,
      image_url: image_url,
      recording_url: recording_url
    };

    var newConcert = new db.Concert(newConcertEntry);

    newConcert.save(function ConcertSaved(err, savedConcert) {
      if (err) {
       return console.log("Could not save concert. Error:" + err);
      }
      updatedBand.concerts.push(savedConcert._id);
      updatedBand.save(function(err, savedBand){
        console.log("Updated band: ", updatedBand);
        res.json(savedConcert);
      });

    });
  });
}

function show(req, res) {
  var concertId = req.params.concertId;
  // find concert in db by id
  db.Concert.findOne({ _id: concertId }, function (err, foundConcert) {
    if (err) {
      if (err.name === "CastError") {
        res.status(404).json({ error: "Nothing found by this ID." });
      }
      else { res.status(500).json({ error: err.message }); }
      }
      else { res.json(foundConcert); }
  }).populate('band').exec();
}

function destroy(req, res) {
  concertId = req.params.concertId;
  console.log("Req params"+req.params);

  db.Concert.findOneAndRemove({ _id: concertId }, function (err, deletedConcert) {
    res.json(deletedConcert);
  });
}

function update(req, res) {

  console.log('updating with data', req.body);

  db.Concert.findById(req.params.concertId, function(err, foundConcert) {

    if(err) { console.log('concertsController.update error', err); }

    foundConcert.eventName = req.body.eventName;
    foundConcert.date = req.body.concertDate;
    foundConcert.location = req.body.location;
    foundConcert.description = req.body.description;
    foundConcert.setlist = req.body.setlist;
    foundConcert.image_url = req.body.image_url;
    foundConcert.recording_url = req.body.recording_url;



    foundConcert.save(function(err, savedConcert) {

      var concertBandId = savedConcert.band;

      db.Band.findById(concertBandId, function(err, foundBand) {

        indexConcert = foundBand.concerts.indexOf(savedConcert._id);
        foundBand.concerts.splice(indexConcert, 1);
        foundBand.concerts.push(savedConcert._id);

        if(err) { console.log('saving altered concert failed'); }

        foundBand.save(function(err, savedBand){
          console.log("Updated band: ", savedBand);
          res.json(savedConcert);
        });
      });
    });
  }).populate('band').exec();
}

// export public methods here
module.exports = {
  index: index,
  create: create,
  show: show,
  destroy: destroy,
  update: update,
  //custom endpoints. Helps us consolidate viewModel logic
  list: list
};
