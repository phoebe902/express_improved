import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import styled from "styled-components";

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 30px;
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
  color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 0 0 15px 15px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Logo = styled(Link)`
  font-size: 1.6rem;
  font-weight: 700;
  color: #fff;
  text-decoration: none;
  letter-spacing: 1px;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  & a, & button {
    color: #fff;
    text-decoration: none;
    font-weight: 600;
    padding: 8px 15px;
    border-radius: 8px;
    transition: all 0.2s ease;
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 0.95rem;
  }

  & a:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }

  & button:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }
`;

export default function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <Nav>
      <Logo to="/">MovieApp</Logo>
      <NavLinks>
        {user ? (
          <>
            <Link to="/movies">Movies</Link>
            <Link to="/profile">Profile</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </NavLinks>
    </Nav>
  );
}