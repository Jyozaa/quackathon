// src/components/BirdWithSpeech.jsx
import React, { useState } from 'react';

const BirdWithSpeech = () => {
  const [isHovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <img src="/bird.gif" alt="Bird" style={{ width: '150px' }} />

      {isHovered && (
        <img
          src="/pixel-speech-bubble.gif"
          alt="Speech Bubble"
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '180px',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
};

export default BirdWithSpeech;
