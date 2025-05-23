import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendSuccessResponse, sendErrorResponse } from '../utils/response.util';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

/**
 * Test Attempt Controllers
 */

// Start a test attempt
export const startTestAttempt = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Get test ID from request params
    const { testId } = req.params;
    
    // Support anonymous users
    let userId = 'anonymous-user';
    let isAnonymous = true;
    
    // If user is authenticated, use their ID
    if (req.user) {
      userId = req.user.id;
      isAnonymous = false;
    }

    // Check if test exists and is published
    const test = await prisma.test.findUnique({
      where: { 
        id: testId,
        isPublished: true
      },
      include: {
        sections: {
          include: {
            questions: true
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    if (!test) {
      return sendErrorResponse(res, 'Test not found or not published', 404);
    }

    // Skip subscription check for anonymous users
    if (!isAnonymous && req.user && !['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return sendErrorResponse(res, 'User not found', 404);
      }

      // Check subscription status
      const hasValidSubscription = 
        user.subscriptionStatus === 'ACTIVE' || 
        user.subscriptionStatus === 'TRIAL';
      
      if (!hasValidSubscription) {
        return sendErrorResponse(res, 'Active subscription required to take tests', 403);
      }
    }

    // Check if user already has an active attempt for this test
    const existingAttempt = await prisma.testAttempt.findFirst({
      where: {
        userId,
        testId,
        status: 'IN_PROGRESS'
      }
    });

    if (existingAttempt) {
      // Return the existing attempt
      const attempt = await prisma.testAttempt.findUnique({
        where: { id: existingAttempt.id },
        include: {
          responses: {
            include: {
              question: true
            }
          },
          test: {
            include: {
              sections: {
                include: {
                  questions: {
                    orderBy: {
                      order: 'asc'
                    }
                  }
                },
                orderBy: {
                  order: 'asc'
                }
              }
            }
          }
        }
      });

      return sendSuccessResponse(res, attempt, 'Existing test attempt retrieved', 200);
    }

    // Create a new test attempt
    const attempt = await prisma.testAttempt.create({
      data: {
        userId,
        testId,
        status: 'IN_PROGRESS',
        currentSection: 0,
        // Set time remaining based on test's total time (convert minutes to seconds)
        timeRemaining: test.totalTime * 60
      },
      include: {
        test: {
          include: {
            sections: {
              include: {
                questions: {
                  orderBy: {
                    order: 'asc'
                  }
                }
              },
              orderBy: {
                order: 'asc'
              }
            }
          }
        }
      }
    });

    return sendSuccessResponse(res, attempt, 'Test attempt started successfully', 201);
  } catch (error) {
    return sendErrorResponse(res, 'Error starting test attempt', 500, error);
  }
};

// Save test attempt progress (auto-save)
export const saveTestProgress = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { attemptId } = req.params;
    const { 
      responses, 
      currentSection, 
      timeRemaining 
    } = req.body;
    
    // Support anonymous users
    let userId = 'anonymous-user';
    
    // If user is authenticated, use their ID
    if (req.user) {
      userId = req.user.id;
    }

    // Check if test attempt exists and belongs to user
    const attempt = await prisma.testAttempt.findFirst({
      where: { 
        id: attemptId,
        userId,
        status: 'IN_PROGRESS'
      }
    });

    if (!attempt) {
      return sendErrorResponse(res, 'Test attempt not found or not in progress', 404);
    }

    // Begin transaction to update attempt and responses
    await prisma.$transaction(async (tx) => {
      // Update attempt
      await tx.testAttempt.update({
        where: { id: attemptId },
        data: {
          lastSavedAt: new Date(),
          currentSection,
          timeRemaining
        }
      });

      // Process responses if provided
      if (responses && Array.isArray(responses)) {
        for (const response of responses) {
          const { questionId, userAnswer, audioRecording } = response;
          
          // Check if response already exists
          const existingResponse = await tx.response.findFirst({
            where: {
              testAttemptId: attemptId,
              questionId,
              userId
            }
          });

          if (existingResponse) {
            // Update existing response
            await tx.response.update({
              where: { id: existingResponse.id },
              data: {
                userAnswer,
                audioRecording,
                submittedAt: new Date()
              }
            });
          } else {
            // Create new response
            await tx.response.create({
              data: {
                testAttemptId: attemptId,
                questionId,
                userId,
                userAnswer,
                audioRecording,
                reviewStatus: 'PENDING'
              }
            });
          }
        }
      }
    });

    return sendSuccessResponse(res, { success: true }, 'Test progress saved successfully');
  } catch (error) {
    return sendErrorResponse(res, 'Error saving test progress', 500, error);
  }
};

// Get test attempt status and responses
export const getTestAttempt = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { attemptId } = req.params;
    
    // Support anonymous users
    let userId = 'anonymous-user';
    
    // If user is authenticated, use their ID
    if (req.user) {
      userId = req.user.id;
    }

    // For authenticated users, check if they have admin access
    const isAdmin = req.user && ['ADMIN', 'SUPER_ADMIN'].includes(req.user.role);

    // Build where clause
    let whereClause: any = { id: attemptId };
    
    // Add user filter
    if (isAdmin) {
      // Admin can view any attempt
      whereClause = {
        ...whereClause,
        OR: [
          { userId },
          { userId: { not: userId } } // Admin can view other users' attempts
        ]
      };
    } else {
      // Non-admin can only view their own attempts
      whereClause.userId = userId;
    }

    // Check if user is authorized to view this attempt
    const attempt = await prisma.testAttempt.findFirst({
      where: whereClause,
      include: {
        responses: {
          include: {
            question: true
          }
        },
        test: {
          include: {
            sections: {
              include: {
                questions: {
                  orderBy: {
                    order: 'asc'
                  }
                }
              },
              orderBy: {
                order: 'asc'
              }
            }
          }
        }
      }
    });

    if (!attempt) {
      return sendErrorResponse(res, 'Test attempt not found or access denied', 404);
    }

    return sendSuccessResponse(res, attempt, 'Test attempt retrieved successfully');
  } catch (error) {
    return sendErrorResponse(res, 'Error retrieving test attempt', 500, error);
  }
};

