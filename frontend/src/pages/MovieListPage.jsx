import React, { useState, useEffect } from "react";
import API from "../api/api";
import { Link } from "react-router-dom";
import styled from "styled-components";

// --- Styled Components ---
const Container = styled.div`
  padding: 40px 20px;
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.h2`
  margin-bottom: 25px;
  color: #333;
`;

const AddButton = styled(Link)`
  padding: 10px 15px;
  margin-bottom: 20px;
  background-color: #28a745;
  color: #fff;
  font-weight: bold;
  border-radius: 6px;
  text-decoration: none;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #1e7e34;
  }
`;

const MovieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 900px;
`;

const MovieCard = styled.div`
  background-color: #fff;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* spreads content */
  align-items: center;

  height: 250px; /* fixed height for consistency */
`;

const Poster = styled.img`
  width: 100%;
  height: 140px; /* fixed image height */
  object-fit: cover; /* keeps image nice */
  border-radius: 8px;
`;

const MovieTitle = styled(Link)`
  margin-top: auto; /* pushes title to bottom */
  font-weight: bold;
  color: #007bff;
  text-decoration: none;
  text-align: center;

  &:hover {
    text-decoration: underline;
  }
`;

// --- MovieListPage Component ---
export default function MovieListPage() {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        API.get("/movies")
            .then(res => setMovies(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <Container>
            <Header>Movies</Header>
            <AddButton to="/movies/new">Add Movie</AddButton>
            <MovieGrid>
                {movies.map(m => (
                    <MovieCard key={m.id}>
                        <MovieTitle to={`/movies/${m.id}`}>{m.title}</MovieTitle>
                        {m.poster && <Poster src={`http://localhost:5000/uploads/${m.poster}`} alt={m.title} />}
                    </MovieCard>
                ))}
            </MovieGrid>
        </Container>
    );
}