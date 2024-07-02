const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please enter your name"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "please enter your email"],
        unique: true,
        validate: [validator.isEmail, "this is not a valid email"],
    },
    password: {
        type: String,
        required: [true, "please enter your password"],
        minLength: [8, "the password should be more than 8 chars"],
    },
    passwordConfirm: {
        type: String,
        required: [true, "please confirm your password"],
        validate: {
            validator: function (ele) {
                // will work only on create and save
                return ele === this.password;
            },
            message: "passwords are not the same",
        },
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN", "MANAGER"],
        default: "USER",
    },
    avatar: {
        type: String,
        default: "uploads/profile.jpg",
    },
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // if the password is not modified.. exit

    this.password = await bcrypt.hash(this.password, 10);
    this.passwordConfirm = undefined; // will delete the passConfirm field
    next();
});

userSchema.methods.correctPass = async function (userPass, dbPass) {
    return await bcrypt.compare(dbPass, userPass); // the compare returns true or false
};

module.exports = mongoose.model("User", userSchema);
