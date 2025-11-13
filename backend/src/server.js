import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database.js';
import { isFirebaseInitialized } from './config/firebase.js'; // Initialize Firebase Admin (optional)
import studyRoutes from './routes/studyRoutes.js';
import authRoutes from './routes/authRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import firebaseAuthRoutes from './routes/firebaseAuthRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
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

// Firebase routes (only if Firebase is initialized)
if (isFirebaseInitialized()) {
  app.use('/api/firebase', firebaseAuthRoutes);
  console.log('✅ Firebase auth routes enabled');
} else {
  console.log('⚠️  Firebase auth routes disabled (Firebase not configured)');
}

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
    // MongoDB connection is optional - server can run without it
    try {
      await connectDatabase();
    } catch (dbError) {
      console.warn('⚠️  MongoDB connection failed, continuing without database:', dbError.message);
      console.log('   Study features will work, but history/auth features may be limited');
    }
    
    // Bind to 0.0.0.0 to allow external connections (required for Render)
    const HOST = process.env.HOST || '0.0.0.0';
    
    app.listen(PORT, HOST, () => {
      console.log(`🚀 Server running on ${HOST}:${PORT}`);
      console.log(`📚 Study endpoint: http://${HOST}:${PORT}/study?topic=YourTopic`);
      console.log(`🔐 Auth endpoints: http://${HOST}:${PORT}/api/auth/signup | /api/auth/login`);
      console.log(`🏥 Health check: http://${HOST}:${PORT}/health`);
      
      if (!isFirebaseInitialized()) {
        console.log('⚠️  Firebase not configured - some features may be unavailable');
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

