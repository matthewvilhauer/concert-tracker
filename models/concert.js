var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Song = require("./song.js");
var User = require(".user.js");

var ConcertSchema = new Schema({
    eventName: String,
    date: Date,
    time: String,
    description: String,
    location: String,
    eventURL: String,
    setlist: [Song.schema],
    attendees: [User.schema]
});

var Concert = mongoose.model('Concert', ConcertSchema);
module.exports = Concert;
