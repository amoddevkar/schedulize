require('dotenv').config()
const express = require('express')
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

app.use(express.static(__dirname + '/../frontend'));
app.use(express.urlencoded({ extended: 'false' }))
app.use(express.json())

app.get('/', (req, res) => {
    res.send("server started")
})

app.get("/signup", (req, res) => {
    res.sendFile('./signup.html', { root: __dirname })
})

app.post("/signup", (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    const user = new User({
        name, email, password
    })
    user.save().then((data) => {
        res.redirect("/")
    }).catch((error) => {
        console.log(error);
    })

})

app.listen(process.env.PORT, () => {
    console.log(`Schedulize app listening on port ${process.env.PORT}`)
})