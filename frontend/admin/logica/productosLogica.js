import { 
    obtenerProductos,
    crearProducto,
    editarProducto,
    eliminarProducto
} from "../conexiones/productosConexion.js";

const tabla = document.getElementById("tabla-productos");

const modalCrear = document.getElementById("modal-crear-producto");
const modalEditar = document.getElementById("modal-editar-producto");

const formCrear = document.getElementById("form-crear-producto");
const formEditar = document.getElementById("form-editar-producto");

// Abrir / cerrar modales
window.abrirModalCrear = () => modalCrear.style.display = "flex";
window.cerrarModalCrear = () => modalCrear.style.display = "none";
window.cerrarModalEditar = () => modalEditar.style.display = "none";

window.abrirModalEditar = (producto) => {
    modalEditar.style.display = "flex";

    formEditar.id_producto.value = producto.id_producto;
    formEditar.nombre_producto.value = producto.nombre_producto;
    formEditar.precio_producto.value = producto.precio_producto;
    formEditar.descripcion_producto.value = producto.descripcion_producto;
    formEditar.nombre_categoria.value = producto.nombre_categoria;
    formEditar.entradas.value = producto.entradas;
    formEditar.salidas.value = producto.salidas;
};

formEditar.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(formEditar);
    const data = Object.fromEntries(formData);

    const file = formData.get("imagen");
    if (file && file.size > 0) {
        data.imagen = await convertirABase64(file);
    }

    await editarProducto(data.id_producto, data);

    formEditar.reset();
    cerrarModalEditar();
    cargarProductos();
});


window.soloLetras = (input) => {
    input.value = input.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
};

window.soloEntero = (input) => {
    input.value = input.value.replace(/\D+/g, "");
};

window.sinEspeciales = (input) => {
    input.value = input.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,-]/g, "");
};


// ------------------------------
// VALIDACIONES DE CAMPOS
// ------------------------------
window.soloEntero = (input) => {
    input.value = input.value.replace(/\D+/g, "");
};

window.soloDecimal = (input) => {
    input.value = input.value.replace(/[^0-9.]/g, "");
    const partes = input.value.split(".");
    if (partes.length > 2) input.value = partes[0] + "." + partes[1];
};


// ------------------------------
// Convertir imagen a base64
// ------------------------------
function convertirABase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result); 
        reader.onerror = reject;
        reader.readAsDataURL(file); // <-- incluye el prefijo data:image/png;base64,
    });
}


// ------------------------------
// Cargar productos
// ------------------------------
async function cargarProductos() {
    tabla.innerHTML = "";
    const productos = await obtenerProductos();

    productos.forEach(p => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${p.id_producto}</td>
            <td>${p.nombre_producto}</td>
            <td>$${p.precio_producto}</td>
            <td>${p.stock}</td>
            <td>${p.nombre_categoria}</td>
            <td>
                <button onclick='abrirModalEditar(${JSON.stringify(p)})'>Editar</button>
                <button onclick='confirmarEliminar(${p.id_producto})'>Eliminar</button>
            </td>
        `;

        tabla.appendChild(tr);
    });
}

cargarProductos();


// ------------------------------
// Crear producto
// ------------------------------
formCrear.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(formCrear);
    const data = Object.fromEntries(formData);

    // VALIDACIÓN
    const nombre = data.nombre_producto.trim();
    const precio = data.precio_producto.trim();
    const entradas = data.entradas.trim();
    const descripcion = data.descripcion_producto.trim();

    if (!/^[\w\sáéíóúÁÉÍÓÚñÑ.-]{3,50}$/.test(nombre)) {
        alert("El nombre es inválido. Solo letras, números y espacios.");
        return;
    }

    if (!/^\d+(\.\d{1,2})?$/.test(precio)) {
        alert("El precio es inválido. Solo números y máximo 2 decimales.");
        return;
    }

    if (!/^\d+$/.test(entradas)) {
        alert("Las entradas deben ser un número entero.");
        return;
    }

    if (descripcion && !/^[\w\sáéíóúÁÉÍÓÚñÑ.,-]{0,200}$/.test(descripcion)) {
        alert("La descripción contiene caracteres inválidos.");
        return;
    }

    const file = formData.get("imagen");

    if (file && file.size > 0) {
        data.imagen = await convertirABase64(file);
    }

    await crearProducto(data);

    formCrear.reset();
    cerrarModalCrear();
    cargarProductos();
});

// ------------------------------
// Eliminar
// ------------------------------
window.confirmarEliminar = async (id) => {
    if (confirm("¿Seguro que deseas eliminar este producto?")) {
        await eliminarProducto(id);
        cargarProductos();
    }
};
