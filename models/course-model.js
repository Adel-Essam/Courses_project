const mongoose = require("mongoose");

var courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    method: {
        type: String,
        required: false,
    },
});

module.exports = mongoose.model("Course", courseSchema); // لازم اسم الموديل يكون نفس اسم الكوليكشن بس مفرد
