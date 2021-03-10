const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const EventSchema=new Schema({
    title:String,
    description : {
      type:String,
      required:true
    },
    issue_date : {
        type:Date,
        required:true
    },
    expiry_date : {
        type:Date,
        required : true
    }
})

module.exports= mongoose.model('Event', EventSchema);