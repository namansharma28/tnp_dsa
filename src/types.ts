export interface Question {
  id: string;
  title: string;
  topics: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  leetcode_url: string;
  company_tags: string;
}

export interface Notice {
  title: string;
  link: string;
}

export interface AptitudeQuestion {
  id: string;
  title: string;
  topics: string;
  practice_urls: string[];
}
