// admin/conexiones/usuariosConexion.js

const URL = "http://localhost:3000/api/usuarios";

export async function obtenerUsuarios() {
  const res = await fetch(URL);
  return res.json();
}

export async function obtenerUsuarioPorId(id) {
  const res = await fetch(`${URL}/${id}`);
  return res.json();
}

export async function crearUsuario(data) {
  const res = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function actualizarUsuario(id, data) {
  const res = await fetch(`${URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function eliminarUsuario(id) {
  const res = await fetch(`${URL}/${id}`, { method: "DELETE" });
  return res.json();
}
