// src/App.tsx

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import NewsApp from "./pages/NewsApp";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import LoadingState from "./components/common/LoadingState";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingState type="spinner" />
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route
          path="/auth"
          element={user ? <Navigate to="/" replace /> : <AuthPage />}
        />
        <Route
          path="/profile"
          element={user ? <ProfilePage /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/*"
          element={user ? <NewsApp /> : <Navigate to="/auth" replace />}
        />
      </Routes>
    </>
  );
}

export default App;