const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const ManagerSchema=new Schema({
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
       enum:['Student','Company','Admin','Manager'],
       default:'Manager',
       required:true
   }
});

module.exports=mongoose.model('Manager',ManagerSchema);