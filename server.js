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

app.get('/concerts/:concertId', function homepage (req, res) {
  res.sendFile(__dirname + '/views/concert.html');
});

app.get('/myprofile', function homepage (req, res) {
  res.sendFile(__dirname + '/views/profile.html');
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

//Get all banss and all concertss to populate select list on the add band form
app.get('/api/bandsList', controllers.bands.list);

// app.get('/api/bands/:bandId/concerts', controllers.bands.concerts);

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

/**********
* SERVER *
**********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
 console.log('Express server is running on http://localhost:3000/');
});
