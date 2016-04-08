// This file allows us to seed our application with data
// simply run: `node seed.js` from the root of this project folder.

var db = require("./models");

var bandsList = [];
bandsList.push({
              name: 'Sound Tribe Sector 9',
              formationDate: '1996',
              recordLabel: '1320 Records',
              description: 'Serious space funk.',
              image_url: 'http://www.glidemagazine.com/glide/wp-content/uploads/2014/02/sts9-2012_press65.jpg',
              genres: [ 'Jamband, Electronic, Jamtronica' ]
            });
bandsList.push({
              name: 'Keller Williams',
              formationDate: '1996',
              recordLabel: 'SCI Fidelity Records',
              description: 'A ninja of love that keeps his kidney in a cooler.',
              image_url: 'http://www.thedistrictsf.com/images/events/KW1.jpg',
              genres: [ 'Jamband, Rock, Funk, Bluegrass' ]
            });
bandsList.push({
              name: 'The String Cheese Incident',
              formationDate: '1993',
              recordLabel: 'SCI Fidelity Records',
              description: 'Best band in the world!',
              image_url: '../images/String-cheese.jpg',
              genres: 'Jamband, Rock'
            });

db.Band.remove({}, function(err, bands){

  db.Band.create(bandsList, function(err, bands){
    if (err) { return console.log('ERROR', err); }
    console.log("all bands:", bands);
    console.log("created", bands.length, "bands");
    process.exit();
  });
});
