const API_URL = "http://localhost:3000/api/auth";

// LOGIN
export async function login(correo, contraseña) {
    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contraseña })
    });

    return res.json();
}

// LOGOUT
export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/frontend/public/";
}
