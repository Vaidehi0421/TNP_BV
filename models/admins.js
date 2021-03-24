const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const AdminSchema=new Schema({
   name:{
       type:String,
       required:true
   },
   email:{
       type:String,
       required:true,
       unique:true
   },
   contact_number:{
       type:String,
       required:true
   },
   user_role:{
       type:String,
       enum:['Student','Company','Admin'],
       required:true
   }
});

module.exports=mongoose.model('Admin',AdminSchema);