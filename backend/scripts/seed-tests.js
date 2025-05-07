// Seed script for initializing test data
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting database seed...');

    // Create sample tests
    const testsData = [
      {
        title: 'General Aptitude Test',
        description: 'A comprehensive aptitude assessment covering logical, verbal, and quantitative reasoning',
        moduleType: 'FULL_TEST',
        difficulty: 'MEDIUM',
        totalTime: 60,
        totalMarks: 100,
        isPublished: true
      },
      {
        title: 'Verbal Reasoning',
        description: 'Tests your ability to understand and analyze written information',
        moduleType: 'READING',
        difficulty: 'EASY',
        totalTime: 45,
        totalMarks: 50,
        isPublished: true
      },
      {
        title: 'Quantitative Analysis',
        description: 'Mathematical problem-solving and data interpretation',
        moduleType: 'FULL_TEST',
        difficulty: 'HARD',
        totalTime: 90,
        totalMarks: 100,
        isPublished: false
      },
      {
        title: 'Logical Reasoning',
        description: 'Test your ability to analyze patterns and draw logical conclusions',
        moduleType: 'READING',
        difficulty: 'MEDIUM',
        totalTime: 60,
        totalMarks: 75,
        isPublished: true
      }
    ];

    // Create each test
    for (const testData of testsData) {
      await prisma.test.create({
        data: testData
      });
    }

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 