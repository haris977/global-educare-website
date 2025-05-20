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
  deleteQuestion,
  createCompleteIELTSTest
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

// Test management routes - TEMPORARILY REMOVED AUTH FOR TESTING
router.post('/', createTest as any); // TEMPORARILY REMOVED AUTH FOR TESTING
router.get('/', getAllTests as any); // No auth for listing tests (read only)
router.get('/:id', getTestById as any); // No auth for viewing a single test (read only)
router.put('/:id', updateTest as any); // TEMPORARILY REMOVED AUTH FOR TESTING
router.delete('/:id', deleteTest as any); // TEMPORARILY REMOVED AUTH FOR TESTING

// IELTS Complete Test creation endpoint
router.post('/ielts/complete', createCompleteIELTSTest as any); // TEMPORARILY REMOVED AUTH FOR TESTING

// Section management routes
router.post('/:testId/sections', authMiddleware as any, checkRole(adminRoles) as any, createSection as any);
router.put('/sections/:id', authMiddleware as any, checkRole(adminRoles) as any, updateSection as any);
router.delete('/sections/:id', authMiddleware as any, checkRole(adminRoles) as any, deleteSection as any);

// Question management routes
router.post('/sections/:sectionId/questions', createQuestion as any); // TEMPORARILY REMOVED AUTH FOR TESTING
router.put('/questions/:id', updateQuestion as any); // TEMPORARILY REMOVED AUTH FOR TESTING
router.delete('/questions/:id', deleteQuestion as any); // TEMPORARILY REMOVED AUTH FOR TESTING

// Test attempt routes
router.post('/:testId/attempts', startTestAttempt as any);
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