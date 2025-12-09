const pool = require('../config/database');

const User = {
    async create({ nombre, apellido, cedula, telefono, correo, contraseña }) {
        const [result] = await pool.execute(
            `INSERT INTO usuarios (nombre, apellido, cedula, telefono, correo, contraseña)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [nombre, apellido, cedula, telefono, correo, contraseña]
        );
        return result.insertId;
    },

    async findByEmail(correo) {
        const [rows] = await pool.execute(
            `SELECT * FROM usuarios WHERE correo = ?`,
            [correo]
        );
        return rows[0];
    },

    async findById(id) {
        const [rows] = await pool.execute(
            `SELECT id_usuario, nombre, apellido, correo, rol 
             FROM usuarios WHERE id_usuario = ?`,
            [id]
        );
        return rows[0];
    }
};

module.exports = User;
