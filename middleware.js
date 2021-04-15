const ExpressError = require("./utils/ExpressError");
const Student  = require('./models/students');
const Company = require('./models/companies');
const Admin = require('./models/admins');
const Manager = require('./models/manager');
const Joi = require('joi');
const { number } = require('joi');
const { adminSchema, companySchema, eventSchema, noticeSchema, studentSchema, jobSchema} = require('./schemas');

module.exports.validateadmin = (req, res, next) => {
    const { error } = adminSchema.validate(req.body);

    const redirectUrl = req.originalUrl;
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        req.flash('error',msg);
        res.redirect(redirectUrl);
    } else {
        next();
    }
}

module.exports.validatecompany = (req, res, next) => {
    const { error } = companySchema.validate(req.body);
 
    const redirectUrl = req.originalUrl;
    if (error) {
        console.log(error);
        const msg = error.details.map(el => el.message).join(',')
        req.flash('error',msg)
        res.redirect(redirectUrl);
    } else {
        next();
    }
}

module.exports.validateevent = (req, res, next) => {
    const { error } = eventSchema.validate(req.body);
 
    const redirectUrl = req.originalUrl;
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        req.flash('error',msg);
        res.redirect(redirectUrl);
    } else {
        next();
    }
}

module.exports.validatenotice = (req, res, next) => {
    const { error } = noticeSchema.validate(req.body);
    const redirectUrl = req.originalUrl;
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        req.flash('error',msg);
        res.redirect(redirectUrl);
    } else {
        next();
    }
}

module.exports.validatestudent = (req, res, next) => {
    const { error } = studentSchema.validate(req.body);
    //console.log(req.body);
    const redirectUrl = req.originalUrl;
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        req.flash('error',msg);
        res.redirect(redirectUrl);
    } else {
        next();
    }
}

module.exports.validatejob = (req, res, next) => {
    const { error } = jobSchema.validate(req.body);
    const redirectUrl = req.originalUrl;
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        req.flash('error',msg);
        res.redirect(redirectUrl);
    } else {
        next();
    }
}


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        
            req.flash('error', 'You must login first!');
           
        return res.redirect('/login');
    }
    next();
}

module.exports.isCompany= (req,res,next)=> {
    if(req.user.user_role==='Company' || req.user.user_role === 'Manager')
    {
        return next();
    }
    else{
        req.flash('error', 'You are not allowed to access this page');
        res.redirect('/');
    }
}

module.exports.isAdmin= (req,res,next)=> {
    if(req.user.user_role==='Admin' || req.user.user_role === 'Manager')
    {
        return next();
    }
   else{
        req.flash('error', 'You are not allowed to access this page');
        res.redirect('/');
    }
}

module.exports.isComAd = (req,res,next) => {
    if(req.user.user_role==='Admin' || req.user.user_role === 'Company' || req.user.user_role === 'Manager' )
    {
        return next();
    }
   else{
        req.flash('error', 'You are not allowed to access this page');
       
        res.redirect('/');
    }
}

module.exports.isVerified= async (req,res,next)=> {
    try{
        const username = req.user.username;
    if (req.user.user_role === 'Company') {
        const company = await Company.findOne({ username });
        if (company.verified === true) {
         return next();
        }
        else{
            req.flash('error', 'You are not verified yet!');
           
            res.redirect('/');
        }
    }
    else if (req.user.user_role === "Student") {
        const student = await Student.findOne({ username });
        if (student.verified === true) {
           return next();
        }
        else{
            req.flash('error', 'You are not verified yet!');
           
            res.redirect('/');
        }
    }
    else if (req.user.user_role === "Admin") {
        const admin = await Admin.findOne({ username });
        if (admin.verified === true) {
            return next();
        }
        else{
            req.flash('error', 'You are not verified yet!');
           res.redirect('/');
        }
    }
    else if(req.user.user_role === 'Manager') {
        return next();
    }
    }
    catch(err){
        res.render('error.ejs',{err});
    }
}


 