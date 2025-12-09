import { login } from "../conexiones/authConexion.js";

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("formLogin");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const correo = document.getElementById("correo").value;
        const contraseña = document.getElementById("contraseña").value;

        const res = await login(correo, contraseña);

        if (res.error) {
            alert(res.error);
            return;
        }

        // Guarda token
        localStorage.setItem("token", res.token);

        // Guarda usuario
        localStorage.setItem("user", JSON.stringify(res.user));

        // SI ES ADMINISTRADOR
        if (res.user.rol === "Administrador") {
            window.location.href = "/frontend/admin/productos.html";
            return;
        }

        // SI ES CLIENTE
        window.location.href = "/frontend/public/index.html";
    });

});
