import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'

const Navbar = ({ openAuthModal, user }) => {
  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b">
      {/* Left: Site name */}
      <div className="font-bold text-xl">
        <Link to="/" className="no-underline text-current">The Green Team</Link>
      </div>

      {/* Right: Render differently based on user type */}
      <div>
        {user ? (
          user.isAdmin ? (
            // For admin, only display admin username without login/register buttons
            <span className="nes-text is-primary" style={{ fontSize: '1.25rem' }}>
              {user.username}
            </span>
          ) : (
            <div className="flex space-x-2">
            <Link to="/discover" className="nes-btn is-success mr-3">
              Discover
            </Link>
            <Link
              to="/profile"
              className="nes-text is-primary"
              style={{ fontSize: '1.25rem', textDecoration: 'none', alignSelf: 'center' }}
            >
              {user.username}
            </Link>
          </div>
          )
        ) : (
          // No user: show login/register button
          <motion.button 
          onClick={openAuthModal} 
          whileHover={{ rotate: [0, -3, 3, 0] }}
          transition={{ duration: 0.25 }}
          className="nes-btn is-success"

          >
            Login / Register
          </motion.button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
