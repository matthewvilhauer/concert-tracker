// This file allows us to seed our application with data
// simply run: `node seed.js` from the root of this project folder.

var db = require("./models");

var concertsList = [];
concertsList.push({
              eventName: "RJD2 at 9:30",
              date: "5/10/1989",
              time: "7:30pm doors",
              description: "RJD2 is a great DJ.",
              location: "9:30 Club",
              event_url: "http://www.930.com/event/1049801-rjd2-washington/",
              image_url: "http://cdn.ticketfly.com/i/00/01/86/24/87-elg.png",
            });

db.Concert.remove({}, function(err, concerts){

  db.Concert.create(concertsList, function(err, concerts){
    if (err) { return console.log('ERROR', err); }
    console.log("all concerts:", concerts);
    console.log("created", concerts.length, "concerts");
    process.exit();
  });
});
