const express=require('express');
const methodOverride=require('method-override');
const mongoose=require('mongoose');
const Job=require('./models/jobs');
const Notice=require('./models/notices');
const Event=require('./models/events');
const User=require('./models/users');
const Company=require('./models/companies');
const Admin=require('./models/admins');
const Student=require('./models/students');
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');

const passport = require('passport');
const LocalStrategy = require('passport-local');

const app=express();
const JobRoutes = require('./routes/job');
const EventRoutes = require('./routes/event');
const NoticeRoutes = require('./routes/notice');
mongoose.connect('mongodb://localhost:27017/placementhub', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify:false
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


const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))

//PASSPORT
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Register Company
app.get('/register/company', (req,res)=>{
    res.render('users/Company_Registration')
})

app.post('/register/company', async (req,res,next)=>{

    console.log(req.body.company);
    const { username , password } = req.body.company;
    const user = new User({username});
    console.log(user);
    const registeredUser = await User.register(user, password);
    console.log(registeredUser);
    console.log(req.body);
    res.redirect('/login');
})



app.get('/register/student', (req,res)=>{
    res.render('users/Student_Registration')
})
app.get('/login', (req,res)=>{
    res.render('users/login');
})







//home route
app.get('/',(req,res)=>{
    res.render('home');
})
app.use("/jobs",JobRoutes);
app.use('/events',EventRoutes);
app.use('/notices',NoticeRoutes);

/*app.post('/', (req,res)=>{
    res.redirect('/');
})*/
app.all('*',(req,res,next)=>{
    next(new ExpressError('PAGE NOT FOUND!',404));
})

app.use((err,req,res,next)=>{
    const { status = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(status).render('error', { err });
})

app.listen(3000,()=>{
    console.log('Listening to port 3000');
});

