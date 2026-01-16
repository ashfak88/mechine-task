const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");


app.use(express.json());

var users = [
  { id: 1, name: "ashfak", email: "ashfak@gmal.com" },
  { id: 2, name: "faheem", email: "faheem@gmal.com" },
  { id: 3, name: "ashitha", email: "ashitha@gmal.com" },
];

app.get("/users", (req, res) => {
  res.send(users);
});

app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((u) => u.id == id);
  if (!user) {
    res.status(404).send();
  }
  res.send(user);
});

app.post("/users", (req, res) => {
  const { name, email } = req.body;
  const user = { id: users.length + 1, name, email };
  users.push(user);
  return res.send();
});

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((user) => user.id == id);
  if (!user) {
    res.status(404).send();
  } else {
     users = users.filter((user) => user.id != id);
    res.status(200).send(user);
  }
});

app.post("/login", (req, res) => {
  const { email, name } = req.body;
  const user = users.find((user) => user.email == email && user.name == name);
  if (!user) {
    return res.status(401).json({ message: "invalid name and password" });
  }

  const token = jwt.sign({ id: user.id }, "topsecret");
  return res.json({ message: "login success", token });
});

app.post("/register", (req, res) => {
  const { name, email } = req.body;
  const user = { id: users.length + 1, name, email };
  users.push(user);
  res.status(201).send()
});

app.listen(3000, () => {
  console.log("server running on port http://localhost:3000");
});
