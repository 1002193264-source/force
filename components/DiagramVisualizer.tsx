import React, { useState, useRef } from 'react';
import type { Force } from '../types';
import { analyzeForces } from '../services/geminiService';
import { ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon, ArrowUpRightIcon } from './icons/ArrowIcons';
import { WhiteboardIcon } from './icons/WhiteboardIcon';
import { UploadIcon } from './icons/UploadIcon';

const DiagramVisualizer: React.FC = () => {
  const [scenario, setScenario] = useState('');
  const [forces, setForces] = useState<Force[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scenario.trim() && !imageBase64) {
      setError('الرجاء وصف سيناريو فيزيائي أو رفع صورة.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setForces([]);

    try {
      const result = await analyzeForces(scenario, imageBase64);
      setForces(result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const getArrowIcon = (direction: Force['direction']) => {
    switch (direction) {
      case 'up': return <ArrowUpIcon className="w-6 h-6 text-green-400" />;
      case 'down': return <ArrowDownIcon className="w-6 h-6 text-red-400" />;
      case 'left': return <ArrowLeftIcon className="w-6 h-6 text-yellow-400" />;
      case 'right': return <ArrowRightIcon className="w-6 h-6 text-yellow-400" />;
      case 'angled': return <ArrowUpRightIcon className="w-6 h-6 text-purple-400" />;
      default: return null;
    }
  };
  
  const clearImage = () => {
    setImageBase64(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 flex flex-col h-full shadow-lg hover:shadow-purple-500/10 transition-shadow duration-300">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-purple-500/10 p-2 rounded-lg"><WhiteboardIcon className="w-8 h-8 text-purple-400" /></div>
        <h2 className="text-2xl font-bold text-purple-400">لوحات التعبير المشتركة</h2>
      </div>
      <p className="mb-4 text-slate-300">صف سيناريو فيزيائيًا، أو ارفع صورة، لتمثيل القوى المؤثرة.</p>
      <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
        <textarea
          value={scenario}
          onChange={(e) => setScenario(e.target.value)}
          placeholder="مثال: كتاب يستقر على طاولة أفقية."
          className="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg mb-4 flex-grow focus:ring-2 focus:ring-purple-500 focus:outline-none transition-shadow"
          rows={3}
          disabled={isLoading}
        ></textarea>

        <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
            accept="image/*"
            disabled={isLoading}
        />

        {imageBase64 && (
            <div className="mb-4 relative w-fit mx-auto">
                <img src={imageBase64} alt="معاينة" className="rounded-lg max-h-32 border-2 border-slate-600" />
                <button
                    type="button"
                    onClick={clearImage}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-500 transition-colors"
                    aria-label="إزالة الصورة"
                >
                    &times;
                </button>
            </div>
        )}

        {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
        
        <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <UploadIcon className="w-5 h-5"/>
              {imageBase64 ? 'تغيير الصورة' : 'رفع صورة'}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
              {isLoading ? 'جاري التحليل...' : 'تصور القوى'}
            </button>
        </div>

      </form>
      {forces.length > 0 && (
        <div className="mt-6 p-4 bg-slate-900 rounded-lg border border-slate-700 max-h-80 overflow-y-auto">
          <h3 className="text-xl font-bold mb-3 text-purple-300">تحليل القوى:</h3>
          <ul className="space-y-4">
            {forces.map((force, index) => (
              <li key={index} className="flex items-start gap-4 p-3 bg-slate-800 rounded-md">
                <div className="flex-shrink-0">{getArrowIcon(force.direction)}</div>
                <div>
                  <p className="font-bold text-purple-200">{force.name}</p>
                  <p className="text-sm text-slate-400">{force.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DiagramVisualizer;