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

    console.log("Creating test with data:", JSON.stringify(req.body, null, 2));

    // TEMPORARILY COMMENTED OUT FOR TESTING
    /* 
    // Only allow admins and content creators to create tests
    if (!req.user || !['ADMIN', 'SUPER_ADMIN', 'STUDY_MATERIAL_ADMIN'].includes(req.user.role)) {
      return sendErrorResponse(res, 'Unauthorized', 403);
    }
    */

    // Create the test
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

    console.log("Test created successfully:", test.id);
    
    // Automatically create a default section for the test
    await prisma.section.create({
      data: {
        testId: test.id,
        title: "Section 1",
        instructions: "Default section for the test",
        order: 1,
        timeLimit: totalTime
      }
    });
    
    console.log("Default section created for test:", test.id);

    // Get the updated test with the new section
    const testWithSection = await prisma.test.findUnique({
      where: { id: test.id },
      include: {
        sections: true
      }
    });

    return sendSuccessResponse(res, testWithSection, 'Test created successfully with default section', 201);
  } catch (error) {
    console.error("Error creating test:", error);
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

    // TEMPORARILY COMMENTED OUT FOR TESTING
    /*
    // Only allow admins and content creators to update tests
    if (!req.user || !['ADMIN', 'SUPER_ADMIN', 'STUDY_MATERIAL_ADMIN'].includes(req.user.role)) {
      return sendErrorResponse(res, 'Unauthorized', 403);
    }
    */

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

    // TEMPORARILY COMMENTED OUT FOR TESTING
    /*
    // Only allow admins and content creators to delete tests
    if (!req.user || !['ADMIN', 'SUPER_ADMIN', 'STUDY_MATERIAL_ADMIN'].includes(req.user.role)) {
      return sendErrorResponse(res, 'Unauthorized', 403);
    }
    */

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
      correctAnswer,
      // IELTS specific fields
      passage,
      cueCard,
      speakingPrompts,
      bandDescriptors,
      sampleAnswer
    } = req.body;

    console.log("Received question creation request for sectionId:", sectionId);
    console.log("Question data:", JSON.stringify(req.body, null, 2));
    console.log("Request params:", JSON.stringify(req.params, null, 2));
    console.log("Request path:", req.path);

    // TEMPORARILY COMMENTED OUT FOR TESTING
    /*
    // Only allow admins and content creators to create questions
    if (!req.user || !['ADMIN', 'SUPER_ADMIN', 'STUDY_MATERIAL_ADMIN'].includes(req.user.role)) {
      return sendErrorResponse(res, 'Unauthorized', 403);
    }
    */

    // Check if section exists
    const section = await prisma.section.findUnique({
      where: { id: sectionId },
      include: {
        test: true
      }
    });

    if (!section) {
      console.error(`Section not found with ID: ${sectionId}`);
      return sendErrorResponse(res, `Section not found with ID: ${sectionId}`, 404);
    }
    
    // Validate required fields based on question type
    if (!validateQuestionFields(questionType, req.body)) {
      return sendErrorResponse(res, 'Missing required fields for this question type', 400);
    }

    // Parse options if it's a string (it might come as JSON string from frontend)
    let parsedOptions = options;
    if (typeof options === 'string') {
      try {
        // The frontend is already sending a stringified JSON array, so we need to parse it
        parsedOptions = JSON.parse(options);
        console.log("Successfully parsed options:", parsedOptions);
      } catch (error) {
        console.error("Error parsing options:", error);
        // If parsing fails, use the string as is
      }
    }
    
    // Parse speakingPrompts if needed
    let parsedSpeakingPrompts = speakingPrompts;
    if (typeof speakingPrompts === 'string') {
      try {
        parsedSpeakingPrompts = JSON.parse(speakingPrompts);
      } catch (error) {
        console.error("Error parsing speakingPrompts:", error);
      }
    }
    
    // Parse bandDescriptors if needed
    let parsedBandDescriptors = bandDescriptors;
    if (typeof bandDescriptors === 'string') {
      try {
        parsedBandDescriptors = JSON.parse(bandDescriptors);
      } catch (error) {
        console.error("Error parsing bandDescriptors:", error);
      }
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
        // Make sure we stringify the options for storage in the JSON field
        options: parsedOptions ? Array.isArray(parsedOptions) ? JSON.stringify(parsedOptions) : parsedOptions : undefined,
        correctAnswer,
        // IELTS specific fields
        passage,
        cueCard,
        speakingPrompts: parsedSpeakingPrompts ? JSON.stringify(parsedSpeakingPrompts) : undefined,
        bandDescriptors: parsedBandDescriptors ? JSON.stringify(parsedBandDescriptors) : undefined,
        sampleAnswer
      }
    });

    console.log("Question created successfully:", question.id);

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
    console.error("Error in createQuestion controller:", error);
    // Add stack trace to help debugging
    if (error instanceof Error) {
      console.error("Stack trace:", error.stack);
    }
    return sendErrorResponse(res, 'Error creating question', 500, error);
  }
};

