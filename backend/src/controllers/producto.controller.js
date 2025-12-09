const db = require("../config/database");
const ImagenesController = require("./imagenes.controller");

class ProductosController {

    async obtenerProductos(req, res) {
        try {
            const [rows] = await db.query("SELECT * FROM productos ORDER BY id_producto DESC");
            return res.json(rows);
        } catch (error) {
            console.error("Error al obtener productos:", error);
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async crearProducto(req, res) {
        try {
            const { imagen, ...datos } = req.body;

            // 1. Crear producto sin imagen
            const [result] = await db.query(
                "INSERT INTO productos SET ?",
                [datos]
            );

            const id = result.insertId;

            // 2. Si viene imagen base64, guardarla
            if (imagen) {
                await ImagenesController.guardarImagen(
                    "productos",
                    "id_producto",
                    id,
                    imagen
                );
            }

            return res.status(201).json({
                message: "Producto creado correctamente",
                id_producto: id
            });

        } catch (error) {
            console.error("Error al crear producto:", error);
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async actualizarProducto(req, res) {
        try {
            const { id } = req.params;
            const { imagen, ...datos } = req.body;

            // 1. Actualizar el producto sin imagen
            await db.query(
                "UPDATE productos SET ? WHERE id_producto = ?",
                [datos, id]
            );

            // 2. Si envió imagen base64 → actualizarla
            if (imagen) {
                await ImagenesController.guardarImagen(
                    "productos",
                    "id_producto",
                    id,
                    imagen
                );
            }

            return res.json({
                message: "Producto actualizado correctamente",
                id_producto: id
            });

        } catch (error) {
            console.error("Error al actualizar producto:", error);
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async eliminarProducto(req, res) {
        try {
            const { id } = req.params;

            await db.query("DELETE FROM productos WHERE id_producto = ?", [id]);

            return res.json({ message: "Producto eliminado correctamente" });

        } catch (error) {
            console.error("Error al eliminar producto:", error);
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}

module.exports = ProductosController;
