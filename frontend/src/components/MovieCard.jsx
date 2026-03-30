import React from "react";
import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
    return (
        <div style={{ border: "1px solid #ccc", padding: 10, margin: 10, width: 200 }}>
            {movie.poster && (
                <img
                    src={`http://localhost:5000/uploads/${movie.poster}`}
                    alt={movie.title}
                    style={{ width: "100%", height: "auto" }}
                />
            )}
            <h3>{movie.title}</h3>
            <p>{movie.genre}</p>
            <Link to={`/movies/${movie.id}`}>View Details</Link>
        </div>
    );
}