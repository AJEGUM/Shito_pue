const User = require("../models/user");
const Bcrypt = require("../utils/bcrypt");
const JWT = require("../utils/jwt");
const pool = require("../config/database");

const authController = {

    // Obtener usuarios (solo admins)
    async getUsers(req, res) {
        try {
            if (req.user.rol !== "Administrador") {
                return res.status(403).json({ error: "No autorizado" });
            }

            const [users] = await pool.execute(
                `SELECT id_usuario, nombre, apellido, correo, telefono, rol, created_at
                 FROM usuarios ORDER BY created_at DESC`
            );

            res.json(users);

        } catch (error) {
            console.error("Error obteniendo usuarios:", error);
            res.status(500).json({ error: "Error obteniendo usuarios" });
        }
    },


    // Registro
    async register(req, res) {
        try {
            const { nombre, apellido, cedula, telefono, correo, contraseña } = req.body;

            const exists = await User.findByEmail(correo);
            if (exists) {
                return res.status(400).json({ error: "El usuario ya existe" });
            }

            const hashedPassword = await Bcrypt.hash(contraseña);

            const newUserId = await User.create({
                nombre,
                apellido,
                cedula,
                telefono,
                correo,
                contraseña: hashedPassword
            });

            res.status(201).json({
                message: "Usuario registrado",
                id: newUserId
            });

        } catch (error) {
            console.error("Error en registro:", error);
            res.status(500).json({ error: "Error en el servidor" });
        }
    },


    // Login
    async login(req, res) {
        try {
            const { correo, contraseña } = req.body;

            const user = await User.findByEmail(correo);
            if (!user) {
                return res.status(400).json({ error: "Credenciales inválidas" });
            }

            const valid = await Bcrypt.compare(contraseña, user.contraseña);
            if (!valid) {
                return res.status(400).json({ error: "Credenciales inválidas" });
            }

            const token = JWT.sign({
                id: user.id_usuario,
                correo: user.correo,
                rol: user.rol
            });

            res.json({
                token,
                user: {
                    id: user.id_usuario,
                    nombre: user.nombre,
                    apellido: user.apellido,
                    correo: user.correo,
                    rol: user.rol
                }
            });

        } catch (error) {
            console.error("Error en login:", error);
            res.status(500).json({ error: "Error en el servidor" });
        }
    }
};

module.exports = authController;
