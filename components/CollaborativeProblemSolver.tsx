import React, { useState } from 'react';
import { solveProblemStepByStep, correctSolution } from '../services/geminiService';
import { CollaborateIcon } from './icons/CollaborateIcon';
import { exampleProblems } from '../data/exampleProblems';

const CollaborativeProblemSolver: React.FC = () => {
  const [problem, setProblem] = useState('');
  const [userSolution, setUserSolution] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [resultTitle, setResultTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem.trim()) {
      setError('الرجاء إدخال مسألة فيزيائية.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAiResponse('');

    try {
      if (userSolution.trim()) {
        setResultTitle('تقييم الحل:');
        const result = await correctSolution(problem, userSolution);
        setAiResponse(result);
      } else {
        setResultTitle('خطوات الحل:');
        const result = await solveProblemStepByStep(problem);
        setAiResponse(result);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowExample = () => {
    const randomProblem = exampleProblems[Math.floor(Math.random() * exampleProblems.length)];
    setProblem(randomProblem);
    setUserSolution('');
    setAiResponse('');
    setError(null);
  };

  const formatResponse = (text: string) => {
    return text.split('\n').map((line, index) => {
        if (line.trim() === '') return null;
        if (line.startsWith('*') && line.endsWith('*')) {
            // FIX: The `replaceAll` method is not available in all JavaScript environments targeted by the compiler. Replaced with `replace` and a global regular expression for better compatibility.
            return <p key={index} className="mb-2 font-bold text-sky-900">{line.replace(/\*/g, '')}</p>
        }
        const isListItem = /^\s*(\d+\.|-|\*)\s/.test(line);
        return (
            <p key={index} className={`mb-2 ${isListItem ? 'pl-4' : ''}`}>
                {line}
            </p>
        );
    }).filter(Boolean);
  }
  
  const hasUserSolution = userSolution.trim().length > 0;

  return (
    <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl p-6 flex flex-col h-full shadow-lg hover:shadow-sky-500/20 transition-shadow duration-300">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-sky-900/10 p-2 rounded-lg"><CollaborateIcon className="w-8 h-8 text-sky-800" /></div>
        <h2 className="text-2xl font-bold text-sky-800">التعاون وحل المسائل</h2>
      </div>
      <p className="mb-4 text-gray-800">أدخل مسألة فيزيائية، ثم حاول حلها بنفسك ليقوم الذكاء الاصطناعي بتصحيحها، أو اطلب الحل مباشرة.</p>
      <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
        <label htmlFor="problem-textarea" className="mb-1 font-semibold text-gray-800">المسألة:</label>
        <textarea
          id="problem-textarea"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="مثال: جسم كتلته 10 كجم على سطح أفقي، أثرت عليه قوة أفقية مقدارها 50 نيوتن. احسب تسارع الجسم إذا كان معامل الاحتكاك 0.2."
          className="w-full p-3 bg-white/50 border border-gray-400 rounded-lg mb-4 flex-grow focus:ring-2 focus:ring-sky-600 focus:outline-none transition-shadow placeholder-gray-600"
          rows={3}
          disabled={isLoading}
        ></textarea>
        
        <label htmlFor="solution-textarea" className="mb-1 font-semibold text-gray-800">محاولتك للحل (اختياري):</label>
        <textarea
          id="solution-textarea"
          value={userSolution}
          onChange={(e) => setUserSolution(e.target.value)}
          placeholder="أدخل خطوات حلك هنا... إذا تركت هذا الحقل فارغًا، سيقوم الذكاء الاصطناعي بحل المسألة لك."
          className="w-full p-3 bg-white/50 border border-gray-400 rounded-lg mb-4 flex-grow focus:ring-2 focus:ring-sky-600 focus:outline-none transition-shadow placeholder-gray-600"
          rows={4}
          disabled={isLoading}
        ></textarea>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={handleShowExample}
              disabled={isLoading}
              className="w-full bg-black/20 hover:bg-black/30 text-gray-900 font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              جرب مثالاً
            </button>
            <button
              type="submit"
              disabled={isLoading || !problem.trim()}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'جاري المعالجة...' : (hasUserSolution ? 'صحح حلي' : 'احصل على الحل')}
            </button>
        </div>
      </form>
      {aiResponse && (
        <div className="mt-6 p-4 bg-black/10 rounded-lg border border-gray-900/20 max-h-80 overflow-y-auto">
          <h3 className="text-xl font-bold mb-3 text-sky-900">{resultTitle}</h3>
          <div className="prose prose-p:text-gray-800">{formatResponse(aiResponse)}</div>
        </div>
      )}
    </div>
  );
};

export default CollaborativeProblemSolver;