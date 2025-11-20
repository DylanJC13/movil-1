import { Link } from "react-router-dom";

export function MainPage() {
  return (
    <main className="page">
      <section className="card" style={{ textAlign: "center" }}>
        <p style={{ textTransform: "uppercase", color: "#38bdf8", letterSpacing: 2, fontSize: 12 }}>
          Master–Detail · PWA
        </p>
        <h1 style={{ fontSize: "2.8rem", marginBottom: "1rem", color: "#f8fafc" }}>
          Movil Primero Catalog
        </h1>
        <p style={{ color: "#cbd5f5", fontSize: "1.1rem", marginBottom: "2rem" }}>
          Explora un listado de productos y consulta sus detalles en tiempo real, directo desde la base de
          datos PostgreSQL alojada en DigitalOcean.
        </p>
        <Link to="/catalog" className="primary-btn">
          Ver catálogo
          <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}
