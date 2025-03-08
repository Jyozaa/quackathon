// src/components/CalendarModal.jsx
import React from 'react';

function CalendarModal({ onClose }) {
  const schedule = [
    { date: 'Mar 9, 2025', time: '9:30am GMT', activity: 'Green Volunteers' },
    { date: 'Mar 10, 2025', time: '9:30am GMT', activity: 'Nature Play' },
    { date: 'Mar 16, 2025', time: '9:30am GMT', activity: 'Green Volunteers' },
    { date: 'Mar 17, 2025', time: '10am GMT', activity: 'Green Explorers' },
    // Add more entries as needed
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
