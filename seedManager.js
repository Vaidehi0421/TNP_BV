const mongoose = require('mongoose');

const Manager = require('./models/manager');
const User = require('./models/users');

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

const seedDB = async () => {
    const username = 'amit@gmail.com';
    const password = 'Amit';
    const user_role = 'Manager';
    const user = new User({ user_role, username });
    const registeredUser = await User.register(user, password);

    const manager = new Manager({
        name: 'Amit',
        username: 'amit@gmail.com',
        user_role: 'Manager'
    })
    await manager.save();
    
    }

seedDB().then(() => {
    mongoose.connection.close();
})