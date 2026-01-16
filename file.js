const express = require("express")
const jwt = require("jsonwebtoken")
const connectDB = require("./config-db")
const User = require("./model")
const auth = require("./auth-middleware")

const app = express()
app.use(express.json())

connectDB()

app.get("/users",auth, async (req, res) => {
  const users = await User.find()
  res.json(users)
})

app.get("/users/:id",auth, async (req, res) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user)
})

app.post("/users",auth, async (req, res) => {
  const { name, email } = req.body

  const user = new User({ name, email })
  await user.save()

  res.status(201).json(user)
})

app.delete("/users/:id",auth, async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id)

  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }

  res.json({ message: "User deleted", user })
})

app.post("/login", async (req, res) => {
  const { email } = req.body

  const user = await User.findOne({ email })
  if (!user) {
    return res.status(401).json({ message: "Invalid user" })
  }

  const token = jwt.sign({ id: user._id }, "topsecret")
  res.json({ message: "Login success", token })
})

app.post("/register", async (req, res) => {
  try {
    const { name, email } = req.body

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email required" })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" })
    }

    const user = new User({ name, email })
    await user.save()

    res.status(201).json({
      message: "User registered successfully",
      user,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000")
});
