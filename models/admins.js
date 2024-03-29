const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const AdminSchema=new Schema({
   name:{
       type:String,
       required:true
   },
   username:{
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
       enum:['Student','Company','Admin','Manager'],
       default:'Admin',
       required:true
   },
   verified:{
       type:Boolean,
       default:false
   }
});

module.exports=mongoose.model('Admin',AdminSchema);