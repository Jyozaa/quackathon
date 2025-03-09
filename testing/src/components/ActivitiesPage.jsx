// src/components/ActivitiesPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import CalendarModal from './CalendarModal';

function ActivitiesPage({ onJoinVolunteer }) {
  const navigate = useNavigate();
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  const activities = [
    {
      id: 1,
      title: 'Green Volunteers',
      description: 'Get hands-on with conservation tasks, learn sustainable practices, Perfect for anyone looking to give back and grow their eco-knowledge...',
      image: '/green-volunteers.jpg', 
    },
    {
      id: 2,
      title: 'Nature Play',
      description: 'Immerse yourself in fun, outdoor activities. From guided walks to interactive workshops, discover new ways to explore and connect with nature...',
      image: '/nature-play.jpg',
    },
    {
      id: 3,
      title: 'Green Explorers',
      description: 'Dive deeper into the wonders of our planet. Join guided adventures, learn about diverse ecosystems, and develop practical skills perfect for curious minds ready to explore. ...',
      image: '/green-explorers.jpg',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Activities</h2>


      <button
        className="nes-btn is-warning mb-4"
        onClick={() => navigate('/')}
      >
        Back
      </button>

   
      <button
        className="nes-btn is-primary mb-4 ml-4"
        onClick={() => setIsCalendarOpen(true)}
      >
        View Calendar
      </button>


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
            <button
              className="nes-btn is-success"
              onClick={() => onJoinVolunteer(activity.id)}
            >
              Join Volunteer
            </button>
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
