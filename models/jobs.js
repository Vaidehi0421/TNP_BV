const mongoose = require('mongoose');
const Schema=mongoose.Schema;
const JobSchema = new Schema({
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
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'Company'
    }
})

module.exports = mongoose.model('Job',JobSchema);