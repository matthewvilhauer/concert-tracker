// This file allows us to seed our application with data
// simply run: `node seed.js` from the root of this project folder.

var db = require("./models");

var bandsList = [];
bandsList.push({
              name: 'The String Cheese Incident',
              formationDate: '1993',
              recordLabel: 'SCI Fidelity Records',
              description: 'Best band in the world!',
              image: 'images/String-cheese.jpg',
              genres: [ 'Jamband', 'Rock' ]
            });


db.Band.remove({}, function(err, bands){

  db.Band.create(bandsList, function(err, bands){
    if (err) { return console.log('ERROR', err); }
    console.log("all bands:", bands);
    console.log("created", bands.length, "bands");
    process.exit();
  });

});
