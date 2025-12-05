import React, { useState } from 'react';
import { LABELS } from '../constants';
import { askGeminiCoach } from '../services/geminiService';

interface AICoachProps {
  context: string;
}

const AICoach: React.FC<AICoachProps> = ({ context }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setResponse('');
    
    const answer = await askGeminiCoach(query, context);
    
    setResponse(answer);
    setIsLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4 rounded-full shadow-lg shadow-purple-500/30 hover:scale-105 transition-transform z-50 flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-700 animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                {LABELS.coachTitle}
              </h2>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="h-64 overflow-y-auto bg-slate-900/50 rounded-lg p-4 mb-4 border border-slate-700">
              {response ? (
                <div className="prose prose-invert prose-sm">
                  {/* Simple rendering for now, could be Markdown */}
                  <p className="whitespace-pre-wrap leading-relaxed text-slate-200">{response}</p>
                </div>
              ) : (
                <p className="text-slate-500 text-center mt-20 text-sm">
                  {isLoading ? "思考中..." : "我是你的 AI 私教。今天练什么？有什么不懂的？"}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={LABELS.coachPlaceholder}
                className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
              />
              <button
                onClick={handleAsk}
                disabled={isLoading}
                className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
              >
                {isLoading ? "..." : LABELS.send}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AICoach;
