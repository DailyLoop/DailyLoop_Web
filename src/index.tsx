import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { StoryTrackingProvider } from './context/StoryTrackingContext';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <StoryTrackingProvider>
          <App />
        </StoryTrackingProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);