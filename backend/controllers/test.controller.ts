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
      clbScore,
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
    const newTest = await prisma.test.create({
      data: {
        title,
        description,
        difficulty,
        moduleType,
        totalTime,
        totalQuestions: 0, // Will be updated as questions are added
        clbScore: clbScore || 1, // Default CLB score to 1 if not provided
        isPublished: isPublished || false
      }
    });

    console.log("Test created successfully:", newTest.id);

    // Get the test without sections
    const testWithoutSection = await prisma.test.findUnique({
      where: { id: newTest.id }
    });

    return sendSuccessResponse(res, testWithoutSection, 'Test created successfully', 201);
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
            questions: {
              select: {
                id: true,
                sectionId: true,
                questionText: true,
                questionType: true,
                questionImage: true,
                audioFile: true,
                sentenceBeginnings: true,
                sentenceEndings: true,
                correctHeadings: true,
                additionalInfo: true,
                completeSentenceAnswers : true,
                order: true,
                marks: true,
                options: true,
                correctAnswer: true,
                passage: true,
                paragraphs: true,
                sentences: true,
                matchingPairs: true,
                mapLabels: true,
                cueCard: true,
                speakingPrompts: true,
                followUpQuestions: true,
                bandDescriptors: true,
                sampleAnswer: true,
                headings: true,           
                fillBlankAnswers: true, 
              },
              orderBy: {
                order: 'asc'
              }
            }
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

    // For each section, if there's a passage in the questions with order 0, 
    // add it to the section directly for easier access in the frontend
    const processedTest = {
      ...test,
      sections: test.sections.map((section: any) => {
        // Ensure all question.options are arrays
        const questionsWithArrayOptions = section.questions.map((q: any) => {
          let options = q.options;
          if (typeof options === 'string') {
            try {
              options = JSON.parse(options);
            } catch {
              options = options.split(',');
            }
          }
          return { ...q, options };
        });
        // Find the passage question (order 0) if it exists
        const passageQuestion = questionsWithArrayOptions.find((q: any) => q.order === 0);

        // Add the passage to the section if found
        if (passageQuestion && passageQuestion.passage) {
          return {
            ...section,
            passage: passageQuestion.passage,
            // Filter out the passage question from the questions array
            questions: questionsWithArrayOptions.filter((q: any) => q.order > 0)
          };
        }

        return {
          ...section,
          questions: questionsWithArrayOptions
        };
      })
    };
    console.log("Processed test with sections and questions:", JSON.stringify(processedTest, null, 2));
    return sendSuccessResponse(res, processedTest, 'Test retrieved successfully');
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
      clbScore,
      isPublished
    } = req.body;

    // TEMPORARILY COMMENTED OUT FOR TESTING
    /*
    // Only allow admins and content creators to update tests
    if (!req.user || !['ADMIN', 'SUPER_ADMIN', 'STUDY_MATERIAL_ADMIN'].includes(req.user.role)) {
      return sendErrorResponse(res, 'Unauthorized', 403);
    }
    */

    const existingTest = await prisma.test.findUnique({
      where: { id }
    });

    if (!existingTest) {
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
        clbScore,
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
    const { title, instructions, order, timeLimit, passage } = req.body;

    // TEMPORARILY COMMENTED OUT FOR TESTING
    /*
    // Only allow admins and content creators to create sections
    if (!req.user || !['ADMIN', 'SUPER_ADMIN', 'STUDY_MATERIAL_ADMIN'].includes(req.user.role)) {
      return sendErrorResponse(res, 'Unauthorized', 403);
    }
    */

    // Check if test exists
    const test = await prisma.test.findUnique({
      where: { id: testId }
    });

    if (!test) {
      return sendErrorResponse(res, 'Test not found', 404);
    }

    // Create section with additional passage field for reading tests
    const sectionData: any = {
      testId,
      title,
      instructions,
      order,
      timeLimit
    };

    // Store passage if provided
    if (passage) {
      sectionData.questions = {
        create: {
          questionText: "Reading Passage",
          questionType: "MULTIPLE_CHOICE", // Default type, will be updated for actual questions
          passage: passage,
          order: 0, // Special order to indicate this is the passage
          marks: 0 // No marks for the passage itself
        }
      };
    }

    const section = await prisma.section.create({
      data: sectionData,
      include: {
        questions: true
      }
    });

    return sendSuccessResponse(res, section, 'Section created successfully', 201);
  } catch (error) {
    console.error("Error creating section:", error);
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
      headings,
      correctHeadings,
      fillBlankAnswers,
      fillBlankSentence,
      sentenceBeginnings,
      sentenceEndings,
      correctEndings,
      diagramImage,
      diagramAnswers,
      wordLimit,
      // Fields for various question types
      summaryWords,
      summaryBlankAnswers,
      passage,
      paragraphs,
      
      sentences,
      matchingPairs,
      mapLabels,
      cueCard,
      speakingPrompts,
      followUpQuestions,
      bandDescriptors,
      sampleAnswer,
      completeSentenceAnswers, // <-- Added this line
      tableData // <-- Added this line to fix the error
    } = req.body;

    console.log("Received question creation request for sectionId:", sectionId);
    console.log("Question data:", JSON.stringify(req.body, null, 2));

    // Check if section exists and get module type from parent test
    const section = await prisma.section.findUnique({
      where: { id: sectionId },
      include: {
        test: true,
        questions: {
          where: { order: 0 }, // Get the passage question if it exists
          take: 1
        }
      }
    });

    if (!section) {
      console.error(`Section not found with ID: ${sectionId}`);
      return sendErrorResponse(res, `Section not found with ID: ${sectionId}`, 404);
    }

    // Get the module type to validate question type
    const moduleType = section.test.moduleType;

    // Validate if the question type is appropriate for the module type
    if (!isQuestionTypeValidForModule(questionType, moduleType)) {
      return sendErrorResponse(res, `Question type ${questionType} is not valid for module ${moduleType}`, 400);
    }

    // Validate required fields based on question type
    if (!validateQuestionFields(questionType, req.body)) {
      return sendErrorResponse(res, 'Missing required fields for this question type', 400);
    }

    // Parse JSON strings if needed
    const parseJsonField = (field: any) => {
      if (typeof field === 'string') {
        try {
          return JSON.parse(field);
        } catch (error) {
          console.error(`Error parsing field:`, error);
          return field;
        }
      }
      return field;
    };

    // Parse various fields that might be JSON strings
    const parsedOptions = parseJsonField(options);
    const parsedSpeakingPrompts = parseJsonField(speakingPrompts);
    const parsedBandDescriptors = parseJsonField(bandDescriptors);
    const parsedParagraphs = parseJsonField(paragraphs);

    // Build the data object conditionally
    const questionData: any = {
      sectionId,
      questionText,
      questionType,
      order: order || (await prisma.question.count({ where: { sectionId, order: { gt: 0 } } })) + 1, // Skip passage (order 0)
      marks: marks || 1.0,
    };

    // Only add fields if they are provided and not undefined or null
    if (questionImage) questionData.questionImage = questionImage;
    if (audioFile) questionData.audioFile = audioFile;
    if (additionalInfo) questionData.additionalInfo = additionalInfo;
    if (correctAnswer) questionData.correctAnswer = correctAnswer;



    // For reading questions, try to get the passage from the section if it exists and none is provided
    if (moduleType === 'READING') {

      if (headings) questionData.headings = Array.isArray(headings) ? headings : JSON.parse(headings);
      if (correctHeadings) questionData.correctHeadings = Array.isArray(correctHeadings) ? correctHeadings : JSON.parse(correctHeadings);
      if (fillBlankAnswers) questionData.fillBlankAnswers = Array.isArray(fillBlankAnswers) ? fillBlankAnswers : JSON.parse(fillBlankAnswers);
      if (sentenceBeginnings) questionData.sentenceBeginnings = Array.isArray(sentenceBeginnings) ? sentenceBeginnings : JSON.parse(sentenceBeginnings);
      if (sentenceEndings) questionData.sentenceEndings = Array.isArray(sentenceEndings) ? sentenceEndings : JSON.parse(sentenceEndings);
      if (correctEndings) questionData.correctEndings = Array.isArray(correctEndings) ? correctEndings : JSON.parse(correctEndings);
      if (diagramImage) questionData.diagramImage = diagramImage;
      if (diagramAnswers) questionData.diagramAnswers = Array.isArray(diagramAnswers) ? diagramAnswers : JSON.parse(diagramAnswers);
      if (wordLimit) questionData.wordLimit = wordLimit;

      if (tableData) {
  questionData.tableData = Array.isArray(tableData) || typeof tableData === 'object'
    ? tableData
    : JSON.parse(tableData);
}

      if (completeSentenceAnswers) questionData.completeSentenceAnswers = Array.isArray(completeSentenceAnswers) ? completeSentenceAnswers : JSON.parse(completeSentenceAnswers);

      if (sentences) questionData.sentences = Array.isArray(sentences) ? sentences : JSON.parse(sentences);


      if (summaryWords) questionData.summaryWords = Array.isArray(summaryWords) ? summaryWords : JSON.parse(summaryWords);
      if (summaryBlankAnswers) questionData.summaryBlankAnswers = Array.isArray(summaryBlankAnswers) ? summaryBlankAnswers : JSON.parse(summaryBlankAnswers);
      if (paragraphs) questionData.paragraphs = Array.isArray(paragraphs) ? paragraphs : JSON.parse(paragraphs);
      if (fillBlankSentence) questionData.fillBlankSentence = fillBlankSentence;
      if (fillBlankAnswers) questionData.fillBlankAnswers = Array.isArray(fillBlankAnswers) ? fillBlankAnswers : JSON.parse(fillBlankAnswers);


      if (headings) questionData.headings = Array.isArray(headings) ? headings : JSON.parse(headings);
      if (paragraphs) questionData.paragraphs = Array.isArray(paragraphs) ? paragraphs : JSON.parse(paragraphs);
      if (correctHeadings) questionData.correctHeadings = Array.isArray(correctHeadings) ? correctHeadings : JSON.parse(correctHeadings);





      // If a passage was provided in the request, use it


      if (passage) {
        questionData.passage = passage;
      }
      // Otherwise, check if the section has a passage question
      else if (section.questions && section.questions.length > 0 && section.questions[0].passage) {
        questionData.passage = section.questions[0].passage;
      }
    } else if (passage) {
      // For non-reading questions, still set the passage if explicitly provided
      questionData.passage = passage;
    }

    if (cueCard) questionData.cueCard = cueCard;

    // Add JSON fields with proper parsing
    if (parsedOptions) questionData.options = parsedOptions;
    if (parsedSpeakingPrompts) questionData.speakingPrompts = parsedSpeakingPrompts;
    if (parsedBandDescriptors) questionData.bandDescriptors = parsedBandDescriptors;
    if (parsedParagraphs) questionData.paragraphs = parsedParagraphs;
    if (followUpQuestions) questionData.followUpQuestions = followUpQuestions;
    if (sentences) questionData.sentences = sentences;
    if (mapLabels) questionData.mapLabels = mapLabels;
    if (matchingPairs) questionData.matchingPairs = matchingPairs;
    if (sampleAnswer) questionData.sampleAnswer = sampleAnswer;

    const question = await prisma.question.create({
      data: questionData
    });

    console.log("Question created successfully:", question.id);

    // Update test total questions count
    await prisma.test.update({
      where: { id: section.test.id },
      data: {
        totalQuestions: { increment: 1 }
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

// Helper function to check if question type is valid for the module type
const isQuestionTypeValidForModule = (questionType: string, moduleType: string): boolean => {
  const readingQuestionTypes = [
    'MULTIPLE_CHOICE',
    'PARA_HEADINGS',
    'COMPLETE_SENTENCE',
    'NAME_MATCHING',
    'FILL_BLANK',
    'TRUE_FALSE_NOT_GIVEN',
    'YES_NO_NOT_GIVEN',
    'TRUE_FALSE',
    'SUMMARY'
  ];

  const listeningQuestionTypes = [
    'MULTIPLE_CHOICE',
    'FILL_BLANK',
    'TRUE_FALSE',
    'MAP',
    'SHORT_ANSWER'
  ];

  const speakingQuestionTypes = [
    'SPEAKING_TASK_1',
    'SPEAKING_TASK_2',
    'SPEAKING_TASK_3',
    'SPEAKING_FOLLOW_UPS'
  ];

  const writingQuestionTypes = [
    'ESSAY'
  ];

  switch (moduleType) {
    case 'READING':
      return readingQuestionTypes.includes(questionType);
    case 'LISTENING':
      return listeningQuestionTypes.includes(questionType);
    case 'SPEAKING':
      return speakingQuestionTypes.includes(questionType);
    case 'WRITING':
      return writingQuestionTypes.includes(questionType);
    case 'IELTS_GENERAL':
    case 'IELTS_ACADEMIC':
    case 'COMBINED':
      // All question types allowed for combined tests
      return true;
    default:
      return false;
  }
};

// Helper function to validate question fields based on question type
const validateQuestionFields = (questionType: string, questionData: any): boolean => {
  // Common validation - all questions must have question text
  if (!questionData.questionText) {
    return false;
  }

  switch (questionType) {
    // Reading module question types
    case 'MULTIPLE_CHOICE':
      return !!questionData.options && !!questionData.correctAnswer;

    case 'PARA_HEADINGS':
      return (
        !!questionData.questionText &&
        Array.isArray(questionData.paragraphs) && questionData.paragraphs.length > 0 &&
        Array.isArray(questionData.headings) && questionData.headings.length > 0 &&
        Array.isArray(questionData.correctHeadings) && questionData.correctHeadings.length === questionData.paragraphs.length
      );

    case 'COMPLETE_SENTENCE':
      return !!questionData.sentences && Array.isArray(questionData.sentences) && questionData.sentences.length > 0 &&
    Array.isArray(questionData.completeSentenceAnswers) && questionData.completeSentenceAnswers.length > 0;

    case 'NAME_MATCHING':
      return (
      Array.isArray(questionData.sentenceBeginnings) && questionData.sentenceBeginnings.length > 0 &&
    Array.isArray(questionData.sentenceEndings) && questionData.sentenceEndings.length > 0
  );

    case 'FILL_BLANK':
      return !!questionData.questionText && Array.isArray(questionData.fillBlankAnswers) && questionData.fillBlankAnswers.length > 0;

    case 'TRUE_FALSE_NOT_GIVEN':
    case 'YES_NO_NOT_GIVEN':
      return !!questionData.passage && !!questionData.correctAnswer;

    // Listening module question types
    case 'TRUE_FALSE':
      return !!questionData.correctAnswer;

    case 'MAP':
      return !!questionData.questionImage && !!questionData.mapLabels;

    // Speaking module question types
    case 'SPEAKING_TASK_1':
      return !!questionData.speakingPrompts;

    case 'SPEAKING_TASK_2':
      return !!questionData.cueCard;

    case 'SPEAKING_TASK_3':
    case 'SPEAKING_FOLLOW_UPS':
      return !!questionData.followUpQuestions;

    // Other question types
    case 'SHORT_ANSWER':
      return !!questionData.correctAnswer;

    case 'ESSAY':
      return true; // No special validation needed

    case 'MATCHING':
    case 'HEADING_MATCHING':
    case 'INFORMATION_MATCHING':
    case 'FEATURES_MATCHING':
      return !!questionData.options;

    case 'GAP_FILLING':
    case 'NOTE_COMPLETION':
    case 'TABLE_COMPLETION':
    case 'SENTENCE_COMPLETION':
      return !!questionData.correctAnswer;

    case 'DIAGRAM_LABELLING':
      return (!!questionData.questionText &&
        // typeof questionData.diagramImage === "string" &&
        Array.isArray(questionData.diagramLabels) &&
        questionData.diagramLabels.length > 0 &&
        questionData.diagramLabels.every(
          (label: any) =>
            typeof label.x === "number" &&
            typeof label.y === "number" &&
            typeof label.text === "string" &&
            typeof label.id === undefined &&
            typeof label.correctAnswer === "string"
        ))
    case 'MAP_LABELLING':
    case 'PROCESS_DIAGRAM':
      return !!questionData.questionImage && !!questionData.correctAnswer;

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
      console.log("missing fields")
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

    // We no longer track total marks in the test model
    // Just log the change for debugging
    if (marksDifference !== 0) {
      console.log(`Question marks updated by ${marksDifference} for question ${id}`);
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

    // Update test total questions count
    await prisma.test.update({
      where: { id: question.section.test.id },
      data: {
        totalQuestions: { decrement: 1 }
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
      clbScore,
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
      // Calculate total questions
      let totalQuestions = 0;

      if (sections && Array.isArray(sections)) {
        for (const section of sections) {
          if (section.questions && Array.isArray(section.questions)) {
            totalQuestions += section.questions.length;
          }
        }
      }

      // Create the test
      const newTest = await tx.test.create({
        data: {
          title,
          description,
          difficulty,
          moduleType,
          totalTime,
          totalQuestions,
          clbScore: clbScore || 1, // Default CLB score to 1 if not provided
          isPublished: isPublished || false,
          testCategory,
          isFeatured: isFeatured || false
        }
      });

      console.log("IELTS test created successfully:", newTest.id);

      // Create sections and questions
      if (sections && Array.isArray(sections)) {
        for (let i = 0; i < sections.length; i++) {
          const section = sections[i];
          const createdSection = await tx.section.create({
            data: {
              testId: newTest.id,
              title: section.title,
              instructions: section.instructions,
              order: section.order || i + 1,
              timeLimit: section.timeLimit
            }
          });

          console.log(`Section ${createdSection.title} created for test: ${newTest.id}`);

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
        where: { id: newTest.id },
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