import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Login } from "./UI";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="*" element={
        <div style={{
          color: 'white', 
          fontSize: '24px', 
          textAlign: 'center', 
          marginTop: '50px',
          background: '#1a1a1a',
          minHeight: '100vh',
          padding: '20px'
        }}>
          Page Not Found - Go back to <a href="/" style={{color: '#FFD700'}}>Login</a>
        </div>
      } />
    </Routes>
  );
}

export default App;
