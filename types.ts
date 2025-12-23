
export interface SubjectPerformance {
  marks: number;
  unattempted: number;
  incorrect: number;
  accuracy: number;
  calcError: number;
  misconception: number;
  conceptNotAware: number;
  readingError: number;
  extraThinking: number;
  lackOfTime: number;
}

export interface TestEntry {
  id: string;
  date: string;
  testName: string;
  physics: SubjectPerformance;
  chemistry: SubjectPerformance;
  maths: SubjectPerformance;
  total: SubjectPerformance;
}

export const SUBJECT_KEYS = ['physics', 'chemistry', 'maths'] as const;
export type SubjectKey = typeof SUBJECT_KEYS[number];

export const INITIAL_SUBJECT_PERFORMANCE: SubjectPerformance = {
  marks: 0,
  unattempted: 0,
  incorrect: 0,
  accuracy: 0,
  calcError: 0,
  misconception: 0,
  conceptNotAware: 0,
  readingError: 0,
  extraThinking: 0,
  lackOfTime: 0,
};
