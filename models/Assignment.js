const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    solution_filename: {
        type: String,
        required: false,
        default: null
    },
    subject: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    due_date: {
        type: Date,
        required: true
    },
    accepted: {
        type: Boolean,
        default: false
    },
    is_paid: {
        type: Boolean,
        default: false
    },
    amount_paid: {
        type: String,
        default: null
    },
    expert_id: {
        type: String,
        default: null
    },
    expert_username: {
        type: String,
        default: null
    },
    upload_timestamp: {
        type: Date,
        required: true,
        default: Date.now
    },
    assigned_timestamp: {
        type: Date,
    },
    isSolved: {
        type: Boolean,
        default: false
    },
    solved_timestamp: {
        type: Date,
    },
    isChecked: {
        type: Boolean,
        default: false
    },
    checked_timestamp:{
        type: Date,
    }
});

const Assignment = mongoose.model('Assignment', AssignmentSchema);

module.exports = Assignment;