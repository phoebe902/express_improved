import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

export default function GuestRoute({ children }) {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/movies"); // redirect if logged in
        }
    }, [user, navigate]);

    return !user ? children : null;
}