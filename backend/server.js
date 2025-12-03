import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import pool from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// uploads map statisch maken zodat de browser de images kan zien
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

console.log("SERVER STARTED:", new Date().toLocaleTimeString());

/* ============================================================
   MULTER CONFIG VOOR FOTO-UPLOADS
============================================================ */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, "profile-" + Date.now() + ext);
  },
});

const upload = multer({ storage });

/* ============================================================
   LOGIN
============================================================ */
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await pool.query(
    `SELECT 
        u.id AS user_id,
        u.email,
        u.password,
        p.id AS profile_id,
        p.name,
        p.birthdate,
        p.bio,
        p.gender,
        p.interests,
        p.location,
        p.last_online
     FROM users u
     LEFT JOIN profiles p ON p.user_id = u.id
     WHERE u.email = ?
     LIMIT 1`,
    [email.trim().toLowerCase()]
  );

  if (rows.length === 0)
    return res
      .status(401)
      .json({ success: false, message: "Account niet gevonden" });

  const dbUser = rows[0];

  const ok = await bcrypt.compare(password, dbUser.password);
  if (!ok)
    return res
      .status(401)
      .json({ success: false, message: "Wachtwoord onjuist" });

  // leeftijd
  let age = null;
  if (dbUser.birthdate) {
    const b = new Date(dbUser.birthdate);
    const n = new Date();
    age = n.getFullYear() - b.getFullYear();
    if (n < new Date(n.getFullYear(), b.getMonth(), b.getDate())) age--;
  }

  res.json({
    success: true,
    user: {
      id: dbUser.user_id,
      email: dbUser.email,
      profile_id: dbUser.profile_id,
      name: dbUser.name,
      age,
      bio: dbUser.bio,
      gender: dbUser.gender,
      interests: dbUser.interests?.split(",") || [],
      location: dbUser.location,
      last_online: dbUser.last_online,
      birthdate: dbUser.birthdate,
    },
  });
});

