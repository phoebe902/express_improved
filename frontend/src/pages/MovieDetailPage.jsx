import React, { useState, useEffect } from "react";
import API from "../api/api";
import styled from "styled-components";

// --- Styled Components ---
const Container = styled.div`
  padding: 40px 20px;
  font-family: Arial, sans-serif;
  max-width: 900px;
  margin: auto;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 25px;
`;

const MovieList = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  list-style: none;
  padding: 0;
`;

const MovieCard = styled.li`
  background: #fff;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  height: 300px; /* fixed height for uniformity */

  @media (max-width: 500px) {
    height: auto; /* allow flexible height on small screens */
  }
`;

const Poster = styled.img`
  width: 100%;
  height: 150px;  /* fixed height */
  object-fit: cover;
  border-radius: 8px;

  @media (max-width: 500px) {
    height: 120px;
  }
`;

const BottomContent = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;

  @media (max-width: 500px) {
    gap: 8px;
  }
`;

const MovieInfo = styled.div`
  text-align: center;
`;

const Button = styled.button`
  margin: 5px;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  color: #fff;
  font-size: 0.9rem;

  background-color: ${props => props.color || "#007bff"};
  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 500px) {
    padding: 6px 10px;
    font-size: 0.85rem;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: ${props => (props.show ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 25px;
  border-radius: 10px;
  width: 400px;

  @media (max-width: 500px) {
    width: 90%; /* take most of the screen on mobile */
    padding: 20px;
  }
`;

const Input = styled.input`
  width: 100%;
  margin: 8px 0;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const Message = styled.p`
  color: red;
`;

// --- Component ---
export default function MovieManagementPage() {
  const [movies, setMovies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [form, setForm] = useState({ title: "", genre: "" });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  // Fetch movies
  const fetchMovies = () => {
    API.get("/movies")
      .then(res => setMovies(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => { fetchMovies(); }, []);

  // Open modal
  const openModal = (movie = null) => {
    setEditingMovie(movie);
    setForm({ title: movie?.title || "", genre: movie?.genre || "" });
    setFile(null);
    setMessage("");
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  // Handle form change
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // Handle form submit
  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("genre", form.genre);
    if (file) formData.append("poster", file);

    try {
      if (editingMovie) {
        await API.put(`/movies/${editingMovie.id}`, formData);
        setMessage("Movie updated successfully");
      } else {
        await API.post("/movies", formData);
        setMessage("Movie created successfully");
      }
      closeModal();
      fetchMovies();
    } catch (err) {
      setMessage(err.response?.data?.message || "Error");
    }
  };

  // Delete movie
  const handleDelete = async movie => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;
    try {
      await API.delete(`/movies/${movie.id}`);
      fetchMovies();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <Container>
      <Title>Movie Management</Title>
      <Button color="#28a745" onClick={() => openModal()}>Add Movie</Button>

      <MovieList>
        {movies.map(m => (
          <MovieCard key={m.id}>
  {m.poster && <Poster src={`http://localhost:5000/uploads/${m.poster}`} alt={m.title} />}
  
  <BottomContent>
    <MovieInfo>
      <h3>{m.title}</h3>
      <p>{m.genre}</p>
    </MovieInfo>
    <div>
      <Button color="#ffc107" onClick={() => openModal(m)}>Edit</Button>
      <Button color="#dc3545" onClick={() => handleDelete(m)}>Delete</Button>
    </div>
  </BottomContent>
</MovieCard>
        ))}
      </MovieList>

      {/* Modal */}
      <ModalOverlay show={showModal}>
        <ModalContent>
          <h3>{editingMovie ? "Edit Movie" : "Add Movie"}</h3>
          <form onSubmit={handleSubmit}>
            <Input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
            <Input name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} />
            <Input type="file" onChange={e => setFile(e.target.files[0])} />
            <Button type="submit" color="#007bff" style={{ marginTop: "10px" }}>
              {editingMovie ? "Update" : "Create"}
            </Button>
            <Button type="button" color="#6c757d" onClick={closeModal} style={{ marginLeft: "10px" }}>Cancel</Button>
          </form>
          {message && <Message>{message}</Message>}
        </ModalContent>
      </ModalOverlay>
    </Container>
  );
}