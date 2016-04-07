var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var SongSchema = new Schema({
    name: String,
    displayName: String,
    trackNumber: Number,
    time: String,
    location: String,
    eventURL: String,
});

var Song = mongoose.model('Song', SongSchema);
module.exports = Song;
