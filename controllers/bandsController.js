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

}

function destroy(req, res) {

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
