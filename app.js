const express=require('express');
const methodOverride=require('method-override');
const mongoose=require('mongoose');
const Job=require('./models/jobs');
const Notice=require('./models/notices');
const Event=require('./models/events');
const path = require('path');
const { urlencoded } = require('express');
const app=express();

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.get('/',(req,res)=>{
    res.send("Hey look who made it!!!!")
})
app.listen(3000,()=>{
    console.log('Listening to port 3000');
});

