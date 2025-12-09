// ABRIR MODAL
window.abrirModal = function(id) {
    document.getElementById(id).style.display = "flex";
};

// CERRAR MODAL
window.cerrarModal = function(id) {
    document.getElementById(id).style.display = "none";
};

// Abrir Login desde icono de usuario
document.getElementById("btnOpenLogin").addEventListener("click", () => {
    abrirModal("modalLogin");
});

window.cambiarDeModal = function(actual, siguiente) {
    cerrarModal(actual);
    abrirModal(siguiente);
};