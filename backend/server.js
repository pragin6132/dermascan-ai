import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';

import connectDB from './config/db.js';
import protect from './middleware/authMiddleware.js';
import { signupUser, loginUser, getUserProfile } from './controllers/authController.js';
import { analyzeImage, getScanHistory, getScanDetails, deleteScan } from './controllers/scanController.js';

// Load environmental parameters
dotenv.config();

// Establish connection to MongoDB (automatically handles offline fallback)
connectDB();

const app = express();

// Standard middlewares
app.use(cors({
  origin: '*', // Allows access from any port (e.g. React frontend on 5173 or 3000)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' })); // support large Base64 payload loads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Set up Multer for handling file buffers in memory
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // Max 8MB file size
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only skin image assets are allowed!'), false);
    }
  }
});

// --- API Router Bindings ---

// Health & Status Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date(),
    service: 'DermaScan AI Diagnosis Engine',
    database: global.isMockDB ? 'Offline Demo Mode (In-Memory DB)' : 'Connected (MongoDB)'
  });
});

// Authentication Routes
app.post('/api/auth/signup', signupUser);
app.post('/api/auth/login', loginUser);
app.get('/api/auth/profile', protect, getUserProfile);

// Scan Classification & History Routes
app.post('/api/scans/analyze', protect, upload.single('image'), analyzeImage);
app.get('/api/scans/history', protect, getScanHistory);
app.get('/api/scans/:id', protect, getScanDetails);
app.delete('/api/scans/:id', protect, deleteScan);

// Handle undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Requested endpoint does not exist.' });
});

// Central Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err.message);
  res.status(err.status || 500).json({
    message: err.message || 'An internal server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 DermaScan AI Server running on PORT: ${PORT}`);
  console.log(`🩺 Mode: ${process.env.NODE_ENV}`);
  console.log(`🔗 Healthcheck: http://localhost:${PORT}/api/health`);
  console.log(`======================================================\n`);
});
