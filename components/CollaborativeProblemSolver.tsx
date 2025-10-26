import React, { useState } from 'react';
import { solveProblemStepByStep } from '../services/geminiService';
import { CollaborateIcon } from './icons/CollaborateIcon';

const CollaborativeProblemSolver: React.FC = () => {
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
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
    setSolution('');

    try {
      const result = await solveProblemStepByStep(problem);
      setSolution(result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatSolution = (text: string) => {
    return text.split('\n').map((line, index) => {
        if (line.trim() === '') return null;
        const isListItem = /^\s*(\d+\.|-|\*)\s/.test(line);
        return (
            <p key={index} className={`mb-2 ${isListItem ? 'pl-4' : ''}`}>
                {line}
            </p>
        );
    }).filter(Boolean);
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 flex flex-col h-full shadow-lg hover:shadow-blue-500/10 transition-shadow duration-300">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-blue-500/10 p-2 rounded-lg"><CollaborateIcon className="w-8 h-8 text-blue-400" /></div>
        <h2 className="text-2xl font-bold text-blue-400">التعاون وحل المسائل</h2>
      </div>
      <p className="mb-4 text-slate-300">أدخل مسألة فيزيائية لتحصل على تحليل وخطوات حل مفصلة.</p>
      <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
        <textarea
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="مثال: جسم كتلته 10 كجم على سطح أفقي، أثرت عليه قوة أفقية مقدارها 50 نيوتن. احسب تسارع الجسم إذا كان معامل الاحتكاك 0.2."
          className="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg mb-4 flex-grow focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
          rows={4}
          disabled={isLoading}
        ></textarea>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
        >
          {isLoading ? 'جاري الحل...' : 'احصل على المساعدة'}
        </button>
      </form>
      {solution && (
        <div className="mt-6 p-4 bg-slate-900 rounded-lg border border-slate-700 max-h-80 overflow-y-auto">
          <h3 className="text-xl font-bold mb-3 text-blue-300">خطوات الحل:</h3>
          <div className="prose prose-invert prose-p:text-slate-300">{formatSolution(solution)}</div>
        </div>
      )}
    </div>
  );
};

export default CollaborativeProblemSolver;