const express=require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const Event = require("../models/events");
const { isLoggedIn, isAdmin, isVerified } = require('../middleware');
const Admin=require("../models/admins");
const ExpressError=require('../utils/ExpressError');

//EVENT ROUTES
//Displays all the events
router.get('/', isLoggedIn, isVerified, catchAsync(async (req,res,next)=>{
    const events = await Event.find({});
    res.render('events/index', { events });
}))

//Displays the form to add a new event
router.get('/new', isLoggedIn, isAdmin , isVerified, (req,res) => {
    if(req.user.user_role === 'Manager')
       { req.flash('error', 'You are not allowed to access this page');
       res.redirect('/');}
    res.render('events/new');
})

//Save the new event in the database
router.post('/', isLoggedIn,isAdmin,isVerified,catchAsync(async (req,res,next) => {
    if(req.user.user_role === 'Manager')
    { req.flash('error', 'You are not allowed to access this page');
    res.redirect('/');}
    const admin=await Admin.findOne({username:req.user.username})
    const event = new Event(req.body.events);
    event.author=admin._id;
    await event.save();
    req.flash('success', 'Successfully added new Event!');
    
    res.redirect('/events');
}))

//Show a particular Event
router.get('/:id', isLoggedIn,isVerified, catchAsync(async (req,res,next)=>{
    const { id } = req.params;
    const event = await Event.findById(id);
    res.render('events/show', { event });
}))

//to show the edit form
router.get('/:id/edit', isLoggedIn,isAdmin, isVerified, catchAsync(async (req,res,next) => {
    const admin=await Admin.findOne({username:req.user.username})
    const { id } = req.params;
    const event = await Event.findById(id).populate('author');
    if(req.user.user_role === "Manager" || admin._id.equals(event.author._id))
        res.render('events/edit', { event });
    else
        { req.flash('error', 'You are not allowed to access this page');
        res.redirect('/');}
}))

//to save the edited details
router.put('/:id',isLoggedIn,isAdmin, isVerified, catchAsync(async (req,res,next)=>{
    const admin=await Admin.findOne({username:req.user.username})
    const { id } = req.params;
    const event = await Event.findById(id).populate('author');
    if(req.user.user_role === "Manager" || admin._id.equals(event.author._id))
    {
        const eve = await Event.findByIdAndUpdate(id, {...req.body.events});
         req.flash('success','Successfully Updated');
        
        res.redirect(`/events/${event._id}`);
    }
    else
        { req.flash('error', 'You are not allowed to access this page');
        res.redirect('/');}
}))

//to delete the event
router.delete('/:id',isLoggedIn,isAdmin,isVerified,catchAsync(async (req,res,next) => {
    const admin=await Admin.findOne({username:req.user.username})
    const { id } = req.params;
    const event = await Event.findById(id).populate('author');
    if(req.user.user_role === "Manager" ||admin._id.equals(event.author._id))
    {   
        await Event.findByIdAndDelete(id);
         req.flash('success','Successfully deleted event!');
        
        res.redirect('/events');
    }
    else
        { req.flash('error', 'You are not allowed to access this page');
        res.redirect('/');}
}))

module.exports = router; 