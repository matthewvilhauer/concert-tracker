var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Band = require("./band.js");
var Song = require("./song.js");
var User = require("./user.js");
// var Recording = require("./recording.js");

var ConcertSchema = new Schema({
    eventName: String,
    date: Date,
    description: String,
    location: String,
    image_url: String,
    recording_url: String,
    songs: [Song.schema],
    attendees: [User.schema],
    band: {type : Schema.Types.ObjectId, ref : 'Band'}
});

var Concert = mongoose.model('Concert', ConcertSchema);
module.exports = Concert;
