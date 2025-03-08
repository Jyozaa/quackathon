import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useNavigate } from 'react-router-dom';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

function AdminDashboard({ onLogout }) {
  const navigate = useNavigate();
  const [volunteers, setVolunteers] = useState([]);

  const fetchVolunteers = async () => {
    try {
      const res = await fetch('http://localhost:3001/volunteers');
      const data = await res.json();
      if (res.ok) {
        setVolunteers(data.volunteers);
      }
    } catch (err) {
      console.error('Error fetching volunteers:', err);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  // Example bar chart data
  const barData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Donations ($)',
        data: [500, 1200, 800, 1500],
        backgroundColor: 'green',
      },
    ],
  };

  // Prepare volunteer tasks (each volunteer can be assigned a task later)
  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="nes-btn is-error" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <h1 style={{ color: 'green' }}>Admin Dashboard</h1>
      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
        {/* Left column: Donation stats */}
        <div style={{ flex: 1 }}>
          <h2 style={{ color: 'green' }}>Donations Overview</h2>
          <p>
            Total Donations This Month: <strong>$4000</strong>
          </p>
          <div style={{ backgroundColor: '#f0fff0', padding: '1rem', borderRadius: '8px' }}>
            <Bar data={barData} />
          </div>
        </div>

        {/* Right column: Volunteer Tasks */}
        <div style={{ flex: 1 }}>
          <h2 style={{ color: 'green' }}>Volunteer Tasks</h2>
          {volunteers.length > 0 ? (
            <ul style={{ backgroundColor: '#f0fff0', padding: '1rem', borderRadius: '8px' }}>
              {volunteers.map((vol) => (
                <li key={vol.id} style={{ marginBottom: '1rem' }}>
                  <strong>Volunteer:</strong> {vol.username} <br />
                  <strong>Activity ID:</strong> {vol.activity_id}
                </li>
              ))}
            </ul>
          ) : (
            <p>No volunteers have joined yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
