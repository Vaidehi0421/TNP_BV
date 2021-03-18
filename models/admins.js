const mongooose=require('mongoose');
const Schema=mongooose.Schema;

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
   },
   notice_id:[{
       type:Schema.Types.ObjectId,
       ref:'Notice'
   }],
   event_id:[{
       type:Schema.Types.ObjectId,
       ref:'Event'
   }]
});

module.exports=mongoose.model('Admin',AdminSchema);