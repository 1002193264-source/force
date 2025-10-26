
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Force {
  name: string;
  direction: 'up' | 'down' | 'left' | 'right' | 'angled';
  description: string;
}
