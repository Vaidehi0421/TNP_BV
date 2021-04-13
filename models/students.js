const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const StudentSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    user_role:{
        type:String,
        enum:['Student','Admin','Company','Manager'],
        required:true,
        default:'Student'
    },
    smartcard_id:{
        type:String,
        required:true
    },
    verified:{
        type:Boolean,
        default: false
    },
    placed:{
        type:Boolean,
        default:false
    },
    active_backlog:{
        type:Boolean,
        required:true
    },
    dob:{
        type:Date,
        required:true
    },
    contact_number:{
        type:String,
        required:true
    },
    cgpa:{
        type:Number,
        required:true
    },
    branch:{
        type:String,
        enum:['CS','IT','EC','EE','EI','CE','MT','BT'],
        required:true
    },
    tenth_marks:{
        type:Number,
        required:true
    },
    twelfth_marks:{
        type:Number,
        required:true
    },
    resume:{
        url:String,
        filename: String
    }
});

module.exports=mongoose.model('Student',StudentSchema);