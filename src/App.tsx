// src/App.tsx
import React from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import NewsApp from './pages/NewsApp';
import AuthPage from './pages/AuthPage';
import LoadingState from "./components/common/LoadingState";
import { Toaster } from 'react-hot-toast';

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
      <Toaster position="top-center" />
      <Routes>
        <Route
          path="/auth"
          element={user ? <Navigate to="/" replace /> : <AuthPage />}
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