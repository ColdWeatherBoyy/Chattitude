const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_ATLAS_URI || "mongodb://127.0.0.1:27017/chattitude");

module.exports = mongoose.connection;
