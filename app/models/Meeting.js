const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: true
    },
    month: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    events: [{
        title: {
            type: String,
            required: true
        },
        time: {
            type: String,
            required: true
        },
    }]

});

const Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = Meeting;
