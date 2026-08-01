// routes/dashboard.js - Updated with backend chatbot integration supporting the frontend HubBot
const express = require("express");
const User = require("../models/User");

const router = express.Router();

// =======================
// UPDATE PROFILE
// =======================
router.put("/update/:id", async (req, res) => {
    try {
        const { name, email, age, college, skills, avatar } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, age, college, skills, avatar },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully!",
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                age: updatedUser.age,
                college: updatedUser.college,
                skills: updatedUser.skills,
                avatar: updatedUser.avatar
            }
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// =======================
// CHATBOT API ENDPOINT
// =======================
router.post("/chat", (req, res) => {
    try {
        const { message } = req.body;
        let reply = "I am here to help you navigate courses and assignments!";
        
        const lower = (message || "").toLowerCase();
        if(lower.includes("assignment")) {
            reply = "You have 3 pending assignments due soon. Check the Assignments tab!";
        } else if(lower.includes("grade") || lower.includes("score")) {
            reply = "You can view your detailed performance under the Grades & Reports section.";
        } else if(lower.includes("hello") || lower.includes("hi")) {
            reply = "Hello there! Ready to learn something new today?";
        }

        res.status(200).json({
            success: true,
            reply: reply
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

module.exports = router;