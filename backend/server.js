require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

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

// Routes
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Student Hub Backend Running..."
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

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