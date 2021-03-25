const express=require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const Event = require("../models/events");
const { isLoggedIn, isAdmin } = require('../middleware');
const Admin=require("../models/admins");
const ExpressError=require('../utils/ExpressError');

//EVENT ROUTES
//Displays all the events
router.get('/', isLoggedIn, catchAsync(async (req,res,next)=>{
    const events = await Event.find({});
    res.render('events/index', { events });
}))

//Displays the form to add a new event
router.get('/new', isLoggedIn, isAdmin ,(req,res) => {
    res.render('events/new');
})

//Save the new event in the database
router.post('/', isLoggedIn,isAdmin,catchAsync(async (req,res,next) => {
    const admin=await Admin.findOne({username:req.user.username})
    const event = new Event(req.body.events);
    event.author=admin._id;
    await event.save();
    res.redirect('/events');
}))

//Show a particular Event
router.get('/:id', isLoggedIn,catchAsync(async (req,res,next)=>{
    const { id } = req.params;
    const event = await Event.findById(id);
    res.render('events/show', { event });
}))

//to show the edit form
router.get('/:id/edit', isLoggedIn,isAdmin,catchAsync(async (req,res,next) => {
    const admin=await Admin.findOne({username:req.user.username})
    const { id } = req.params;
    const event = await Event.findById(id).populate('author');
    if(admin._id.equals(event.author._id))
        res.render('events/edit', { event });
    else
        throw new ExpressError("You are not not allowed access this page",401);
}))

//to save the edited details
router.put('/:id',isLoggedIn,isAdmin, catchAsync(async (req,res,next)=>{
    const admin=await Admin.findOne({username:req.user.username})
    const { id } = req.params;
    const event = await Event.findById(id).populate('author');
    if(admin._id.equals(event.author._id))
    {
        const eve = await Event.findByIdAndUpdate(id, {...req.body.events});
        res.redirect(`/events/${event._id}`);
    }
    else
        throw new ExpressError("You are not not allowed access this page",401);
}))

//to delete the event
router.delete('/:id',isLoggedIn,isAdmin,catchAsync(async (req,res,next) => {
    const admin=await Admin.findOne({username:req.user.username})
    const { id } = req.params;
    const event = await Event.findById(id).populate('author');
    if(admin._id.equals(event.author._id))
    {   
        await Event.findByIdAndDelete(id);
        res.redirect('/events');
    }
    else
        throw new ExpressError("You are not not allowed access this page",401);
}))

module.exports = router; 