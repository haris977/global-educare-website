import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendSuccessResponse, sendErrorResponse } from '../utils/response.util';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

/**
 * Test Management Controllers
 */

// Create a new test
export const createTest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { 
      title, 
      description, 
      difficulty, 
      moduleType, 
      totalTime, 
      totalMarks,
      isPublished
    } = req.body;

    // Only allow admins and content creators to create tests
    if (!req.user || !['ADMIN', 'SUPER_ADMIN', 'STUDY_MATERIAL_ADMIN'].includes(req.user.role)) {
      return sendErrorResponse(res, 'Unauthorized', 403);
    }

    const test = await prisma.test.create({
      data: {
        title,
        description,
        difficulty,
        moduleType,
        totalTime,
        totalQuestions: 0, // Will be updated as questions are added
        totalMarks,
        isPublished: isPublished || false
      }
    });

    return sendSuccessResponse(res, test, 'Test created successfully', 201);
  } catch (error) {
    return sendErrorResponse(res, 'Error creating test', 500, error);
  }
};

// Get all tests
export const getAllTests = async (req: Request, res: Response) => {
  try {
    const { moduleType, difficulty, isPublished } = req.query;
    
    // Build filter conditions
    const whereClause: any = {};
    
    if (moduleType) {
      whereClause.moduleType = moduleType;
    }
    
    if (difficulty) {
      whereClause.difficulty = difficulty;
    }
    
    if (isPublished !== undefined) {
      whereClause.isPublished = isPublished === 'true';
    }
    
    const tests = await prisma.test.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            sections: true,
            attempts: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return sendSuccessResponse(res, tests, 'Tests retrieved successfully');
  } catch (error) {
    return sendErrorResponse(res, 'Error retrieving tests', 500, error);
  }
};

// Get test by ID
export const getTestById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const test = await prisma.test.findUnique({
      where: { id },
      include: {
        sections: {
          include: {
            questions: true
          },
          orderBy: {
            order: 'asc'
          }
        },
        _count: {
          select: {
            attempts: true
          }
        }
      }
    });

    if (!test) {
      return sendErrorResponse(res, 'Test not found', 404);
    }

    return sendSuccessResponse(res, test, 'Test retrieved successfully');
  } catch (error) {
    return sendErrorResponse(res, 'Error retrieving test', 500, error);
  }
};

// Update test
export const updateTest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      description, 
      difficulty, 
      moduleType, 
      totalTime, 
      totalMarks,
      isPublished
    } = req.body;

    // Only allow admins and content creators to update tests
    if (!req.user || !['ADMIN', 'SUPER_ADMIN', 'STUDY_MATERIAL_ADMIN'].includes(req.user.role)) {
      return sendErrorResponse(res, 'Unauthorized', 403);
    }

    const test = await prisma.test.findUnique({
      where: { id }
    });

    if (!test) {
      return sendErrorResponse(res, 'Test not found', 404);
    }

    const updatedTest = await prisma.test.update({
      where: { id },
      data: {
        title,
        description,
        difficulty,
        moduleType,
        totalTime,
        totalMarks,
        isPublished
      }
    });

    return sendSuccessResponse(res, updatedTest, 'Test updated successfully');
  } catch (error) {
    return sendErrorResponse(res, 'Error updating test', 500, error);
  }
};

// Delete test
export const deleteTest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Only allow admins and content creators to delete tests
    if (!req.user || !['ADMIN', 'SUPER_ADMIN', 'STUDY_MATERIAL_ADMIN'].includes(req.user.role)) {
      return sendErrorResponse(res, 'Unauthorized', 403);
    }

    const test = await prisma.test.findUnique({
      where: { id },
      include: {
        attempts: true
      }
    });

    if (!test) {
      return sendErrorResponse(res, 'Test not found', 404);
    }

    // Check if test has been attempted, if so don't allow deletion
    if (test.attempts.length > 0) {
      return sendErrorResponse(res, 'Cannot delete test with existing attempts', 400);
    }

    await prisma.test.delete({
      where: { id }
    });

    return sendSuccessResponse(res, null, 'Test deleted successfully');
  } catch (error) {
    return sendErrorResponse(res, 'Error deleting test', 500, error);
  }
};

/**
 * Section Management Controllers
 */

// Create a new section
export const createSection = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { testId } = req.params;
    const { title, instructions, order, timeLimit } = req.body;

    // Only allow admins and content creators to create sections
    if (!req.user || !['ADMIN', 'SUPER_ADMIN', 'STUDY_MATERIAL_ADMIN'].includes(req.user.role)) {
      return sendErrorResponse(res, 'Unauthorized', 403);
    }

    // Check if test exists
    const test = await prisma.test.findUnique({
      where: { id: testId }
    });

    if (!test) {
      return sendErrorResponse(res, 'Test not found', 404);
    }

    const section = await prisma.section.create({
      data: {
        testId,
        title,
        instructions,
        order,
        timeLimit
      }
    });

    return sendSuccessResponse(res, section, 'Section created successfully', 201);
  } catch (error) {
    return sendErrorResponse(res, 'Error creating section', 500, error);
  }
};

