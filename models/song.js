var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Band = require("./band.js");
var Concert = require(".concert.js");

var SongSchema = new Schema({
    name: String,
    trackNumber: Number,
    time: String,
    location: String,
    eventURL: String,
    concert: [Concert.schema],
    band: [Band.schema]
});

var Song = mongoose.model('Song', SongSchema);
module.exports = Song;
