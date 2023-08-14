const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Open SQLite database connection
const db = new sqlite3.Database('mydatabase.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the database.');
  }
});

app.use(express.static('views'));
app.use(express.urlencoded({ extended: true }));

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/home.html');
  }
  next();
}

app.get('/', checkNotAuthenticated, (req, res) => {
  res.sendFile(__dirname + '/views/login.html');
});

app.post('/login', checkNotAuthenticated, (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Simulate database query for authentication
  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
    if (err) {
      console.error(err.message);
      return res.sendStatus(500);
    }

    if (row) {
      res.redirect('/home.html'); // Redirect to home.html upon successful login
    } else {
      res.redirect('/page.html'); // Redirect to page.html upon invalid credentials
    }
  });
});

// Redirect /home.html to /index.html
app.get('/home.html', (req, res) => {
  res.redirect('/index.html');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
