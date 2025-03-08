// src/components/AuthModal.jsx
import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

function AuthModal({ onClose, onLoginSuccess }) {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" 
      onClick={onClose}
    >
      <div 
        className="nes-container is-rounded" 
        onClick={(e) => e.stopPropagation()}
        style={{ width: '90%', maxWidth: '400px', position: 'relative', padding: '2rem' }}
      >
        <button 
          className="nes-btn is-error" 
          style={{ position: 'absolute', top: '10px', right: '10px' }}
          onClick={onClose}
        >
          X
        </button>
        <div className="mb-4" style={{ display: 'flex', justifyContent: 'space-around' }}>
          <button
            onClick={() => setShowRegister(false)}
            className={`nes-btn ${!showRegister ? 'is-primary' : ''}`}
          >
            Login
          </button>
          <button
            onClick={() => setShowRegister(true)}
            className={`nes-btn ${showRegister ? 'is-primary' : ''}`}
          >
            Register
          </button>
        </div>
        {showRegister ? <Register /> : <Login onLoginSuccess={onLoginSuccess} />}
      </div>
    </div>
  );
}

export default AuthModal;
