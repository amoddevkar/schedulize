const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    attendees: {
        type: [String],
        required: true
    },
    location: {
        type: String,
        required: true
    },
    agenda: {
        type: String,
        required: true
    }
});

const Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = Meeting;
