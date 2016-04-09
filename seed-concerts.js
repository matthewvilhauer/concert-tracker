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
              description: "Guests: with Zach Velmer and Jeffree Lerner on percussion, Hunter Brown on guitar, and David Phipps on keyboards (all from Sound Tribe Sector 9) and Shaman (?) on percussion with Scott Law on guitar, Jamie Janover on percussion, Aaron Holstein on guitar, Keller Williams, and all members of Sound Tribe Sector 9 ",
              location: "Horning's Hideout - North Plains, OR",
              image_url: "http://www.livedownloads.com/images/shows/sci050807_03.jpg",
              recording_url: "https://archive.org/embed/sci2004-06-19.flac16",
              band: newBand
            });

db.Concert.remove({}, function(err, concerts){

  db.Concert.create(concertsList, function(err, concerts){
    if (err) { return console.log('ERROR', err); }
    console.log("all concerts:", concerts);
    console.log("created", concerts.length, "concerts");
    process.exit();

    // db.Concert.find({  eventName: "String Cheese at Merriwhether"}, function(err, fuckYes) {
    //   if (err) { console.log("Shat a brick" , err);}
    //   console.log(fuckYes);
    //   fuckYes.save(function actuallyWork(no, yes) {
    //     if (no) { console.log("Damnit" , no);}
    //       console.log('Yes!!! ' , yes);
    //       process.exit();
    //   });
    // });
  });



});
