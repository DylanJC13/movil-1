require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 4000;

const buildConnectionString = () => {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  const {
    DB_HOST,
    DB_PORT,
    DB_DATABASE,
    DB_USER,
    DB_PASSWORD,
    DB_SSL = "true"
  } = process.env;

  if (!DB_HOST || !DB_PORT || !DB_DATABASE || !DB_USER || !DB_PASSWORD) {
    console.error("Variables DB_* incompletas. Revisa .env.example.");
    process.exit(1);
  }

  const sslMode = DB_SSL === "true" ? "no-verify" : "disable";
  return `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}?sslmode=${sslMode}`;
};

const pool = new Pool({
  connectionString: buildConnectionString(),
  ssl: { rejectUnauthorized: false }
});

app.use(cors());
app.use(express.json());

const api = express.Router();

const normalizeProduct = (row) => ({
  ...row,
  price: row.price !== null ? Number(row.price) : null,
  stock: row.stock !== null ? Number(row.stock) : 0
});

api.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok" });
  } catch (err) {
    res.status(500).json({ status: "down", error: err.message });
  }
});

api.get("/products", async (_req, res) => {
  try {
    const { rows } = await pool.query("SELECT id, name, category, price, stock, description FROM products ORDER BY id DESC");
    res.json(rows.map(normalizeProduct));
  } catch (err) {
    res.status(500).json({ error: "No se pudieron obtener productos", detail: err.message });
  }
});

api.get("/products/:id", async (req, res) => {
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

api.post("/products", async (req, res) => {
  try {
    const { name, category, price, stock, description } = req.body || {};
    if (!name || !category || price === undefined || stock === undefined) {
      return res.status(400).json({ error: "name, category, price y stock son obligatorios" });
    }

    const parsedPrice = Number(price);
    const parsedStock = Number.isInteger(stock) ? stock : Number(stock);

    if (Number.isNaN(parsedPrice) || Number.isNaN(parsedStock)) {
      return res.status(400).json({ error: "price y stock deben ser numéricos" });
    }

    const { rows } = await pool.query(
      "INSERT INTO products (name, category, price, stock, description) VALUES ($1,$2,$3,$4,$5) RETURNING id, name, category, price, stock, description",
      [name, category, parsedPrice, parsedStock, description || ""]
    );

    res.status(201).json(normalizeProduct(rows[0]));
  } catch (err) {
    res.status(500).json({ error: "No se pudo crear el producto", detail: err.message });
  }
});

app.use("/api", api);

if (process.env.NODE_ENV === "production") {
  const clientDist = path.join(__dirname, "..", "client", "dist");
  app.use(express.static(clientDist));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});
