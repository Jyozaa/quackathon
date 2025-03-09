import React from 'react';

const UnityGame = () => {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Play Our Unity Game</h2>
      <iframe
        src="/unity/index.html"
        width="100%"
        height="600px"
        frameBorder="0"
        allowFullScreen
        title="Unity Game"
      ></iframe>
    </div>
  );
};

export default UnityGame;
