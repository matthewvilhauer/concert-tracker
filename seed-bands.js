// This file allows us to seed our application with data
// simply run: `node seed.js` from the root of this project folder.

var db = require("./models");

var bandsList = [];
bandsList.push({
              name: 'The String Cheese Incident',
              formationDate: '1993',
              recordLabel: 'SCI Fidelity Records',
              description: 'Best band in the world!',
              image_url: '../images/String-cheese.jpg',
              genres: 'Jamband, Rock'
            });
bandsList.push({
              name: 'Keller Williams',
              formationDate: '1996',
              recordLabel: 'SCI Fidelity Records',
              description: 'A ninja of love that keeps his kidney in a cooler.',
              image_url: 'http://www.thedistrictsf.com/images/events/KW1.jpg',
              genres: 'Jamband, Rock, Funk, Bluegrass'
            });
bandsList.push({
              name: 'Sound Tribe Sector 9',
              formationDate: '1996',
              recordLabel: '1320 Records',
              description: 'Serious space funk.',
              image_url: 'http://cdn.phillymag.com/wp-content/uploads/2014/10/STS9-e1413212404996-937x541.jpg',
              genres: 'Jamband, Electronic, Jamtronica'
            });

// var concertsList = [];
//
// concertsList.push({
//               eventName: "String Cheese at Merriwhether",
//               date: "10/31/2015",
//               time: "6:30pm doors",
//               description: "Maryland Music Festival",
//               location: "Merriwhether Post Pavilion",
//               event_url: "http://www.930.com/event/1049801-rjd2-washington/",
//               image_url: "http://cdn.ticketfly.com/i/00/01/86/24/87-elg.png",
//             });
//
// bandsList.forEach(function(band) {
//   band.concerts = concertsList;
// });


db.Band.remove({}, function(err, bands){

  db.Band.create(bandsList, function(err, bands){
    if (err) { return console.log('ERROR', err); }
    console.log("all bands:", bands);
    console.log("created", bands.length, "bands");
    process.exit();
  });
});
