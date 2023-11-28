const express = require("express");
const sqlite3 = require('sqlite3').verbose();
const path = require("path");

const app = express();

// Connect to SQLite database
const db = new sqlite3.Database(":memory:", (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the SQLite database.');

    // Create the users table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      email TEXT,
      password TEXT
    )`, (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Users table created successfully.');

        // Insert 100 users into the users table
        for (let i = 1; i <= 100; i++) {
          const username = `user${i}`;
          const email = `user${i}@mail.com`;
          const password = 'P4ssword';

          db.run(
            `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
            [username, email, password],
            (err) => {
              if (err) {
                console.error(err.message);
              } else {
                console.log(`User ${username} inserted into the database.`);
              }
            }
          );
        }
      }
    });

    // Create the products table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      description TEXT,
      price REAL
    )`, (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Products table created successfully.');

        // Insert 10 mock products into the products table
        for (let i = 1; i <= 10; i++) {
          const name = `Product ${i}`;
          const description = `Description for product ${i}`;
          const price = Math.floor(Math.random() * 100) + 1; // Mock price

          db.run(
            `INSERT INTO products (name, description, price) VALUES (?, ?, ?)`,
            [name, description, price],
            function (err) {
              if (err) {
                console.error(err.message);
              } else {
                console.log(`Ting ${this.lastID} inserted into the database.`);
              }
            }
          );
        }
      }
    });
  }
});

// Middleware for parsing JSON data
app.use(express.json());
app.use(express.static(path.join(__dirname, "lastclass")));

// Route to retrieve all users from the SQLite database
app.get('/api/users', (req, res) => {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});



// Route to retrieve all users from the SQLite database
app.get('/api/tings', (req, res) => {
  db.all('SELECT * FROM products', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});



app.post('/users', async (req, res) => {
  await User.create(req.body);
  res.send("success");
})

app.get("/homepage", async (req, res) => {
  res.sendFile(path.join(__dirname, "Frontend Development", "not homepage.html"));
})

app.get('/users', async (req, res) => {
  const pageAsNumber = Number.parseInt(req.query.page);
  const sizeAsNumber = Number.parseInt(req.query.size);

  let page = 0;
  if(!Number.isNaN(pageAsNumber) && pageAsNumber > 0){
    page = pageAsNumber;
  }

  let size = 10;
  if(!Number.isNaN(sizeAsNumber) && !(sizeAsNumber > 10) && !(sizeAsNumber < 1)){
    size = sizeAsNumber;
  }

  const usersWithCount = await User.findAndCountAll({
    limit: size,
    offset: page * size
  });
  res.send({
    content: usersWithCount.rows,
    totalPages: Math.ceil(usersWithCount.count / Number.parseInt(size))
  });
})

app.get('/users/:id', async (req, res) => {
  const id = req.params.id;
  const user = await User.findOne({where: {id: id}});
  res.send(user);
})

app.put('/users/:id', async (req, res) => {
  const id = req.params.id;
  const user = await User.findOne({where: {id: id}});
  user.username = req.body.username;
  await user.save();
  res.send('updated');
})

app.delete('/users/:id', async (req, res) => {
  const id = req.params.id;
  await User.destroy({where: {id: id}});
  res.send('removed');
})

// Start the server to listen on a specific port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});