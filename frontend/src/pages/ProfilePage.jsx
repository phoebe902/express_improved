import React, { useContext, useState, useEffect } from "react";
import API from "../api/api";
import { AuthContext } from "../context/authContext";
import styled from "styled-components";
import { FiEdit2, FiCheck, FiX } from "react-icons/fi";


// --- Styled Components ---
const PageContainer = styled.div`
  font-family: 'Segoe UI', Arial, sans-serif;
  min-height: 100vh;
  background-color: #f4f6f8;
  padding: 50px 20px;
  display: flex;
  justify-content: center;
`;
const ProfileImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative; /* needed for absolute buttons */
`;
const ButtonOverlay = styled.div`
  position: absolute;
  bottom: -35px; /* just below the image */
  display: flex;
  gap: 10px;
`;
const Button = styled.button`
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  background-color: #007bff;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #0056b3;
  }
`;
const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;

  // center under image for picture
  justify-content: ${props => props.center ? "center" : "flex-start"};
`;

const ProfileCard = styled.div`
  background-color: #fff;
  width: 700px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  padding: 40px;
  display: flex;
  gap: 50px;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 90%;
    padding: 25px;
    gap: 25px;
  }
`;

const ProfileImageSection = styled.div`
  flex: 1;
  text-align: center;
  position: relative;
`;

const ProfileImage = styled.img`
  width: 180px;
  height: 180px;
  object-fit: cover;
  border-radius: 15px;
  border: 3px solid #007bff;
`;

const EditPictureButton = styled.label`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #007bff;
  color: #fff;
  border-radius: 50%;
  padding: 8px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #0056b3;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const InfoSection = styled.div`
  flex: 2;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 25px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 18px;
  justify-content: space-between;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const Label = styled.span`
  font-weight: bold;
  color: #555;
  min-width: 120px;
`;

const ValueContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Value = styled.span`
  font-size: 1rem;
  color: #333;
`;

const Input = styled.input`
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0,123,255,0.2);
  }
`;

const IconButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  color: ${props => props.color || "#007bff"};
  display: flex;
  align-items: center;
  font-size: 1.2rem;

  &:hover {
    opacity: 0.7;
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
  padding: 25px 30px;
  border-radius: 12px;
  text-align: center;
  width: 350px;
`;

const ModalMessage = styled.p`
  font-size: 16px;
  color: ${props => (props.success ? "green" : "red")};
  margin-bottom: 20px;
`;

export default function ProfilePage() {
  const { user, loadProfile } = useContext(AuthContext);
  const [editingField, setEditingField] = useState(null);
  const [username, setUsername] = useState(user?.username || "");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmChange, setConfirmChange] = useState(false);

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [file]);

  const handleFieldEdit = field => setEditingField(field);
  const cancelEdit = () => {
    setEditingField(null);
    setUsername(user?.username || "");
    setFile(null);
  };
  const handleFileSelect = e => {
  const selectedFile = e.target.files[0];
  if (selectedFile) {
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setConfirmChange(true); // show confirmation modal
  }
};

  const handleSave = async field => {
    const formData = new FormData();
    if (field === "username") formData.append("username", username);
    if (field === "profile_picture" && file) formData.append("profile_picture", file);

    setLoading(true);
    try {
      const res = await API.put("/auth/profile", formData);
      setMessage(res.data.message);
      setSuccess(true);
      setShowModal(true);
      loadProfile();
      setEditingField(null);
      setFile(null);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error");
      setSuccess(false);
      setShowModal(true);
    }
    setLoading(false);
  };

  const closeModal = () => setShowModal(false);

  return (
    <PageContainer>
      <ProfileCard>
        <ProfileImageSection>
          <ProfileImageWrapper>
  <ProfileImage 
    src={preview || user?.profile_picture ? `http://localhost:5000/uploads/${user.profile_picture}` : ""} 
    alt="Profile" 
  />

  <EditPictureButton htmlFor="fileInput" onClick={() => handleFieldEdit("profile_picture")}>
    <FiEdit2 />
  </EditPictureButton>

  {editingField === "profile_picture" && (
    
      <HiddenFileInput 
  id="fileInput" 
  type="file" 
  accept="image/*" 
  onChange={handleFileSelect} 
/>

    
    
  )}
</ProfileImageWrapper>
        </ProfileImageSection>

        <InfoSection>
          <Title>Profile Info</Title>
          <InfoRow>
            <Label>Username:</Label>
            <ValueContainer>
              {editingField === "username" ? (
                <>
                  <Input value={username} onChange={e => setUsername(e.target.value)} />
                  <IconButton color="green" onClick={() => handleSave("username")}>
                    <FiCheck />
                  </IconButton>
                  <IconButton color="red" onClick={cancelEdit}>
                    <FiX />
                  </IconButton>
                </>
              ) : (
                <>
                  <Value>{user?.username}</Value>
                  <IconButton onClick={() => handleFieldEdit("username")}><FiEdit2 /></IconButton>
                </>
              )}
            </ValueContainer>
          </InfoRow>
          <InfoRow>
            <Label>Email:</Label>
            <Value>{user?.email}</Value>
          </InfoRow>
        </InfoSection>
      </ProfileCard>
      <ModalOverlay show={confirmChange}>
  <ModalContent>
    <ModalMessage>Are you sure you want to change your profile picture?</ModalMessage>
    <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
      <Button onClick={() => { handleSave("profile_picture"); setConfirmChange(false); }}>Yes</Button>
      <Button onClick={() => { setFile(null); setPreview(null); setConfirmChange(false); }}>No</Button>
    </div>
  </ModalContent>
</ModalOverlay>

      {/* Modal */}
      <ModalOverlay show={showModal}>
        <ModalContent>
          <ModalMessage success={success}>{message}</ModalMessage>
          <Button onClick={closeModal}>OK</Button>
        </ModalContent>
      </ModalOverlay>
    </PageContainer>
  );
}