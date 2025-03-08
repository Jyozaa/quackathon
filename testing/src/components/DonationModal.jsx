// src/components/DonationModal.jsx
import React, { useState } from 'react';

function DonationModal({ onClose, onDonate }) {
  const [amount, setAmount] = useState('');

  const handleDonate = () => {
    const num = parseFloat(amount);
    if (!isNaN(num) && num > 0) {
      onDonate(num);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="nes-container is-rounded relative p-6"
        style={{ width: '300px', background: 'white' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="nes-btn is-error"
          style={{ position: 'absolute', top: '10px', right: '10px' }}
        >
          X
        </button>

        <h2 className="text-xl mb-4">Enter amount you want to donate</h2>
        <div className="nes-field">
          <label htmlFor="donationAmount">Amount</label>
          <input
            id="donationAmount"
            type="number"
            className="nes-input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g., 50"
          />
        </div>
        <button
          onClick={handleDonate}
          className="nes-btn is-success"
          style={{ marginTop: '1rem' }}
        >
          Donate
        </button>
      </div>
    </div>
  );
}

export default DonationModal;
