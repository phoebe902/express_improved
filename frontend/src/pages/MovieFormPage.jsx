import React, { useState, useEffect } from "react";
import API from "../api/api";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

// --- Styled Components ---
const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px 20px;
  font-family: Arial, sans-serif;
`;

const Card = styled.div`
  background-color: #fff;
  padding: 30px 25px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  width: 400px;
  text-align: center;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const FileInput = styled.input`
  margin-bottom: 15px;
`;

const Button = styled.button`
  padding: 12px;
  background-color: #007bff;
  color: #fff;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const Message = styled.p`
  margin-top: 15px;
  color: ${props => (props.success ? "green" : "red")};
  font-size: 14px;
`;

// --- MovieFormPage Component ---
export default function MovieFormPage() {
    const { id } = useParams(); // undefined if creating
    const navigate = useNavigate();
    const [form, setForm] = useState({ title: "", genre: "" });
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (id) {
            // Fetch movie for editing
            API.get(`/movies/${id}`)
                .then(res => setForm({ title: res.data.title, genre: res.data.genre }))
                .catch(err => setMessage(err.response?.data?.message || "Error"));
        }
    }, [id]);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("genre", form.genre);
        if (file) formData.append("poster", file);

        try {
            if (id) {
                await API.put(`/movies/${id}`, formData);
                setMessage("Movie updated successfully");
            } else {
                await API.post("/movies", formData);
                setMessage("Movie created successfully");
            }
            navigate("/movies");
        } catch (err) {
            setMessage(err.response?.data?.message || "Error");
        }
    };

    return (
        <Container>
            <Card>
                <Title>{id ? "Edit Movie" : "Add Movie"}</Title>
                <Form onSubmit={handleSubmit}>
                    <Input
                        name="title"
                        placeholder="Title"
                        value={form.title}
                        onChange={handleChange}
                    />
                    <Input
                        name="genre"
                        placeholder="Genre"
                        value={form.genre}
                        onChange={handleChange}
                    />
                    <FileInput type="file" onChange={e => setFile(e.target.files[0])} />
                    <Button type="submit">{id ? "Update" : "Create"}</Button>
                </Form>
                {message && <Message success={message.includes("successfully")}>{message}</Message>}
            </Card>
        </Container>
    );
}