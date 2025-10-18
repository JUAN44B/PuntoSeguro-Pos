-- Diseño de la Base de Datos para el Sistema POS "ALIRU"
-- Versión: 1.0
-- Este script SQL está diseñado para una base de datos relacional como MySQL o PostgreSQL.

-- Tabla de Usuarios
-- Almacena la información de los empleados que pueden acceder al sistema.
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uid VARCHAR(255) NOT NULL UNIQUE, -- ID único de Firebase Authentication
    nombre_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    rol ENUM('Administrador', 'Supervisor', 'Cajero') NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
);

-- Tabla de Categorías de Productos
-- Organiza los productos en diferentes categorías.
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Proveedores
-- Almacena la información de contacto y fiscal de los proveedores.
CREATE TABLE proveedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    nombre_contacto VARCHAR(255),
    telefono VARCHAR(20),
    email VARCHAR(255),
    direccion TEXT,
    rfc VARCHAR(13) UNIQUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Productos
-- Contiene el catálogo completo de productos.
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    estado ENUM('Activo', 'Borrador', 'Archivado') NOT NULL DEFAULT 'Activo',
    precio_compra DECIMAL(10, 2) NOT NULL,
    margen_ganancia DECIMAL(5, 2) NOT NULL,
    precio_final DECIMAL(10, 2) NOT NULL,
    existencia INT NOT NULL DEFAULT 0,
    url_imagen VARCHAR(2048),
    categoria_id INT,
    proveedor_id INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE SET NULL
);

-- Tabla de Clientes
-- Almacena información de contacto y fiscal de los clientes.
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(255),
    direccion TEXT,
    rfc VARCHAR(13) UNIQUE,
    codigo_postal VARCHAR(10),
    uso_cfdi VARCHAR(5),
    regimen_fiscal VARCHAR(5),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Ventas
-- Registra cada transacción realizada.
CREATE TABLE ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    folio_venta VARCHAR(50) NOT NULL UNIQUE,
    fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subtotal DECIMAL(10, 2) NOT NULL,
    iva DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL,
    estado ENUM('Completada', 'Cancelada', 'Devolucion') DEFAULT 'Completada',
    monto_recibido DECIMAL(10, 2),
    cambio DECIMAL(10, 2),
    usuario_id INT NOT NULL,
    cliente_id INT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL
);

-- Tabla de Items de Venta (Tabla de enlace)
-- Detalla los productos incluidos en cada venta.
CREATE TABLE items_venta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL, -- Precio final al momento de la venta
    descuento_porcentaje DECIMAL(5, 2) DEFAULT 0.00,
    subtotal_item DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Tabla de Sesiones de Caja
-- Registra la apertura y cierre de caja.
CREATE TABLE sesiones_caja (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    fecha_apertura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_cierre TIMESTAMP,
    monto_inicial DECIMAL(10, 2) NOT NULL,
    monto_esperado DECIMAL(10, 2),
    monto_final_contado DECIMAL(10, 2),
    diferencia DECIMAL(10, 2),
    ventas_efectivo DECIMAL(10, 2) DEFAULT 0.00,
    estado ENUM('Abierta', 'Cerrada') NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabla de Devoluciones
-- Registra las devoluciones asociadas a una venta.
CREATE TABLE devoluciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT NOT NULL,
    fecha_devolucion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id INT NOT NULL,
    monto_devolucion DECIMAL(10, 2) NOT NULL,
    motivo TEXT,
    FOREIGN KEY (venta_id) REFERENCES ventas(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabla de Items de Devolución (Tabla de enlace)
-- Detalla los productos devueltos en cada devolución.
CREATE TABLE items_devolucion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    devolucion_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    FOREIGN KEY (devolucion_id) REFERENCES devoluciones(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Índices para mejorar el rendimiento de las búsquedas comunes.
CREATE INDEX idx_productos_nombre ON productos(nombre);
CREATE INDEX idx_productos_codigo ON productos(codigo);
CREATE INDEX idx_ventas_fecha ON ventas(fecha_venta);
CREATE INDEX idx_clientes_nombre ON clientes(nombre);
CREATE INDEX idx_clientes_rfc ON clientes(rfc);
CREATE INDEX idx_proveedores_nombre ON proveedores(nombre);
