// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function AdminDashboard() {

  const volunteers = [
    { id: 1, username: 'Jacob', activity_id: 'A123' },
    { id: 2, username: 'Joe', activity_id: 'B456' },
    { id: 3, username: 'Sachin', activity_id: 'C789' },
    { id: 4, username: 'Charles', activity_id: 'D346' },
    { id: 5, username: 'Mark', activity_id: 'E635' },
  ];


  const barData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Donations ($)',
        data: [1500, 2800, 1200, 2500],
        backgroundColor: 'green',
      },
    ],
  };

  const [lineData, setLineData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Active Users',
        data: [100, 150, 120, 180, 200, 220],
        borderColor: 'green',
        backgroundColor: 'green',
      },
    ],
  });


  useEffect(() => {
    const interval = setInterval(() => {
      setLineData(prevData => {

        const newData = prevData.datasets[0].data.map(val => {

          const delta = Math.floor(Math.random() * 21) - 10;
          let updated = val + delta;

          if (updated < 50) updated = 50;
          return updated;
        });
        return {
          ...prevData,
          datasets: [{
            ...prevData.datasets[0],
            data: newData
          }]
        };
      });
    }, 3000); 

    return () => clearInterval(interval);
  }, []);

 
  const tasks = [
    { name: "Plant Trees", activeUsers: 12 },
    { name: "Recycle", activeUsers: 8 },
    { name: "Beach cleaning", activeUsers: 5 },
  ];


  const [todoItems, setTodoItems] = useState([
    { id: 1, text: 'Review new volunteer applications', completed: false },
    { id: 2, text: 'Send newsletter update', completed: false },
    { id: 3, text: 'Go through new volunteer sign-ups and verify eligibility', completed: false },
    { id: 4, text: 'Refresh the calendar with upcoming events and activities.', completed: false },
    { id: 5, text: 'Contact volunteers or donors with follow-up information after events.', completed: false },
    { id: 6, text: 'Plan a meeting to discuss new initiatives and gather feedback.', completed: false },
    { id: 7, text: 'Write and distribute news about upcoming events or achievements.', completed: false },
    { id: 8, text: 'Refresh the website with new photos, testimonials, or blog posts.', completed: false },
    { id: 9, text: 'Verify and approve profiles for new donors or sponsors.', completed: false },
    { id: 10, text: 'Track mentions, comments, and interactions on social platforms.', completed: false },
    { id: 11, text: 'Design flyers, social media graphics, or email newsletters.', completed: false },
    { id: 12, text: 'Reach out to local organizations to form new partnerships.', completed: false },
    { id: 13, text: 'Organize sessions to prepare volunteers for upcoming tasks.', completed: false },
    { id: 14, text: 'Review surveys or comments from recent events to improve future activities.', completed: false },
    { id: 15, text: 'Ensure that volunteer information is current and accurate in the system.', completed: false },
    { id: 16, text: 'Organize a workshop to educate volunteers and the community on eco-friendly practices.', completed: false },
  ]);
  const [newTodoText, setNewTodoText] = useState('');

  const handleAddTodo = () => {
    if (!newTodoText.trim()) return;
    const newItem = {
      id: Date.now(),
      text: newTodoText,
      completed: false,
    };
    setTodoItems(prev => [...prev, newItem]);
    setNewTodoText('');
  };

  const toggleTodoCompleted = (id) => {
    setTodoItems(prev =>
      prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item)
    );
  };


  const [tasksCompleted, setTasksCompleted] = useState(5);
  const tasksGoal = 20;
  const progressPercentage = Math.min(
    Math.round((tasksCompleted / tasksGoal) * 100),
    100
  );

  const incrementTaskCompletion = () => {
    setTasksCompleted(prev => (prev < tasksGoal ? prev + 1 : prev));
  };

  return (
    <div style={{ backgroundColor: "white", minHeight: "100vh", padding: "2rem" }}>
      <h1 style={{ color: "green" }}>Admin Dashboard</h1>
      
      
      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
       
        <div style={{ flex: 1 }}>
          <h2 style={{ color: "green" }}>Donations Overview</h2>
          <p>Total Donations This Month: <strong>$8000</strong></p>
          <div style={{ backgroundColor: "#f0fff0", padding: "1rem", borderRadius: "8px" }}>
            <Bar data={barData} />
          </div>
        </div>

        
        <div style={{ flex: 1 }}>
          <h2 className="mt-6" style={{ color: "green" }}>Volunteer Tasks</h2>
          <ul style={{ backgroundColor: "#f0fff0", padding: "1rem", borderRadius: "8px" }}>
            {volunteers.map(vol => (
              <li key={vol.id} style={{ marginBottom: "1rem", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <div style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                  <strong>Volunteer:</strong> {vol.username}
                  <select className="nes-select" style={{ width: "120px" }} defaultValue="Plant Trees">
                    <option value="Plant Trees">Plant Trees</option>
                    <option value="Recycle">Recycle</option>
                    <option value="Task 3">Beach cleaning</option>
                  </select>
                </div>
                <div style={{ marginTop: "0.5rem" }}>
                  <strong>Activity ID:</strong> {vol.activity_id}
                </div>
              </li>
            ))}
          </ul>
 
          <div style={{ backgroundColor: "#f0fff0", padding: "1rem", borderRadius: "8px", marginTop: "2rem" }}>
            <h3 style={{ color: "green" }}>Task Summary</h3>
            <ul>
              {tasks.map(task => (
                <li key={task.name}>
                  {task.name}: {task.activeUsers} active users
                </li>
              ))}
            </ul>
            <p style={{ marginTop: "1rem" }}>
              <strong>All Active Users: 183</strong>
            </p>
          </div>
        </div>
      </div>


      <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", alignItems: "flex-start" }}>
      
        <div style={{ flex: 1, backgroundColor: "#f0fff0", padding: "1rem", borderRadius: "8px" }}>
          <h2 style={{ color: "green" }}>User Engagement</h2>
          <Line data={lineData} />
        </div>

       
        <div style={{ flex: 0.5, backgroundColor: "#f0fff0", padding: "1rem", borderRadius: "8px" }}>
          <h2 style={{ color: "green" }}>To-Do List</h2>
          <div style={{ marginBottom: "1rem" }}>
            <input
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="Add a new task..."
              style={{ marginRight: "0.5rem" }}
            />
            <button className="nes-btn is-primary" onClick={handleAddTodo}>Add</button>
          </div>
          <ul>
            {todoItems.map(item => (
              <li key={item.id} style={{ marginBottom: "0.5rem" }}>
                <label style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleTodoCompleted(item.id)}
                    style={{ marginRight: "0.5rem" }}
                  />
                  <span style={{ textDecoration: item.completed ? "line-through" : "none" }}>
                    {item.text}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>


        <div style={{ flex: 0.5, backgroundColor: "#f0fff0", padding: "1rem", borderRadius: "8px" }}>
          <h2 style={{ color: "green" }}>Progress Tracker</h2>
          <p>Monthly Task Completion Goal: 20 tasks</p>
          <p>Tasks Completed: {tasksCompleted}</p>
          <div style={{ height: "20px", backgroundColor: "#ccc", borderRadius: "10px", overflow: "hidden", marginBottom: "1rem", width: "100%" }}>
            <div style={{ height: "100%", width: `${progressPercentage}%`, backgroundColor: "green", transition: "width 0.3s ease" }}></div>
          </div>
          <button className="nes-btn is-success" onClick={incrementTaskCompletion}>Mark Task Done</button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
