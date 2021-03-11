const express=require('express');
const methodOverride=require('method-override');
const mongoose=require('mongoose');
const Job=require('./models/jobs');
const Notice=require('./models/notices');
const Event=require('./models/events');
const path = require('path');
const ejsMate = require('ejs-mate');

const app=express();

mongoose.connect('mongodb://localhost:27017/placementhub', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


//MIDDLEWARE
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);


app.get('/',(req,res)=>{
    res.send("Hey look who made it!!!!")
})


//JOB ROUTES
//Displays all the jobs
app.get('/jobs', async (req,res)=>{
    const jobs = await Job.find({});
    res.render('jobs/index', { jobs });
})

//Displays the form to add a new job
app.get('/jobs/new', (req,res) => {
    res.render('jobs/new');
})


//Show a particular Job
app.get('/jobs/:id', async (req,res)=>{
    const { id } = req.params;
    const job = await Job.findById(id);
    res.render('jobs/show', { job });
})



//Save the new job in the database
app.post('/jobs', async (req,res) => {

    const job = new Job(req.body.jobs);
    await job.save();
    res.redirect('/jobs');
})

//to show the edit form
app.get('/jobs/:id/edit', async (req,res) => {
    const { id } = req.params;
    const job = await Job.findById(id);
    res.render('jobs/edit', { job });
})

//to save the edited details
app.put('/jobs/:id', async (req,res)=>{
    const { id } = req.params;
    const job = await Job.findByIdAndUpdate(id, {...req.body.jobs});
    res.redirect(`/jobs/${job._id}`);
})

//to delete the job
app.delete('/jobs/:id', async (req,res) => {
    const { id } = req.params;
    await Job.findByIdAndDelete(id);
    res.redirect('/jobs');
})

//EVENT ROUTES
//Displays all the events
app.get('/events', async (req,res)=>{
    const events = await Event.find({});
    res.render('events/index', { events });
})

//Displays the form to add a new job
app.get('/events/new', (req,res) => {
    res.render('events/new');
})


//Save the new event in the database
app.post('/events', async (req,res) => {

    const event = new Event(req.body.events);
    await event.save();
    res.redirect('/events');
})

//Show a particular Event
app.get('/events/:id', async (req,res)=>{
    const { id } = req.params;
    const event = await Event.findById(id);
    res.render('events/show', { event });
})

//to show the edit form
app.get('/events/:id/edit', async (req,res) => {
    const { id } = req.params;
    const event = await Event.findById(id);
    res.render('events/edit', { event });
})

//to save the edited details
app.put('/events/:id', async (req,res)=>{
    const { id } = req.params;
    const event = await Event.findByIdAndUpdate(id, {...req.body.events});
    res.redirect(`/events/${event._id}`);
})

//to delete the event
app.delete('/events/:id', async (req,res) => {
    const { id } = req.params;
    await Event.findByIdAndDelete(id);
    res.redirect('/events');
})

//Displays all the notices
app.get('/notices', async (req,res)=>{
    const notices = await Notice.find({});
    res.render('notices/index', { notices });
})

//Displays the form to add a new notice
app.get('/notices/new', (req,res) => {
    res.render('notices/new');
})


//Save the new notice in the database
app.post('/notices', async (req,res) => {

    const notice = new Notice(req.body.notices);
    await notice.save();
    res.redirect('/notices');
})

//Show a particular Notice
app.get('/notices/:id', async (req,res)=>{
    const { id } = req.params;
    const notice = await Notice.findById(id);
    res.render('notices/show', { notice });
})

//to show the edit form
app.get('/notices/:id/edit', async (req,res) => {
    const { id } = req.params;
    const notice = await Notice.findById(id);
    res.render('notices/edit', { notice });
})

//to save the edited details
app.put('/notices/:id', async (req,res)=>{
    const { id } = req.params;
    const notice = await Notice.findByIdAndUpdate(id, {...req.body.notices});
    res.redirect(`/notices/${notice._id}`);
})

//to delete the notice
app.delete('/notices/:id', async (req,res) => {
    const { id } = req.params;
    await Notice.findByIdAndDelete(id);
    res.redirect('/notices');
})

app.listen(3000,()=>{
    console.log('Listening to port 3000');
});

