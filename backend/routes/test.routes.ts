import { Router } from 'express';
import { authenticateToken, checkRole } from '../middleware/auth.middleware';

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

// Section management routes - TEMPORARILY REMOVED AUTH FOR TESTING
router.post('/:testId/sections', createSection as any); // TEMPORARILY REMOVED AUTH FOR TESTING
router.put('/sections/:id', updateSection as any); // TEMPORARILY REMOVED AUTH FOR TESTING
router.delete('/sections/:id', deleteSection as any); // TEMPORARILY REMOVED AUTH FOR TESTING

// Question management routes
router.post('/sections/:sectionId/questions', createQuestion as any); // TEMPORARILY REMOVED AUTH FOR TESTING
router.put('/questions/:id', updateQuestion as any); // TEMPORARILY REMOVED AUTH FOR TESTING
router.delete('/questions/:id', deleteQuestion as any); // TEMPORARILY REMOVED AUTH FOR TESTING

// Test attempt routes
router.post('/:testId/attempts', startTestAttempt as any); // No auth for starting test attempts
router.get('/attempts/:attemptId', getTestAttempt as any); // No auth for accessing test attempts
router.post('/attempts/:attemptId/save', saveTestProgress as any); // No auth for saving progress
router.post('/attempts/:attemptId/submit', submitTestAttempt as any); // No auth for submitting tests
router.get('/history', authenticateToken as any, getUserTestHistory as any);

// Response scoring routes (admin only)
router.put('/responses/:responseId/score', 
  authenticateToken as any, 
  checkRole(['ADMIN', 'SUPER_ADMIN', 'DOUBTS_SOLVING_ADMIN'] as const) as any, 
  updateResponseScoring as any
);

export default router; 