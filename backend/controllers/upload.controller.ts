import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendSuccessResponse, sendErrorResponse } from '../utils/response.util';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

// Ensure base upload directory exists
const baseUploadDir = path.join(process.cwd(), 'uploads', 'audio');
if (!fs.existsSync(baseUploadDir)) {
  fs.mkdirSync(baseUploadDir, { recursive: true });
}
console.log('baseUploadDir:', baseUploadDir);

// Configure multer for audio file uploads
export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      // If this is a listening module upload, save in uploads/listening/<testId>
      const moduleType = req.body.moduleType || req.query.moduleType;
      if (moduleType === 'LISTENING') {
        const testId = req.body.testId || req.query.testId;
        if (!testId) {
          cb(new Error('Test ID is required for listening module uploads'), '');
          return;
        }
        const listeningDir = path.join(process.cwd(), 'uploads', 'listening', testId);
        if (!fs.existsSync(listeningDir)) {
          fs.mkdirSync(listeningDir, { recursive: true });
        }
        cb(null, listeningDir);
      } else {
        // Default: uploads/audio
        cb(null, baseUploadDir);
      }
    } catch (error) {
      cb(error as Error, '');
    }
  },
  filename: (req, file, cb) => {
    try {
      // Use the original filename if it starts with 'audio_' (our new naming convention)
      if (file.originalname.startsWith('audio_')) {
        cb(null, file.originalname);
      } else {
        // Generate a unique filename to prevent collisions
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `audio_${uniqueSuffix}${ext}`);
      }
    } catch (error) {
      cb(error as Error, '');
    }
  }
});

// File filter for audio files
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  try {
    const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only MP3, WAV, and OGG files are allowed.'));
    }
  } catch (error) {
    cb(error as Error);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Upload audio file
export const uploadAudio = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      sendErrorResponse(res, 'No file uploaded', 400);
      return;
    }
    
    // Only allow admins and content creators to upload files
    if (!req.user || !['ADMIN', 'SUPER_ADMIN', 'STUDY_MATERIAL_ADMIN'].includes(req.user.role)) {
      sendErrorResponse(res, 'Unauthorized', 403);
      return;
    }

    // Determine the correct relative path and URL
    let relativePath, fileUrl;
    const moduleType = req.body.moduleType || req.query.moduleType;
    if (moduleType === 'LISTENING') {
      const testId = req.body.testId || req.query.testId;
      if (!testId) {
        sendErrorResponse(res, 'Test ID is required for listening module uploads', 400);
        return;
      }
      relativePath = path.join('listening', testId, req.file.filename);
      fileUrl = `/uploads/${relativePath.replace(/\\/g, '/')}`;
    } else {
      relativePath = path.join('audio', req.file.filename);
      fileUrl = `/uploads/${relativePath.replace(/\\/g, '/')}`;
    }

    sendSuccessResponse(res, {
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
      path: relativePath.replace(/\\/g, '/')
    }, 'Audio file uploaded successfully');
  } catch (error) {
    console.error('Upload error:', error);
    sendErrorResponse(res, 'Error uploading audio file', 500, error);
  }
};

// Delete audio file
export const deleteAudio = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { path: filePath } = req.params;
    
    // Only allow admins and content creators to delete files
    if (!req.user || !['ADMIN', 'SUPER_ADMIN', 'STUDY_MATERIAL_ADMIN'].includes(req.user.role)) {
      sendErrorResponse(res, 'Unauthorized', 403);
      return;
    }

    const fullPath = path.join(process.cwd(), 'uploads', filePath);
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      sendErrorResponse(res, 'File not found', 404);
      return;
    }

    // Delete file
    fs.unlinkSync(fullPath);

    // Try to remove the directory if it's empty
    const dirPath = path.dirname(fullPath);
    if (fs.existsSync(dirPath) && fs.readdirSync(dirPath).length === 0) {
      fs.rmdirSync(dirPath);
    }

    sendSuccessResponse(res, null, 'Audio file deleted successfully');
  } catch (error) {
    console.error('Delete error:', error);
    sendErrorResponse(res, 'Error deleting audio file', 500, error);
  }
}; 