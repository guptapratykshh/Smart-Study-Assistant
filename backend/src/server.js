import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database.js';
import './config/firebase.js'; // Initialize Firebase Admin
import studyRoutes from './routes/studyRoutes.js';
import authRoutes from './routes/authRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import firebaseAuthRoutes from './routes/firebaseAuthRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// CORS Configuration - Allow multiple origins (localhost for dev, deployed frontends)
const allowedOrigins = [
  'http://localhost:3001',
  'http://localhost:3000',
  'https://smart-study-assistantt.netlify.app',
  'https://smart-study-assistant.netlify.app',
  'https://smart-study-assistant-smc5.vercel.app',
  process.env.FRONTEND_URL,
  process.env.VERCEL_URL,
  process.env.NETLIFY_URL
].filter(Boolean); // Remove undefined values

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // For development, allow localhost on any port
      if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        callback(null, true);
      } else {
        console.warn(`⚠️ CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Smart Study Assistant API',
    version: '1.0.0',
    endpoints: {
      study: '/study?topic=<topic>&mode=<normal|math>',
      health: '/health'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/study', studyRoutes);
app.use('/api/auth', authRoutes); // Keep MongoDB auth for backward compatibility
app.use('/api/firebase', firebaseAuthRoutes); // Firebase auth routes
app.use('/api/history', historyRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: true,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: true,
    message: 'Endpoint not found'
  });
});

// Connect to MongoDB and start server
async function startServer() {
  try {
    await connectDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      // Only show localhost URLs if running locally (not on Render/other cloud)
      if (process.env.RENDER || process.env.VERCEL || process.env.RAILWAY_ENVIRONMENT) {
        console.log(`🌐 Server deployed and accessible via configured domain`);
      } else {
        console.log(`📚 Study endpoint: http://localhost:${PORT}/study?topic=YourTopic`);
        console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth/signup | /api/auth/login`);
        console.log(`🏥 Health check: http://localhost:${PORT}/health`);
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

