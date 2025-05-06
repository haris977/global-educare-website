import { Router } from 'express';
import { authMiddleware, checkRole } from '../middleware/auth.middleware';

// Import test management controllers
import {
  createTest,
  getAllTests,
  getTestById,
  updateTest,
  deleteTest,
  createSection,
  updateSection,
  deleteSection,
  createQuestion,
  updateQuestion,
  deleteQuestion
} from '../controllers/test.controller';

// Import test attempt controllers
import {
  startTestAttempt,
  saveTestProgress,
  getTestAttempt,
  submitTestAttempt,
  getUserTestHistory,
  updateResponseScoring
} from '../controllers/test-attempt.controller';

const router = Router();

// Define admin roles as a type-safe array
const adminRoles = ['ADMIN', 'SUPER_ADMIN', 'STUDY_MATERIAL_ADMIN'] as const;

// Test management routes
router.post('/', authMiddleware as any, checkRole(adminRoles) as any, createTest as any);
router.get('/', getAllTests as any);
router.get('/:id', getTestById as any);
router.put('/:id', authMiddleware as any, checkRole(adminRoles) as any, updateTest as any);
router.delete('/:id', authMiddleware as any, checkRole(adminRoles) as any, deleteTest as any);

// Section management routes
router.post('/:testId/sections', authMiddleware as any, checkRole(adminRoles) as any, createSection as any);
router.put('/sections/:id', authMiddleware as any, checkRole(adminRoles) as any, updateSection as any);
router.delete('/sections/:id', authMiddleware as any, checkRole(adminRoles) as any, deleteSection as any);

// Question management routes
router.post('/sections/:sectionId/questions', authMiddleware as any, checkRole(adminRoles) as any, createQuestion as any);
router.put('/questions/:id', authMiddleware as any, checkRole(adminRoles) as any, updateQuestion as any);
router.delete('/questions/:id', authMiddleware as any, checkRole(adminRoles) as any, deleteQuestion as any);

// Test attempt routes
router.post('/:testId/attempts', authMiddleware as any, startTestAttempt as any);
router.get('/attempts/:attemptId', authMiddleware as any, getTestAttempt as any);
router.post('/attempts/:attemptId/save', authMiddleware as any, saveTestProgress as any);
router.post('/attempts/:attemptId/submit', authMiddleware as any, submitTestAttempt as any);
router.get('/history', authMiddleware as any, getUserTestHistory as any);

// Response scoring routes (admin only)
router.put('/responses/:responseId/score', 
  authMiddleware as any, 
  checkRole(['ADMIN', 'SUPER_ADMIN', 'DOUBTS_SOLVING_ADMIN'] as const) as any, 
  updateResponseScoring as any
);

export default router; 