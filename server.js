const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

let usuarios = []; // después lo cambiás por tu base de datos real

const SECRET = "secreto123";

// REGISTRO
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  usuarios.push({ email, password: hash });

  res.json({ message: "Usuario creado" });
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = usuarios.find(u => u.email === email);

  if (!user) return res.status(400).json({ error: "Usuario no existe" });

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) return res.status(400).json({ error: "Contraseña incorrecta" });

  const token = jwt.sign({ email }, SECRET, { expiresIn: "1h" });

  res.json({ token });
});

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));