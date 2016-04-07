var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Concert = require("./concert.js");
var Band = require("./band.js");

var UserProfileSchema = new Schema({
    firstName: String,
    lastName: String,
    image: String,
    user: User.schema,
    myConcerts: [Concert.schema],
    myBands: [Band.schema],
});

var UserProfile = mongoose.model('UserProfile', UserProfileSchema);
module.exports = UserProfile;
