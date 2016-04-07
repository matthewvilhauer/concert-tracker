var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Concert = require("./concert.js");
var Song = require("./song.js");
var User = require(".user.js");

var BandSchema = new Schema({
    name: String,
    artistName: String,
    formationDate: String,
    label: String,
    description: String,
    genres: Array,
    concerts: [Concert.schema],
    songs: [Song.schema],
    followers: [User.schema]
});

var Band = mongoose.model('Band', BandSchema);
module.exports = Band;