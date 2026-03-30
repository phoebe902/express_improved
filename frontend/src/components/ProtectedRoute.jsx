import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

export default function ProtectedRoute({ children }) {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login"); // redirect if not logged in
        }
    }, [user, navigate]);

    return user ? children : null;
}