var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserProfile = require("./user_profile.js");

var UserSchema = new Schema({
    username: String,
    password: String,
    email: String,
    userProfile: UserProfile.schema
});

var User = mongoose.model('User', UserSchema);
module.exports = User;
