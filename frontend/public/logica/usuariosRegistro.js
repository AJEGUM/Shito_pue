import { registrarUsuario } from "../conexiones/usuariosConexion.js";

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("formRegister");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            nombre: document.getElementById("nombre").value,
            apellido: document.getElementById("apellido").value,
            cedula: document.getElementById("cedula").value,
            telefono: document.getElementById("telefono").value,
            correo: document.getElementById("correoReg").value,
            rol: "cliente",   // 👈 ROL FIJO
            contraseña: document.getElementById("passReg").value
        };

        const res = await registrarUsuario(data);

        if (res.error) {
            alert("❌ Error: " + res.error);
            return;
        }

        alert("✔ Usuario registrado correctamente");
        form.reset();
        cerrarModal("modalRegister");
    });

});
