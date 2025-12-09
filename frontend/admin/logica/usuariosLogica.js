import {
  obtenerUsuarios,
  crearUsuario,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario
} from "../conexiones/usuariosConexion.js";

export class UsuariosUI {

  // ==========================
  //  CARGAR TABLA
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
  //  BOTONES: EDITAR / ELIMINAR
  // ==========================
  activarBotones() {

    // ---------------- ELIMINAR ----------------
    document.querySelectorAll(".btnEliminar").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        await eliminarUsuario(id);
        this.cargarTabla();
      });
    });

    // ---------------- EDITAR ----------------
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
  //  ABRIR / CERRAR MODALES
  // ==========================
  abrirModal(id) {
    document.getElementById(id).style.display = "flex";
  }

  cerrarModal(id) {
    document.getElementById(id).style.display = "none";
  }

  // ==========================
  //  CREAR USUARIO
  // ==========================
async crear() {

  const nombre = document.getElementById("crearNombre").value.trim();
  const apellido = document.getElementById("crearApellido").value.trim();
  const cedula = document.getElementById("crearCedula").value.trim();
  const telefono = document.getElementById("crearTelefono").value.trim();
  const correo = document.getElementById("crearCorreo").value.trim();
  const rol = document.getElementById("crearRol").value.trim();
  const contraseña = document.getElementById("crearContraseña").value.trim();

  // ===============================
  // VALIDAR FORMULARIO VACÍO
  // ===============================
  if (!nombre || !apellido || !cedula || !telefono || !correo || !rol || !contraseña) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  // ===============================
  // VALIDACIONES ESPECÍFICAS
  // ===============================
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,30}$/.test(nombre)) {
    alert("Nombre inválido: solo letras y mínimo 3 caracteres.");
    return;
  }

  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,30}$/.test(apellido)) {
    alert("Apellido inválido: solo letras y mínimo 3 caracteres.");
    return;
  }

  if (!/^\d{6,11}$/.test(cedula)) {
    alert("La cédula debe contener entre 6 y 11 números.");
    return;
  }

  if (!/^\d{7,10}$/.test(telefono)) {
    alert("El teléfono debe contener entre 7 y 10 números.");
    return;
  }

  if (!/\S+@\S+\.\S+/.test(correo)) {
    alert("Correo electrónico inválido.");
    return;
  }

  if (contraseña.length < 6) {
    alert("La contraseña debe tener mínimo 6 caracteres.");
    return;
  }

  // ===============================
  // SI TODO ESTÁ BIEN → ENVIAR
  // ===============================
  const data = {
    nombre,
    apellido,
    cedula,
    telefono,
    correo,
    rol,
    contraseña
  };

  await crearUsuario(data);

  alert("Usuario creado correctamente.");

  this.cargarTabla();
  this.cerrarModal("modalCrear");
}


  // ==========================
  //  GUARDAR EDICIÓN
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

    this.cargarTabla();
    this.cerrarModal("modalEditar");
  }
}

// Validaciones
window.soloLetras = (input) => {
    input.value = input.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
};

window.soloEntero = (input) => {
    input.value = input.value.replace(/\D+/g, "");
};

window.sinEspeciales = (input) => {
    input.value = input.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,-]/g, "");
};

const usuariosUI = new UsuariosUI();
// ==========================
// EVENTOS DE LOS MODALES
// ==========================
// ==========================
// INICIALIZACIÓN AUTOMÁTICA
// ==========================
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
