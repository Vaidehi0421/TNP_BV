const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const passportLocalMongoose=require('passport-local-mongoose');

const UserSchema=new Schema({
    user_role: {
        type: String,
        default: 'Admin'
    }   
});

UserSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model('User',UserSchema);