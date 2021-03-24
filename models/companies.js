const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const CompanySchema=new Schema({
    cname:{
        type:String,
        required:true
    },
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
    }
});

module.exports=mongoose.model('Company',CompanySchema);