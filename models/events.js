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
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'Admin'
    }
})

module.exports= mongoose.model('Event', EventSchema);
