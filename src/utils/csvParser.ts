import type { Question, Notice, AptitudeQuestion } from '../types';

// Helper to parse a line into CSV values, handling quoted values containing commas
const parseCSVLine = (line: string): string[] => {
  const values: string[] = [];
  let currentValue = '';
  let insideQuotes = false;

  for (let j = 0; j < line.length; j++) {
    const char = line[j];

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
  return values;
};

export const parseCSV = (csv: string): Question[] => {
  const lines = csv.trim().split('\n');
  if (lines.length <= 1) return [];

  const questions: Question[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = parseCSVLine(lines[i]);

    if (values.length >= 5) {
      questions.push({
        id: values[0],
        title: values[1],
        topics: values[2],
        difficulty: values[3] as 'Easy' | 'Medium' | 'Hard',
        leetcode_url: values[4],
        company_tags: values[5] || '',
      });
    }
  }

  return questions;
};

export const parseNoticesCSV = (csv: string): Notice[] => {
  const lines = csv.trim().split('\n');
  if (lines.length <= 1) return [];
  const notices: Notice[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = parseCSVLine(lines[i]);
    if (values.length >= 2) {
      notices.push({
        title: values[0].replace(/^"|"$/g, ''), // clean outer quotes if any
        link: values[1].replace(/^"|"$/g, ''),
      });
    }
  }

  return notices;
};

export const parseAptitudeCSV = (csv: string): AptitudeQuestion[] => {
  const lines = csv.trim().split('\n');
  if (lines.length <= 1) return [];
  const questions: AptitudeQuestion[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = parseCSVLine(lines[i]);

    if (values.length >= 2) {
      questions.push({
        id: `apt-${i}`,
        title: values[0].replace(/^"|"$/g, '').trim(),
        topics: values[1] ? values[1].replace(/^"|"$/g, '').trim() : 'General',
        practice_urls: values.slice(2)
          .map(url => url.replace(/^"|"$/g, '').trim())
          .filter(url => url.length > 0),
      });
    }
  }

  return questions;
};
