const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const mysql = require("mysql2");
const db = mysql.createConnection({
  host: "srv816.hstgr.io",
  user: "u915074426_falltech_user",
  password: "=8RGOIrqUOPy",
  database: "u915074426_falltech_db"
});

db.connect(err => {
  if (err) {
    console.error("Error conexión DB:", err);
  } else {
    console.log("Conectado a MySQL");
  }
});
const app = express();
app.use(express.json());
app.use(cors());


const SECRET = "secreto123";

app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO usuarios (email, password) VALUES (?, ?)",
    [email, hash],
    (err, result) => {
      if (err) {
        return res.status(400).json({ error: "Usuario ya existe" });
      }
      res.json({ message: "Usuario creado" });
    }
  );
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM usuarios WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ error: "Error servidor" });

      if (results.length === 0) {
        return res.status(400).json({ error: "Usuario no existe" });
      }

      const user = results[0];

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        return res.status(400).json({ error: "Contraseña incorrecta" });
      }

      const token = jwt.sign({ email }, SECRET, { expiresIn: "1h" });

      res.json({ token });
    }
  );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor corriendo en puerto " + PORT));
