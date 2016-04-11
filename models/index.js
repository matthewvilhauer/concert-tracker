var mongoose = require("mongoose");
mongoose.connect( process.env.MONGOLAB_URI ||
                      process.env.MONGOHQ_URL ||
                      "YOUR CURRENT LOCALHOST DB CONNECTION STRING HERE" );

module.exports.Band = require("./band.js");
module.exports.Concert = require("./concert.js");
module.exports.User = require("./user.js");
