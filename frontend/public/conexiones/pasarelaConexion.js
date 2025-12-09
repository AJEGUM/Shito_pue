const API_VENTAS = "http://localhost:3000/api/ventas";

// Crear venta
export async function crearVenta(data) {
    try {
        const res = await fetch(API_VENTAS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const json = await res.json();

        if (!res.ok) throw new Error(json.error || "Error al crear venta");

        return json;

    } catch (error) {
        console.error("Error creando venta:", error);
        return null;
    }
}
