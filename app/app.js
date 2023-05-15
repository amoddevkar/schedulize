require('dotenv').config()
const express = require('express')
const session = require('express-session');
const path = require("path")
const app = express()
const User = require("./models/User")

const mongoose = require('mongoose');
mongoose
    .connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(console.log(`DB GOT CONNECTED`))
    .catch((error) => {
        console.log(`DB CONNECTION ISSUES`);
        console.log(error);
        process.exit(1);
    });
app.use(session({
    secret: 'schedulize-session',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: 'false' }))
app.use(express.json())

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/signin');
    }
};

app.get('/', isAuthenticated, (req, res) => {
    res.sendFile('index.html', { root: __dirname })
})

app.get("/signup", (req, res) => {
    res.sendFile('public/pages/signup.html', { root: __dirname })
})

app.post("/signup", (req, res) => {
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password
    const user = new User({
        username, email, password
    })
    user.save().then((data) => {
        res.redirect("/signin")
    }).catch((error) => {
        console.log(error);
    })

})

app.get("/signin", (req, res) => {
    res.sendFile('public/pages/signin.html', { root: __dirname })
})

app.post('/signin', (req, res) => {
    const { username, password } = req.body;

    User.findOne({ username, password }).then((user) => {

        req.session.user = user;
        res.redirect('/');

    }).catch((error) => {
        res.send('Invalid username/password');
    })


});

app.listen(process.env.PORT, () => {
    console.log(`Schedulize app listening on port ${process.env.PORT}`)
})