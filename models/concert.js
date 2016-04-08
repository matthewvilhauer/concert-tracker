var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Band = require("./band.js");
var Song = require("./song.js");
var User = require("./user.js");
var Recording = require("./recording.js");

var ConcertSchema = new Schema({
    eventName: String,
    band: String,
    date: Date,
    time: String,
    description: String,
    location: String,
    event_url: String,
    image_url: String,
    songs: [Song.schema],
    attendees: [User.schema]
});

var Concert = mongoose.model('Concert', ConcertSchema);
module.exports = Concert;
