export function protegerPagina(roleNecesario = null) {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // Si NO está logueado → login
    if (!token || !user.rol) {
        window.location.href = "/frontend/public/login.html";
        return;
    }

    // Si la página requiere un rol → validar exactamente el rol
    if (roleNecesario && user.rol !== roleNecesario) {
        alert("No autorizado");
        window.location.href = "/frontend/public/index.html";
        return;
    }
}
