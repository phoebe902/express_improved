import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import styled from "styled-components";

// --- Styled Components ---
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

const Card = styled.div`
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  width: 350px;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
`;

const Button = styled.button`
  padding: 12px;
  width: 100%;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;

// --- Modal ---
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Modal = styled.div`
  background: white;
  padding: 25px;
  border-radius: 10px;
  text-align: center;
  width: 300px;
`;

const ModalButton = styled.button`
  margin-top: 15px;
  padding: 10px 15px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;

// --- Component ---
export default function ResetPasswordPage() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [showModal, setShowModal] = useState(false);

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await API.post(`/auth/reset-password/${token}`, { password });
            setMessage(res.data.message);

            // ✅ show modal instead of auto redirect
            setShowModal(true);

        } catch (err) {
            setMessage(err.response?.data?.message || "Error");
        }
    };

    return (
        <Container>
            <Card>
                <h2>Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <Input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <Button type="submit">Reset</Button>
                </form>
                <p>{message}</p>
            </Card>

            {/* ✅ Modal */}
            {showModal && (
                <ModalOverlay>
                    <Modal>
                        <h3>Password Reset Successful</h3>
                        <p>You can now log in with your new password.</p>
                        <ModalButton onClick={() => navigate("/login")}>
                            Go to Login
                        </ModalButton>
                    </Modal>
                </ModalOverlay>
            )}
        </Container>
    );
}