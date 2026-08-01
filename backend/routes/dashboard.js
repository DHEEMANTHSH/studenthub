// routes/dashboard.js - Updated with Safe ObjectId Validation
const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");

const router = express.Router();

// =======================
// UPDATE PROFILE
// =======================
router.put("/update/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: "Invalid user ID format" });
        }

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
// SKILL-BASED PEER MATCHING API
// =======================
router.get("/peers/:id", async (req, res) => {
    try {
        // Validate MongoDB ObjectId to prevent server crash on malformed IDs
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: "Invalid user ID format" });
        }

        const currentUser = await User.findById(req.params.id);
        if (!currentUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const userSkills = (currentUser.skills || "")
            .toLowerCase()
            .split(",")
            .map(s => s.trim())
            .filter(Boolean);

        // Find other users in the database
        const allUsers = await User.find({ _id: { $ne: currentUser._id } });

        // Score peers based on matching skills
        const matchedPeers = allUsers.map(peer => {
            const peerSkills = (peer.skills || "")
                .toLowerCase()
                .split(",")
                .map(s => s.trim())
                .filter(Boolean);

            const commonSkills = peerSkills.filter(skill => userSkills.includes(skill));

            return {
                id: peer._id,
                name: peer.name,
                college: peer.college,
                skills: peer.skills,
                matchCount: commonSkills.length,
                matchedSkillsList: commonSkills.join(", ")
            };
        });

        // Sort by highest matching skills count
        matchedPeers.sort((a, b) => b.matchCount - a.matchCount);

        res.status(200).json({
            success: true,
            peers: matchedPeers.slice(0, 5) // Return top 5 matched peers
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