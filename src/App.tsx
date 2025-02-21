// src/App.tsx

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import NewsApp from "./pages/NewsApp";
import AuthPage from "./pages/AuthPage";
import LandingPage from "./components/LandingPage";
import ProfilePage from "./pages/ProfilePage";
import BookmarksPage from "./pages/BookmarksPage";
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
    <Routes>
      <Route
        path="/"
        element={
          user ? <Navigate to="/app" replace /> : <LandingPage onSearch={async () => {}} />
        }
      />
      <Route
        path="/auth"
        element={user ? <Navigate to="/app" replace /> : <AuthPage />}
      />
      <Route
        path="/app"
        element={user ? <NewsApp /> : <Navigate to="/auth" replace />}
      />
      <Route
        path="/profile"
        element={user ? <ProfilePage /> : <Navigate to="/auth" replace />}
      />
      <Route
        path="/bookmarks"
        element={user ? <BookmarksPage /> : <Navigate to="/auth" replace />}
      />
      {/* Fallback route for unmatched paths */}
      <Route path="*" element={<div className="text-white p-4">Page not found</div>} />
    </Routes>
  );
}

export default App;