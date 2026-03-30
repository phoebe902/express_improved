import React, { useState, useContext } from "react";
import API from "../api/api";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

// --- Styled Components ---
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;   // align to top
  min-height: 100vh;
  padding-top: 50px;         // optional space from top
  background-color: #f5f5f5;
  font-family: Arial, sans-serif;
`;

const Card = styled.div`
  background-color: #fff;
  padding: 40px 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 320px;
  text-align: center;
`;

const Title = styled.h2`
  margin-bottom: 25px;
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

  &:hover {
    background-color: #0056b3;
  }
`;

const LinkText = styled.p`
  margin-top: 10px;
  color: #007bff;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    text-decoration: underline;
  }
`;

const Message = styled.p`
  margin-top: 15px;
  color: red;
  font-size: 14px;
`;

// Modal
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: ${props => (props.show ? "flex" : "none")};
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 25px;
  border-radius: 10px;
  width: 300px;
`;

// --- Component ---
export default function LoginPage() {
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");

    // Forgot password state
    const [showModal, setShowModal] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotMessage, setForgotMessage] = useState("");

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await API.post("/auth/login", form);
            localStorage.setItem("token", res.data.token);

            const profile = await API.get("/auth/profile");
            setUser(profile.data.user);

            navigate("/movies");
        } catch (err) {
            setMessage(err.response?.data?.message || "Error");
        }
    };

    // Forgot password submit
    const handleForgot = async e => {
        e.preventDefault();
        try {
            const res = await API.post("/auth/forgot-password", { email: forgotEmail });
            setForgotMessage(res.data.message);
        } catch (err) {
            setForgotMessage(err.response?.data?.message || "Error");
        }
    };

    return (
        <Container>
            <Card>
                <Title>Login</Title>
                <Form onSubmit={handleSubmit}>
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
                    <Button type="submit">Login</Button>
                </Form>

                {/* Forgot Password */}
                <LinkText onClick={() => setShowModal(true)}>
                    Forgot Password?
                </LinkText>

                {message && <Message>{message}</Message>}
            </Card>

            {/* Modal */}
            <ModalOverlay show={showModal}>
                <ModalContent>
                    <h3>Reset Password</h3>
                    <form onSubmit={handleForgot}>
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={forgotEmail}
                            onChange={e => setForgotEmail(e.target.value)}
                        />
                        <Button type="submit">Send Reset Link</Button>
                        <Button type="button" onClick={() => setShowModal(false)} style={{ marginTop: "10px", background: "#6c757d" }}>
                            Close
                        </Button>
                    </form>
                    {forgotMessage && <Message>{forgotMessage}</Message>}
                </ModalContent>
            </ModalOverlay>
        </Container>
    );
}