const mongooose=require('mongoose');
const Schema=mongooose.Schema;

const CompanySchema=new Schema({
    cname:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    user_role:{
        type:String,
        enum:['Student','Admin','Company'],
        required:true,
        default:'Company'
    },
    contact_number:{
        type:String,
        required:true
    },
    company_description:{
        type:String
    },
    verified:{
        type:Boolean,
        default:false
    },
    job_id:[
        {
        type:Schema.Types.ObjectId,
        ref:'Job'
    }
    ],
    notice_id:[{
        type:Schema.Types.ObjectId,
        ref:'Notice'
    }]
});

module.exports=mongoose.model('Company',CompanySchema);