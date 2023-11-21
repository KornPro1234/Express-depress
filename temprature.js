 // Insert 25 users into the users table
 for (let i = 1; i <= 25; i++) {
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

// Middleware for parsing JSON data
app.use(express.json());

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






app.post('/users', async (req, res) => {
await User.create(req.body);
res.send("success");
})

app.get("/homepage", async (req, res) => {
res.sendFile(path.join(__dirname, "Frontend Development", "homepage.html"));
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