// Submit test attempt for scoring
export const submitTestAttempt = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { attemptId } = req.params;
    
    // Support anonymous users
    let userId = 'anonymous-user';
    
    // If user is authenticated, use their ID
    if (req.user) {
      userId = req.user.id;
    }

    // Check if test attempt exists and belongs to user
    const attempt = await prisma.testAttempt.findFirst({
      where: { 
        id: attemptId,
        userId,
        status: 'IN_PROGRESS'
      },
      include: {
        responses: {
          include: {
            question: true
          }
        },
        test: {
          include: {
            sections: {
              include: {
                questions: true
              }
            }
          }
        }
      }
    });

    if (!attempt) {
      return sendErrorResponse(res, 'Test attempt not found or not in progress', 404);
    }

    // Auto-grade objective questions (MCQs, true/false, etc.)
    let totalScore = 0;
    let totalPossibleScore = 0;

    // Begin transaction for scoring
    await prisma.$transaction(async (tx) => {
      // Process each response for auto-grading where possible
      for (const response of attempt.responses) {
        const { question } = response;
        let isCorrect = false;
        let marksAwarded = 0;
        
        // Questions that can be auto-graded
        const autoGradeableTypes = [
          'MULTIPLE_CHOICE', 
          'TRUE_FALSE', 
          'MATCHING',
          'FILL_BLANK',
          'SHORT_ANSWER'
        ];
        
        // If question type is auto-gradeable and has a correct answer
        if (autoGradeableTypes.includes(question.questionType) && question.correctAnswer) {
          // Compare user answer with correct answer
          if (response.userAnswer && 
              response.userAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase()) {
            isCorrect = true;
            marksAwarded = question.marks;
          }
          
          // Update response with grading
          await tx.response.update({
            where: { id: response.id },
            data: {
              isCorrect,
              marksAwarded,
              reviewStatus: 'REVIEWED'
            }
          });
          
          totalScore += marksAwarded;
        } else {
          // For non-auto-gradeable questions, mark for manual review
          await tx.response.update({
            where: { id: response.id },
            data: {
              reviewStatus: 'PENDING'
            }
          });
        }
        
        totalPossibleScore += question.marks;
      }
      
      // For writing and speaking, totalScore will be updated after manual review
      
      // Mark attempt as completed
      await tx.testAttempt.update({
        where: { id: attemptId },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          totalScore
        }
      });
      
      // Only add to user scores table for authenticated users
      if (req.user) {
        await tx.userScore.create({
          data: {
            userId,
            moduleType: attempt.test.moduleType,
            score: totalScore
          }
        });
      }
    });

    // Get the updated attempt
    const updatedAttempt = await prisma.testAttempt.findUnique({
      where: { id: attemptId },
      include: {
        responses: {
          include: {
            question: true
          }
        },
        test: true
      }
    });

    return sendSuccessResponse(
      res, 
      {
        attempt: updatedAttempt,
        score: totalScore,
        totalPossible: totalPossibleScore,
        percentageScore: (totalScore / totalPossibleScore) * 100
      }, 
      'Test submitted and graded successfully'
    );
  } catch (error) {
    return sendErrorResponse(res, 'Error submitting test', 500, error);
  }
};

