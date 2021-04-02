const express=require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const Job = require("../models/jobs");
const Company=require("../models/companies");
const { isLoggedIn ,isCompany } = require('../middleware');
const ExpressError = require('../utils/ExpressError');
router.get('/',isLoggedIn, catchAsync(async (req,res,next)=>{
    const jobs = await Job.find({}).populate('author');
    res.render('jobs/index', { jobs });
}))
//Displays the form to add a new job
router.get('/new',isLoggedIn,isCompany, (req,res) => {
    if(req.user.user_role === 'Manager')
        throw new ExpressError("You are not allowed to access this page", 401);
    res.render('jobs/new');
})

//Show a particular Job
router.get('/:id',isLoggedIn, catchAsync(async (req,res,next)=>{
    let company={};
    if(req.user.user_role==='Company')
    company=await Company.findOne({username:req.user.username})
    const { id } = req.params;
    const job = await Job.findById(id).populate('author');
    res.render('jobs/show', { job ,company});
}))

//Save the new job in the database
router.post('/', isLoggedIn,isCompany,catchAsync(async (req,res,next) => {
    if(req.user.user_role === 'Manager')
        throw new ExpressError("You are not not allowed access this page",401);
    const company=await Company.findOne({username:req.user.username})
    const job = new Job(req.body.jobs);
    job.author=company._id;
    await job.save();
    res.redirect('/jobs');
}))

//to show the edit form
router.get('/:id/edit',isLoggedIn,isCompany, catchAsync(async (req,res,next) => {
    const company=await Company.findOne({username:req.user.username})
    const { id } = req.params;
    const job = await Job.findById(id).populate('author');
    if((req.user.user_role === 'Manager') || (company._id.equals(job.author._id)))
        res.render('jobs/edit', { job });
    else
        throw new ExpressError("You are not not allowed access this page",401);
}))

//to save the edited details
router.put('/:id',isLoggedIn,isCompany, catchAsync(async (req,res,next)=>{
    const company=await Company.findOne({username:req.user.username})
    const { id } = req.params;
    const job = await Job.findById(id).populate('author');
    if((req.user.user_role === 'Manager') || (company._id.equals(job.author._id)))
    {
        const jo = await Job.findByIdAndUpdate(id, {...req.body.jobs});
        res.redirect(`/jobs/${job._id}`);
    }
    else
    throw new ExpressError("You are not not allowed access this page",401);
}))

//to delete the job
router.delete('/:id',isCompany, catchAsync(async (req,res,next) => {
    const company=await Company.findOne({username:req.user.username})
    const { id } = req.params;
    const job = await Job.findById(id).populate('author');
    if((req.user.user_role === 'Manager') || (company._id.equals(job.author._id)))
    {await Job.findByIdAndDelete(id);
    res.redirect('/jobs');
    }
    else
    throw new ExpressError("You are not not allowed access this page",401);
}))

module.exports = router; 