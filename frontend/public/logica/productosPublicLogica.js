/* ================================
    IMPORTS
=================================*/
import { obtenerProductosPublicos } from "../conexiones/productosPublicConexion.js";

/* ================================
    CARGAR PRODUCTOS
=================================*/
let productos = []; // Para almacenar todos los productos
const contenedor = document.getElementById("contenedorProductos");
const inputBusqueda = document.getElementById("busqueda"); // nuestro input de búsqueda
inputBusqueda.addEventListener("input", filtrarProductos);

document.addEventListener("DOMContentLoaded", async () => {
  productos = await obtenerProductosPublicos(); // Traemos todos los productos
  renderProductos(productos);
});

// Renderizar productos (lo mismo que ya tienes, pero en función)
function renderProductos(lista) {
  contenedor.innerHTML = "";

  if (!lista || lista.length === 0) {
    contenedor.innerHTML = "<p>No hay productos disponibles</p>";
    return;
  }

  lista.forEach((p) => {
    const card = document.createElement("div");
    card.classList.add("card-producto");

    card.innerHTML = `
      <img src="${p.imagen || ""}" class="img-producto">
      <h3>${p.nombre_producto}</h3>
      <p>${p.descripcion_producto}</p>
      <span class="precio">$${p.precio_producto.toLocaleString()}</span>
      <button class="btnAgregarCarrito">Añadir al carrito</button>
    `;

    card.addEventListener("click", () => abrirModalProducto(p));

    card.querySelector(".btnAgregarCarrito").addEventListener("click", (e) => {
      e.stopPropagation();
      agregarAlCarrito(p);
    });

    contenedor.appendChild(card);
  });
}

function filtrarProductos() {
  const texto = inputBusqueda.value.toLowerCase().trim();

  // Filtramos por nombre y categoría
  const filtrados = productos.filter(
    (p) =>
      p.nombre_producto.toLowerCase().includes(texto) ||
      p.nombre_categoria.toLowerCase().includes(texto)
  );

  renderProductos(filtrados);
}

/* ================================
    MANEJO DE MODALES
=================================*/
export function abrirModal(id) {
  document.getElementById(id).style.display = "flex";
}

export function cerrarModal(id) {
  document.getElementById(id).style.display = "none";
}

