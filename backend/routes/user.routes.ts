import { Router } from 'express';
import {
  createUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/user.controller';
import { authMiddleware, checkRole } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/register', createUser as any);
router.post('/login', loginUser as any);

// Protected routes
router.get('/', authMiddleware as any, checkRole(['admin']) as any, getAllUsers as any);
router.get('/:id', authMiddleware as any, getUserById as any);
router.put('/:id', authMiddleware as any, updateUser as any);
router.delete('/:id', authMiddleware as any, deleteUser as any);

export default router; 