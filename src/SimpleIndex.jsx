import React from 'react';

const SimpleIndex = () => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1810 50%, #1a1a1a 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '24px',
      textAlign: 'center',
      flexDirection: 'column',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>🎉 Dashboard Working!</h1>
      <p>Welcome to the Admin Dashboard</p>
      <div style={{
        background: 'rgba(255, 215, 0, 0.1)',
        border: '2px solid #FFD700',
        borderRadius: '12px',
        padding: '20px',
        marginTop: '30px',
        maxWidth: '400px'
      }}>
        <p style={{ fontSize: '18px', marginBottom: '10px' }}>✅ Login Successful!</p>
        <p style={{ fontSize: '16px' }}>The enhanced dashboard will be loaded here.</p>
      </div>
      <button 
        onClick={() => {
          sessionStorage.removeItem('authToken');
          window.location.href = '/';
        }}
        style={{
          marginTop: '30px',
          padding: '12px 24px',
          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
          border: 'none',
          borderRadius: '8px',
          color: 'white',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer'
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default SimpleIndex;
