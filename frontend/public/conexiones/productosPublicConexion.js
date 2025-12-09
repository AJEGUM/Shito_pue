const API_PRODUCTOS_PUBLICOS = "http://localhost:3000/api/productos/publicos/lista";

// Obtener productos sin token (público)
export async function obtenerProductosPublicos() {
    try {

        const res = await fetch(API_PRODUCTOS_PUBLICOS);
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "Error al obtener productos públicos");
        }

        return data;

    } catch (error) {
        console.error("Error obteniendo productos públicos:", error);
        return [];
    }
}