// Get user test history
export const getUserTestHistory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // User must be authenticated
    if (!req.user) {
      return sendErrorResponse(res, 'Authentication required', 401);
    }

    const userId = req.user.id;
    const { moduleType, status } = req.query;

    // Build filter conditions
    const whereClause: any = { userId };
    
    if (moduleType) {
      whereClause.test = { moduleType };
    }
    
    if (status) {
      whereClause.status = status;
    }

    // Get user's test attempts
    const attempts = await prisma.testAttempt.findMany({
      where: whereClause,
            include: {        test: {          select: {            id: true,            title: true,            moduleType: true,            totalQuestions: true,            clbScore: true          }        }      },
      orderBy: {
        startedAt: 'desc'
      }
    });

    return sendSuccessResponse(res, attempts, 'Test history retrieved successfully');
  } catch (error) {
    return sendErrorResponse(res, 'Error retrieving test history', 500, error);
  }
};

// Update response scoring (for manually graded questions, admin only)
export const updateResponseScoring = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Only admin users can update scoring
    if (!req.user || !['ADMIN', 'SUPER_ADMIN', 'DOUBTS_SOLVING_ADMIN'].includes(req.user.role)) {
      return sendErrorResponse(res, 'Unauthorized', 403);
    }

    const { responseId } = req.params;
    const { marksAwarded, feedback, isCorrect } = req.body;

    // Find the response
    const response = await prisma.response.findUnique({
      where: { id: responseId },
      include: {
        testAttempt: true
      }
    });

    if (!response) {
      return sendErrorResponse(res, 'Response not found', 404);
    }

    // Update response
    const updatedResponse = await prisma.response.update({
      where: { id: responseId },
      data: {
        isCorrect,
        marksAwarded,
        feedback,
        reviewStatus: 'REVIEWED'
      }
    });

    // Update test attempt total score
    await prisma.$transaction(async (tx) => {
      // Get all responses for this attempt
      const attemptResponses = await tx.response.findMany({
        where: { 
          testAttemptId: response.testAttemptId,
          reviewStatus: 'REVIEWED'
        }
      });
      
      // Calculate new total score
      const newTotalScore = attemptResponses.reduce(
        (sum, resp) => sum + (resp.marksAwarded || 0), 
        0
      );
      
      // Update attempt with new score
      await tx.testAttempt.update({
        where: { id: response.testAttemptId },
        data: {
          totalScore: newTotalScore,
          status: 'EVALUATED'
        }
      });
      
      // Update user score record
      const attempt = await tx.testAttempt.findUnique({
        where: { id: response.testAttemptId },
        include: { test: true }
      });
      
      if (attempt) {
        // Find existing score record
        const userScore = await tx.userScore.findFirst({
          where: {
            userId: attempt.userId,
            moduleType: attempt.test.moduleType
          },
          orderBy: {
            recordedAt: 'desc'
          }
        });
        
        if (userScore) {
          // Update existing score
          await tx.userScore.update({
            where: { id: userScore.id },
            data: { score: newTotalScore }
          });
        } else {
          // Create new score record
          await tx.userScore.create({
            data: {
              userId: attempt.userId,
              moduleType: attempt.test.moduleType,
              score: newTotalScore
            }
          });
        }
      }
    });

    return sendSuccessResponse(res, updatedResponse, 'Response scoring updated successfully');
  } catch (error) {
    return sendErrorResponse(res, 'Error updating response scoring', 500, error);
  }
}; 