const express=require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const Company = require("../models/companies");
const { isLoggedIn ,isComAd , isCompany , isAdmin, isVerified} = require('../middleware');
const ExpressError = require('../utils/ExpressError');

//View a Company
router.get('/', isLoggedIn, isAdmin, isVerified, catchAsync(async(req,res,next) => {
    const companies=await Company.find({});
    res.render('companies/allcompany',{companies});
}))

router.get('/:id',isLoggedIn,isComAd,catchAsync(async(req,res,next)=>{
    const { id }=req.params;
    const company = await Company.findById(id);
    res.render('companies/show',{company});
}))

//to verify a company
router.get('/:id/verify', isLoggedIn, isAdmin, isVerified, catchAsync(async(req,res,next) => {
    const { id } = req.params;
    const company = await Company.findById(id);
    company.verified = true;
    await Company.findByIdAndUpdate(id, company);
    res.redirect(`/companies/${company._id}`);
}))

//to show the edit form of company 
router.get('/:id/edit',isLoggedIn, catchAsync(async (req,res,next) => {
    const { id } = req.params;
    const company = await Company.findById(id);
    if(req.user.username===company.username)
        res.render('companies/edit', { company });
    else
        throw new ExpressError("You are not allowed to access this page",401);
}))

//to save the edited details of companies 
router.put('/:id',isLoggedIn, catchAsync(async (req,res,next)=>{
    const { id } = req.params;
    let company=await Company.findById(id);
    if(req.user.username===company.username){
        company.verified = false;
        await Company.findByIdAndUpdate(id, company);
        company = await Company.findByIdAndUpdate(id, {...req.body.companies});
        res.redirect(`/companies/${company._id}`);  
    }
    else
        throw new ExpressError("You are not allowed to access this page",401);
}))

module.exports=router;