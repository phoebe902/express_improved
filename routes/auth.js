const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
require("dotenv").config();

// Multer storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// --- REGISTER ---
const crypto = require("crypto");
const nodemailer = require("nodemailer");


// --- REGISTER ---
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: "All fields required" });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString("hex");

const verificationUrl = `${process.env.BASE_URL}/api/auth/verify/${verificationToken}`;

        db.query(
            "INSERT INTO users (username, email, password, verification_token) VALUES (?, ?, ?, ?)", 
            [username, email, hashedPassword, verificationToken],
            async (err, result) => {
                if (err) return res.status(500).json({ message: err.message });

                // Send verification email
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                });

                const verificationUrl = `${process.env.BASE_URL}/api/auth/verify/${verificationToken}`;

                const mailOptions = {
  from: process.env.EMAIL_USER,
  to: email,
  subject: "Verify your account",
  html: `
    <p>Hello ${username},</p>
    <p>Please click the button below to verify your account:</p>
    <a href="${verificationUrl}" 
       style="
         display: inline-block;
         padding: 12px 25px;
         background-color: #007bff;
         color: #fff;
         font-weight: bold;
         text-decoration: none;
         border-radius: 6px;
       ">
       Verify Account
    </a>

  `
};

                await transporter.sendMail(mailOptions);

                res.json({ message: "User registered successfully. Check your email to verify your account." });
            }
        );
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// --- LOGIN ---
router.post("/login", (req, res) => {
    const { email, password } = req.body;
    db.query("SELECT * FROM users WHERE email=?", [email], async (err, results) => {
        if (err) return res.status(500).json({ message: err.message });
        if (results.length === 0) return res.status(404).json({ message: "User not found" });

        const user = results[0];

        // Check if account is verified
        if (!user.verified) {
            return res.status(401).json({ message: "Account not verified. Check your email." });
        }

        // Check password
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: "Wrong password" });

        // Generate JWT
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    });
});
// --- FORGOT PASSWORD ---
router.post("/forgot-password", (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    // Check if user exists
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json({ message: err.message });
        if (results.length === 0) return res.status(404).json({ message: "User not found" });

        const user = results[0];

        // Generate reset token & expiration
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetExpires = new Date(Date.now() + 3600000); // 1 hour


        db.query(
            "UPDATE users SET reset_token = ?, reset_expires = ? WHERE id = ?",
            [resetToken, resetExpires, user.id],
            async (err) => {
                if (err) return res.status(500).json({ message: err.message });

                // Send reset email
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                });

                const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: email,
  subject: "Reset Your Password",
  html: `
    <p>Hello ${user.username},</p>
    <p>You requested a password reset. Click the button below to reset your password:</p>
    <a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#007bff;color:#fff;border-radius:5px;text-decoration:none;">Reset Password</a>
    <p>This link will expire in 1 hour.</p>
  `
};

                await transporter.sendMail(mailOptions);

                res.json({ message: "Password reset email sent. Check your inbox." });
            }
        );
    });
});

// --- RESET PASSWORD ---
router.post("/reset-password/:token", async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) return res.status(400).json({ message: "Password is required" });

    // Find user with valid token
    db.query(
        "SELECT * FROM users WHERE reset_token = ? AND reset_expires > NOW()",
        [token],
        async (err, results) => {
            if (err) return res.status(500).json({ message: err.message });
            if (results.length === 0) return res.status(400).json({ message: "Invalid or expired token" });

            const user = results[0];
            const hashedPassword = await bcrypt.hash(password, 10);

            db.query(
                "UPDATE users SET password = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?",
                [hashedPassword, user.id],
                (err) => {
                    if (err) return res.status(500).json({ message: err.message });
                    res.json({ message: "Password has been reset successfully." });
                }
            );
        }
    );
});

// --- GET PROFILE ---
router.get("/profile", authMiddleware, (req, res) => {
    db.query("SELECT id, username, email, profile_picture FROM users WHERE id=?", [req.user.id], (err, results) => {
        if (err) return res.status(500).json({ message: err.message });
        if (results.length === 0) return res.status(404).json({ message: "User not found" });
        res.json({ user: results[0] });
    });
});

// --- UPDATE PROFILE ---
router.put("/profile", authMiddleware, upload.single("profile_picture"), (req, res) => {
    const userId = req.user.id;
    const { username } = req.body;
    const profile_picture = req.file ? req.file.filename : null;

    let query = "UPDATE users SET ";
    const params = [];

    if (username) {
        query += "username = ?";
        params.push(username);
    }
    if (profile_picture) {
        if (params.length) query += ", ";
        query += "profile_picture = ?";
        params.push(profile_picture);
    }

    if (params.length === 0) return res.status(400).json({ message: "No data to update" });

    query += " WHERE id = ?";
    params.push(userId);

    db.query(query, params, (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json({ message: "Profile updated successfully" });
    });
});
// --- VERIFY EMAIL ---
router.get("/verify/:token", (req, res) => {
    const { token } = req.params;

    db.query(
        "UPDATE users SET verified = TRUE, verification_token = NULL WHERE verification_token = ?",
        [token],
        (err, result) => {
            if (err) return res.status(500).send("Something went wrong. Try again later.");
            if (result.affectedRows === 0)
                return res.status(400).send(`
                    <html>
                        <head>
                            <title>Verification Error</title>
                            <style>
                                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                                .btn { padding: 12px 25px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 6px; }
                                .btn:hover { background-color: #0056b3; }
                            </style>
                        </head>
                        <body>
                            <h2>Invalid or expired token</h2>
                            <a href="/login" class="btn">Go to Login</a>
                        </body>
                    </html>
                `);

            // Success page
            res.send(`
                <html>
                    <head>
                        <title>Email Verified</title>
                        <style>
                            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                            .btn { padding: 12px 25px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 6px; }
                            .btn:hover { background-color: #0056b3; }
                        </style>
                    </head>
                    <body>
                        <h2>Email verified successfully!</h2>
                        <p>You can now log in.</p>
                        <a href="http://localhost:3000/login" class="btn">Go to Login</a>
                    </body>
                </html>
            `);
        }
    );
});
module.exports = router;