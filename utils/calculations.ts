
import { SubjectPerformance, TestEntry } from '../types';

/**
 * Calculates the number of incorrect questions based on marks and unattempted count.
 * Formula: incorrect = (100 - (marks + 4 * unattempted)) / 5
 * (Assuming 25 questions per subject, each +4, -1)
 */
export const calculateIncorrect = (marks: number, unattempted: number): number => {
  const incorrect = (100 - (marks + 4 * unattempted)) / 5;
  return Math.round(incorrect * 100) / 100;
};

/**
 * Calculates accuracy percentage.
 * Formula: accuracy = (total_attempted - incorrect) / total_attempted * 100
 */
export const calculateAccuracy = (unattempted: number, incorrect: number, totalQs: number = 25): number => {
  const attempted = totalQs - unattempted;
  if (attempted <= 0) return 0;
  const correct = attempted - incorrect;
  const accuracy = (correct / attempted) * 100;
  return Math.round(accuracy * 100) / 100;
};

/**
 * Aggregates P, C, M performance into a single total object
 */
export const aggregateTotal = (p: SubjectPerformance, c: SubjectPerformance, m: SubjectPerformance): SubjectPerformance => {
  const sumFields = (field: keyof SubjectPerformance) => p[field] + c[field] + m[field];

  const totalMarks = sumFields('marks');
  const totalUnattempted = sumFields('unattempted');
  const totalIncorrect = sumFields('incorrect');
  
  // Total accuracy based on 75 questions (25 * 3)
  const totalAccuracy = calculateAccuracy(totalUnattempted, totalIncorrect, 75);

  return {
    marks: totalMarks,
    unattempted: totalUnattempted,
    incorrect: totalIncorrect,
    accuracy: totalAccuracy,
    calcError: sumFields('calcError'),
    misconception: sumFields('misconception'),
    conceptNotAware: sumFields('conceptNotAware'),
    readingError: sumFields('readingError'),
    extraThinking: sumFields('extraThinking'),
    lackOfTime: sumFields('lackOfTime'),
  };
};
