// models/User.js - Updated User Schema Model
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    age: {
        type: Number,
        default: null
    },

    college: {
        type: String,
        default: ""
    },

    skills: {
        type: String,
        default: ""
    },

    avatar: {
        type: String,
        default: ""
    },

    courses: {
        type: Array,
        default: []
    },

    grades: {
        type: Array,
        default: []
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);