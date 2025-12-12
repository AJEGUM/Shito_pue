CREATE DATABASE bikestore_marlon;
USE bikestore_marlon;

-- TABLA USUARIOS
CREATE TABLE usuarios(
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50),
    apellido VARCHAR(50),
    cedula VARCHAR(20),
    telefono VARCHAR(20),
    correo VARCHAR(225),
    rol ENUM('Cliente', 'Administrador') DEFAULT 'Cliente',
    contraseña VARCHAR(255)
);

-- TABLA PRODUCTOS
CREATE TABLE productos(
    id_producto INT PRIMARY KEY AUTO_INCREMENT,
    nombre_producto VARCHAR(225),
    precio_producto DECIMAL(10,2),
    descripcion_producto VARCHAR(225),
    imagen LONGTEXT,
    nombre_categoria ENUM('Bicicletas', 'Accesorios', 'Repuestos'),
    stock INT DEFAULT 0
);

-- TABLA VENTAS
CREATE TABLE ventas(
    id_venta INT PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT,
    fecha DATE,
    direccion VARCHAR(255),
    metodo_pago ENUM('Efectivo', 'Tarjeta'),
    total DECIMAL(18,2),
    FOREIGN KEY(id_cliente) REFERENCES usuarios(id_usuario)
);

-- TABLA DETALLE DE VENTAS
CREATE TABLE detalle_ventas(
    id_detalle_venta INT PRIMARY KEY AUTO_INCREMENT,
    id_venta INT,
    id_producto INT,
    cantidad INT,
    precio_unitario DECIMAL(18,2),
    FOREIGN KEY(id_venta) REFERENCES ventas(id_venta),
    FOREIGN KEY(id_producto) REFERENCES productos(id_producto)
);
