// routes/auth.js - Updated Authentication Routes (Supporting Age, College, Skills, Avatar)
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// =======================
// SIGNUP
// =======================
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, age, college, skills } = req.body;

        const exist = await User.findOne({ email });

        if (exist) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            age: age || null,
            college: college || "",
            skills: skills || ""
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: "Signup Successful"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});


// =======================
// LOGIN
// =======================
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check User
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        // Check Password
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(400).json({
                success: false,
                message: "Incorrect Password"
            });
        }

        // Login Success (Including Age, College, Skills, and Avatar fields)
        res.status(200).json({
            success: true,
            message: "Login Successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                age: user.age,
                college: user.college,
                skills: user.skills,
                avatar: user.avatar
            }
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

module.exports = router;