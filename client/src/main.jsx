import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1c1a17',
            color: '#f5f5f4',
            border: '1px solid rgba(197,160,40,0.2)',
            borderRadius: '2px',
            fontSize: '13px',
          },
          success: { iconTheme: { primary: '#c5a028', secondary: '#0d0c09' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#0d0c09' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)