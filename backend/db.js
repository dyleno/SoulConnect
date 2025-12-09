// backend/db.js
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",        // pas aan als nodig
  password: "",        // pas aan als nodig
  database: "soulconnect",
});

export default pool;