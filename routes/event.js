const express=require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const Event = require("../models/events");

//EVENT ROUTES
//Displays all the events

router.get('/', catchAsync(async (req,res,next)=>{
    const events = await Event.find({});
    res.render('events/index', { events });
}))

//Displays the form to add a new job
router.get('/new', (req,res) => {
    res.render('events/new');
})


//Save the new event in the database
router.post('/', catchAsync(async (req,res,next) => {

    const event = new Event(req.body.events);
    await event.save();
    res.redirect('/events');
}))

//Show a particular Event
router.get('/:id', catchAsync(async (req,res,next)=>{
    const { id } = req.params;
    const event = await Event.findById(id);
    res.render('events/show', { event });
}))

//to show the edit form
router.get('/:id/edit', catchAsync(async (req,res,next) => {
    const { id } = req.params;
    const event = await Event.findById(id);
    res.render('events/edit', { event });
}))

//to save the edited details
router.put('/:id', catchAsync(async (req,res,next)=>{
    const { id } = req.params;
    const event = await Event.findByIdAndUpdate(id, {...req.body.events});
    res.redirect(`/events/${event._id}`);
}))

//to delete the event
router.delete('/:id', catchAsync(async (req,res,next) => {
    const { id } = req.params;
    await Event.findByIdAndDelete(id);
    res.redirect('/events');
}))
module.exports = router; 