// backend/server.js
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import pool from "./db.js";

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Backend werkt!" });
});

// 🔐 Registreren
app.post("/register", async (req, res) => {
  const { name, age, email, password } = req.body;

  try {
    if (!name || !age || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Naam, leeftijd, email en wachtwoord zijn verplicht.",
      });
    }

    const ageNumber = parseInt(age, 10);
    if (Number.isNaN(ageNumber) || ageNumber < 18 || ageNumber > 120) {
      return res.status(400).json({
        success: false,
        message: "Voer een geldige leeftijd in (18+).",
      });
    }

    if (password.length < 16) {
      return res.status(400).json({
        success: false,
        message: "Wachtwoord moet minimaal 16 tekens zijn.",
      });
    }

    // Bestaat email al?
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Dit emailadres is al in gebruik.",
      });
    }

    // Wachtwoord hashen
    const hashedPassword = await bcrypt.hash(password, 10);

    // Nieuwe user invoegen
    const [userResult] = await pool.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hashedPassword]
    );

    const newUserId = userResult.insertId;

    // Leeftijd omzetten naar een birthdate (bijv. 1 januari van dat jaar)
    const now = new Date();
    const birthYear = now.getFullYear() - ageNumber;
    const birthdate = `${birthYear}-01-01`; // simpel placeholder

    // Profiel aanmaken
    await pool.query(
      "INSERT INTO profiles (user_id, name, birthdate) VALUES (?, ?, ?)",
      [newUserId, name, birthdate]
    );

    return res.status(201).json({
      success: true,
      message: "Account succesvol aangemaakt.",
      user: {
        id: newUserId,
        name,
        age: ageNumber,
        email,
      },
    });
  } catch (err) {
    console.error("Fout bij register:", err);
    return res.status(500).json({
      success: false,
      message: "Serverfout bij registreren.",
    });
  }
});

// 🔐 Inloggen
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email en wachtwoord zijn verplicht.",
      });
    }

    const [rows] = await pool.query(
      "SELECT id, email, password FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Onjuiste email of wachtwoord.",
      });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Onjuiste email of wachtwoord.",
      });
    }

    return res.json({
      success: true,
      message: "Inloggen gelukt.",
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Fout bij login:", err);
    return res.status(500).json({
      success: false,
      message: "Serverfout bij inloggen.",
    });
  }
});

app.listen(3000, () => {
  console.log("Server draait op http://localhost:3000");
});
