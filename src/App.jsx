import React from 'react';
import './App.css';

function App() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1 style={{ color: '#d846b4' }}>Lease Management</h1>
      <p>Test pagina - als je dit ziet werkt de basis React app</p>
      <div style={{ marginTop: '20px' }}>
        <button style={{ 
          padding: '10px 20px', 
          background: '#d846b4', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Test Knop
        </button>
      </div>
    </div>
  );
}

export default App;
