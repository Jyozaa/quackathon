// server.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize/connect to SQLite database
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Connected to SQLite database');
    // Create 'users' table if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
      )
    `);

    // Create 'profiles' table if it doesn't exist.
    // Each profile is associated with a user via user_id.
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

    db.run(`
        CREATE TABLE IF NOT EXISTS donations (
          id INTEGER PRIMARY KEY,
          total_amount INTEGER
        )
      `, (err) => {
        if (err) console.error('Error creating donations table:', err);
        else {
          // Insert a default row if none exists
          db.get('SELECT * FROM donations WHERE id = 1', (err, row) => {
            if (!row) {
              db.run(`INSERT INTO donations (id, total_amount) VALUES (1, 0)`);
              console.log('Inserted default row in donations table with total_amount=0');
            }
          });
        }
      });

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

    // (server.js) - After db.run(...) for tables
    const adminUsername = 'admin';
    const adminPassword = 'admin123'; // or something more secure

    db.get('SELECT username FROM users WHERE username = ?', [adminUsername], (err, row) => {
    if (err) {
        console.error('Error checking for admin user:', err);
    } else if (!row) {
        // If admin doesn't exist, insert them
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

  // Basic validations
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  // Check if username already exists
  db.get('SELECT username FROM users WHERE username = ?', [username], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error.' });
    }
    if (row) {
      // Username is taken
      return res.status(400).json({ error: 'Username already exists.' });
    }

    // Hash password before storing
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Insert new user
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error inserting user.' });
      }
      // Optionally, you can create an empty profile row for the user here.
      const userId = this.lastID;
      db.run('INSERT INTO profiles (user_id, personal_info, email, phone, interests) VALUES (?, ?, ?, ?, ?)',
        [userId, '', '', '', ''], (err) => {
          if (err) {
            console.error(err);
            // Even if profile creation fails, we might still return success for registration.
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

  // Basic validations
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required.' });
  }

  // Find user by username
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error.' });
    }
    if (!row) {
      // User not found
      return res.status(400).json({ error: 'Invalid username or password.' });
    }

    // Compare password hash
    const isMatch = bcrypt.compareSync(password, row.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid username or password.' });
    }

    // For production, you'd typically generate a token or session here.
    // We'll just send a success message along with the user's id and username.
    return res.json({ message: 'Login successful.', userId: row.id, username: row.username });
  });
});

// =============================
// GET USER PROFILE
// =============================
// GET /profile/:username will return profile info for the given username.
app.get('/profile/:username', (req, res) => {
  const { username } = req.params;

  // First, get the user id from the users table.
  db.get('SELECT id FROM users WHERE username = ?', [username], (err, userRow) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error.' });
    }
    if (!userRow) {
      return res.status(404).json({ error: 'User not found.' });
    }
    const userId = userRow.id;
    // Now, get the profile for this user.
    db.get('SELECT personal_info, email, phone, interests FROM profiles WHERE user_id = ?', [userId], (err, profileRow) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error.' });
      }
      // If no profile row exists, return empty fields.
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
// PUT /profile/:username to update profile information.
app.put('/profile/:username', (req, res) => {
  const { username } = req.params;
  const { personalInfo, email, phone, interests } = req.body;

  // First, get the user id.
  db.get('SELECT id FROM users WHERE username = ?', [username], (err, userRow) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error.' });
    }
    if (!userRow) {
      return res.status(404).json({ error: 'User not found.' });
    }
    const userId = userRow.id;
    // Check if a profile already exists
    db.get('SELECT id FROM profiles WHERE user_id = ?', [userId], (err, profileRow) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error.' });
      }
      if (profileRow) {
        // Profile exists, update it.
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
        // No profile exists; insert new row.
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



// =====================
//  GET Donation Total
// =====================
app.get('/donation', (req, res) => {
    db.get('SELECT total_amount FROM donations WHERE id = 1', (err, row) => {
      if (err) {
        console.error('Error retrieving donation total:', err);
        return res.status(500).json({ error: 'Database error.' });
      }
      if (!row) {
        // If somehow there's no row, initialize it
        return res.json({ total_amount: 0 });
      }
      return res.json({ total_amount: row.total_amount });
    });
});
  
// =====================
// POST Increment Donation
// =====================
app.post('/donation', (req, res) => {
    const { amount } = req.body;
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: 'Invalid donation amount.' });
    }
  
    // Retrieve current total, then increment
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


//POST /volunteers: add a volunteer signup
app.post('/volunteers', (req, res) => {
  const { username, activityId } = req.body;
  if (!username || !activityId) {
    return res.status(400).json({ error: 'username and activityId are required.' });
  }
  // Check if the volunteer already signed up for this activity
  db.get(
    'SELECT * FROM volunteers WHERE username = ? AND activity_id = ?',
    [username, activityId],
    (err, row) => {
      if (err) {
        console.error('Error checking volunteer record:', err);
        return res.status(500).json({ error: 'Database error.' });
      }
      if (row) {
        // Already signed up
        return res.status(400).json({ error: 'You have already joined as volunteer for this activity.' });
      }
      // Insert volunteer record
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

// GET /volunteers: retrieve all volunteer signups
app.get('/volunteers', (req, res) => {
  db.all('SELECT * FROM volunteers', (err, rows) => {
    if (err) {
      console.error('Error fetching volunteers:', err);
      return res.status(500).json({ error: 'Database error.' });
    }
    return res.json({ volunteers: rows });
  });
});


// Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
