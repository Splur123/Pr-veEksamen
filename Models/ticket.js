const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    category: {type: Number, required: true},
    status: {type: Number, required: true},
    user: {type: String, required: true}
});

module.exports = mongoose.model("ticket", ticketSchema);