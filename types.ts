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

export interface InteractionProblem {
  id: number;
  scenario: string;
  targetObject: string;
  interactionStep: {
    question: string;
    options: string[];
    correctAnswers: string[];
  };
  forceStep: {
    question: string;
    options: string[];
    correctAnswers: string[];
    explanation: string;
  };
}