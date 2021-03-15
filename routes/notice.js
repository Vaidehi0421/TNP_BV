const express=require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const Notice = require("../models/notices");


//Displays all the notices
router.get('/', catchAsync(async (req,res,next)=>{
    const notices = await Notice.find({});
    res.render('notices/index', { notices });
}))

//Displays the form to add a new notice
router.get('/new', (req,res) => {
    res.render('notices/new');
})


//Save the new notice in the database
router.post('/', catchAsync(async (req,res,next) => {

    const notice = new Notice(req.body.notices);
    await notice.save();
    res.redirect('/notices');
}))

//Show a particular Notice
router.get('/:id', catchAsync(async (req,res,next)=>{
    const { id } = req.params;
    const notice = await Notice.findById(id);
    res.render('notices/show', { notice });
}))

//to show the edit form
router.get('/:id/edit', catchAsync(async (req,res,next) => {
    const { id } = req.params;
    const notice = await Notice.findById(id);
    res.render('notices/edit', { notice });
}))

//to save the edited details
router.put('/:id', catchAsync(async (req,res,next)=>{
    const { id } = req.params;
    const notice = await Notice.findByIdAndUpdate(id, {...req.body.notices});
    res.redirect(`/notices/${notice._id}`);
}))

//to delete the notice
router.delete('/:id', catchAsync(async (req,res,next) => {
    const { id } = req.params;
    await Notice.findByIdAndDelete(id);
    res.redirect('/notices');
}))
module.exports = router; 