-- Esquema de Base de Datos SQL para el Sistema POS ALIRU
-- Este es un ejemplo conceptual de cómo se estructurarían las tablas en una base de datos relacional como MySQL.

-- Tabla para perfiles de usuario y roles
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    display_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Administrador', 'Supervisor', 'Cajero') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla para categorías de productos
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para proveedores
CREATE TABLE suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    rfc VARCHAR(13),
    contact_name VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla para los productos
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(13) UNIQUE,
    name VARCHAR(255) NOT NULL,
    status ENUM('Activo', 'Borrador', 'Archivado') NOT NULL DEFAULT 'Activo',
    purchase_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    discount DECIMAL(5, 2) NOT NULL DEFAULT 0.00, -- Descuento sobre el precio de compra
    profit_margin DECIMAL(5, 2) NOT NULL DEFAULT 0.00, -- Porcentaje de ganancia
    final_price DECIMAL(10, 2) NOT NULL, -- Precio de venta final
    stock INT NOT NULL DEFAULT 0,
    image_url TEXT,
    category_id INT,
    supplier_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL
);

-- Tabla para clientes
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    rfc VARCHAR(13),
    postal_code VARCHAR(10),
    cfdi_use VARCHAR(5),
    tax_regime VARCHAR(5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla para registrar las ventas
CREATE TABLE sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sale_id VARCHAR(255) NOT NULL UNIQUE, -- Folio legible (ej. ALIRU-12345)
    total DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    returned BOOLEAN DEFAULT FALSE,
    user_id VARCHAR(255) NOT NULL,
    customer_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
);

-- Tabla de detalle de ventas (relaciona ventas y productos)
CREATE TABLE sale_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sale_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price_at_sale DECIMAL(10, 2) NOT NULL, -- Precio unitario final al momento de la venta
    discount_at_sale DECIMAL(5, 2) DEFAULT 0.00, -- Descuento porcentual aplicado
    FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

-- Tabla para sesiones de caja
CREATE TABLE cash_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    status ENUM('abierta', 'cerrada') NOT NULL,
    opening_balance DECIMAL(10, 2) NOT NULL,
    closing_balance DECIMAL(10, 2),
    expected_balance DECIMAL(10, 2),
    cash_sales DECIMAL(10, 2) DEFAULT 0.00,
    difference DECIMAL(10, 2),
    opened_at TIMESTAMP NOT NULL,
    closed_at TIMESTAMP,
    user_id VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabla para la configuración de la empresa (debería tener solo una fila)
CREATE TABLE company_profile (
    id INT PRIMARY KEY DEFAULT 1,
    name VARCHAR(255),
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    fiscal_id VARCHAR(13),
    receipt_footer_message TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT pk_single_row CHECK (id = 1)
);