// Update section
export const updateSection = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, instructions, order, timeLimit } = req.body;

    // Only allow admins and content creators to update sections
    if (!req.user || !['ADMIN', 'SUPER_ADMIN', 'STUDY_MATERIAL_ADMIN'].includes(req.user.role)) {
      return sendErrorResponse(res, 'Unauthorized', 403);
    }

    const section = await prisma.section.findUnique({
      where: { id }
    });

    if (!section) {
      return sendErrorResponse(res, 'Section not found', 404);
    }

    const updatedSection = await prisma.section.update({
      where: { id },
      data: {
        title,
        instructions,
        order,
        timeLimit
      }
    });

    return sendSuccessResponse(res, updatedSection, 'Section updated successfully');
  } catch (error) {
    return sendErrorResponse(res, 'Error updating section', 500, error);
  }
};

// Delete section
export const deleteSection = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Only allow admins and content creators to delete sections
    if (!req.user || !['ADMIN', 'SUPER_ADMIN', 'STUDY_MATERIAL_ADMIN'].includes(req.user.role)) {
      return sendErrorResponse(res, 'Unauthorized', 403);
    }

    const section = await prisma.section.findUnique({
      where: { id }
    });

    if (!section) {
      return sendErrorResponse(res, 'Section not found', 404);
    }

    await prisma.section.delete({
      where: { id }
    });

    return sendSuccessResponse(res, null, 'Section deleted successfully');
  } catch (error) {
    return sendErrorResponse(res, 'Error deleting section', 500, error);
  }
};

/**
 * Question Management Controllers
 */

// Create a new question
export const createQuestion = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { sectionId } = req.params;
    const { 
      questionText, 
      questionType, 
      questionImage, 
      audioFile,
      additionalInfo,
      order,
      marks,
      options,
      correctAnswer
    } = req.body;

    // Only allow admins and content creators to create questions
    if (!req.user || !['ADMIN', 'SUPER_ADMIN', 'STUDY_MATERIAL_ADMIN'].includes(req.user.role)) {
      return sendErrorResponse(res, 'Unauthorized', 403);
    }

    // Check if section exists
    const section = await prisma.section.findUnique({
      where: { id: sectionId },
      include: {
        test: true
      }
    });

    if (!section) {
      return sendErrorResponse(res, 'Section not found', 404);
    }

    const question = await prisma.question.create({
      data: {
        sectionId,
        questionText,
        questionType,
        questionImage,
        audioFile,
        additionalInfo,
        order,
        marks: marks || 1.0,
        options: options ? JSON.stringify(options) : undefined,
        correctAnswer
      }
    });

    // Update test total questions and total marks
    await prisma.test.update({
      where: { id: section.test.id },
      data: {
        totalQuestions: { increment: 1 },
        totalMarks: { increment: marks || 1.0 }
      }
    });

    return sendSuccessResponse(res, question, 'Question created successfully', 201);
  } catch (error) {
    return sendErrorResponse(res, 'Error creating question', 500, error);
  }
};

// Update question
export const updateQuestion = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      questionText, 
      questionType, 
      questionImage, 
      audioFile,
      additionalInfo,
      order,
      marks,
      options,
      correctAnswer
    } = req.body;

    // Only allow admins and content creators to update questions
    if (!req.user || !['ADMIN', 'SUPER_ADMIN', 'STUDY_MATERIAL_ADMIN'].includes(req.user.role)) {
      return sendErrorResponse(res, 'Unauthorized', 403);
    }

    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        section: {
          include: {
            test: true
          }
        }
      }
    });

    if (!question) {
      return sendErrorResponse(res, 'Question not found', 404);
    }

    // Calculate marks difference for test total update
    const marksDifference = (marks || 1.0) - question.marks;

    const updatedQuestion = await prisma.question.update({
      where: { id },
      data: {
        questionText,
        questionType,
        questionImage,
        audioFile,
        additionalInfo,
        order,
        marks: marks || 1.0,
        options: options ? JSON.stringify(options) : undefined,
        correctAnswer
      },
      include: {
        section: {
          include: {
            test: true
          }
        }
      }
    });

    // Update test total marks if marks have changed
    if (marksDifference !== 0) {
      await prisma.test.update({
        where: { id: updatedQuestion.section.test.id },
        data: {
          totalMarks: { increment: marksDifference }
        }
      });
    }

    return sendSuccessResponse(res, updatedQuestion, 'Question updated successfully');
  } catch (error) {
    return sendErrorResponse(res, 'Error updating question', 500, error);
  }
};

// Delete question
export const deleteQuestion = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Only allow admins and content creators to delete questions
    if (!req.user || !['ADMIN', 'SUPER_ADMIN', 'STUDY_MATERIAL_ADMIN'].includes(req.user.role)) {
      return sendErrorResponse(res, 'Unauthorized', 403);
    }

    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        section: {
          include: {
            test: true
          }
        }
      }
    });

    if (!question) {
      return sendErrorResponse(res, 'Question not found', 404);
    }

    await prisma.question.delete({
      where: { id }
    });

    // Update test total questions and total marks
    await prisma.test.update({
      where: { id: question.section.test.id },
      data: {
        totalQuestions: { decrement: 1 },
        totalMarks: { decrement: question.marks }
      }
    });

    return sendSuccessResponse(res, null, 'Question deleted successfully');
  } catch (error) {
    return sendErrorResponse(res, 'Error deleting question', 500, error);
  }
}; 