const express=require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const Job = require("../models/jobs");
const Company=require("../models/companies");
const { isLoggedIn ,isCompany, isVerified , validatejob} = require('../middleware');
const ExpressError = require('../utils/ExpressError');

router.get('/',isLoggedIn, isVerified,catchAsync(async (req,res,next)=>{
    const jobs = await Job.find({}).populate('author');
    res.render('jobs/index', { jobs });
}))
//Displays the form to add a new job
router.get('/new',isLoggedIn,isCompany, isVerified, (req,res) => {
    if(req.user.user_role === 'Manager')
    {
    req.flash('error', 'You are not allowed to access this page!');
    res.redirect('/jobs');
    }
    res.render('jobs/new');
})

//Show a particular Job
router.get('/:id',isLoggedIn, isVerified, catchAsync(async (req,res,next)=>{
    let company={};
    if(req.user.user_role==='Company')
    company=await Company.findOne({username:req.user.username})
    const { id } = req.params;
    const job = await Job.findById(id).populate('author');
    res.render('jobs/show', { job ,company});
}))

//Save the new job in the database
router.post('/', isLoggedIn,isCompany,isVerified,validatejob,catchAsync(async (req,res,next) => {
    if(req.user.user_role === 'Manager'){
    req.flash('error', 'You are not allowed to access this page');
    res.redirect('/jobs');
}
    const company=await Company.findOne({username:req.user.username})
    const job = new Job(req.body.jobs);
    job.author=company._id;
    await job.save();
    req.flash('success', 'Successfully added new job!');
    res.redirect('/jobs');
}))

//to show the edit form
router.get('/:id/edit',isLoggedIn,isCompany,isVerified, catchAsync(async (req,res,next) => {
   
    const company=await Company.findOne({username:req.user.username})
    const { id } = req.params;
    const job = await Job.findById(id).populate('author');
    if((req.user.user_role === 'Manager') || (company._id.equals(job.author._id)))
        res.render('jobs/edit', { job });
    else
    {
        req.flash('error', 'You are not allowed to access this page');
        res.redirect('/jobs');
    }
}))

//to save the edited details
router.put('/:id',isLoggedIn,isCompany,isVerified,validatejob,catchAsync(async (req,res,next)=>{
    const company=await Company.findOne({username:req.user.username})
    const { id } = req.params;
    const job = await Job.findById(id).populate('author');
    if((req.user.user_role === 'Manager') || (company._id.equals(job.author._id)))
    {
        const jo = await Job.findByIdAndUpdate(id, {...req.body.jobs});
        res.redirect(`/jobs/${job._id}`);
    }
    else
    {
        req.flash('error', 'You are not allowed to access this page');
        res.redirect('/jobs');
    }
}))

//to delete the job
router.delete('/:id',isCompany,isVerified, catchAsync(async (req,res,next) => {
    const company=await Company.findOne({username:req.user.username})
    const { id } = req.params;
    const job = await Job.findById(id).populate('author');
    if((req.user.user_role === 'Manager') || (company._id.equals(job.author._id)))
    {await Job.findByIdAndDelete(id);
    res.redirect('/jobs');
    }
    else
    {
        req.flash('error', 'You are not allowed to access this page');
        res.redirect('/jobs');
    }
}))

module.exports = router; 