/* ============================================================
   REGISTER
============================================================ */
app.post("/register", async (req, res) => {
  const { name, age, email, password, bio, gender, location, interests } =
    req.body;

  const birthYear = new Date().getFullYear() - age;
  const birthdate = `${birthYear}-01-01`;

  const hashed = await bcrypt.hash(password, 10);

  const [userRes] = await pool.query(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email.trim().toLowerCase(), hashed]
  );

  const userId = userRes.insertId;

  const [profileRes] = await pool.query(
    `INSERT INTO profiles 
      (user_id, name, birthdate, bio, gender, interests, location, last_online)
     VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
    [userId, name, birthdate, bio, gender, interests, location]
  );

  res.json({
    success: true,
    message: "Account succesvol aangemaakt.",
    user: {
      id: userId,
      email,
      profile_id: profileRes.insertId,
      name,
      age,
      bio,
      gender,
      interests: interests.split(","),
      location,
      birthdate,
    },
  });
});

/* ============================================================
   RANDOM PROFILES VOOR SWIPEN
============================================================ */
app.get("/api/profiles/random", async (req, res) => {
  const { profile_id } = req.query;

  const [rows] = await pool.query(
    `SELECT id, name, birthdate, bio, gender, interests, location, last_online
     FROM profiles
     WHERE id != ?
     ORDER BY RAND()
     LIMIT 30`,
    [profile_id]
  );

  const formatted = rows.map((p) => {
    const b = new Date(p.birthdate);
    const n = new Date();
    let age = n.getFullYear() - b.getFullYear();
    if (n < new Date(n.getFullYear(), b.getMonth(), b.getDate())) age--;

    return {
      ...p,
      age,
      interests: p.interests ? p.interests.split(",") : [],
    };
  });

  res.json(formatted);
});

/* ============================================================
   PROFIEL OPHALEN / UPDATEN
============================================================ */

// Profiel details ophalen
app.get("/api/profiles/:id", async (req, res) => {
  const { id } = req.params;

  const [rows] = await pool.query(
    `SELECT id, user_id, name, birthdate, bio, gender, interests, location, last_online
     FROM profiles
     WHERE id = ?
     LIMIT 1`,
    [id]
  );

  if (!rows.length) {
    return res.status(404).json({ message: "Profiel niet gevonden" });
  }

  const p = rows[0];

  let age = null;
  if (p.birthdate) {
    const b = new Date(p.birthdate);
    const n = new Date();
    age = n.getFullYear() - b.getFullYear();
    if (n < new Date(n.getFullYear(), b.getMonth(), b.getDate())) age--;
  }

  res.json({
    ...p,
    age,
    interests: p.interests ? p.interests.split(",") : [],
  });
});

// Profiel updaten vanuit instellingen.vue
app.put("/api/profiles/:id", async (req, res) => {
  const { id } = req.params;
  const { name, bio, gender, location, interests } = req.body;

  await pool.query(
    `UPDATE profiles
     SET name = ?, bio = ?, gender = ?, location = ?, interests = ?
     WHERE id = ?`,
    [name, bio, gender, location, interests, id]
  );

  const [rows] = await pool.query(
    `SELECT id, user_id, name, birthdate, bio, gender, interests, location, last_online
     FROM profiles
     WHERE id = ?
     LIMIT 1`,
    [id]
  );

  const p = rows[0];

  let age = null;
  if (p.birthdate) {
    const b = new Date(p.birthdate);
    const n = new Date();
    age = n.getFullYear() - b.getFullYear();
    if (n < new Date(n.getFullYear(), b.getMonth(), b.getDate())) age--;
  }

  res.json({
    ...p,
    age,
    interests: p.interests ? p.interests.split(",") : [],
  });
});

/* ============================================================
   PROFIElFOTO's
============================================================ */

// Laatste foto voor een profiel
app.get("/api/photos/:profileId", async (req, res) => {
  const { profileId } = req.params;

  const [rows] = await pool.query(
    `SELECT id, profile_id, image_url, uploaded_at
     FROM photos
     WHERE profile_id = ?
     ORDER BY uploaded_at DESC
     LIMIT 1`,
    [profileId]
  );

  if (!rows.length) return res.json(null);

  res.json(rows[0]);
});

// Nieuwe foto uploaden
app.post(
  "/api/photos/upload",
  upload.single("image"),
  async (req, res) => {
    const { profile_id } = req.body;

    if (!req.file || !profile_id) {
      return res
        .status(400)
        .json({ message: "image en profile_id zijn verplicht" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const [result] = await pool.query(
      `INSERT INTO photos (profile_id, image_url)
       VALUES (?, ?)`,
      [profile_id, imageUrl]
    );

    res.json({
      id: result.insertId,
      profile_id,
      image_url: imageUrl,
    });
  }
);

/* ============================================================
   MATCH AANMAKEN
============================================================ */
app.post("/api/matches", async (req, res) => {
  const { profile_id_1, profile_id_2 } = req.body;

  const [exists] = await pool.query(
    `SELECT id FROM matches 
     WHERE (profile_id_1 = ? AND profile_id_2 = ?)
        OR (profile_id_1 = ? AND profile_id_2 = ?)`,
    [profile_id_1, profile_id_2, profile_id_2, profile_id_1]
  );

  if (exists.length > 0)
    return res.json({ success: true, match_id: exists[0].id });

  const [result] = await pool.query(
    "INSERT INTO matches (profile_id_1, profile_id_2) VALUES (?, ?)",
    [profile_id_1, profile_id_2]
  );

  res.json({ success: true, match_id: result.insertId });
});

/* ============================================================
   MATCHES + PROFIELEN + CHAT MESSAGES
============================================================ */
app.get("/api/matches", async (req, res) => {
  const { profile_id } = req.query;

  const [matches] = await pool.query(
    `SELECT 
        m.id AS match_id,
        p.id AS other_id,
        p.name,
        p.birthdate,
        p.gender,
        p.location,
        p.last_online,
        p.interests,
        p.bio
     FROM matches m
     JOIN profiles p 
        ON (p.id = m.profile_id_1 AND m.profile_id_2 = ?)
        OR (p.id = m.profile_id_2 AND m.profile_id_1 = ?)
     ORDER BY m.created_at DESC`,
    [profile_id, profile_id]
  );

  for (let m of matches) {
    const [msgs] = await pool.query(
      `SELECT id, sender_id, content, created_at
       FROM messages
       WHERE match_id = ?
       ORDER BY created_at ASC`,
      [m.match_id]
    );
    m.messages = msgs;
  }

  const result = matches.map((m) => {
    const b = new Date(m.birthdate);
    const n = new Date();
    let age = n.getFullYear() - b.getFullYear();
    if (n < new Date(n.getFullYear(), b.getMonth(), b.getDate())) age--;

    return {
      id: m.match_id,
      profile: {
        id: m.other_id,
        name: m.name,
        age,
        gender: m.gender,
        location: m.location,
        last_online: m.last_online,
        interests: m.interests ? m.interests.split(",") : [],
        bio: m.bio,
      },
      messages: m.messages,
    };
  });

  res.json(result);
});

/* ============================================================
   BERICHT STUREN
============================================================ */
app.post("/api/messages", async (req, res) => {
  const { match_id, sender_id, content } = req.body;

  const [result] = await pool.query(
    `INSERT INTO messages (match_id, sender_id, content)
     VALUES (?, ?, ?)`,
    [match_id, sender_id, content]
  );

  const [msg] = await pool.query(
    `SELECT id, match_id, sender_id, content, created_at
     FROM messages
     WHERE id = ?`,
    [result.insertId]
  );

  res.json(msg[0]);
});

/* ============================================================
   MATCH + CHAT VERWIJDEREN
============================================================ */
app.delete("/api/matches/:id", async (req, res) => {
  const { id } = req.params;

  await pool.query(`DELETE FROM matches WHERE id = ?`, [id]);
  await pool.query(`DELETE FROM messages WHERE match_id = ?`, [id]);

  res.json({ success: true });
});

/* ============================================================
   SERVER START
============================================================ */
app.listen(3000, () =>
  console.log("SERVER RUNNING → http://localhost:3000")
);
