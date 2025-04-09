const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
    question: {type: String, required: true},
    answer: {type: String, required: false, default: ""},
    answered: {type: String, required: true},
    }, {
    timestamps: true
      });

module.exports = mongoose.model("faq", faqSchema);