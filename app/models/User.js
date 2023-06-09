const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a name"],
        maxlength: [40, "Name should be under 40 characters"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        validate: [validator.isEmail, "Please enter email in correct format"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: [8, "password should be atleast 8 digit"],
        select: false,
    },
    role: {
        type: String,
        default: "user",
    },
})

const User = mongoose.model("User", userSchema);

module.exports = User