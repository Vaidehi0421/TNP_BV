const express=require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const Admin = require("../models/admins");

const { isLoggedIn ,isComAd , isCompany ,isVerified, isAdmin, validateadmin} = require('../middleware');
const ExpressError = require('../utils/ExpressError');
//View  Admin
router.get('/', isLoggedIn, catchAsync(async(req,res,next) => {
if(req.user.user_role==='Manager'){
    const admins=await Admin.find({});
    res.render('admins/alladmin',{admins});
}
else{
     req.flash('error', 'You are not allowed to access this page');
        res.redirect('/');
}
}))
//view admin profile 
router.get('/:id',isLoggedIn,isAdmin,catchAsync(async(req,res,next)=>{
    const { id }=req.params;
    const admin = await Admin.findById(id);
    res.render('admins/show',{admin});
}))

//to verify a admin
router.get('/:id/verify', isLoggedIn, isVerified, catchAsync(async(req,res,next) => {
    if(req.user.user_role==='Manager'){
    const { id } = req.params;
    const admin = await Admin.findById(id);
    admin.verified = true;
    await Admin.findByIdAndUpdate(id, admin);
    res.redirect(`/admins/${admin._id}`);
    }
    else{
     req.flash('error', 'You are not allowed to access this page');
        res.redirect('/');}
}))

//to show the edit form of Admin
router.get('/:id/edit',isLoggedIn, isAdmin, catchAsync(async (req,res,next) => {
    const { id } = req.params;
    const admin = await Admin.findById(id);
    if(req.user.username===admin.username)
    
        res.render('admins/edit', {admin });
    else{
         req.flash('error', 'You are not allowed to access this page');
        res.redirect('/');}
}))

//to save the edited details of admins 
router.put('/:id',isLoggedIn,isAdmin, catchAsync(async (req,res,next)=>{
    const { id } = req.params;
    let admin=await Admin.findById(id);
    if(req.user.username===admin.username){
        admin.verified = false;
        await Admin.findByIdAndUpdate(id, admin);
        admin = await Admin.findByIdAndUpdate(id, {...req.body.admins});
        req.flash('success', 'Successfully updated ');
        res.redirect(`/admins/${admin._id}`);  
    }
    else
        { req.flash('error', 'You are not allowed to access this page');
        res.redirect('/');}
}))





module.exports=router;