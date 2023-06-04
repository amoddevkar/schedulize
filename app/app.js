require('dotenv').config()
const express = require('express')
const session = require('express-session');
const path = require("path")
const app = express()
const User = require("./models/User")
const Meeting = require("./models/Meeting")
const emailHelper = require("./emailHelper")
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

app.get("/getuser", isAuthenticated, (req, res) => {
    const user = req.session.user

    console.log(user);
    res.send(user)
})

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

app.post('/addmeeting', isAuthenticated, (req, res) => {
    const { day, month, year, event } = req.body;



    Meeting.findOne({ day, month, year }).then((meeting) => {
        console.log(meeting, req.session.user);
        if (meeting) {
            meeting.events.push(event);
            meeting.save();
            User.find().then((users) => {

                let emails = "";
                for (let i = 0; i < users.length - 1; i++) {
                    emails = emails + users[i].email + ",";
                }
                emails = emails + users[users.length - 1].email
                console.log(emails);

                emailHelper({ email: emails, subject: "Schedulize - New Meeting Added", text: `new meeting with title ${event.title} scheduled at ${event.time}` })
                res.redirect('/')
            }).catch((error) => {
                console.log(error);
            })

        } else {
            throw "not found"
        }
    }).catch((error) => {
        console.log(error);
        const events = [{
            title: event.title,
            time: event.time
        }]
        const meeting = new Meeting({ day, month, year, events });
        meeting.save().then(() => {
            User.find().then((users) => {

                let emails = "";
                for (let i = 0; i < users.length - 1; i++) {
                    emails = emails + users[i].email + ",";
                }
                emails = emails + users[users.length - 1].email
                console.log(emails);
                const mail = {
                    email: emails,
                    subject: "Schedulize - New Meeting Added",
                    message: `New meeting with title ${event.title} is scheduled during ${event.time}`
                }
                emailHelper(mail)
                res.redirect('/')
            }).catch((error) => {
                console.log(error);
            })

        }).catch((error) => {
            console.log(error);
        })
    })

})

app.get("/test", async (req, res) => {
    const meetings = await Meeting.find({ month: 5, year: 2023 })
    res.send(meetings)
})

app.listen(process.env.PORT, () => {
    console.log(`Schedulize app listening on port ${process.env.PORT}`)
})