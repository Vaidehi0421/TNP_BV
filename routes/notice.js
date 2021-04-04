const express=require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const Notice = require("../models/notices");
const { isLoggedIn, isComAd, isVerified } = require('../middleware');
const ExpressError = require("../utils/ExpressError");


//Displays all the notices
router.get('/',isLoggedIn, isVerified, catchAsync(async (req,res,next)=>{
    const notices = await Notice.find({});
    res.render('notices/index', { notices });
}))

//Displays the form to add a new notice
router.get('/new',isLoggedIn, isComAd, isVerified, (req,res) => {
    if(req.user.user_role === "Manager")
        throw new ExpressError("You are not allowed to access this page" , 401);
    res.render('notices/new');
})


//Save the new notice in the database
router.post('/', isLoggedIn,isComAd, isVerified, catchAsync(async (req,res,next) => {
    if(req.user.user_role === "Manager")
        throw new ExpressError("You are not allowed to access this page" , 401);
        const notice = new Notice(req.body.notices);
        notice.author = req.user._id;
        await notice.save();
        res.redirect('/notices');
}))

//Show a particular Notice
router.get('/:id',isLoggedIn,isVerified, catchAsync(async (req,res,next)=>{
    const { id } = req.params;
    const notice = await Notice.findById(id);
    res.render('notices/show', { notice });
}))

//to show the edit form
router.get('/:id/edit', isLoggedIn, isComAd,isVerified, catchAsync(async (req,res,next) => {
    const { id } = req.params;
    const notice = await Notice.findById(id);
    if((req.user.user_role === 'Manager') || (req.user._id.equals(notice.author)) || (req.user.user_role === 'Admin'))
    res.render('notices/edit', { notice });
    else
    throw new ExpressError("You are not not allowed access this page",401);
}))

//to save the edited details
router.put('/:id',isLoggedIn, isComAd, isVerified, catchAsync(async (req,res,next)=>{
    const { id } = req.params;
    const notice = await Notice.findById(id);
    if((req.user.user_role === 'Manager') || (req.user._id.equals(notice.author)) || (req.user.user_role === 'Admin'))
    {
        const noti = await Notice.findByIdAndUpdate(id, {...req.body.notices});
        res.redirect(`/notices/${notice._id}`);
    }
    else
    throw new ExpressError("You are not not allowed access this page",401);
}))

//to delete the notice
router.delete('/:id',isVerified, catchAsync(async (req,res,next) => {
    const { id } = req.params;
    const notice = await Notice.findById(id);
    if((req.user.user_role === 'Manager') || (req.user._id.equals(notice.author)) || (req.user.user_role === 'Admin'))
    {
        await Notice.findByIdAndDelete(id);
        res.redirect('/notices');
    }
    else
    throw new ExpressError("You are not not allowed access this page",401);

}))
module.exports = router; 