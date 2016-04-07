var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Song = require("./song.js");

var RecordingSchema = new Schema({
    eventName: String,
    year: String,
    date: Date,
    time: String,
    recordingNumber: Number,
    description: String,
    recordingURLs: Array,
    songs: [{
      type: Schema.Types.ObjectId,
      ref: 'Song'
    }]
});

var Recording = mongoose.model('Recording', RecordingSchema);
module.exports = Recording;
