import React, { useState, useCallback } from 'react';
import type { QuizQuestion } from '../types';
import { quizQuestions } from '../data/quizData';
import { QuizIcon } from './icons/QuizIcon';
import { StarRating } from './StarRating';
import { getRatings, saveRating } from '../services/ratingService';

type QuizState = 'idle' | 'loading' | 'active' | 'finished';

const InteractiveQuiz: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [quizState, setQuizState] = useState<QuizState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const startQuiz = useCallback(() => {
    setQuizState('loading');
    setError(null);
    setUserAnswers({});
    
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

    setUserAnswers(prev => ({...prev, [currentQuestionIndex]: answer}));
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
        setRatings(getRatings()); // Load ratings when quiz finishes
        setQuizState('finished');
      }
    }, 1500);
  };
  
  const resetQuiz = () => {
      setQuizState('idle');
      setQuestions([]);
      setUserAnswers({});
  }

  const handleRatingChange = (question: string, rating: number) => {
    const newRatings = { ...ratings, [question]: rating };
    setRatings(newRatings);
    saveRating(question, rating);
  };

  const getButtonClass = (option: string) => {
    if (!selectedAnswer) {
      return 'bg-white/40 hover:bg-white/60 text-gray-900';
    }
    const isCorrectAnswer = option === questions[currentQuestionIndex].correctAnswer;
    const isSelected = option === selectedAnswer;

    if (isCorrectAnswer) {
      return 'bg-green-600 text-white scale-105';
    }
    if (isSelected && !isCorrect) {
      return 'bg-red-600 text-white';
    }
    return 'bg-white/40 opacity-50 text-gray-900';
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
              <p className="text-gray-700">السؤال {currentQuestionIndex + 1} من {questions.length}</p>
              <div className="w-full bg-white/50 rounded-full h-2.5 mt-2">
                <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
              </div>
            </div>
            <p className="text-xl font-semibold mb-6 text-center">{currentQuestion.question}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentQuestion.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={!!selectedAnswer}
                  className={`p-4 rounded-lg font-semibold transition-all duration-300 ${getButtonClass(option)}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );
      case 'finished':
        return (
          <div className="text-center w-full">
            <h3 className="text-2xl font-bold mb-2">اكتمل الاختبار!</h3>
            <p className="text-xl mb-6">نتيجتك النهائية: {score} من {questions.length}</p>
            
            <div className="text-right w-full max-h-[22rem] overflow-y-auto space-y-4 p-4 bg-black/5 rounded-lg border border-gray-900/20 mb-6">
                <h4 className="text-lg font-bold text-amber-900 mb-2">راجع إجاباتك وقم بتقييم الأسئلة:</h4>
                {questions.map((q, index) => {
                    const userAnswer = userAnswers[index];
                    const isUserCorrect = userAnswer === q.correctAnswer;
                    return (
                        <div key={index} className="p-4 bg-white/20 rounded-lg border border-white/30">
                            <p className="font-semibold mb-2">{index + 1}. {q.question}</p>
                            <p className={`text-sm ${isUserCorrect ? 'text-green-800' : 'text-red-800'}`}>
                                إجابتك: {userAnswer || "لم تتم الإجابة"} {isUserCorrect ? ' (صحيحة)' : ' (خاطئة)'}
                            </p>
                            {!isUserCorrect && <p className="text-sm text-gray-800">الإجابة الصحيحة: {q.correctAnswer}</p>}
                            <div className="mt-3 flex items-center justify-between">
                                <span className="text-sm text-gray-700">تقييمك للسؤال:</span>
                                <StarRating 
                                    rating={ratings[q.question] || 0}
                                    onRate={(newRating) => handleRatingChange(q.question, newRating)}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <button
              onClick={resetQuiz}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
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
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
              onClick={startQuiz}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              ابدأ الاختبار
            </button>
          </div>
        );
    }
  };

  return (
    <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl p-6 flex flex-col h-full shadow-lg hover:shadow-amber-500/20 transition-shadow duration-300">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-amber-900/10 p-2 rounded-lg"><QuizIcon className="w-8 h-8 text-amber-800" /></div>
        <h2 className="text-2xl font-bold text-amber-800">أسئلة التقييم</h2>
      </div>
      <div className="flex-grow flex items-center justify-center">
        {renderContent()}
      </div>
    </div>
  );
};

export default InteractiveQuiz;