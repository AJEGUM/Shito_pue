const db = require("../config/database");

class VentasController {
  async obtenerVentas(req, res) {
    try {
      const [rows] = await db.query(`
        SELECT 
          v.id_venta,
          u.nombre AS cliente,
          DATE_FORMAT(v.fecha, '%Y-%m-%d') AS fecha,
          v.direccion,
          v.metodo_pago,
          v.total
        FROM ventas v
        JOIN usuarios u ON v.id_cliente = u.id_usuario
        ORDER BY v.id_venta DESC
      `);

      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener ventas" });
    }
  }

  async crearVenta(req, res) {
    try {
      const { id_cliente, fecha, direccion, metodo_pago, total } = req.body;

      const [venta] = await db.query(
        `INSERT INTO ventas(id_cliente, fecha, direccion, metodo_pago, total)
         VALUES (?, ?, ?, ?, ?)`,
        [id_cliente, fecha, direccion, metodo_pago, total]
      );

      res.status(201).json({ id_venta: venta.insertId, ...req.body });
    } catch (error) {
      res.status(500).json({ error: "Error al crear venta" });
    }
  }

  async obtenerDetalle(req, res) {
    try {
      const { id_venta } = req.params;

      const [rows] = await db.query(
        `
        SELECT v.id_venta, v.fecha, u.nombre AS cliente,
               p.nombre_producto AS producto,
               dv.cantidad, dv.precio_unitario,
               (dv.cantidad * dv.precio_unitario) AS subtotal,
               v.total
        FROM ventas v
        JOIN usuarios u ON v.id_cliente = u.id_usuario
        JOIN detalle_ventas dv ON v.id_venta = dv.id_venta
        JOIN productos p ON dv.id_producto = p.id_producto
        WHERE v.id_venta = ?
      `,
        [id_venta]
      );

      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener detalle" });
    }
  }

 async crearVenta(req, res) {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        const { id_cliente, fecha, direccion, metodo_pago, total, detalles } = req.body;

        // Insertar venta
        const [venta] = await connection.query(
            `INSERT INTO ventas(id_cliente, fecha, direccion, metodo_pago, total)
             VALUES (?, ?, ?, ?, ?)`,
            [id_cliente, fecha, direccion, metodo_pago, total]
        );

        const id_venta = venta.insertId;

        // Insertar detalles + descontar stock
        for (const item of detalles) {

            // Insertar detalle
            await connection.query(
                `INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario)
                VALUES (?, ?, ?, ?)`,
                [id_venta, item.id_producto, item.cantidad, item.precio_unitario]
            );

            // 🔥 Descontar stock
            await connection.query(
                `UPDATE productos SET stock = stock - ? WHERE id_producto = ?`,
                [item.cantidad, item.id_producto]
            );

        }

        await connection.commit();

        res.status(201).json({
            mensaje: "Venta creada correctamente",
            id_venta
        });

    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ error: "Error al procesar la venta completa" });
    } finally {
        connection.release();
    }
}

}

module.exports = VentasController;
