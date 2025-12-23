/**
 * Hostinger Compatible Express Server
 * Features: MySQL connection, Messages API, Health check
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from client build (for production)
app.use(express.static(path.join(__dirname, '../client/dist')));

// Database connection pool
let pool = null;
let dbConnected = false;

async function initDatabase() {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'test_db',
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Test connection
    const connection = await pool.getConnection();
    console.log('✅ MySQL connected successfully');
    
    // Create messages table if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Messages table ready');
    
    connection.release();
    dbConnected = true;
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    dbConnected = false;
    // Don't crash - allow server to start without DB
  }
}

// ==================== API ROUTES ====================

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'SERVER ALIVE',
    timestamp: new Date().toISOString(),
    database: dbConnected ? 'connected' : 'disconnected'
  });
});

// Database Test Endpoint
app.get('/api/db-test', async (req, res) => {
  try {
    if (!pool) {
      return res.status(503).json({ 
        success: false, 
        message: 'Database not configured' 
      });
    }
    
    const [rows] = await pool.query('SELECT 1 as test');
    res.json({ 
      success: true, 
      message: 'Database connected successfully!',
      data: rows
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Database connection failed: ' + error.message 
    });
  }
});

// Get all messages
app.get('/api/messages', async (req, res) => {
  try {
    if (!pool || !dbConnected) {
      return res.status(503).json({ 
        success: false, 
        message: 'Database not available' 
      });
    }
    
    const [rows] = await pool.query(
      'SELECT * FROM messages ORDER BY created_at DESC LIMIT 50'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch messages: ' + error.message 
    });
  }
});

// Create new message
app.post('/api/messages', async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content || content.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: 'Message content is required' 
      });
    }
    
    if (!pool || !dbConnected) {
      return res.status(503).json({ 
        success: false, 
        message: 'Database not available' 
      });
    }
    
    const [result] = await pool.query(
      'INSERT INTO messages (content) VALUES (?)',
      [content.trim()]
    );
    
    const [newMessage] = await pool.query(
      'SELECT * FROM messages WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'Message saved successfully!',
      data: newMessage[0]
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to save message: ' + error.message 
    });
  }
});

// Delete a message
app.delete('/api/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!pool || !dbConnected) {
      return res.status(503).json({ 
        success: false, 
        message: 'Database not available' 
      });
    }
    
    await pool.query('DELETE FROM messages WHERE id = ?', [id]);
    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete message: ' + error.message 
    });
  }
});

// Catch-all for SPA (send index.html for any unmatched routes)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// ==================== START SERVER ====================

async function startServer() {
  await initDatabase();
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔════════════════════════════════════════════╗
║     🚀 HOSTINGER TEST SERVER RUNNING       ║
╠════════════════════════════════════════════╣
║  Port: ${PORT}                               
║  Health: http://localhost:${PORT}/health     
║  Database: ${dbConnected ? '✅ Connected' : '❌ Not Connected'}        
╚════════════════════════════════════════════╝
    `);
  });
}

startServer();
