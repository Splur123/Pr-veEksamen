const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    answer: {type: String, required: false, default: ""},
    category: {type: String, required: true},
    status: {type: String, required: true},
    priority: {type: String, required: true},
    ownerId: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    ownerName: {type: String, required: true},
    answerer: String
}, {
    timestamps: true
  });

module.exports = mongoose.model("ticket", ticketSchema);