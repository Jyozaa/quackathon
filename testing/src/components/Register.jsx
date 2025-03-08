// src/components/Register.jsx
import React, { useState } from 'react';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setIsSuccess(true);
        setUsername('');
        setPassword('');
      } else {
        setMessage(data.error);
        setIsSuccess(false);
      }
    } catch (error) {
      console.error(error);
      setMessage('An error occurred.');
      setIsSuccess(false);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2 className="title" style={{ marginBottom: '1rem' }}>Register</h2>
      <div className="nes-field">
        <label htmlFor="register-username">Username</label>
        <input
          id="register-username"
          type="text"
          className="nes-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="nes-field">
        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          type="password"
          className="nes-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit" className="nes-btn is-primary" style={{ marginTop: '1rem' }}>
        Register
      </button>
      {message && (
        <p style={{ marginTop: '10px', color: isSuccess ? 'green' : 'red' }}>
          {message}
        </p>
      )}
    </form>
  );
}

export default Register;
