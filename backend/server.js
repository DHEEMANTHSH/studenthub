require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");

const app = express();

// Middleware
app.use(cors({
    origin: "*",
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => {
    console.error("❌ MongoDB Connection Error:", err);
});

// --- User Schema & Model (Including Age, College, Skills, Avatar, Courses, Grades) ---
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, default: null },
    college: { type: String, default: "" },
    skills: { type: String, default: "" },
    avatar: { type: String, default: "" },
    courses: { type: Array, default: [] },
    grades: { type: Array, default: [] }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// --- Integrated Full Auth & Profile Routes ---

// Signup Route (Supports Age, College, Skills)
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, email, password, age, college, skills } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email is already registered!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            age: age || null,
            college: college || "",
            skills: skills || ""
        });

        await newUser.save();
        res.status(201).json({ success: true, message: "Signup Successful! Please login." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error during signup." });
    }
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email or password." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid email or password." });
        }

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
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error during login." });
    }
});

// Update Profile Route (Supports Avatar, Age, College, Skills, Name, Email)
app.put('/api/user/update/:id', async (req, res) => {
    try {
        const { name, email, age, college, skills, avatar } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, age, college, skills, avatar },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found." });
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error updating profile." });
    }
});

// Chatbot AI API Endpoint
app.post('/api/chat', (req, res) => {
    const { message } = req.body;
    let reply = "I am here to help you navigate your student portal!";
    
    const lower = (message || "").toLowerCase();
    if(lower.includes("assignment")) {
        reply = "You can view and track all your pending assignments under the Assignments tab.";
    } else if(lower.includes("grade") || lower.includes("score")) {
        reply = "Your latest semester performance can be reviewed in the Grades & Reports section.";
    } else if(lower.includes("hello") || lower.includes("hi")) {
        reply = "Hello! How can I help you excel in your studies today?";
    }

    res.status(200).json({ success: true, reply });
});

// Existing modular routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Root Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Student Hub Backend Running..."
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API Route Not Found"
    });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});