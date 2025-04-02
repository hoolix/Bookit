import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

const CLIENT_ID = "58976510126-pqs33g0d63kkhhd5jrsd0hn5nvcjaj5s.apps.googleusercontent.com";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <GoogleOAuthProvider clientId={CLIENT_ID}>
    <App />
      </GoogleOAuthProvider>
  </StrictMode>,
)
