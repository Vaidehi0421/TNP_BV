const express=require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const Job = require("../models/jobs");
const { isLoggedIn } = require('../middleware');
router.get('/',isLoggedIn, catchAsync(async (req,res,next)=>{
    const jobs = await Job.find({});
    res.render('jobs/index', { jobs });
}))

//Displays the form to add a new job
router.get('/new',isLoggedIn,isLoggedIn, (req,res) => {
    res.render('jobs/new');
})


//Show a particular Job
router.get('/:id',isLoggedIn, catchAsync(async (req,res,next)=>{
    const { id } = req.params;
    const job = await Job.findById(id);
    res.render('jobs/show', { job });
}))



//Save the new job in the database
router.post('/', isLoggedIn,catchAsync(async (req,res,next) => {

    const job = new Job(req.body.jobs);
    await job.save();
    res.redirect('/jobs');
}))

//to show the edit form
router.get('/:id/edit',isLoggedIn, catchAsync(async (req,res,next) => {
    const { id } = req.params;
    const job = await Job.findById(id);
    res.render('jobs/edit', { job });
}))

//to save the edited details
router.put('/:id',isLoggedIn, catchAsync(async (req,res,next)=>{
    const { id } = req.params;
    const job = await Job.findByIdAndUpdate(id, {...req.body.jobs});
    res.redirect(`/jobs/${job._id}`);
}))

//to delete the job
router.delete('/:id', catchAsync(async (req,res,next) => {
    const { id } = req.params;
    await Job.findByIdAndDelete(id);
    res.redirect('/jobs');
}))
module.exports = router; 