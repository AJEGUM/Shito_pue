const API_PRODUCTOS = "http://localhost:3000/api/productos";

// Obtener productos
export async function obtenerProductos() {
    try {
        const token = localStorage.getItem("token");

        const res = await fetch(API_PRODUCTOS, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "Error al obtener productos");
        }

        return data;
    } catch (error) {
        console.error("Error API productos:", error);
        return [];
    }
}

// Crear producto
export async function crearProducto(data) {
    try {
        const token = localStorage.getItem("token");

        const res = await fetch(API_PRODUCTOS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        return await res.json();
    } catch (error) {
        console.error("Error creando producto:", error);
    }
}

// Editar producto
export async function editarProducto(id, data) {
    try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_PRODUCTOS}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        return await res.json();
    } catch (error) {
        console.error("Error editando producto:", error);
    }
}

// Eliminar producto
export async function eliminarProducto(id) {
    try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_PRODUCTOS}/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        return await res.json();
    } catch (error) {
        console.error("Error eliminando producto:", error);
    }
}
