var db = require('../models');


// GET /api/concerts
function index(req, res) {
  db.Concert.find( function(err, concerts){
    if (err) {
      return console.log("Concert Index Error: " + err);
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

  var concertId = req.params.id;

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

  concertId = req.params.id;
  console.log("Req params"+req.params);
  db.Concert.findOneAndRemove({ _id: concertId }, function (err, deletedConcert) {
    db.Concert.find( function(err, concerts){
      if (err) {
        return console.log("Concert Index Error: " + err);
      }
      res.json(concerts);
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
