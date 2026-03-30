const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const movieRoutes = require("./routes/movie");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/movies", authMiddleware, movieRoutes); // protect all movie routes

// Serve frontend static files
app.use(express.static(path.join(__dirname, "frontend")));

// Catch-all for frontend routes (only if not API)
app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});