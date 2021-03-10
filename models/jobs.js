const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    marks_criteria: {
        type: Number
    },
    description:{
        type: String,
        required: true
    }

})

module.exports = mongoose.model('Job',JobSchema);