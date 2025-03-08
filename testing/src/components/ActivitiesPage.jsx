import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CalendarModal from './CalendarModal';

function ActivitiesPage({ user, onJoinVolunteer }) {
  const navigate = useNavigate();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  // Keep track locally of which activities the user has joined as volunteer
  const [volunteerJoined, setVolunteerJoined] = useState({});

  // Example data for cards
  const activities = [
    {
      id: 1,
      title: 'Green Volunteers',
      description: 'For ages 12 - 18 looking for regular weekend opportunities...',
      image: '/green-volunteers.jpg', // replace with your image
    },
    {
      id: 2,
      title: 'Nature Play',
      description: 'For toddlers and young kids aged 2-6 to experience nature...',
      image: '/nature-play.jpg',
    },
    {
      id: 3,
      title: 'Green Explorers',
      description: 'For ages 8-10 wanting to learn more about nature...',
      image: '/green-explorers.jpg',
    },
  ];

  const handleJoinWaitlist = (activityId) => {
    alert(`Joined waiting list for activity #${activityId}`);
  };

  const handleJoinVolunteerClick = async (activityId) => {
    if (!user) {
      alert('Please log in to join as volunteer.');
      return;
    }
    try {
      const res = await fetch('http://localhost:3001/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.username, activityId }),
      });
      const data = await res.json();
      if (res.ok) {
        // Mark this activity as joined by the volunteer
        setVolunteerJoined((prev) => ({ ...prev, [activityId]: true }));
        // Optionally, call onJoinVolunteer callback if you want to update App state as well.
        if (onJoinVolunteer) onJoinVolunteer(activityId);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error('Error joining as volunteer:', err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Activities</h2>

      {/* Back button */}
      <button
        className="nes-btn is-warning mb-4"
        onClick={() => navigate('/')}
      >
        Back
      </button>

      {/* Button to view calendar */}
      <button
        className="nes-btn is-primary mb-4 ml-4"
        onClick={() => setIsCalendarOpen(true)}
      >
        View Calendar
      </button>

      {/* Grid of cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="nes-container with-title"
            style={{ padding: '1rem' }}
          >
            <p className="title">{activity.title}</p>
            <img
              src={activity.image}
              alt={activity.title}
              className="mb-2 w-full h-32 object-cover"
            />
            <p className="text-sm text-gray-700 mb-2">{activity.description}</p>
            <div className="flex flex-col gap-2">
              <button
                className="nes-btn is-success"
                onClick={() => handleJoinWaitlist(activity.id)}
              >
                Join Waiting List
              </button>
              {volunteerJoined[activity.id] ? (
                <p className="text-green-600 font-bold">
                  You have joined as volunteer.
                </p>
              ) : (
                <button
                  className="nes-btn is-primary"
                  onClick={() => handleJoinVolunteerClick(activity.id)}
                >
                  Join Volunteer
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {isCalendarOpen && (
        <CalendarModal onClose={() => setIsCalendarOpen(false)} />
      )}
    </div>
  );
}

export default ActivitiesPage;
