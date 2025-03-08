// src/components/AdminLogin.jsx
import React, { useState } from 'react';

function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Hardcode admin credentials
    if (username === 'admin' && password === 'admin123') {
      onLoginSuccess(); // Let the parent know admin is authenticated
    } else {
      setError('Invalid admin credentials');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Admin Login</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />
        <label style={styles.label}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
        <button type="submit" style={styles.button}>
          Log In
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '3rem auto',
    padding: '2rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  title: {
    marginBottom: '1rem',
    color: 'green',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '0.3rem',
    textAlign: 'left',
  },
  input: {
    marginBottom: '1rem',
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    backgroundColor: 'green',
    color: '#fff',
    padding: '0.6rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default AdminLogin;
