const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const NoticeSchema=new Schema({
    title:String,
    description:{
        type:String,
        required:true
    },
    issue_date:{
        type:Date,
        required:true
    },
    expiry_date:{
        type:String,
        required:true
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
});

module.exports=mongoose.model('Notice',NoticeSchema);
