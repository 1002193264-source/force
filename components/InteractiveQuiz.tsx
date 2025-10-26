import React, { useState, useCallback } from 'react';
import type { QuizQuestion } from '../types';
import { quizQuestions } from '../data/quizData';
import { QuizIcon } from './icons/QuizIcon';

type QuizState = 'idle' | 'loading' | 'active' | 'finished';

const InteractiveQuiz: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [quizState, setQuizState] = useState<QuizState>('idle');
  const [error, setError] = useState<string | null>(null);

  const startQuiz = useCallback(() => {
    setQuizState('loading');
    setError(null);
    
    // Simulate loading for better UX
    setTimeout(() => {
      const shuffled = [...quizQuestions].sort(() => 0.5 - Math.random());
      const selectedQuestions = shuffled.slice(0, 5); // Take 5 random questions

      if (selectedQuestions.length > 0) {
        setQuestions(selectedQuestions);
        setCurrentQuestionIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setQuizState('active');
      } else {
        setError("لم يتم تحميل أسئلة الاختبار. حاول مرة أخرى.");
        setQuizState('idle');
      }
    }, 500);
  }, []);

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer) return;

    setSelectedAnswer(answer);
    const correct = answer === questions[currentQuestionIndex].correctAnswer;
    setIsCorrect(correct);
    if (correct) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setQuizState('finished');
      }
    }, 1500);
  };
  
  const resetQuiz = () => {
      setQuizState('idle');
      setQuestions([]);
  }

  const getButtonClass = (option: string) => {
    if (!selectedAnswer) {
      return 'bg-slate-700 hover:bg-slate-600';
    }
    const isCorrectAnswer = option === questions[currentQuestionIndex].correctAnswer;
    const isSelected = option === selectedAnswer;

    if (isCorrectAnswer) {
      return 'bg-green-500 scale-105';
    }
    if (isSelected && !isCorrect) {
      return 'bg-red-500';
    }
    return 'bg-slate-700 opacity-50';
  };

  const renderContent = () => {
    switch (quizState) {
      case 'loading':
        return <div className="text-center p-8">جاري تحضير الاختبار...</div>;
      case 'active':
        const currentQuestion = questions[currentQuestionIndex];
        return (
          <div>
            <div className="mb-4 text-center">
              <p className="text-slate-400">السؤال {currentQuestionIndex + 1} من {questions.length}</p>
              <div className="w-full bg-slate-700 rounded-full h-2.5 mt-2">
                <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
              </div>
            </div>
            <p className="text-xl font-semibold mb-6 text-center">{currentQuestion.question}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentQuestion.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={!!selectedAnswer}
                  className={`p-4 rounded-lg text-white font-semibold transition-all duration-300 ${getButtonClass(option)}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );
      case 'finished':
        return (
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">اكتمل الاختبار!</h3>
            <p className="text-xl mb-6">نتيجتك النهائية: {score} من {questions.length}</p>
            <button
              onClick={resetQuiz}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              إعادة الاختبار
            </button>
          </div>
        );
      case 'idle':
      default:
        return (
          <div className="text-center">
            <p className="mb-6">اختبر معلوماتك في مفاهيم القوى الفيزيائية من خلال هذا الاختبار القصير والمعد مسبقًا.</p>
            {error && <p className="text-red-400 mb-4">{error}</p>}
            <button
              onClick={startQuiz}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              ابدأ الاختبار
            </button>
          </div>
        );
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 flex flex-col h-full shadow-lg hover:shadow-cyan-500/10 transition-shadow duration-300">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-cyan-500/10 p-2 rounded-lg"><QuizIcon className="w-8 h-8 text-cyan-400" /></div>
        <h2 className="text-2xl font-bold text-cyan-400">أسئلة التقييم</h2>
      </div>
      <div className="flex-grow flex items-center justify-center">
        {renderContent()}
      </div>
    </div>
  );
};

export default InteractiveQuiz;