-- Script para crear la tabla de clientes
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,           -- Identificador único automático
    nombre VARCHAR(100) NOT NULL,    -- Nombre completo del cliente
    dni VARCHAR(20) UNIQUE NOT NULL, -- DNI (usamos VARCHAR por si tiene puntos o guiones)
    localidad VARCHAR(100),          -- Localidad del cliente
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Fecha en que se guarda
);