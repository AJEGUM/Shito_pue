const db = require("../config/database");
const bcrypt = require("bcryptjs");


class UsuariosController {

  async obtenerUsuarios(req, res) {
    try {
      const [rows] = await db.query("SELECT * FROM usuarios");
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener usuarios" });
    }
  }

  async obtenerUsuario(req, res) {
    try {
      const { id } = req.params;

      const [rows] = await db.query(
        "SELECT * FROM usuarios WHERE id_usuario = ?",
        [id]
      );

      res.json(rows[0]);

    } catch (error) {
      res.status(500).json({ error: "Error al obtener usuario" });
    }
  }


async crearUsuario(req, res) {
  try {
    const data = req.body;

    // Validar campos obligatorios
    if (!data.nombre || !data.apellido || !data.cedula || 
        !data.telefono || !data.correo || !data.rol) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // Validar contraseña
    if (!data.contraseña || data.contraseña.trim() === "") {
      return res.status(400).json({ error: "La contraseña es obligatoria" });
    }

    // Encriptar contraseña
    const contraseñaEncriptada = await bcrypt.hash(data.contraseña, 10);

    const [result] = await db.query(
      `INSERT INTO usuarios (nombre, apellido, cedula, telefono, correo, rol, contraseña)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.nombre,
        data.apellido,
        data.cedula,
        data.telefono,
        data.correo,
        data.rol,
        contraseñaEncriptada
      ]
    );

    res.status(201).json({ id_usuario: result.insertId, ...data });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al crear usuario" });
  }
}


  async actualizarUsuario(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;

    // Si viene contraseña, encriptarla
    if (data.contraseña && data.contraseña.trim() !== "") {
      data.contraseña = await bcrypt.hash(data.contraseña, 10);
    } else {
      // Si se deja vacío el campo contraseña → NO actualizarla
      delete data.contraseña;
    }

    await db.query("UPDATE usuarios SET ? WHERE id_usuario = ?", [data, id]);

    res.json({ id, ...data });

  } catch (error) {
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
}


  async eliminarUsuario(req, res) {
    try {
      const { id } = req.params;

      await db.query("DELETE FROM usuarios WHERE id_usuario = ?", [id]);

      res.json({ message: "Usuario eliminado" });

    } catch (error) {
      res.status(500).json({ error: "Error al eliminar usuario" });
    }
  }
}

module.exports = UsuariosController;
