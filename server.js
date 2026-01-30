const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(express.json());

// Conexión a la base de datos de Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Ruta para probar si el servidor y la base de datos se hablan
app.get('/prueba', async (req, res) => {
  try {
    const resDB = await pool.query('SELECT NOW()');
    res.json({ 
      mensaje: "¡Servidor y Neon conectados con éxito! 🚀", 
      hora_en_neon: resDB.rows[0].now 
    });
  } catch (err) {
    res.status(500).json({ error: "Error de conexión", detalle: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor encendido en http://localhost:${PORT}`);
  console.log(`🔗 Prueba la conexión en: http://localhost:${PORT}/prueba`);
});

// Ruta para registrar un nuevo cliente (Ajustada a tu base de datos)
app.post('/registrar', async (req, res) => {
    // Extraemos 'localidad' que es como se llama en tu tabla
    const { nombre, dni, localidad } = req.body; 

    try {
        // La consulta SQL ahora usa los nombres exactos de tus columnas
        const query = 'INSERT INTO clientes (nombre, dni, localidad) VALUES ($1, $2, $3) RETURNING *';
        const values = [nombre, dni, localidad];
        
        const result = await pool.query(query, values);
        
        res.status(201).json({
            mensaje: "Cliente registrado con éxito",
            cliente: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al registrar cliente", detalle: err.message });
    }
});