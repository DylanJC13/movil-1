import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchProduct } from "../services/api";

export function DetailPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(state?.product || null);
  const [status, setStatus] = useState(state?.product ? "ready" : "loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (state?.product) return;
    const loadProduct = async () => {
      try {
        setStatus("loading");
        const data = await fetchProduct(id);
        setProduct(data);
        setStatus("ready");
      } catch (err) {
        setStatus("error");
        setError(err.message);
      }
    };
    loadProduct();
  }, [id, state]);

  return (
    <main className="page">
      <section className="card" style={{ width: "min(640px, 100%)" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "none",
            border: "none",
            color: "#38bdf8",
            fontSize: 14,
            cursor: "pointer",
            padding: 0,
            marginBottom: "1rem"
          }}
        >
          ← Atrás
        </button>

        {status === "loading" && (
          <div style={{ color: "#94a3b8" }}>
            <p>Cargando detalle...</p>
          </div>
        )}

        {status === "error" && (
          <div style={{ color: "#fecaca" }}>
            <p>{error}</p>
          </div>
        )}

        {status === "ready" && product && (
          <>
            <h1 style={{ marginTop: 0, color: "#f8fafc" }}>{product.name}</h1>
            <p style={{ textTransform: "uppercase", letterSpacing: 2, color: "#38bdf8", fontSize: 13 }}>
              {product.category}
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "1rem",
                margin: "1.5rem 0"
              }}
            >
              <div
                style={{
                  background: "rgba(15, 23, 42, 0.6)",
                  padding: "1rem",
                  borderRadius: 14,
                  border: "1px solid rgba(148, 163, 184, 0.2)"
                }}
              >
                <p style={{ margin: 0, color: "#94a3b8", fontSize: 12 }}>Precio</p>
                <strong style={{ fontSize: "1.5rem", color: "#4ade80" }}>
                  ${Number(product.price).toFixed(2)}
                </strong>
              </div>
              <div
                style={{
                  background: "rgba(15, 23, 42, 0.6)",
                  padding: "1rem",
                  borderRadius: 14,
                  border: "1px solid rgba(148, 163, 184, 0.2)"
                }}
              >
                <p style={{ margin: 0, color: "#94a3b8", fontSize: 12 }}>Stock</p>
                <strong style={{ fontSize: "1.5rem", color: "#f8fafc" }}>{product.stock}</strong>
              </div>
            </div>
            <p style={{ color: "#cbd5f5", lineHeight: 1.6 }}>{product.description}</p>
          </>
        )}
      </section>
    </main>
  );
}
