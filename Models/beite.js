const mongoose = require('mongoose');

const beiteSchema = new mongoose.Schema({
    primærområde: String,
    fylke: String
});

module.exports = mongoose.model("beite", beiteSchema);