export interface Question {
  id: string;
  title: string;
  topics: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  leetcode_url: string;
  company_tags: string;
}
