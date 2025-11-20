const normalizeBase = () => {
  const envBase = import.meta.env.VITE_API_URL?.trim();
  const base = envBase ? envBase.replace(/\/$/, "") : "/api";
  return base;
};

const API_BASE = normalizeBase();

const buildUrl = (path) => `${API_BASE}${path}`;

export async function fetchProducts() {
  const res = await fetch(buildUrl("/products"));
  if (!res.ok) throw new Error("No se pudo cargar el catálogo");
  return res.json();
}

export async function fetchProduct(id) {
  const res = await fetch(buildUrl(`/products/${id}`));
  if (res.status === 404) {
    throw new Error("Producto no encontrado");
  }
  if (!res.ok) {
    throw new Error("No se pudo cargar el detalle");
  }
  return res.json();
}

export async function createProduct(payload) {
  const res = await fetch(buildUrl("/products"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const details = await res.json().catch(() => ({}));
    throw new Error(details.error || "No se pudo crear el producto");
  }

  return res.json();
}
