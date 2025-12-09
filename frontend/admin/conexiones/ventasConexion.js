const API = "http://localhost:3000/api/ventas";

export async function obtenerVentas() {
    const res = await fetch(API);
    return await res.json();
}

export async function obtenerDetalleVenta(id) {
    const res = await fetch(`${API}/${id}/detalle`);
    return await res.json();
}
