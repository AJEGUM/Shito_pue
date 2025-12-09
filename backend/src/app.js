require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get('/', (req, res) => res.send('API funcionando ✔'));

// Rutas
app.use("/api/auth", require("./routes/auth.routes"));
app.use('/api/usuarios', require('./routes/usuario.routes'));
app.use('/api/productos', require('./routes/productos.routes'));
app.use('/api/ventas', require('./routes/ventas.routes'));
app.use('/api/detalle-ventas', require('./routes/detalleVentas.routes'));

module.exports = app;
