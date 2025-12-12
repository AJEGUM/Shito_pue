import {
  obtenerUsuarios,
  crearUsuario,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario
} from "../conexiones/usuariosConexion.js";

export class UsuariosUI {

  // ==========================
  // CARGAR TABLA
  // ==========================
  async cargarTabla() {
    const usuarios = await obtenerUsuarios();
    const tbody = document.getElementById("tablaUsuarios");
    tbody.innerHTML = "";

    usuarios.forEach(u => {
      tbody.innerHTML += `
        <tr>
          <td>${u.id_usuario}</td>
          <td>${u.nombre}</td>
          <td>${u.apellido}</td>
          <td>${u.cedula}</td>
          <td>${u.telefono}</td>
          <td>${u.correo}</td>
          <td>${u.rol}</td>
          <td>
            <button class="btnEditar" data-id="${u.id_usuario}">Editar</button>
            <button class="btnEliminar" data-id="${u.id_usuario}">Eliminar</button>
          </td>
        </tr>
      `;
    });

    this.activarBotones();
  }

  // ==========================
  // BOTONES DE ACCIÓN
  // ==========================
  activarBotones() {

    // -------- ELIMINAR --------
    document.querySelectorAll(".btnEliminar").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;

        const confirm = await Swal.fire({
          title: "¿Eliminar usuario?",
          text: "Esta acción no se puede deshacer.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, eliminar",
          cancelButtonText: "Cancelar"
        });

        if (confirm.isConfirmed) {
          await eliminarUsuario(id);

          Swal.fire({
            icon: "success",
            title: "Eliminado",
            text: "El usuario fue eliminado correctamente."
          });

          this.cargarTabla();
        }
      });
    });

    // -------- EDITAR --------
    document.querySelectorAll(".btnEditar").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        const u = await obtenerUsuarioPorId(id);

        document.getElementById("editId").value = id;
        document.getElementById("editNombre").value = u.nombre;
        document.getElementById("editApellido").value = u.apellido;
        document.getElementById("editCedula").value = u.cedula;
        document.getElementById("editTelefono").value = u.telefono;
        document.getElementById("editCorreo").value = u.correo;
        document.getElementById("editRol").value = u.rol;
        document.getElementById("editContraseña").value = "";

        this.abrirModal("modalEditar");
      });
    });
  }

  // ==========================
  // ABRIR / CERRAR MODALES
  // ==========================
  abrirModal(id) {
    document.getElementById(id).style.display = "flex";
  }

  cerrarModal(id) {
    document.getElementById(id).style.display = "none";
  }

  // ==========================
  // CREAR USUARIO
  // ==========================
  async crear() {

    const nombre = document.getElementById("crearNombre").value.trim();
    const apellido = document.getElementById("crearApellido").value.trim();
    const cedula = document.getElementById("crearCedula").value.trim();
    const telefono = document.getElementById("crearTelefono").value.trim();
    const correo = document.getElementById("crearCorreo").value.trim();
    const rol = document.getElementById("crearRol").value.trim();
    const contraseña = document.getElementById("crearContraseña").value.trim();

    // -------- Validación de campos vacíos --------
    if (!nombre || !apellido || !cedula || !telefono || !correo || !rol || !contraseña) {
      Swal.fire({
        icon: "error",
        title: "Campos incompletos",
        text: "Por favor, completa todos los campos."
      });
      return;
    }

    // -------- Validaciones --------
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,30}$/.test(nombre)) {
      return Swal.fire({ icon: "error", title: "Nombre inválido", text: "Debe tener solo letras y mínimo 3 caracteres." });
    }

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,30}$/.test(apellido)) {
      return Swal.fire({ icon: "error", title: "Apellido inválido", text: "Debe tener solo letras y mínimo 3 caracteres." });
    }

    if (!/^\d{6,11}$/.test(cedula)) {
      return Swal.fire({ icon: "error", title: "Cédula inválida", text: "Debe tener entre 6 y 11 números." });
    }

    if (!/^\d{7,10}$/.test(telefono)) {
      return Swal.fire({ icon: "error", title: "Teléfono inválido", text: "Debe tener entre 7 y 10 números." });
    }

    if (!/\S+@\S+\.\S+/.test(correo)) {
      return Swal.fire({ icon: "error", title: "Correo inválido", text: "Ingresa un correo válido." });
    }

    if (contraseña.length < 6) {
      return Swal.fire({ icon: "error", title: "Contraseña débil", text: "Debe tener mínimo 6 caracteres." });
    }

    // -------- Enviar datos --------
    const data = { nombre, apellido, cedula, telefono, correo, rol, contraseña };

    await crearUsuario(data);

    Swal.fire({
      icon: "success",
      title: "Usuario creado",
      text: "El usuario ha sido registrado exitosamente."
    });

    this.cargarTabla();
    this.cerrarModal("modalCrear");
  }

  // ==========================
  // ACTUALIZAR USUARIO
  // ==========================
  async actualizar() {

    const id = document.getElementById("editId").value;

    const data = {
      nombre: document.getElementById("editNombre").value,
      apellido: document.getElementById("editApellido").value,
      cedula: document.getElementById("editCedula").value,
      telefono: document.getElementById("editTelefono").value,
      correo: document.getElementById("editCorreo").value,
      rol: document.getElementById("editRol").value,
      contraseña: document.getElementById("editContraseña").value,
    };

    await actualizarUsuario(id, data);

    Swal.fire({
      icon: "success",
      title: "Usuario actualizado",
      text: "Los datos se han guardado correctamente."
    });

    this.cargarTabla();
    this.cerrarModal("modalEditar");
  }
}

// ==========================
// VALIDADORES
// ==========================
window.soloLetras = (input) => {
  input.value = input.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
};

window.soloEntero = (input) => {
  input.value = input.value.replace(/\D+/g, "");
};

window.sinEspeciales = (input) => {
  input.value = input.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,-]/g, "");
};

// ==========================
// INICIALIZACIÓN
// ==========================
const usuariosUI = new UsuariosUI();

document.addEventListener("DOMContentLoaded", () => {

  usuariosUI.cargarTabla();

  document.getElementById("btnAbrirCrear")
    .addEventListener("click", () => usuariosUI.abrirModal("modalCrear"));

  document.getElementById("btnCrearGuardar")
    .addEventListener("click", () => usuariosUI.crear());

  document.getElementById("btnEditarGuardar")
    .addEventListener("click", () => usuariosUI.actualizar());

  document.querySelectorAll(".modal-bg").forEach(modal => {
    modal.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal-bg")) {
        modal.style.display = "none";
      }
    });
  });

});
