// This file allows us to seed our application with data
// simply run: `node seed.js` from the root of this project folder.

var db = require("./models");

var newBand = new db.Band({
              name: 'The String Cheese Incident',
              formationDate: '1993',
              recordLabel: 'SCI Fidelity Records',
              description: 'Best band in the world!',
              image_url: '../images/String-cheese.jpg',
              genres: 'Jamband, Rock',
            });
// bandsList.push({
//               name: 'Keller Williams',
//               formationDate: '1996',
//               recordLabel: 'SCI Fidelity Records',
//               description: 'A ninja of love that keeps his kidney in a cooler.',
//               image_url: 'http://www.thedistrictsf.com/images/events/KW1.jpg',
//               genres: 'Jamband, Rock, Funk, Bluegrass',
//             });

// bandsList.forEach(function(band) {
//   bandsIdArray = [];
//   bandsIdArray.push(band);
//   console.log(bandIdArray);
// });

var concertsList = [];
concertsList.push({
              eventName: "String Cheese Incident at Horning's Hideout",
              date: "2004-06-19",
              location: "Horning's Hideout - North Plains, OR",
              setlist: "Set 1: One Step Closer, Rhum 'n' Zouc, Rhythm of the Road > 45th of November, Water, Sweet Melinda^ > Orion's Belt",
              description: "Guests: with Zach Velmer and Jeffree Lerner on percussion, Hunter Brown on guitar, and David Phipps on keyboards (all from Sound Tribe Sector 9) and Shaman (?) on percussion with Scott Law on guitar, Jamie Janover on percussion, Aaron Holstein on guitar, Keller Williams, and all members of Sound Tribe Sector 9 ",
              image_url: "http://www.livedownloads.com/images/shows/sci050807_03.jpg",
              recording_url: "https://archive.org/embed/sci2004-06-19.flac16",
              band: {
    _id: '570b40aa45e20dfe72ed4337',
    genres: 'Jamband, Rock',
    image_url: '../images/String-cheese.jpg',
    description: 'Best band in the world!',
    recordLabel: 'SCI Fidelity Records',
    formationDate: '1993',
    name: 'The String Cheese Incident',
    __v: 0 }
            });

db.Concert.remove({}, function(err, concerts){

  db.Concert.create(concertsList, function(err, concerts){
    if (err) { return console.log('ERROR', err); }
    console.log("all concerts:", concerts);
    console.log("created", concerts.length, "concerts");
    process.exit();
  });

});
