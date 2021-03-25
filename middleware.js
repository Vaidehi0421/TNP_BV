const ExpressError=require("./utils/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
       // req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.isCompany= (req,res,next)=> {
    if(req.user.user_role==='Company')
    {
        return next();
    }
    else throw new ExpressError("You don't have access to this page",404);
}

module.exports.isAdmin= (req,res,next)=> {
    if(req.user.user_role==='Admin')
    {
        return next();
    }
    else throw new ExpressError("You don't have access to this page",404);
}