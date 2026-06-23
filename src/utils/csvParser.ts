import type { Question } from '../types';

export const parseCSV = (csv: string): Question[] => {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',');

  const questions: Question[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values: string[] = [];
    let currentValue = '';
    let insideQuotes = false;

    for (let j = 0; j < lines[i].length; j++) {
      const char = lines[i][j];

      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim());

    if (values.length === headers.length) {
      questions.push({
        id: values[0],
        title: values[1],
        topics: values[2],
        difficulty: values[3] as 'Easy' | 'Medium' | 'Hard',
        leetcode_url: values[4],
        company_tags: values[5],
      });
    }
  }

  return questions;
};
