// src/components/DonationAmount.jsx
import React from 'react';
import { motion } from 'framer-motion';

function DonationAmount({ amount }) {
  return (
    <motion.p
      // Animate the text to float up and down
      animate={{ y: [0, -10, 0] }}
      transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
      style={{
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '2rem',
        color: '#FFC600', // gold-like color
        margin: '1rem 0',
        // Pixel-style outline
        textShadow: `
          -2px 2px 0 #000,
           2px 2px 0 #000,
           2px -2px 0 #000,
          -2px -2px 0 #000
        `,
      }}
    >
      ${amount}
    </motion.p>
  );
}

export default DonationAmount;
