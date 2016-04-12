var db = require('../models');


// GET /api/users
function index(req, res) {

}

function create(req, res) {

}

function show(req, res) {
  var userId = req.params.userId;
  // find user in db by id
  db.User.findOne({ _id: userId }, function (err, foundUser) {
    if (err) {
      if (err.name === "CastError") {
        res.status(404).json({ error: "Nothing found by this ID." });
      } else { res.status(500).json({ error: err.message }); }
      } else {
        res.json(foundUser);
      }
  });
}

function profile(req, res) {
  var userId = req.params.userId;
  var user;

  // find user in db by id
  db.User.findOne({ _id: userId }, function (err, foundUser) {
    if (err) {
      if (err.name === "CastError") {
        res.status(404).json({ error: "Nothing found by this ID." });
      } else { res.status(500).json({ error: err.message }); }
      } else {
        user = foundUser;

          //Concerts and bands
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
                  console.log('HHHHHHHHHHHHH');

                  // return concerts and bands as JSON
                  res.render('profile', {
                    concerts: allConcerts,
                    bands: allBands,
                    user: user
                  });
              });
          });
      }
  });
}

function showProfile(req, res) {
  var userId = req.params.userId;
  var user;
  var userConcerts;

  // find user in db by id
  db.User.findOne({ _id: userId }, function (err, foundUser) {
    if (err) {
      if (err.name === "CastError") {
        res.status(404).json({ error: "Nothing found by this ID." });
      } else { res.status(500).json({ error: err.message }); }
      } else {
        user = foundUser;

          //Concerts and bands
          var allConcerts;
          var allBands;
          db.Concert.find()
          .populate('band')
          .exec(function(err, concerts) {
              if (err) { console.log("Error retrieving all concerts", err); }
              allConcerts = concerts;
              userConcerts = foundUser.concerts;

              // find Bands to use to populate band select options on concerts index.
              db.Band.find(function(err, bands) {
                  if (err) { console.log("Error retrieving all bands", err); }
                  allBands = bands;
                  console.log('HHHHHHHHHHHHH');

                  // return concerts and bands as JSON
                  res.render('profile', {
                    userConcerts: userConcerts,
                    concerts: allConcerts,
                    bands: allBands,
                    user: user
                  });
              });
          });
      }
  });
}

function createFavoriteConcert(req, res) {

  var clickedUserId = req.params.userId;
  var clickedConcertId = req.params.concertId;

  console.log('updating concert: ', clickedConcertId, "for User: ", clickedUserId);

  db.Concert.findById(concertId, function(err, foundConcert) {

    if(err) { console.log('concertsController.favorite error', err); }

    db.User.findOne({ _id: userId }, function (err, foundUser) {

      var currentUser = foundUser;

      // from concertsController 126
      currentUser.concerts.push(foundConcert._id);

      currentUser.save(function(err, savedUser){
          console.log("Updated User: ", savedUser);
          res.send(200);
      });
    });
  });
}
function destroy(req, res) {

}

function update(req, res) {

  console.log('updating with data', req.body);

  db.User.findById(req.params.userId, function(err, foundUser) {

    if(err) { console.log('usersController.update error', err); }

    foundUser.username = req.body.username;
    foundUser.email = req.body.email;
    foundUser.firstName = req.body.firstName;
    foundUser.lastName = req.body.lastName;
    foundUser.image = req.body.image;
    foundUser.concerts = req.body.concerts;

    foundUser.save(function(err, savedUser) {
      if(err) {
        console.log('saving altered user failed');
      }
      res.json(savedUser);
    });
  }).populate('concerts').exec();

}

// export public methods here
module.exports = {
  index: index,
  create: create,
  show: show,
  destroy: destroy,
  update: update,
  //profile page
  profile: profile,
  createFavoriteConcert: createFavoriteConcert,
  showProfile: showProfile
};
