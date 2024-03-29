const express=require('express');
const {storage}= require('../cloudinary')
const multer  = require('multer')
const upload = multer({storage })
const { cloudinary } = require('../cloudinary')
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const Student = require("../models/students");
const { isLoggedIn ,isComAd , isAdmin, isVerified, validatestudent } = require('../middleware');
const ExpressError = require('../utils/ExpressError');

//View a Student 
router.get('/:id',isLoggedIn,catchAsync(async(req,res,next)=>{
    const { id }=req.params;
    const student = await Student.findById(id); //viewing this student's details
    res.render('students/show',{student});
}))

// View All students 
router.get('/',isLoggedIn, isComAd, isVerified, catchAsync(async (req, res, next) => {
    const students=await Student.find({});
    res.render('students/allstudent',{students});
}))

//to show the edit form of student 
router.get('/:id/edit',isLoggedIn, catchAsync(async (req,res,next) => {
    console.log(req.params);
    const { id } = req.params;
    const student = await Student.findById(id);
    if(req.user.username===student.username)
        res.render('students/edit', { student });
    else
    { req.flash('error', 'You are not allowed to access this page');
    res.redirect('/');}
}))

//to verify a student
router.get('/:id/verify', isLoggedIn, isAdmin, isVerified, catchAsync(async(req,res,next) => {
    const { id } = req.params;
    const student = await Student.findById(id);
    student.verified = true;
    await Student.findByIdAndUpdate(id, student);
    res.redirect(`/students/${student._id}`);
}))

//to save the edited details of studets 
router.put('/:id',isLoggedIn, upload.single('resume'),catchAsync(async (req,res,next)=>{
    const { id } = req.params;
    let student=await Student.findById(id);
    if(req.user.username===student.username){
        student.verified = false;
        if(req.file){
        await cloudinary.uploader.destroy(student.resume.filename)
        student.resume = {url:req.file.path,filename:req.file.filename}

        }
        await Student.findByIdAndUpdate(id, student);
        student = await Student.findByIdAndUpdate(id, {...req.body.students});
          req.flash('success','Updated');
        
        res.redirect(`/students/${student._id}`);  
    }
    else
    { req.flash('error', 'You are not allowed to access this page');
    res.redirect('/');}
}))

module.exports = router;