const API_URL = "http://localhost:3000/api/auth/register";

export async function registrarUsuario(data) {
    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        return await res.json();

    } catch (error) {
        console.error("Error en registrarUsuario()", error);
        return { error: "Error al conectar con el servidor" };
    }
}
