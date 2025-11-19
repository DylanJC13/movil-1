require("dotenv").config();
const { Pool } = require("pg");

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
    console.error("Variables DB_* incompletas. Revisa .env.example");
    process.exit(1);
  }

  return `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}?sslmode=${DB_SSL === "true" ? "require" : "disable"}`;
};

const pool = new Pool({
  connectionString: buildConnectionString(),
  ssl: { rejectUnauthorized: false }
});

const seedProducts = [
  {
    name: "Auriculares Inalámbricos",
    category: "Audio",
    price: 59.99,
    stock: 32,
    description: "Bluetooth 5.3 con cancelación de ruido y 24h de batería."
  },
  {
    name: "Teclado Mecánico",
    category: "Periféricos",
    price: 89.0,
    stock: 12,
    description: "Switches táctiles, retroiluminación RGB y layout compacto."
  },
  {
    name: "Monitor 27'' QHD",
    category: "Monitores",
    price: 299.99,
    stock: 8,
    description: "IPS 165Hz, compatible con G-Sync/FreeSync y ajuste en altura."
  },
  {
    name: "Disco SSD 1TB",
    category: "Almacenamiento",
    price: 119.5,
    stock: 54,
    description: "NVMe Gen4 con velocidades de lectura de hasta 7,000 MB/s."
  },
  {
    name: "Cámara Compacta",
    category: "Foto/Video",
    price: 499.0,
    stock: 5,
    description: "Sensor 1'', grabación 4K y conectividad Wi-Fi integrada."
  }
];

async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price NUMERIC(12,2) NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      description TEXT
    );
  `);
}

async function seedIfEmpty() {
  const { rows } = await pool.query("SELECT COUNT(*) AS total FROM products");
  const count = Number(rows[0].total || rows[0].count || 0);
  if (count > 0) {
    console.log(`Productos existentes: ${count}. No se insertó seed.`);
    return;
  }

  const insertQuery = `
    INSERT INTO products (name, category, price, stock, description)
    VALUES ($1, $2, $3, $4, $5)
  `;

  for (const p of seedProducts) {
    await pool.query(insertQuery, [p.name, p.category, p.price, p.stock, p.description]);
  }
  console.log(`Seed insertado: ${seedProducts.length} productos.`);
}

async function main() {
  try {
    await ensureSchema();
    await seedIfEmpty();
  } catch (err) {
    console.error("Error inicializando la base:", err);
  } finally {
    await pool.end();
  }
}

main();
