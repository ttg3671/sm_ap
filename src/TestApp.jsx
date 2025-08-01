import React from 'react';

function TestApp() {
  return (
    <div style={{
      padding: '20px',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1810 50%, #1a1a1a 100%)',
      minHeight: '100vh',
      color: 'white',
      fontSize: '24px'
    }}>
      <h1>Test App - React is Working!</h1>
      <p>If you can see this, React is rendering correctly.</p>
    </div>
  );
}

export default TestApp;
