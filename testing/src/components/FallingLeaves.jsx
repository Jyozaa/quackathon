import React, { useEffect, useState } from 'react';
import './FallingLeaves.css';

const generateRandomLeaves = (count) => {
  const leaves = [];
  for (let i = 0; i < count; i++) {
    leaves.push({
      id: i,
      // Random horizontal start position (in percentage)
      left: Math.random() * 100,
      // Random delay before the animation starts
      delay: Math.random() * 5,
      // Random animation duration between 5 and 10 seconds
      duration: 5 + Math.random() * 5,
      // Optionally, random size for variety
      size: 20 + Math.random() * 20, // size in pixels
    });
  }
  return leaves;
};

const FallingLeaves = ({ count = 10 }) => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    setLeaves(generateRandomLeaves(count));
  }, [count]);

  return (
    <div className="falling-leaves">
      {leaves.map((leaf) => (
        <img
          key={leaf.id}
          src="/leaf.png"
          alt="leaf"
          className="falling-leaf"
          style={{
            left: `${leaf.left}%`,
            width: `${leaf.size}px`,
            animationDelay: `${leaf.delay}s`,
            animationDuration: `${leaf.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

export default FallingLeaves;
