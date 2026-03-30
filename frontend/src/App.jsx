import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/authContext";

import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import MovieListPage from "./pages/MovieListPage";
import MovieFormPage from "./pages/MovieFormPage";
import MovieDetailPage from "./pages/MovieDetailPage";
import ResetPassword from "./pages/ResetPassword";

// --- Guest Route ---
const GuestRoute = ({ children }) => {
    const { user } = React.useContext(AuthContext);
    return !user ? children : <Navigate to="/movies" replace />;
};

// --- Protected Route ---
const ProtectedRoute = ({ children }) => {
    const { user } = React.useContext(AuthContext);
    return user ? children : <Navigate to="/login" replace />;
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    {/* Guest-only pages */}
                    <Route
                        path="/login"
                        element={
                            <GuestRoute>
                                <LoginPage />
                            </GuestRoute>
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <GuestRoute>
                                <RegisterPage />
                            </GuestRoute>
                        }
                    />

                    {/* Protected pages */}
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/movies"
                        element={
                            <ProtectedRoute>
                                <MovieListPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/movies/new"
                        element={
                            <ProtectedRoute>
                                <MovieFormPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/movies/edit/:id"
                        element={
                            <ProtectedRoute>
                                <MovieFormPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/movies/:id"
                        element={
                            <ProtectedRoute>
                                <MovieDetailPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Reset password is accessible to anyone with the token */}
                    <Route path="/reset-password/:token" element={<ResetPassword />} />

                    {/* Default route */}
                    <Route path="/" element={<Navigate to="/movies" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;