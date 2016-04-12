var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");

var Concert = require("./concert.js");
var Band = require("./band.js");

var UserSchema = new Schema({
    username: String,
    password: String,
    email: String,
    firstName: String,
    lastName: String,
    image: String,
    concerts: [{
      type: Schema.Types.ObjectId,
      ref: 'Concert'
    }],
});

UserSchema.plugin(passportLocalMongoose);
var User = mongoose.model('User', UserSchema);
module.exports = User;

module.exports.User = require("./user");
