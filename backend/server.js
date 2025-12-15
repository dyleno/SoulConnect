// backend/server.js
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import pool from "./db.js";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// -------------------- GLOBAL LOGGER --------------------
app.use((req, res, next) => {
  console.log(`➡️ Incoming request: ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  next();
});

// -------------------- CORS --------------------
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

// handle preflight
app.options("*", cors());

app.use(express.json({ limit: "10mb" })); // for JSON payloads

// -------------------- STRIPE SETUP --------------------
if (!process.env.STRIPE_SECRET_KEY) {
  console.error(
    "⚠️ Stripe secret key missing! Please check your .env file."
  );
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// -------------------- TEST ROUTE --------------------
app.get("/", (req, res) => {
  res.json({ message: "Backend werkt!" });
});

// -------------------- REGISTER --------------------
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const [userResult] = await pool.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hashedPassword]
    );

    const newUserId = userResult.insertId;
    const birthYear = new Date().getFullYear() - ageNumber;
    const birthdate = `${birthYear}-01-01`;

    await pool.query(
      "INSERT INTO profiles (user_id, name, birthdate, is_premium) VALUES (?, ?, ?, 0)",
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

// -------------------- LOGIN --------------------
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

// -------------------- STRIPE CHECKOUT --------------------
app.post("/api/create-checkout-session", async (req, res) => {
  console.log("🔥 Received checkout session request:", req.body);

  try {
    console.log(
      "Stripe key loaded:",
      process.env.STRIPE_SECRET_KEY?.startsWith("sk_")
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: "SoulConnect Premium" },
            unit_amount: 799, // €7,99
          },
          quantity: 1,
        },
      ],
      // ⚠ Make sure these match your frontend dev server
      success_url: "http://localhost:5174/premium-success",
      cancel_url: "http://localhost:5174/premium-cancel",
    });

    console.log("Stripe session created:", session.id);
    res.json({ url: session.url });
  } catch (err) {
    console.error("▶ FULL Stripe error object:", err);
    if (err.raw) console.error("▶ Stripe raw error:", err.raw);

    res.status(500).json({
      error: "Stripe session failed",
      message: err.message,
    });
  }
});

// -------------------- START SERVER --------------------
app.listen(PORT, () => {
  console.log(`Server draait op http://localhost:${PORT}`);
});
