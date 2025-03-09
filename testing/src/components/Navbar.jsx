import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ openAuthModal, user, onLogout }) => {
  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b">
      <div className="font-bold text-xl">
        <Link to="/" className="no-underline text-current">
          The Green Team
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {user && !user.isAdmin && (
          <>
            <Link to="/discover" className="nes-text is-primary text-lg no-underline">
              Discover
            </Link>
            <Link to="/profile" className="nes-text is-primary text-lg no-underline">
              Profile
            </Link>
            <Link to="/chatroom" className="nes-text is-primary text-lg no-underline">
              Chatroom
            </Link>
          </>
        )}
        {user ? (
          <div className="flex items-center gap-2">
            <span className="nes-text is-primary" style={{ fontSize: '1.25rem' }}>
              {user.username}
            </span>
            <button onClick={onLogout} className="nes-btn is-error">
              Logout
            </button>
          </div>
        ) : (
          <button onClick={openAuthModal} className="nes-btn is-success">
            Login / Register
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
