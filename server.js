// SERVER-SIDE JAVASCRIPT

//require express in our app
var express = require('express'),
    db = require('./models'),
    bodyParser = require('body-parser');
// generate a new express app and call it 'app'
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
// serve static files from public folder
app.use(express.static(__dirname + '/public'));

var controllers = require('./controllers');

/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/bands', function homepage (req, res) {
  res.sendFile(__dirname + '/views/bands.html');
});

app.get('/concerts', function homepage (req, res) {
  res.sendFile(__dirname + '/views/concerts.html');
});

app.get('/members', function homepage (req, res) {
  res.sendFile(__dirname + '/views/user_profiles.html');
});

/*
 * JSON API Endpoints
 */

// API endpoint for describing all endpoints
app.get('/api', controllers.api.index);


// BAND CRUD

//Get all bands
app.get('/api/bands', controllers.bands.index);
//Get all bands
app.get('/api/bands', controllers.bands.index);


/**********
* SERVER *
**********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
 console.log('Express server is running on http://localhost:3000/');
});
