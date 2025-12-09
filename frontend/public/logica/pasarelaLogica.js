import { crearVenta } from "../conexiones/pasarelaConexion.js";

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

/* ================================
    MOSTRAR RESUMEN DEL CARRITO
=================================*/
document.addEventListener("DOMContentLoaded", () => {
  renderResumenCarrito();
});

function renderResumenCarrito() {
  const listaResumen = document.getElementById("listaResumen");
  const totalPagar = document.getElementById("totalPagar");

  listaResumen.innerHTML = "";

  let total = 0;

  carrito.forEach((item) => {
    total += item.precio_producto * item.cantidad;

    const div = document.createElement("div");
    div.classList.add("item-resumen");

    div.innerHTML = `
      <p><strong>${item.nombre_producto}</strong> (x${item.cantidad})</p>
      <span>$${(item.precio_producto * item.cantidad).toLocaleString()}</span>
    `;

    listaResumen.appendChild(div);
  });

  totalPagar.textContent = `$${total.toLocaleString()}`;
}

/* ================================
    CONFIRMAR COMPRA
=================================*/
document
  .getElementById("btnConfirmarPago")
  .addEventListener("click", async () => {
    const direccion = document.getElementById("direccion").value.trim();
    const metodo_pago = document.getElementById("metodoPago").value.trim();

    if (!direccion) {
      alert("Debes ingresar la dirección.");
      return;
    }

    if (carrito.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    const usuario = JSON.parse(localStorage.getItem("user"));
    if (!usuario || !usuario.id) {
      alert("Debes iniciar sesión para comprar.");
      return;
    }

    // 🔹 Asegurarnos de que tomamos las cantidades actuales del carrito
    const totalVenta = carrito.reduce(
      (sum, item) => sum + item.precio_producto * item.cantidad,
      0
    );

    // 🔹 Formato de detalles para enviar a backend
    const detallesLimpios = carrito.map((item) => ({
      id_producto: item.id_producto,
      cantidad: item.cantidad,
      precio_unitario: item.precio_producto,
    }));

    const venta = {
      id_cliente: usuario.id,
      fecha: new Date().toISOString().slice(0, 10),
      direccion,
      metodo_pago,
      total: totalVenta,
      detalles: detallesLimpios,
    };

    const respuesta = await crearVenta(venta);

    if (!respuesta) {
      alert("Error creando la venta.");
      return;
    }

    alert("Compra realizada con éxito 🟢");

    // Limpiar carrito y localStorage
    carrito = [];
    localStorage.removeItem("carrito");

    window.location.href = "/frontend/public/index.html";
  });
