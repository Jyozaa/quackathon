// src/components/Hero.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DonationModal from './DonationModal';
import DonationAmount from './DonationAmount';
import { useNavigate } from 'react-router-dom';

function Hero() {
  const navigate = useNavigate();
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [donation, setDonation] = useState(0);

  // Fetch current total from the server on mount
  useEffect(() => {
    const fetchDonationTotal = async () => {
      try {
        const res = await fetch('http://localhost:3001/donation');
        const data = await res.json();
        setDonation(data.total_amount);
      } catch (err) {
        console.error('Error fetching donation total:', err);
      }
    };
    fetchDonationTotal();
  }, []);

  // Update the total donation in the database
  const addDonation = async (amount) => {
    try {
      const res = await fetch('http://localhost:3001/donation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (res.ok) {
        setDonation(data.total_amount);
      } else {
        console.error('Donation error:', data.error);
      }
    } catch (err) {
      console.error('Error donating:', err);
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-bold mb-4">The Green Team</h1>

      <p style={{ color: 'black' }} className="text-gray-600 m-10">
        The Green Team has been successfully running programmes of outdoor activities for young people since 1995. Our programmes offer a unique blend of practical conservation tasks, outdoor fun, environmental education and personal development. We work with individuals, school groups and referring partners. There really is something for everybody.
      </p>

      {/* Use the simplified DonationAmount display component */}
      <DonationAmount amount={donation} />

      {/* Buttons */}
      <div className="flex justify-center items-center gap-4 mb-8">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="nes-btn is-success"
          onClick={() => navigate('/activities')}
        >
          Call to Action
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="nes-btn is-primary"
          onClick={() => setIsDonateModalOpen(true)}
        >
          Donate
        </motion.button>
      </div>

      {/* Donation Modal */}
      {isDonateModalOpen && (
        <DonationModal
          onClose={() => setIsDonateModalOpen(false)}
          onDonate={async (amount) => {
            await addDonation(amount);
            setIsDonateModalOpen(false);
          }}
        />
      )}
    </section>
  );
}

export default Hero;
