const ExpressError = require("./utils/ExpressError");
const Student  = require('./models/students');
const Company = require('./models/companies');
const Admin = require('./models/admins');
const Manager = require('./models/manager');
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


 