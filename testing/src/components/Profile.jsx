// src/components/Profile.jsx
import React, { useState, useEffect } from 'react';

function Profile({ user }) {
  const [formData, setFormData] = useState({
    personalInfo: '',
    email: '',
    phone: '',
    interests: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true); // loading state for GET
  const [message, setMessage] = useState('');

  // Load profile data when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:3001/profile/${user.username}`);
        const data = await res.json();
        // If data is returned, populate the formData
        setFormData({
          personalInfo: data.personalInfo || '',
          email: data.email || '',
          phone: data.phone || '',
          interests: data.interests || '',
        });
        // If there's no data, enable editing so user can enter info
        if (!data.personalInfo && !data.email && !data.phone && !data.interests) {
          setIsEditing(true);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user.username]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch(`http://localhost:3001/profile/${user.username}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personalInfo: formData.personalInfo,
          email: formData.email,
          phone: formData.phone,
          interests: formData.interests,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setIsEditing(false);
      } else {
        setMessage(data.error || 'Failed to save profile.');
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      setMessage('An error occurred while saving.');
    }
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  return (
    <div
      className="nes-container with-title is-centered"
      style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem' }}
    >
      <p className="title">{user.username}&apos;s Profile</p>

      {isEditing ? (
        <form onSubmit={handleSave}>
          <div className="nes-field">
            <label htmlFor="personalInfo">Personal Info</label>
            <textarea
              id="personalInfo"
              name="personalInfo"
              className="nes-textarea"
              placeholder="Tell us about yourself..."
              value={formData.personalInfo}
              onChange={handleChange}
            />
          </div>

          <div className="nes-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="text"
              className="nes-input"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="nes-field">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              type="text"
              className="nes-input"
              placeholder="Phone number"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="nes-field">
            <label htmlFor="interests">Interests</label>
            <input
              id="interests"
              name="interests"
              type="text"
              className="nes-input"
              placeholder="E.g., tree planting, wildlife conservation..."
              value={formData.interests}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="nes-btn is-success" style={{ marginTop: '1rem' }}>
            Save
          </button>
        </form>
      ) : (
        <div>
          <p><strong>Personal Info:</strong> {formData.personalInfo || 'N/A'}</p>
          <p><strong>Email:</strong> {formData.email || 'N/A'}</p>
          <p><strong>Phone:</strong> {formData.phone || 'N/A'}</p>
          <p><strong>Interests:</strong> {formData.interests || 'N/A'}</p>
          <button
            className="nes-btn is-primary"
            onClick={() => setIsEditing(true)}
            style={{ marginTop: '1rem' }}
          >
            Edit Info
          </button>
        </div>
      )}

      {message && <p style={{ marginTop: '1rem', color: 'green' }}>{message}</p>}
    </div>
  );
}

export default Profile;
