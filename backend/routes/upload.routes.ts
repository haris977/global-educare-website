import express from 'express';
import multer from 'multer';
import { authenticateToken } from '../middleware/auth.middleware';
import { checkRole } from '../middleware/role.middleware';
import { uploadAudio, deleteAudio, storage } from '../controllers/upload.controller';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), 'uploads', 'listening');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Upload audio file route
router.post('/audio', 
  authenticateToken,
  checkRole(['ADMIN']),
  (req, res, next) => {
    console.log('Received upload request');
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);
    
    // Create multer instance for this request
    const upload = multer({
      storage,
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('audio/')) {
          cb(null, true);
        } else {
          cb(new Error('Only audio files are allowed'));
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
      }
    }).single('audio');
    
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        console.error('Multer error:', err);
        return res.status(400).json({ success: false, message: err.message });
      } else if (err) {
        console.error('Upload error:', err);
        return res.status(400).json({ success: false, message: err.message });
      }
      
      if (!req.file) {
        console.error('No file uploaded');
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }
      
      console.log('File uploaded successfully:', req.file);
      next();
    });
  },
  uploadAudio
);

// Delete audio file route
router.delete(
  '/audio/:path(*)',
  authenticateToken,
  checkRole(['ADMIN', 'SUPER_ADMIN', 'STUDY_MATERIAL_ADMIN']),
  deleteAudio
);

export default router; 