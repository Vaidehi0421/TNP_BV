const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    marks_criteria: {
        type: Number,
        min: [0, 'Marks should be greater than zero'],
        max: 10
    },
    job_description:{
        type: String,
        required: true
    },
    location:{
        type:String,
        //required:true
    }

})

module.exports = mongoose.model('Job',JobSchema);