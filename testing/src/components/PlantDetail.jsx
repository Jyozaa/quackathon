// src/components/PlantDetail.jsx
import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const PlantDetail = () => {
  const { state: item } = useLocation();

  if (!item) {
    return <p>No details available.</p>;
  }

  const imageUrl =
    item.default_photo
      ? item.default_photo.large_url || item.default_photo.medium_url || 'https://via.placeholder.com/600'
      : 'https://via.placeholder.com/600';

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem' }}>
      <Link to="/discover" style={{ textDecoration: 'none', marginBottom: '1rem', display: 'block' }}>
        ← Back to Discovery
      </Link>
      <img
        src={imageUrl}
        alt={item.name}
        style={{
          width: '100%',
          objectFit: 'cover',
          borderRadius: '8px',
        }}
      />
      <h2 style={{ marginTop: '1rem' }}>{item.name}</h2>
      <p style={{ marginTop: '0.5rem', fontSize: '1rem', color: '#555' }}>
        {item.wikipedia_summary
          ? item.wikipedia_summary
          : 'No description available.'}
      </p>
    </div>
  );
};

export default PlantDetail;
