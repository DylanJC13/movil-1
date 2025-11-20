import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../services/api";

export function MasterPage() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | error | ready
  const [error, setError] = useState(null);

  const loadProducts = useCallback(async () => {
    try {
      setStatus("loading");
      setError(null);
      const data = await fetchProducts();
      setProducts(data);
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <main className="page" style={{ alignItems: "flex-start" }}>
      <section style={{ width: "min(100%, 960px)", margin: "0 auto" }}>
        <header style={{ marginBottom: "1.5rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <Link to="/" style={{ color: "#38bdf8", fontSize: 14 }}>
              ← Volver
            </Link>
            <Link to="/catalog/new" className="primary-btn" style={{ padding: "0.6rem 1rem" }}>
              + Nuevo producto
            </Link>
          </div>
          <div>
            <h1 style={{ margin: "0.5rem 0 0", color: "#f8fafc" }}>Catálogo maestro</h1>
            <p style={{ color: "#cbd5f5" }}>
              Lista dinámica conectada a PostgreSQL. Toca un producto para ver su detalle o agrega nuevos registros.
            </p>
          </div>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1rem"
          }}
        >
          {status === "loading" &&
            Array.from({ length: 6 }).map((_, idx) => (
              <article
                key={`skeleton-${idx}`}
                style={{
                  background: "rgba(15, 23, 42, 0.7)",
                  borderRadius: 16,
                  padding: "1.4rem",
                  border: "1px solid rgba(148, 163, 184, 0.2)",
                  animation: "pulse 1.5s ease-in-out infinite",
                  minHeight: 150
                }}
              />
            ))}

          {status === "error" && (
            <div
              style={{
                background: "rgba(185, 28, 28, 0.15)",
                border: "1px solid rgba(248, 113, 113, 0.4)",
                borderRadius: 16,
                padding: "1.2rem",
                gridColumn: "1 / -1"
              }}
            >
              <p style={{ margin: 0, color: "#fecaca" }}>{error}</p>
              <button className="primary-btn" style={{ marginTop: "1rem" }} onClick={loadProducts}>
                Reintentar
              </button>
            </div>
          )}

          {status === "ready" &&
            products.map((product) => (
              <Link
                to={`/catalog/${product.id}`}
                key={product.id}
                state={{ product }}
                style={{
                  textDecoration: "none",
                  background: "rgba(15, 23, 42, 0.8)",
                  borderRadius: 16,
                  padding: "1.4rem",
                  border: "1px solid rgba(148, 163, 184, 0.2)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2 style={{ margin: 0, fontSize: "1.2rem", color: "#f1f5f9" }}>{product.name}</h2>
                  <span style={{ color: "#4ade80", fontWeight: 700 }}>${Number(product.price).toFixed(2)}</span>
                </div>
                <p style={{ margin: 0, color: "#94a3b8", fontSize: 14 }}>{product.category}</p>
                <p style={{ margin: 0, color: "#cbd5f5", fontSize: 14, flexGrow: 1 }}>
                  Stock disponible: {product.stock}
                </p>
                <span style={{ color: "#38bdf8", fontSize: 13 }}>Ver detalle →</span>
              </Link>
            ))}

          {status === "ready" && products.length === 0 && (
            <p style={{ color: "#cbd5f5" }}>No hay productos registrados en la base de datos.</p>
          )}
        </div>
      </section>
    </main>
  );
}
