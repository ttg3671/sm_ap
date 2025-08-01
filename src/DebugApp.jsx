import React from 'react';

function DebugApp() {
  console.log("DebugApp is rendering");
  
  return (
    <div style={{
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '32px',
      fontWeight: 'bold',
      textAlign: 'center',
      flexDirection: 'column',
      padding: '20px'
    }}>
      <h1>🎉 React is Working!</h1>
      <p style={{ fontSize: '18px', marginTop: '20px' }}>
        This means the issue is with specific components, not React itself.
      </p>
      <p style={{ fontSize: '16px', marginTop: '10px', opacity: 0.8 }}>
        Check browser console for any errors.
      </p>
    </div>
  );
}

export default DebugApp;
