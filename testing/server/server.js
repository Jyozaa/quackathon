// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Mount the chatbot router
const chatbotRouter = require('./chatbot');
app.use('/api', chatbotRouter);

// Initialize/connect to SQLite database
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Connected to SQLite database');
    // Create 'users' table if it doesn't exist

    // Create messages table if not exists
    db.run(`
        CREATE TABLE IF NOT EXISTS chat_messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          sender TEXT,
          text TEXT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);


    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
      )
    `);

    // Create 'profiles' table if it doesn't exist.
    db.run(`
      CREATE TABLE IF NOT EXISTS profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE,
        personal_info TEXT,
        email TEXT,
        phone TEXT,
        interests TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `);

    // Create donations table
    db.run(`
        CREATE TABLE IF NOT EXISTS donations (
          id INTEGER PRIMARY KEY,
          total_amount INTEGER
        )
      `, (err) => {
        if (err) console.error('Error creating donations table:', err);
        else {
          db.get('SELECT * FROM donations WHERE id = 1', (err, row) => {
            if (!row) {
              db.run(`INSERT INTO donations (id, total_amount) VALUES (1, 0)`);
              console.log('Inserted default row in donations table with total_amount=0');
            }
          });
        }
      });

    // Create volunteers table
    db.run(`
        CREATE TABLE IF NOT EXISTS volunteers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT,
          activity_id INTEGER,
          joined_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error('Error creating volunteers table:', err);
    });

    // Hardcode an admin user if not exists
    const adminUsername = 'admin';
    const adminPassword = 'admin123'; // Change to a secure password in production

    db.get('SELECT username FROM users WHERE username = ?', [adminUsername], (err, row) => {
      if (err) {
        console.error('Error checking for admin user:', err);
      } else if (!row) {
        const hashedAdminPassword = bcrypt.hashSync(adminPassword, 10);
        db.run('INSERT INTO users (username, password) VALUES (?, ?)', [adminUsername, hashedAdminPassword], function (err) {
          if (err) {
            console.error('Error inserting admin user:', err);
          } else {
            console.log('Admin user created with username:', adminUsername);
          }
        });
      }
    });
  }
});

// =====================
//      REGISTER
// =====================
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  db.get('SELECT username FROM users WHERE username = ?', [username], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error.' });
    }
    if (row) {
      return res.status(400).json({ error: 'Username already exists.' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error inserting user.' });
      }
      const userId = this.lastID;
      db.run('INSERT INTO profiles (user_id, personal_info, email, phone, interests) VALUES (?, ?, ?, ?, ?)',
        [userId, '', '', '', ''], (err) => {
          if (err) {
            console.error(err);
          }
          return res.json({ message: 'User registered successfully.' });
        }
      );
    });
  });
});

// =====================
//        LOGIN
// =====================
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required.' });
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error.' });
    }
    if (!row) {
      return res.status(400).json({ error: 'Invalid username or password.' });
    }

    const isMatch = bcrypt.compareSync(password, row.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid username or password.' });
    }

    return res.json({ message: 'Login successful.', userId: row.id, username: row.username });
  });
});

// =============================
// GET USER PROFILE
// =============================
app.get('/profile/:username', (req, res) => {
  const { username } = req.params;

  db.get('SELECT id FROM users WHERE username = ?', [username], (err, userRow) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error.' });
    }
    if (!userRow) {
      return res.status(404).json({ error: 'User not found.' });
    }
    const userId = userRow.id;
    db.get('SELECT personal_info, email, phone, interests FROM profiles WHERE user_id = ?', [userId], (err, profileRow) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error.' });
      }
      if (!profileRow) {
        return res.json({ personalInfo: '', email: '', phone: '', interests: '' });
      }
      return res.json({
        personalInfo: profileRow.personal_info,
        email: profileRow.email,
        phone: profileRow.phone,
        interests: profileRow.interests
      });
    });
  });
});

// =============================
// UPDATE USER PROFILE
// =============================
app.put('/profile/:username', (req, res) => {
  const { username } = req.params;
  const { personalInfo, email, phone, interests } = req.body;

  db.get('SELECT id FROM users WHERE username = ?', [username], (err, userRow) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error.' });
    }
    if (!userRow) {
      return res.status(404).json({ error: 'User not found.' });
    }
    const userId = userRow.id;
    db.get('SELECT id FROM profiles WHERE user_id = ?', [userId], (err, profileRow) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error.' });
      }
      if (profileRow) {
        db.run(
          `UPDATE profiles SET personal_info = ?, email = ?, phone = ?, interests = ? WHERE user_id = ?`,
          [personalInfo, email, phone, interests, userId],
          function (err) {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: 'Failed to update profile.' });
            }
            return res.json({ message: 'Profile updated successfully.' });
          }
        );
      } else {
        db.run(
          `INSERT INTO profiles (user_id, personal_info, email, phone, interests) VALUES (?, ?, ?, ?, ?)`,
          [userId, personalInfo, email, phone, interests],
          function (err) {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: 'Failed to create profile.' });
            }
            return res.json({ message: 'Profile created successfully.' });
          }
        );
      }
    });
  });
});

// =============================
// GET Donation Total
// =============================
app.get('/donation', (req, res) => {
  db.get('SELECT total_amount FROM donations WHERE id = 1', (err, row) => {
    if (err) {
      console.error('Error retrieving donation total:', err);
      return res.status(500).json({ error: 'Database error.' });
    }
    if (!row) {
      return res.json({ total_amount: 0 });
    }
    return res.json({ total_amount: row.total_amount });
  });
});
  
// =============================
// POST Increment Donation
// =============================
app.post('/donation', (req, res) => {
  const { amount } = req.body;
  if (!amount || isNaN(amount)) {
    return res.status(400).json({ error: 'Invalid donation amount.' });
  }
  
  db.get('SELECT total_amount FROM donations WHERE id = 1', (err, row) => {
    if (err) {
      console.error('Error reading donation table:', err);
      return res.status(500).json({ error: 'Database error.' });
    }
  
    const currentTotal = row ? row.total_amount : 0;
    const newTotal = currentTotal + parseInt(amount);
  
    db.run(
      'UPDATE donations SET total_amount = ? WHERE id = 1',
      [newTotal],
      function (err) {
        if (err) {
          console.error('Error updating donation total:', err);
          return res.status(500).json({ error: 'Database error.' });
        }
        return res.json({ total_amount: newTotal });
      }
    );
  });
});

// =============================
// POST /volunteers: add a volunteer signup
// =============================
app.post('/volunteers', (req, res) => {
  const { username, activityId } = req.body;
  if (!username || !activityId) {
    return res.status(400).json({ error: 'username and activityId are required.' });
  }
  
  db.get(
    'SELECT * FROM volunteers WHERE username = ? AND activity_id = ?',
    [username, activityId],
    (err, row) => {
      if (err) {
        console.error('Error checking volunteer record:', err);
        return res.status(500).json({ error: 'Database error.' });
      }
      if (row) {
        return res.status(400).json({ error: 'You have already joined as volunteer for this activity.' });
      }
      db.run(
        'INSERT INTO volunteers (username, activity_id) VALUES (?, ?)',
        [username, activityId],
        function (err) {
          if (err) {
            console.error('Error inserting volunteer record:', err);
            return res.status(500).json({ error: 'Database error.' });
          }
          return res.json({ message: 'Successfully joined as volunteer.' });
        }
      );
    }
  );
});

// =============================
// GET /volunteers: retrieve all volunteer signups
// =============================
app.get('/volunteers', (req, res) => {
  db.all('SELECT * FROM volunteers', (err, rows) => {
    if (err) {
      console.error('Error fetching volunteers:', err);
      return res.status(500).json({ error: 'Database error.' });
    }
    return res.json({ volunteers: rows });
  });
});


app.get('/chatroom', (req, res) => {
    db.all('SELECT sender, text, timestamp FROM chat_messages ORDER BY timestamp ASC', (err, rows) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ messages: rows });
    });
  });
  
  // POST new message
  app.post('/chatroom', (req, res) => {
    const { sender, text } = req.body;
    if (!sender || !text) return res.status(400).json({ error: 'Missing sender or text' });
  
    db.run('INSERT INTO chat_messages (sender, text) VALUES (?, ?)', [sender, text], function (err) {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ success: true, id: this.lastID });
    });
  });

// Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
