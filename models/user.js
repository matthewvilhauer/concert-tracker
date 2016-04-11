var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Concert = require("./concert.js");
var Band = require("./band.js");

var UserSchema = new Schema({
    username: String,
    password: String,
    email: String,
    firstName: String,
    lastName: String,
    image: String,
    myConcerts: [{
      type: Schema.Types.ObjectId,
      ref: 'Concert'
    }],
    myBands: [{
      type: Schema.Types.ObjectId,
      ref: 'Band'
    }]
});

var User = mongoose.model('User', UserSchema);
module.exports = User;
