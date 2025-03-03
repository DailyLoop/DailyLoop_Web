import React, { useCallback } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import NewsApp from "./pages/NewsApp";
import AuthPage from "./pages/AuthPage";
import LandingPage from "./components/LandingPage";
import ProfilePage from "./pages/ProfilePage";
import BookmarksPage from "./pages/BookmarksPage";
import StoryTrackingPage from "./pages/StoryTrackingPage";
import LoadingState from "./components/common/LoadingState";
import { StoryTrackingProvider } from "./context/StoryTrackingContext";
import { PollingProvider } from "./context/PollingContext";

function App() {
  const { user, loading, initialized } = useAuth();
  const isAuthenticated = !!user;
  
  const handleSearch = useCallback(async () => {
    // Your search implementation
  }, []);

  // Show loading state until auth is fully initialized
  if (!initialized || loading) {
    console.log("[App] Waiting for auth initialization:", { isAuthenticated, initialized, loading });
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingState type="spinner" />
      </div>
    );
  }

  // Log final state after initialization
  console.log("[App] Auth state resolved:", { isAuthenticated, initialized });

  // Render routes based on auth state
  return (
    <PollingProvider>
      <StoryTrackingProvider>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? 
                <Navigate to="/app" replace /> : 
                <LandingPage onSearch={handleSearch} />
            }
          />
          <Route
            path="/auth"
            element={isAuthenticated ? <Navigate to="/app" replace /> : <AuthPage />}
          />
          <Route
            path="/app"
            element={isAuthenticated ? <NewsApp /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/profile"
            element={isAuthenticated ? <ProfilePage /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/bookmarks"
            element={isAuthenticated ? <BookmarksPage /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/story-tracking/:keyword"
            element={
              isAuthenticated ? (
                <StoryTrackingPage />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />
          <Route path="*" element={<div className="text-white p-4">Page not found</div>} />
        </Routes>
      </StoryTrackingProvider>
    </PollingProvider>
  );
}

export default App;