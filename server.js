const express = require('express');
const cors = require('cors');
const chatbotRoutes = require('./routes/chatbot');

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ CORS configuration
const allowedOrigins = [
  'http://localhost:5173',                   // Svelte dev
  'http://localhost:3000',                   // Alt dev
  'https://safefish-public-metc92hmg-sudharsanamrks-projects.vercel.app'  // ✅ Your Vercel frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS not allowed from this origin: ' + origin));
    }
  },
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api', chatbotRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'SafeFish Chatbot API',
    version: '1.0.0',
    endpoints: {
      'POST /api/chat': 'Send a message to the chatbot',
      'GET /api/categories': 'Get available knowledge categories',
      'GET /api/health': 'Health check endpoint'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: 'The requested endpoint does not exist'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err.message);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message || 'Something went wrong on our end'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🐟 SafeFish API running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🤖 Chat endpoint: http://localhost:${PORT}/api/chat`);
});

module.exports = app;
