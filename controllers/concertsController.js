var db = require('../models');


// GET /api/concerts
function index(req, res) {
  db.Concert.find(function(err, concerts) {
      if (err) {
        console.log("Error retrieving all concerts", err);
      }
      res.json(concerts);
    });
}

function create(req, res) {
  console.log('concerts create', req.body);

  var newConcert = new db.Concert(req.body);

  newConcert.save(function ConcertSaved(err, savedConcert) {
    if (err) {
     return console.log("Could not save concert. Error:" + err);
   }
    res.json(savedConcert);
  });
}

function show(req, res) {

  var concertId = req.params.concertId;

  // find concert in db by id
  db.Concert.findOne({ _id: concertId }, function (err, foundConcert) {
    if (err) {
      if (err.name === "CastError") {
        res.status(404).json({ error: "Nothing found by this ID." });
      } else {
        res.status(500).json({ error: err.message });
      }
    } else {
      res.json(foundConcert);
    }
  });

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
    foundConcert.bandId = req.body.bandId;
    foundConcert.date = req.body.date;
    foundConcert.location = req.body.location;
    foundConcert.description = req.body.description;
    foundConcert.setlist = req.body.setlist;
    foundConcert.image_url = req.body.image_url;
    foundConcert.recording_url = req.body.recording_url;

    foundConcert.save(function(err, savedConcert) {
      if(err) { console.log('saving altered concert failed'); }
      res.json(savedConcert);
    });
  });
}

// export public methods here
module.exports = {
  index: index,
  create: create,
  show: show,
  destroy: destroy,
  update: update
};
