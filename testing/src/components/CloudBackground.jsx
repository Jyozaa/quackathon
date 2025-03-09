// src/components/CloudBackground.jsx
import React, { useState } from 'react';
import './CloudBackground.css';

const cloudImages = [
  '/cloud1.png',
  '/cloud2.png',
  '/cloud3.png',
  '/cloud4.png',
];

function CloudBackground() {

  const [cloudData] = useState(() =>
    cloudImages.map((src) => {

      const top = Math.floor(Math.random() * 20) + 40;
      
      const left = Math.floor(Math.random() * 200) - 200;

      const duration = Math.floor(Math.random() * 40) + 40;

      const scale = 0.3 + Math.random() * 0.5;
      const delay = Math.floor(Math.random() * 11);
      return { src, top, duration, scale, delay};
    })
  );

  return (
    <div className="cloud-container">
      {cloudData.map((cloud, i) => (
        <img
          key={i}
          src={cloud.src}
          alt={`Cloud ${i}`}
          className="cloud"
          style={{
            top: `${cloud.top}%`,
            left: `${cloud.left}px`,
            animationDuration: `${cloud.duration}s`,
            animationDelay: `${cloud.delay}s`,
            transform: `scale(${cloud.scale})`,
          }}
        />
      ))}
    </div>
  );
}

export default CloudBackground;