// Helper function to validate question fields based on question type
const validateQuestionFields = (questionType: string, questionData: any): boolean => {
  switch (questionType) {
    case 'MULTIPLE_CHOICE':
    case 'TRUE_FALSE':
      return !!questionData.options && !!questionData.correctAnswer;
    
    case 'FILL_BLANK':
    case 'SHORT_ANSWER':
    case 'GAP_FILLING':
    case 'NOTE_COMPLETION':
    case 'TABLE_COMPLETION':
    case 'SENTENCE_COMPLETION':
      return !!questionData.correctAnswer;
    
    case 'ESSAY':
    case 'WRITING_TASK_1':
    case 'WRITING_TASK_2':
      return !!questionData.questionText && !!questionData.bandDescriptors;
    
    case 'DIAGRAM_LABELLING':
    case 'MAP_LABELLING':
    case 'PROCESS_DIAGRAM':
      return !!questionData.questionImage && !!questionData.correctAnswer;
    
    case 'MATCHING':
    case 'HEADING_MATCHING':
    case 'INFORMATION_MATCHING':
    case 'FEATURES_MATCHING':
      return !!questionData.options;
    
    case 'YES_NO_NOT_GIVEN':
    case 'TRUE_FALSE_NOT_GIVEN':
      return !!questionData.questionText && !!questionData.correctAnswer;
    
    case 'SPEAKING_TASK_1':
    case 'SPEAKING_TASK_2':
    case 'SPEAKING_TASK_3':
      return !!questionData.speakingPrompts && !!questionData.bandDescriptors;
    
    default:
      return true; // Allow other question types without specific validation
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
      correctAnswer,
      // IELTS specific fields
      passage,
      cueCard,
      speakingPrompts,
      bandDescriptors,
      sampleAnswer
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
    
    // Validate required fields based on question type
    if (!validateQuestionFields(questionType, req.body)) {
      return sendErrorResponse(res, 'Missing required fields for this question type', 400);
    }

    // Calculate marks difference for test total update
    const marksDifference = (marks || 1.0) - question.marks;
    
    // Parse JSON data if needed
    let parsedOptions = options;
    if (typeof options === 'string') {
      try {
        parsedOptions = JSON.parse(options);
      } catch (error) {
        console.error("Error parsing options:", error);
      }
    }
    
    let parsedSpeakingPrompts = speakingPrompts;
    if (typeof speakingPrompts === 'string') {
      try {
        parsedSpeakingPrompts = JSON.parse(speakingPrompts);
      } catch (error) {
        console.error("Error parsing speakingPrompts:", error);
      }
    }
    
    let parsedBandDescriptors = bandDescriptors;
    if (typeof bandDescriptors === 'string') {
      try {
        parsedBandDescriptors = JSON.parse(bandDescriptors);
      } catch (error) {
        console.error("Error parsing bandDescriptors:", error);
      }
    }

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
        options: parsedOptions ? JSON.stringify(parsedOptions) : undefined,
        correctAnswer,
        // IELTS specific fields
        passage,
        cueCard,
        speakingPrompts: parsedSpeakingPrompts ? JSON.stringify(parsedSpeakingPrompts) : undefined,
        bandDescriptors: parsedBandDescriptors ? JSON.stringify(parsedBandDescriptors) : undefined,
        sampleAnswer
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

/**
 * Create a complete IELTS test with sections and questions
 */
export const createCompleteIELTSTest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { 
      title, 
      description, 
      difficulty, 
      moduleType, 
      totalTime, 
      isPublished,
      testCategory,
      isFeatured,
      sections // Array of sections with their questions
    } = req.body;

    console.log("Creating complete IELTS test with data:", JSON.stringify(req.body, null, 2));

    // TEMPORARILY COMMENTED OUT FOR TESTING
    /* 
    // Only allow admins and content creators to create tests
    if (!req.user || !['ADMIN', 'SUPER_ADMIN', 'STUDY_MATERIAL_ADMIN'].includes(req.user.role)) {
      return sendErrorResponse(res, 'Unauthorized', 403);
    }
    */

    // Start transaction to ensure all operations succeed or fail together
    return await prisma.$transaction(async (tx) => {
      // Calculate total marks by summing all question marks
      let totalQuestions = 0;
      let totalMarks = 0;
      
      if (sections && Array.isArray(sections)) {
        for (const section of sections) {
          if (section.questions && Array.isArray(section.questions)) {
            totalQuestions += section.questions.length;
            for (const question of section.questions) {
              totalMarks += question.marks || 1.0;
            }
          }
        }
      }

      // Create the test
      const test = await tx.test.create({
        data: {
          title,
          description,
          difficulty,
          moduleType,
          totalTime,
          totalQuestions,
          totalMarks,
          isPublished: isPublished || false,
          testCategory,
          isFeatured: isFeatured || false
        }
      });

      console.log("IELTS test created successfully:", test.id);
      
      // Create sections and questions
      if (sections && Array.isArray(sections)) {
        for (let i = 0; i < sections.length; i++) {
          const section = sections[i];
          const createdSection = await tx.section.create({
            data: {
              testId: test.id,
              title: section.title,
              instructions: section.instructions,
              order: section.order || i + 1,
              timeLimit: section.timeLimit
            }
          });
          
          console.log(`Section ${createdSection.title} created for test: ${test.id}`);
          
          // Create questions for this section
          if (section.questions && Array.isArray(section.questions)) {
            for (let j = 0; j < section.questions.length; j++) {
              const questionData = section.questions[j];
              
              // Parse JSON fields if they are strings
              let options = questionData.options;
              if (typeof options === 'string') {
                try {
                  options = JSON.parse(options);
                } catch (error) {
                  console.error("Error parsing options:", error);
                }
              }
              
              let speakingPrompts = questionData.speakingPrompts;
              if (typeof speakingPrompts === 'string') {
                try {
                  speakingPrompts = JSON.parse(speakingPrompts);
                } catch (error) {
                  console.error("Error parsing speakingPrompts:", error);
                }
              }
              
              let bandDescriptors = questionData.bandDescriptors;
              if (typeof bandDescriptors === 'string') {
                try {
                  bandDescriptors = JSON.parse(bandDescriptors);
                } catch (error) {
                  console.error("Error parsing bandDescriptors:", error);
                }
              }
              
              await tx.question.create({
                data: {
                  sectionId: createdSection.id,
                  questionText: questionData.questionText,
                  questionType: questionData.questionType,
                  questionImage: questionData.questionImage,
                  audioFile: questionData.audioFile,
                  additionalInfo: questionData.additionalInfo,
                  order: questionData.order || j + 1,
                  marks: questionData.marks || 1.0,
                  options: options ? JSON.stringify(options) : undefined,
                  correctAnswer: questionData.correctAnswer,
                  passage: questionData.passage,
                  cueCard: questionData.cueCard,
                  speakingPrompts: speakingPrompts ? JSON.stringify(speakingPrompts) : undefined,
                  bandDescriptors: bandDescriptors ? JSON.stringify(bandDescriptors) : undefined,
                  sampleAnswer: questionData.sampleAnswer
                }
              });
            }
            
            console.log(`Created ${section.questions.length} questions for section: ${createdSection.title}`);
          }
        }
      }

      // Get the updated test with all sections and questions
      const completeTest = await tx.test.findUnique({
        where: { id: test.id },
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

      return sendSuccessResponse(res, completeTest, 'Complete IELTS test created successfully', 201);
    });
  } catch (error) {
    console.error("Error creating complete IELTS test:", error);
    return sendErrorResponse(res, 'Error creating complete IELTS test', 500, error);
  }
}; 