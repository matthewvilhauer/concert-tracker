var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Concert = require("./concert.js");
var Band = require("./band.js");
var User = require("./user.js");

var UserProfileSchema = new Schema({
    firstName: String,
    lastName: String,
    image: String,
    myConcerts: {
      type: Schema.Types.ObjectId,
      ref: 'Concert'
    },
    myBands: [{
      type: Schema.Types.ObjectId,
      ref: 'Band'
    }]
});

var UserProfile = mongoose.model('UserProfile', UserProfileSchema);
module.exports = UserProfile;
