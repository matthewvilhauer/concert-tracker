// SERVER-SIDE JAVASCRIPT

//require express in our app
var express = require('express'),
    app = express(),
    db = require('./models'),
    User = db.User,
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

//Authentication modules
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//Middleware for Authentication
app.use(cookieParser());
app.use(session({
  secret: 'OIUGUBCIBUIUBECasdf235bNUNIU73847', // change this!
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// passport config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//server configuration and settings
app.use(bodyParser.urlencoded({ extended: true }));
// serve static files from public folder
app.use(express.static(__dirname + '/public'));
// set view engine to hbs (handlebars)
app.set('view engine','hbs');

var controllers = require('./controllers');

/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */
app.get('/', function homepage (req, res) {
  // res.render('index', {user: JSON.stringify(req.user)} );
  res.render('index', {user: JSON.stringify(req.user) + ' || null'});
});
app.get('/bands', function homepage (req, res) {
  res.sendFile(__dirname + '/views/bands.html');
});
app.get('/concerts', function homepage (req, res) {
  res.sendFile(__dirname + '/views/concerts.html');
});
/* Single Templates */
app.get('/concerts/:concertId', function homepage (req, res) {
  res.sendFile(__dirname + '/views/concert.html');
});
app.get('/bands/:bandId', function homepage (req, res) {
  res.sendFile(__dirname + '/views/band.html');
});

/*
 * JSON API Endpoints
 */
// API endpoint for describing all endpoints
app.get('/api', controllers.api.index);

// BAND CRUD
//Get all bands
app.get('/api/bands', controllers.bands.index);
//Create a band
app.post('/api/bands', controllers.bands.create);
//Show a band
app.get('/api/bands/:bandId', controllers.bands.show);
//Update a band
app.put('/api/bands/:bandId', controllers.bands.update);
//Delete a band
app.delete('/api/bands/:bandId', controllers.bands.destroy);
//Get all bands and all concerts to populate select list on the add band form
app.get('/api/bandsList', controllers.bands.list);

// CONCERT CRUD
//Get all concerts
app.get('/api/concerts', controllers.concerts.index);
//Create a concert
app.post('/api/concerts', controllers.concerts.create);
//Show a concert
app.get('/api/concerts/:concertId', controllers.concerts.show);
//Update a concert
app.put('/api/concerts/:concertId', controllers.concerts.update);
//Delete a concert
app.delete('/api/concerts/:concertId', controllers.concerts.destroy);
//Get all concerts and all bands to populate select list on the add concert form
app.get('/api/concertsList', controllers.concerts.list);
// USER CRUD

//Show a User
app.get('/api/users/:userId', controllers.users.show);
//Show a User
app.put('/api/users/:userId', controllers.users.update);
//Add a cncert to myConcerts
app.post('api/users/:userId/concerts/:concertId', controllers.users.createFavoriteConcert);


//Show a User and their favorite Concerts
app.get('/users/:userId', controllers.users.profile);


// AUTH ROUTES
// show signup view
app.get('/signup', function (req, res) {
  res.render('signup'); // you can also use res.sendFile
});
// sign up new user, then log them in
// hashes and salts password, saves new user to db
app.post('/signup', function (req, res) {
  User.register(new User({ username: req.body.username }), req.body.password,
    function (err, newUser) {
      passport.authenticate('local')(req, res, function() {
        res.redirect('/');
      });
    }
  );
});
// show login view
app.get('/login', function (req, res) {
  res.render('login'); // you can also use res.sendFile
});
// log in user
app.post('/login', passport.authenticate('local'), function (req, res) {
  var userId = req.user._id;
  console.log(req.user);
  res.redirect('/users/'+userId);
});
// log out user
app.get('/logout', function (req, res) {
  console.log("BEFORE logout", JSON.stringify(req.user));
  req.logout();
  console.log("AFTER logout", JSON.stringify(req.user));
  res.redirect('/');
});


/**********
* SERVER *
**********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
 console.log('Express server is running on http://localhost:3000/');
});
