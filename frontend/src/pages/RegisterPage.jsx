import React, { useState } from "react";
import axios from "axios"; // Use axios directly
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

// --- RegisterPage Component ---
export default function RegisterPage() {
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const [message, setMessage] = useState("");

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            // Send JSON explicitly
            const res = await axios.post(
                "http://localhost:5000/api/auth/register",
                form,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
            setMessage(res.data.message);
        } catch (err) {
            setMessage(err.response?.data?.message || "Error");
        }
    };

    return (
        <Container>
            <Card>
                <Title>Register</Title>
                <Form onSubmit={handleSubmit}>
                    <Input 
                        name="username" 
                        placeholder="Username" 
                        value={form.username} 
                        onChange={handleChange} 
                    />
                    <Input 
                        name="email" 
                        placeholder="Email" 
                        type="email" 
                        value={form.email} 
                        onChange={handleChange} 
                    />
                    <Input 
                        name="password" 
                        placeholder="Password" 
                        type="password" 
                        value={form.password} 
                        onChange={handleChange} 
                    />
                    <Button type="submit">Register</Button>
                </Form>
                {message && (
                    <Message success={message.toLowerCase().includes("success")}>
                        {message}
                    </Message>
                )}
            </Card>
        </Container>
    );
}