require('dotenv').config()
const express = require('express')
const app = express()
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

app.get('/', (req, res) => {
    res.send(process.env.PORT)
})

app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`)
})