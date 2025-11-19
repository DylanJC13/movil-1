require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 4000;
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL no está definido. Crea un .env (ver .env.example).");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

app.use(cors());
app.use(express.json());

const normalizeProduct = (row) => ({
  ...row,
  price: row.price !== null ? Number(row.price) : null,
  stock: row.stock !== null ? Number(row.stock) : 0
});

app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok" });
  } catch (err) {
    res.status(500).json({ status: "down", error: err.message });
  }
});

app.get("/products", async (_req, res) => {
  try {
    const { rows } = await pool.query("SELECT id, name, category, price, stock, description FROM products ORDER BY id DESC");
    res.json(rows.map(normalizeProduct));
  } catch (err) {
    res.status(500).json({ error: "No se pudieron obtener productos", detail: err.message });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, name, category, price, stock, description FROM products WHERE id = $1 LIMIT 1",
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(normalizeProduct(rows[0]));
  } catch (err) {
    res.status(500).json({ error: "No se pudo obtener el producto", detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});
