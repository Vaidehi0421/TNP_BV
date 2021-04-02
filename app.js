const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const Job = require('./models/jobs');
const Notice = require('./models/notices');
const Event = require('./models/events');

const User = require('./models/users');
const Company = require('./models/companies');
const Admin = require('./models/admins');
const Student = require('./models/students');
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');

const passport = require('passport');
const LocalStrategy = require('passport-local');

const app = express();
const JobRoutes = require('./routes/job');
const EventRoutes = require('./routes/event');
const NoticeRoutes = require('./routes/notice');
const StudentRoutes = require('./routes/student');
const CompanyRoutes = require('./routes/company');
const AdminRoutes =require('./routes/admin');
const { isLoggedIn, isComAd, isAdmin } = require('./middleware');
mongoose.connect('mongodb://localhost:27017/placementhub', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


//MIDDLEWARE
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
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

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})

//Register Company
app.get('/register/company', (req, res) => {
    res.render('users/Company_Registration')
})

app.post('/register/company', async (req, res, next) => {

    //console.log(req.body.company);
    const { username, password } = req.body.company;
    const user_role = 'Company';
    const user = new User({ user_role, username });
    //console.log(user);
    const company = new Company(req.body.company);
    await company.save();
    const registeredUser = await User.register(user, password);
    res.redirect('/login');
})
//Register as Student 
app.get('/register/student', (req, res) => {
    res.render('users/Student_Registration')
})

app.post('/register/student', async (req, res, next) => {
    const { username, password } = req.body.student;
    const user_role = 'Student';
    const user = new User({ user_role, username });
    const student = new Student(req.body.student);
    await student.save();
    const registeredUser = await User.register(user, password);
    res.redirect('/login');

})
//Admin registration
app.get('/register/admin', (req, res) => {
    res.render('users/Admin_Registration')
})

app.post('/register/admin', async (req, res, next) => {
    const { username, password } = req.body.admin;
    const user_role = 'Admin';
    const user = new User({ user_role, username });
    const admin = new Admin(req.body.admin);
    await admin.save();
    const registeredUser = await User.register(user, password);
    res.redirect('/login');
})

app.get('/login', (req, res, next) => {
    res.render('users/login');
})

app.post('/login', catchAsync(async (req, res, next) => {
    const username = req.body.username;
    const user = await User.findOne({ username })
    if (!user) {
        return next();
    }
    else if (user.user_role === 'Company') {
        const company = await Company.findOne({ username });
        if (company.verified === false) {
            //a flash message here
            res.redirect('/login');
        }
        else {
            return next();
        }
    }
    else if (user.user_role === "Student") {
        const student = await Student.findOne({ username });
        if (student.verified === false) {
            res.redirect('/login');
        }
        else {
            return next();
        }
    }
    else if (user.user_role === "Admin") {
        const admin = await Admin.findOne({ username });
        if (admin.verified === false) {
            res.redirect('/login');
        }
        else {
            return next();
        }
    }
    else if(user.user_role === 'Manager') {
        return next();
    }
}), passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
    const redirectUrl = req.session.returnTo || '/jobs';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

//viewing the profile of the user
app.get('/myprofile',isLoggedIn,async(req,res)=>{
    const username = req.user.username;
    const user = await User.findOne({ username })
    if (user.user_role === 'Company') {
        const company = await Company.findOne({ username });
        res.redirect(`/companies/${company._id}`);
    }
    else if (user.user_role === "Student") {
        const student = await Student.findOne({ username });
        res.redirect(`/students/${student._id}`);
    }
    else{
        const admin = await Admin.findOne({ username });
        res.redirect(`/admins/${admin._id}`);
    }
})
app.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/login');
})
//home route
app.get('/', (req, res) => {
    res.render('home');
})

app.use("/jobs", JobRoutes);
app.use('/events', EventRoutes);
app.use('/notices', NoticeRoutes);
app.use('/students', StudentRoutes);
app.use('/companies', CompanyRoutes);
app.use('/admins', AdminRoutes);
/*app.post('/', (req,res)=>{
    res.redirect('/');
})*/
app.all('*', (req, res, next) => {
    next(new ExpressError('PAGE NOT FOUND!', 404));
})

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(status).render('error', { err });
})

app.listen(3000, () => {
    console.log('Listening to port 3000');
});

