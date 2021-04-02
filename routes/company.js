const express=require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const Company = require("../models/companies");
const { isLoggedIn ,isComAd , isCompany , isAdmin} = require('../middleware');
const ExpressError = require('../utils/ExpressError');

//View a Company
router.get('/', isLoggedIn, isAdmin, catchAsync(async(req,res,next) => {
    const companies=await Company.find({});
    res.render('companies/allcompany',{companies});
}))