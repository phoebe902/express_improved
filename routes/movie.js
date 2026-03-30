const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");

// Multer storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// GET ALL MOVIES
router.get("/", (req, res) => {
    db.query("SELECT * FROM movies", (err, result) => {
        if (err) return res.status(500).json({ message: "DB error" });
        res.json(result);
    });
});

// GET MOVIE BY ID
router.get("/:id", (req, res) => {
    const id = req.params.id;
    db.query("SELECT * FROM movies WHERE id=?", [id], (err, result) => {
        if (err) return res.status(500).json({ message: "DB error" });
        if (result.length === 0) return res.status(404).json({ message: "Movie not found" });
        res.json(result[0]);
    });
});

// CREATE MOVIE
// CREATE MOVIE with poster
router.post("/", upload.single("poster"), (req, res) => {
    const { title, genre } = req.body;
    const poster = req.file ? req.file.filename : null;

    if (!title || !genre) return res.status(400).json({ message: "Missing title or genre" });

    db.query(
        "INSERT INTO movies (title, genre, poster) VALUES (?, ?, ?)",
        [title, genre, poster],
        (err, result) => {
            if (err) return res.status(500).json({ message: "DB error" });
            res.json({ message: "Movie created", id: result.insertId });
        }
    );
});

// UPDATE MOVIE
router.put("/:id", upload.single("poster"), (req, res) => {
    const id = req.params.id;
    const { title, genre } = req.body;
    const poster = req.file ? req.file.filename : null;

    // Build dynamic query
    let query = "UPDATE movies SET ";
    const params = [];

    if (title) { query += "title = ?"; params.push(title); }
    if (genre) { if (params.length) query += ", "; query += "genre = ?"; params.push(genre); }
    if (poster) { if (params.length) query += ", "; query += "poster = ?"; params.push(poster); }

    if (params.length === 0) return res.status(400).json({ message: "No data to update" });

    query += " WHERE id = ?";
    params.push(id);

    db.query(query, params, (err, result) => {
        if (err) return res.status(500).json({ message: "DB error" });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Movie not found" });
        res.json({ message: "Movie updated" });
    });
});

// DELETE MOVIE
router.delete("/:id", (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM movies WHERE id=?", [id], (err, result) => {
        if (err) return res.status(500).json({ message: "DB error" });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Movie not found" });
        res.json({ message: "Movie deleted" });
    });
});

module.exports = router;