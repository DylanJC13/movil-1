import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createProduct } from "../services/api";

const initialState = {
  name: "",
  category: "",
  price: "",
  stock: "",
  description: ""
};

export function NewProductPage() {
  const [values, setValues] = useState(initialState);
  const [status, setStatus] = useState("idle"); // idle | saving | error
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setStatus("saving");
    setError(null);
    try {
      const payload = {
        ...values,
        price: Number(values.price),
        stock: Number(values.stock)
      };
      const created = await createProduct(payload);
      setStatus("idle");
      setValues(initialState);
      navigate(`/catalog/${created.id}`, { state: { product: created } });
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  };

  return (
    <main className="page">
      <section className="card" style={{ width: "min(640px, 100%)" }}>
        <header style={{ marginBottom: "1rem" }}>
          <Link to="/catalog" style={{ color: "#38bdf8", fontSize: 14 }}>
            ← Volver al catálogo
          </Link>
          <h1 style={{ margin: "0.5rem 0 0", color: "#f8fafc" }}>Nuevo producto</h1>
          <p style={{ color: "#cbd5f5", fontSize: 14 }}>
            Completa el formulario y guardaremos el registro directamente en PostgreSQL.
          </p>
        </header>

        {error && (
          <div
            style={{
              background: "rgba(185, 28, 28, 0.15)",
              border: "1px solid rgba(248, 113, 113, 0.4)",
              borderRadius: 12,
              padding: "0.8rem",
              color: "#fecaca",
              marginBottom: "1rem"
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <label style={{ display: "flex", flexDirection: "column", color: "#94a3b8", fontSize: 14 }}>
            Nombre*
            <input
              required
              name="name"
              value={values.name}
              onChange={handleChange}
              placeholder="Ej: Monitor QHD 27''"
              style={inputStyle}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", color: "#94a3b8", fontSize: 14 }}>
            Categoría*
            <input
              required
              name="category"
              value={values.category}
              onChange={handleChange}
              placeholder="Ej: Monitores"
              style={inputStyle}
            />
          </label>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "1rem" }}>
            <label style={{ display: "flex", flexDirection: "column", color: "#94a3b8", fontSize: 14 }}>
              Precio*
              <input
                required
                name="price"
                type="number"
                step="0.01"
                value={values.price}
                onChange={handleChange}
                placeholder="0.00"
                style={inputStyle}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", color: "#94a3b8", fontSize: 14 }}>
              Stock*
              <input
                required
                name="stock"
                type="number"
                step="1"
                min="0"
                value={values.stock}
                onChange={handleChange}
                placeholder="0"
                style={inputStyle}
              />
            </label>
          </div>

          <label style={{ display: "flex", flexDirection: "column", color: "#94a3b8", fontSize: 14 }}>
            Descripción
            <textarea
              name="description"
              value={values.description}
              onChange={handleChange}
              rows={4}
              placeholder="Detalles destacados, compatibilidad, etc."
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </label>

          <button className="primary-btn" type="submit" disabled={status === "saving"} style={{ justifyContent: "center" }}>
            {status === "saving" ? "Guardando..." : "Crear producto"}
          </button>
        </form>
      </section>
    </main>
  );
}

const inputStyle = {
  marginTop: "0.4rem",
  padding: "0.75rem 1rem",
  borderRadius: 12,
  border: "1px solid rgba(148, 163, 184, 0.3)",
  background: "rgba(15, 23, 42, 0.6)",
  color: "#f8fafc",
  fontSize: "1rem"
};
