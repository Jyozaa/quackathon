// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Section from './components/Section';
import AuthModal from './components/AuthModal';
import Profile from './components/Profile';
import Discovery from './components/Discovery';
import PlantDetail from './components/PlantDetail';
import AdminDashboard from './components/AdminDashboard';
import FallingLeaves from './components/FallingLeaves';
import ActivitiesPage from './components/ActivitiesPage';

function RoutesWrapper({ user, onLogout, openAuthModal }) {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user && user.isAdmin) {
      navigate('/admin');
    }
  }, [user, navigate]);

  return (
    <Routes>
      {/* Landing page */}
      <Route
        path="/"
        element={
          <div style={{ position: 'relative', minHeight: '100vh' }}>
            {/* Absolutely positioned container for tree & falling leaves */}
            <div
              style={{
                position: 'absolute',
                top: 200,
                right: -200,
                width: '1250px',
                height: 'auto',
                overflow: 'hidden',
                zIndex: 0,
              }}
            >
              <img
                src="/pixel_tree.png"
                alt="Pixel Tree"
                style={{
                  display: 'block',
                  width: '100%',
                  height: 'auto',
                }}
              />
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                <FallingLeaves count={15} />
              </div>
            </div>
            {/* Main content */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Hero user={user} openAuthModal={openAuthModal} />
              <Section />
            </div>
          </div>
        }
      />

      {/* Admin dashboard */}
      <Route
        path="/admin"
        element={
          user && user.isAdmin ? (
            <AdminDashboard onLogout={onLogout} />
          ) : (
            <div
              className="nes-container with-title"
              style={{ margin: '2rem auto', maxWidth: '600px', padding: '2rem' }}
            >
              <p className="title">Access Denied</p>
              <p>You must be an admin to view this page.</p>
            </div>
          )
        }
      />

      {/* Normal user profile */}
      <Route
        path="/profile"
        element={
          user ? (
            <Profile user={user} />
          ) : (
            <div
              className="nes-container with-title"
              style={{ margin: '2rem auto', maxWidth: '600px', padding: '2rem' }}
            >
              <p className="title">Access Denied</p>
              <p>Please log in to view your profile.</p>
            </div>
          )
        }
      />

      {/* Discovery page */}
      <Route
        path="/discover"
        element={
          user ? (
            <Discovery />
          ) : (
            <div
              className="nes-container with-title"
              style={{ margin: '2rem auto', maxWidth: '600px', padding: '2rem' }}
            >
              <p className="title">Access Denied</p>
              <p>Please log in to discover plants and flowers.</p>
            </div>
          )
        }
      />

      {/* Plant detail page */}
      <Route
        path="/details/:id"
        element={
          user ? (
            <PlantDetail />
          ) : (
            <div
              className="nes-container with-title"
              style={{ margin: '2rem auto', maxWidth: '600px', padding: '2rem' }}
            >
              <p className="title">Access Denied</p>
              <p>Please log in to view details.</p>
            </div>
          )
        }
      />

      {/* Activities page */}
      <Route
        path="/activities"
        element={<ActivitiesPage user={user} />}
      />
    </Routes>
  );
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (username) => {
    if (username === 'admin') {
      setUser({ username: 'admin', isAdmin: true });
    } else {
      setUser({ username, isAdmin: false });
    }
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <BrowserRouter>
      <div className="font-sans min-h-screen">
        <Navbar openAuthModal={() => setIsModalOpen(true)} user={user} />
        <RoutesWrapper
          user={user}
          onLogout={handleLogout}
          openAuthModal={() => setIsModalOpen(true)}
        />
        {isModalOpen && (
          <AuthModal
            onClose={() => setIsModalOpen(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
