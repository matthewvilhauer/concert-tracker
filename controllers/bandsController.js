var db = require('../models');


// GET /api/bands
function index(req, res) {
  db.Band.find( function(err, bands){
    if (err) {
      return console.log("Band Index Error: " + err);
    }
    res.json(bands);
  });
}

function create(req, res) {
  console.log('bands create', req.body);
  var newBand = new db.Band(req.body);
  newBand.save(function BandSaved(err, savedBand) {
    if (err) {
     return console.log("Could not save band. Error:" + err);
   }
    res.json(savedBand);
  });
}

function show(req, res) {

  var bandId = req.params.id;

    // find band in db by id
    db.Band.findOne({ _id: bandId }, function (err, foundBand) {
      if (err) {
        if (err.name === "CastError") {
          res.status(404).json({ error: "Nothing found by this ID." });
        } else {
          res.status(500).json({ error: err.message });
        }
      } else {
        res.json(foundBand);
      }
    });

}

function destroy(req, res) {
  bandId = req.params.id;
  console.log("Req params"+req.params);
  db.Band.findOneAndRemove({ _id: bandId }, function (err, deletedBand) {
    db.Band.find( function(err, bands){
      if (err) {
        return console.log("Band Index Error: " + err);
      }
      res.json(bands);
    });
  });
}

function update(req, res) {

}

// export public methods here
module.exports = {
  index: index,
  create: create,
  show: show,
  destroy: destroy,
  update: update
};
