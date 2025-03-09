// src/components/CalendarModal.jsx
import React from 'react';

function CalendarModal({ onClose }) {
  const schedule = [
    { date: 'Jan 15, 2025', time: '10am GMT', activity: 'Green Explorers' },
    { date: 'Jan 17, 2025', time: '10am GMT', activity: 'Nature Play' },
    { date: 'Jan 10, 2025', time: '10am GMT', activity: 'Green Volunteers' },
    { date: 'Jan 25, 2025', time: '10am GMT', activity: 'Green Volunteers' },
    { date: 'Jan 27, 2025', time: '10am GMT', activity: 'Green Explorers' },
    { date: 'Jan 30, 2025', time: '10am GMT', activity: 'Nature Play' },
    { date: 'Feb 13, 2025', time: '10am GMT', activity: 'Green Explorers' },
    { date: 'Feb 14, 2025', time: '10am GMT', activity: 'Green Explorers' },
    { date: 'Feb 15, 2025', time: '10am GMT', activity: 'Nature Play' },
    { date: 'Mar 17, 2025', time: '10am GMT', activity: 'Green Explorers' },
    { date: 'Mar 17, 2025', time: '10am GMT', activity: 'Nature Play' },
    { date: 'Mar 17, 2025', time: '10am GMT', activity: 'Green Explorers' },
    { date: 'Mar 9, 2025', time: '9:30am GMT', activity: 'Green Volunteers' },
    { date: 'Mar 10, 2025', time: '9:30am GMT', activity: 'Nature Play' },
    { date: 'Mar 16, 2025', time: '9:30am GMT', activity: 'Green Volunteers' },
    { date: 'Mar 17, 2025', time: '10am GMT', activity: 'Green Explorers' },
  ];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="nes-container is-rounded p-6 relative"
        style={{ width: '500px', background: 'white' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="nes-btn is-error"
          style={{ position: 'absolute', top: '10px', right: '10px' }}
        >
          X
        </button>
        <h2 className="text-xl mb-4">Activity Schedule</h2>
        <ul>
          {schedule.map((item, index) => (
            <li key={index} className="mb-2">
              <strong>{item.date}</strong> - {item.time} : {item.activity}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CalendarModal;
