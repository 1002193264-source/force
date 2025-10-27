import React, { useState, useMemo } from 'react';
import type { InteractionProblem } from '../types';
import { interactionProblems } from '../data/interactionProblems';
import { InteractionIcon } from './icons/InteractionIcon';
import { CheckCircleIcon, XCircleIcon } from './icons/FeedbackIcons';

type BuilderState = 'idle' | 'interaction' | 'force' | 'finished';
type Feedback = {
  type: 'correct' | 'incorrect';
  message: string;
} | null;

const ForceInteractionBuilder: React.FC = () => {
  const [problem, setProblem] = useState<InteractionProblem | null>(null);
  const [builderState, setBuilderState] = useState<BuilderState>('idle');
  const [selectedInteractions, setSelectedInteractions] = useState<string[]>([]);
  const [selectedForces, setSelectedForces] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<Feedback>(null);
  
  const shuffledProblems = useMemo(() => [...interactionProblems].sort(() => 0.5 - Math.random()), []);
  const [problemIndex, setProblemIndex] = useState(0);

  const startBuilder = () => {
    setProblem(shuffledProblems[problemIndex]);
    setBuilderState('interaction');
    setSelectedInteractions([]);
    setSelectedForces([]);
    setFeedback(null);
  };
  
  const nextProblem = () => {
      const nextIndex = (problemIndex + 1) % shuffledProblems.length;
      setProblemIndex(nextIndex);
      setProblem(shuffledProblems[nextIndex]);
      setBuilderState('interaction');
      setSelectedInteractions([]);
      setSelectedForces([]);
      setFeedback(null);
  }

  const handleInteractionToggle = (option: string) => {
    setSelectedInteractions(prev => 
      prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]
    );
  };
  
  const handleForceToggle = (option: string) => {
    setSelectedForces(prev => 
      prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]
    );
  };

  const checkInteractions = () => {
    if (!problem) return;
    const correct = problem.interactionStep.correctAnswers;
    const selected = selectedInteractions;
    const isCorrect = correct.length === selected.length && correct.every(item => selected.includes(item));
    
    if (isCorrect) {
      setFeedback({ type: 'correct', message: 'إجابة صحيحة! لننتقل الآن لتحديد القوى.' });
      setTimeout(() => {
          setBuilderState('force');
          setFeedback(null);
      }, 1500);
    } else {
      setFeedback({ type: 'incorrect', message: 'إجابة غير دقيقة. راجع اختيارك. هل هناك أجسام تلامس الجسم أو تؤثر عليه عن بعد (مثل الأرض) لم تخترها؟' });
    }
  };

  const checkForces = () => {
    if (!problem) return;
    const correct = problem.forceStep.correctAnswers;
    const selected = selectedForces;
    const isCorrect = correct.length === selected.length && correct.every(item => selected.includes(item));

    if (isCorrect) {
      setFeedback({ type: 'correct', message: 'ممتاز! لقد حددت جميع القوى بشكل صحيح.' });
      setBuilderState('finished');
    } else {
      setFeedback({ type: 'incorrect', message: 'إجابتك غير مكتملة أو تحتوي على أخطاء. تذكر: كل تفاعل حددته في الخطوة الأولى ينتج عنه قوة. لا توجد قوى أخرى!' });
    }
  };

  const renderContent = () => {
    if (builderState === 'idle' || !problem) {
      return (
        <div className="text-center">
          <p className="mb-6">تعلم كيفية تحليل القوى خطوة بخطوة من خلال بناء مخططات الجسم الحر لمسائل مختلفة.</p>
          <button onClick={startBuilder} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
            ابدأ التمرين
          </button>
        </div>
      );
    }

    const renderStep = (
        title: string,
        question: string,
        options: string[],
        selected: string[],
        onToggle: (opt: string) => void,
        onCheck: () => void,
        buttonText: string
    ) => (
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-xl font-semibold mb-6 text-center">{question.replace('{targetObject}', `"${problem.targetObject}"`)}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {options.map(option => (
            <label key={option} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 ${selected.includes(option) ? 'bg-emerald-500/20 border-emerald-600' : 'bg-white/40 border-gray-400 hover:bg-white/60'}`}>
              <input type="checkbox" checked={selected.includes(option)} onChange={() => onToggle(option)} className="form-checkbox h-5 w-5 bg-transparent border-gray-500 text-emerald-600 focus:ring-emerald-600 rounded" />
              <span className="font-medium">{option}</span>
            </label>
          ))}
        </div>
        {feedback && (
          <div className={`flex items-center justify-center gap-2 p-3 mb-4 rounded-lg text-white ${feedback.type === 'correct' ? 'bg-green-600' : 'bg-red-600'}`}>
            {feedback.type === 'correct' ? <CheckCircleIcon className="w-5 h-5" /> : <XCircleIcon className="w-5 h-5" />}
            <span>{feedback.message}</span>
          </div>
        )}
        <button onClick={onCheck} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
          {buttonText}
        </button>
      </div>
    );
    
    switch (builderState) {
        case 'interaction':
            return renderStep('الخطوة 1: تحديد التفاعلات', problem.interactionStep.question, problem.interactionStep.options, selectedInteractions, handleInteractionToggle, checkInteractions, 'تحقق من التفاعلات');
        case 'force':
            return renderStep('الخطوة 2: تحديد القوى', problem.forceStep.question, problem.forceStep.options, selectedForces, handleForceToggle, checkForces, 'تحقق من القوى');
        case 'finished':
            return (
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-emerald-800 mb-4">أحسنت! لقد أكملت التحليل.</h3>
                    <div className="p-4 bg-black/10 rounded-lg border border-gray-900/20 text-right mb-6">
                        <p className="font-bold mb-2">السيناريو: {problem.scenario}</p>
                        <p className="mb-4">{problem.forceStep.explanation}</p>
                        <p><span className="font-semibold">القوى المؤثرة:</span> {problem.forceStep.correctAnswers.join('، ')}.</p>
                    </div>
                    <button onClick={nextProblem} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                        المسألة التالية
                    </button>
                </div>
            )
        default: return null;
    }
  };

  return (
    <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl p-6 flex flex-col h-full shadow-lg hover:shadow-emerald-500/20 transition-shadow duration-300">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-emerald-900/10 p-2 rounded-lg"><InteractionIcon className="w-8 h-8 text-emerald-800" /></div>
        <h2 className="text-2xl font-bold text-emerald-800">بناء المسائل الفيزيائية</h2>
      </div>
       <div className="text-center font-semibold p-3 bg-black/10 border border-gray-900/20 rounded-lg mb-4">
        <p>{problem ? problem.scenario : "اختر مسألة وابدأ التحليل"}</p>
      </div>
      <div className="flex-grow flex items-center justify-center">
        {renderContent()}
      </div>
    </div>
  );
};

export default ForceInteractionBuilder;