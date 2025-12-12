import { registrarUsuario } from "../conexiones/usuariosConexion.js";

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("formRegister");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            nombre: document.getElementById("nombre").value.trim(),
            apellido: document.getElementById("apellido").value.trim(),
            cedula: document.getElementById("cedula").value.trim(),
            telefono: document.getElementById("telefono").value.trim(),
            correo: document.getElementById("correoReg").value.trim(),
            rol: "cliente",
            contraseña: document.getElementById("passReg").value.trim()
        };

        // =======================
        // VALIDACIONES (con Swal)
        // =======================

        if (!data.nombre || !data.apellido || !data.cedula || !data.telefono || !data.correo || !data.contraseña) {
            return Swal.fire({
                icon: "error",
                title: "Campos incompletos",
                text: "Por favor completa todos los campos."
            });
        }

        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,30}$/.test(data.nombre)) {
            return Swal.fire({
                icon: "error",
                title: "Nombre inválido",
                text: "Debe tener mínimo 3 letras y solo caracteres válidos."
            });
        }

        if (!/^\d{6,11}$/.test(data.cedula)) {
            return Swal.fire({
                icon: "error",
                title: "Cédula inválida",
                text: "Ingresa una cédula entre 6 y 11 números."
            });
        }

        if (!/\S+@\S+\.\S+/.test(data.correo)) {
            return Swal.fire({
                icon: "error",
                title: "Correo inválido",
                text: "Por favor ingresa un correo válido."
            });
        }

        if (data.contraseña.length < 6) {
            return Swal.fire({
                icon: "warning",
                title: "Contraseña muy corta",
                text: "Debe tener mínimo 6 caracteres."
            });
        }

        // =======================
        // ENVIAR AL BACKEND
        // =======================
        const res = await registrarUsuario(data);

        if (res.error) {
            return Swal.fire({
                icon: "error",
                title: "Error al registrar",
                text: res.error
            });
        }

        // =======================
        // ÉXITO 🎉
        // =======================
        Swal.fire({
            icon: "success",
            title: "¡Registro exitoso!",
            text: "Tu cuenta ha sido creada correctamente.",
            showConfirmButton: true,
            confirmButtonText: "Iniciar sesión"
        }).then(() => {
            form.reset();
            cerrarModal("modalRegister");
            abrirModal("modalLogin"); // ← abre login automáticamente
        });

    });

});
