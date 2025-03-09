// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Section from './components/UnityGame';
import AuthModal from './components/AuthModal';
import Profile from './components/Profile';
import Discovery from './components/Discovery';
import PlantDetail from './components/PlantDetail';
import AdminDashboard from './components/AdminDashboard';
import FallingLeaves from './components/FallingLeaves';
import ActivitiesPage from './components/ActivitiesPage';
import Chatbot from './components/Chatbot';
import CloudBackground from './components/CloudBackground';
import Chatroom from './components/Chatroom';

function RoutesWrapper({ user, onLogout, openAuthModal, onJoinVolunteer }) {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user && user.isAdmin) {
      navigate('/admin');
    }
  }, [user, navigate]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div style={{ position: 'relative', minHeight: '100vh' }}>
            <div
              style={{
                position: 'absolute',
                top: 100,
                right: -200,
                width: '1350px',
                height: 'auto',
                overflow: 'hidden',
                zIndex: 1, 
              }}
            >
              <img
                className='m-0 p-0'
                src="/pixel_tree.png"
                alt="Pixel Tree"
                style={{
                  display: 'block',
                  width: '100%',
                  height: 'auto',
                }}
              />
              <img
                src="/bird.gif"
                alt="Bird"
                style={{
                  position: 'absolute',
                  top: '200px',
                  left: '300px',
                  width: '70px',
                  zIndex: 2,
                  pointerEvents: 'none',
                }}
              />

              <div style={{ position: 'absolute', inset: 0 }}>
                <FallingLeaves count={15} />
              </div>
            </div>

  
            <div style={{ position: 'relative', zIndex: 2 }}>
              <Hero user={user} openAuthModal={openAuthModal} />
              <Section />
            </div>
          </div>
        }
      />

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

      <Route
        path="/activities"
        element={<ActivitiesPage user={user} onJoinVolunteer={onJoinVolunteer} />}
      />


      <Route
        path="/chatroom"
        element={user ? <Chatroom user={user} /> : <div className="nes-container with-title" style={{ margin: '2rem auto', maxWidth: '600px', padding: '2rem' }}><p className="title">Access Denied</p><p>Please log in to access the chatroom.</p></div>}
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
   
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        
        <CloudBackground />

        <Navbar openAuthModal={() => setIsModalOpen(true)} user={user} onLogout={handleLogout} />

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

        <Chatbot />
      </div>
    </BrowserRouter>
  );
}

export default App;
