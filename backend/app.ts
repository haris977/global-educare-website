import express from 'express';
import cors from 'cors';
import uploadRoutes from './routes/upload.routes';
import testRoutes from './routes/test.routes';

const app = express();

// Enable CORS for all routes
app.use(cors());

// Use express.json() for all routes except /api/upload (which handles multipart/form-data)
app.use((req, res, next) => {
  if (!req.path.startsWith('/api/upload')) {
    express.json()(req, res, next);
  } else {
    next();
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Static file serving for uploaded audio
app.use('/uploads', express.static('uploads'));

// Listening section upload route - mount at /api/upload to match frontend
app.use('/api/upload', uploadRoutes);

// Test routes - mount at /api/tests to match frontend
app.use('/api/tests', testRoutes);

export default app; 