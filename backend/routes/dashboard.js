const express = require("express");
const router = express.Router();

// Dashboard API
router.get("/", async (req, res) => {

    try {

        res.json({
            success: true,

            student: {
                name: "Dheemanth",
                email: "student@example.com"
            },

            stats: {
                courses: 6,
                assignments: 14,
                attendance: "92%",
                cgpa: 8.9
            },

            courses: [
                {
                    name: "Web Development",
                    faculty: "Mr. Kumar",
                    status: "Active"
                },
                {
                    name: "Java Programming",
                    faculty: "Mrs. Priya",
                    status: "Active"
                },
                {
                    name: "DBMS",
                    faculty: "Dr. Rao",
                    status: "Completed"
                },
                {
                    name: "Computer Networks",
                    faculty: "Mr. Arun",
                    status: "Active"
                }
            ],

            announcements: [
                "Internal exams start next Monday.",
                "Assignment submission ends Friday.",
                "Coding contest on Saturday."
            ]

        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

});

module.exports = router;