const express = require('express');
const cors = require('cors');
const chatbotRoutes = require('./routes/chatbot');

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://safefish.vercel.app',
  'https://safefish-public.vercel.app'
];


app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log('❌ Blocked by CORS:', origin);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use('/api', chatbotRoutes);

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

app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: 'The requested endpoint does not exist'
  });
});

app.use((err, req, res, next) => {
  console.error('Global error:', err.message);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message || 'Something went wrong'
  });
});

app.listen(PORT, () => {
  console.log(`✅ SafeFish backend running on port ${PORT}`);
});

module.exports = app;
