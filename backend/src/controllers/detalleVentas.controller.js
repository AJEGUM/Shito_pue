const db = require("../config/database");

class DetalleVentasController {

  async obtenerDetalles(req, res) {
    try {
      const [rows] = await db.query("SELECT * FROM detalle_ventas");
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener detalles" });
    }
  }

}

module.exports = DetalleVentasController;
