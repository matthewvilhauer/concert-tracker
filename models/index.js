var mongoose = require("mongoose");
mongoose.connect(process.env.MONGOLAB_URI ||
                  process.env.MONGOHQ_URL ||
                  "mongodb://localhost/concert-tracker");

module.exports.Band = require("./band.js");
module.exports.Concert = require("./concert.js");
module.exports.Song = require("./song.js");
module.exports.User = require("./user.js");
module.exports.UserProfile = require("./user_profile.js");