// Cerrar modal haciendo clic fuera
window.addEventListener("click", function (event) {
  const modales = document.querySelectorAll(".modal");

  modales.forEach((modal) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});

/* ================================
    DETALLE PRODUCTO (MODAL)
=================================*/
function abrirModalProducto(p) {
  document.getElementById("detalleImagen").src = p.imagen;

  document.getElementById("detalleNombre").textContent = p.nombre_producto;

  document.getElementById("detalleDescripcion").textContent =
    p.descripcion_producto;

  document.getElementById("detalleCategoria").textContent =
    "Categoría: " + p.nombre_categoria;

  document.getElementById("detalleStock").textContent =
    "Stock disponible: " + p.stock;

  document.getElementById(
    "detallePrecio"
  ).textContent = `$${p.precio_producto.toLocaleString()}`;

  // 👉 Botón dentro del modal
  document.getElementById("btnAgregarCarrito").onclick = () => {
    agregarAlCarrito(p);
  };

  abrirModal("modalProducto");
}

/* ================================
    CARRITO DE COMPRAS
=================================*/
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Abrir sidebar del carrito
document.getElementById("btnOpenCart").addEventListener("click", () => {
  document.getElementById("sidebarCarrito").classList.add("open");
  renderCarrito();
});

// Cerrar sidebar
document.getElementById("btnCerrarCarrito").addEventListener("click", () => {
  document.getElementById("sidebarCarrito").classList.remove("open");
});

// Agregar producto al carrito
export function agregarAlCarrito(producto) {
  const existe = carrito.find((i) => i.id_producto === producto.id_producto);

  // Si ya está agregado
  if (existe) {
    // VALIDAR STOCK REAL
    if (existe.cantidad + 1 > producto.stock) {
      mostrarToast("❌ No puedes agregar más, stock máximo alcanzado");
      return;
    }

    existe.cantidad++;
    mostrarToast("Aumentaste la cantidad en el carrito");
  } else {
    // Si intenta agregar un producto sin stock
    if (producto.stock <= 0) {
      mostrarToast("❌ Producto sin stock disponible");
      return;
    }

    carrito.push({
      id_producto: producto.id_producto,
      nombre_producto: producto.nombre_producto,
      precio_producto: producto.precio_producto,
      imagen: producto.imagen, // 👈 CORREGIDO
      stock: producto.stock, // 👈 AHORA EL CARRITO TIENE STOCK
      cantidad: 1,
    });

    mostrarToast("Añadiste un producto al carrito");
  }

  guardarCarrito();
  renderCarrito();
}

// Validar si el usuario esta logueado para realizar la compra

document
  .querySelector(".btn-checkout")
  .addEventListener("click", validarCheckout);

function validarCheckout() {
  const user = JSON.parse(localStorage.getItem("user")); // <-- tu lógica usa "user"

  if (!user) {
    mostrarToast("Debes iniciar sesión para continuar 🛒");

    // Cerrar cualquier modal abierto
    cerrarModal("modalRegister");

    // Abrir modal de login
    abrirModal("modalLogin");

    return;
  }

  // SI ESTÁ LOGUEADO → REDIRIGIR A LA PASARELA
  window.location.href = "/frontend/public/pasarela.html";
}

// Mostrar carrito
// Mostrar carrito
function renderCarrito() {
  const lista = document.getElementById("listaCarrito");
  lista.innerHTML = "";

  let total = 0;

  carrito.forEach((item) => {
    total += item.precio_producto * item.cantidad;

    const div = document.createElement("div");
    div.classList.add("item-carrito");

    div.innerHTML = `
            <img src="${item.imagen}">
            <div class="item-info">
                <h4>${item.nombre_producto}</h4>
                <p>$${item.precio_producto.toLocaleString()}</p>

                <div class="cantidad-control">
                    <button class="btn-decrementar" data-id="${
                      item.id_producto
                    }">-</button>
                    <span class="cantidad">${item.cantidad}</span>
                    <button class="btn-incrementar" data-id="${
                      item.id_producto
                    }">+</button>
                </div>

                <p>Stock disponible: ${item.stock}</p>
            </div>

            <button class="btnEliminar" data-id="${item.id_producto}">🗑</button>
        `;

    lista.appendChild(div);
  });

  document.getElementById(
    "totalCarrito"
  ).textContent = `$${total.toLocaleString()}`;

  agregarEventosCantidad();
}

function agregarEventosCantidad() {
  // Botón +
  document.querySelectorAll(".btn-incrementar").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const item = carrito.find((p) => p.id_producto === id);

      if (!item) return;

      if (item.cantidad < item.stock) {
        item.cantidad++;
        guardarCarrito(); // 🔹 Guardar en localStorage
        renderCarrito();
      } else {
        alert("Has alcanzado el stock máximo disponible.");
      }
    });
  });

  // Botón -
  document.querySelectorAll(".btn-decrementar").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const item = carrito.find((p) => p.id_producto === id);

      if (!item) return;

      if (item.cantidad > 1) {
        item.cantidad--;
        guardarCarrito(); // 🔹 Guardar en localStorage
        renderCarrito();
      } else {
        alert("La cantidad mínima es 1.");
      }
    });
  });

  // Botón eliminar
  document.querySelectorAll(".btnEliminar").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      carrito = carrito.filter((p) => p.id_producto !== id);
      guardarCarrito(); // 🔹 Guardar en localStorage
      renderCarrito();
    });
  });
}

function eliminarDelCarrito(id) {
  carrito = carrito.filter((i) => i.id_producto != id);
  guardarCarrito();
  renderCarrito();
}

function mostrarToast(mensaje) {
  const toast = document.getElementById("toastCarrito");
  toast.textContent = mensaje;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}
