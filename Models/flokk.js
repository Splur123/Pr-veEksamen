const mongoose = require('mongoose');

const flokkSchema = new mongoose.Schema({
    eier: String,
    navn: String,
    serieinndeling: Number,
    buemerkeNavn: String,
    buemerkeBilde: Image
});

module.exports = mongoose.model("flokk", flokkSchema);