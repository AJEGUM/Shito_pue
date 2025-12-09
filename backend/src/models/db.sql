create database bikestore_marlon;
use bikestore_marlon;

create table usuarios(
	id_usuario int primary key auto_increment,
    nombre varchar(50),
    apellido varchar(50),
	cedula varchar(20),
    telefono varchar(20),
    correo varchar(225),
	rol enum("Cliente", "Administrador") default "cliente",
    contraseña varchar(255)
);

create table productos(
	id_producto int primary key auto_increment,
    nombre_producto varchar(225),
	precio_producto DECIMAL(10,2),
    descripcion_producto varchar(225),
	imagen LONGTEXT,
    nombre_categoria enum("Bicicletas", "Accesorios", "Repuestos"),
    entradas int,
    salidas int default 0,
	stock INT AS (entradas - salidas) VIRTUAL
    );

create table ventas(
	id_venta int primary key auto_increment,
    id_cliente int, 
    fecha date,
    direccion varchar(255),
    metodo_pago enum("Efectivo", "Tarjeta"),
	total Decimal(18),
    foreign key(id_cliente) references usuarios(id_usuario)
);

create table detalle_ventas(
	id_detalle_venta int primary key auto_increment,
    id_venta int,
    id_producto int,
    foreign key(id_venta) references ventas(id_venta), 
    foreign key(id_producto) references productos(id_producto),
    cantidad int,
	precio_unitario Decimal (18)
);

-- Parte 2: Insertar bicicletas

SELECT id_producto, nombre_producto, precio_producto, nombre_categoria FROM productos ORDER BY id_producto;

USE bikestore_marlon;
SELECT * FROM usuarios;

-- Ver todo el detalle de una venta específica
SELECT 
    v.id_venta,
    v.fecha,
    u.nombre as cliente,
    p.nombre_producto as producto,
    dv.cantidad,
    dv.precio_unitario,
    (dv.cantidad * dv.precio_unitario) as subtotal,
    v.total
FROM ventas v
JOIN usuarios u ON v.id_cliente = u.id_usuario
JOIN detalle_ventas dv ON v.id_venta = dv.id_venta
JOIN productos p ON dv.id_producto = p.id_producto
ORDER BY v.id_venta DESC;