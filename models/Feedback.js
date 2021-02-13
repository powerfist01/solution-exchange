const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    email: {
        type: String,
    },
    name: {
        type: String,
    },
    message: {
        type: String,
    },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
