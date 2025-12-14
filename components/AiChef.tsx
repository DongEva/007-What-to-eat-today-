import React, { useState } from 'react';
import { Sparkles, ChefHat, ArrowRight, X } from 'lucide-react';
import { getAiRecommendation } from '../services/geminiService';
import { AiSuggestion } from '../types';

interface AiChefProps {
  foodNames: string[];
  isOpen: boolean;
  onClose: () => void;
  onSelect: (foodName: string) => void;
}

export const AiChef: React.FC<AiChefProps> = ({ foodNames, isOpen, onClose, onSelect }) => {
  const [preference, setPreference] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<AiSuggestion | null>(null);

  const handleAskAi = async () => {
    setLoading(true);
    setSuggestion(null);
    try {
      const result = await getAiRecommendation(foodNames, preference);
      setSuggestion(result);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto transition-opacity" 
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="pointer-events-auto bg-white w-full max-w-md sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300 max-h-[85vh]">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <ChefHat className="w-6 h-6" />
              AI 智能参谋
            </h2>
            <p className="text-indigo-100 text-sm mt-1">告诉 Gemini 你的口味，拯救选择困难</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {!suggestion ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  今天想吃点什么口味？(选填)
                </label>
                <textarea
                  value={preference}
                  onChange={(e) => setPreference(e.target.value)}
                  placeholder="例如：想吃辣的、不想吃面食、心情不好想吃甜的..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none h-24 text-gray-700 placeholder-gray-400 bg-gray-50"
                />
              </div>

              <button
                onClick={handleAskAi}
                disabled={loading}
                className={`
                  w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2
                  ${loading ? 'bg-indigo-300 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02]'}
                `}
              >
                {loading ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-spin" />
                    AI 正在分析味蕾...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    生成推荐
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in zoom-in duration-300">
              <div className="text-center space-y-2">
                <div className="inline-block bg-indigo-50 text-indigo-700 text-xs px-3 py-1 rounded-full font-semibold tracking-wide uppercase">
                  Gemini 的建议
                </div>
                <h3 className="text-4xl font-black text-gray-800 tracking-tight">
                  {suggestion.name}
                </h3>
              </div>
              
              <div className="bg-indigo-50/50 p-5 rounded-xl border border-indigo-100 text-gray-600 leading-relaxed italic relative">
                <span className="absolute top-2 left-2 text-indigo-200 text-4xl font-serif">"</span>
                <p className="relative z-10 px-2">{suggestion.reason}</p>
                <span className="absolute bottom-[-10px] right-2 text-indigo-200 text-4xl font-serif">"</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSuggestion(null)}
                  className="py-3 px-4 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                >
                  再换一个
                </button>
                <button
                  onClick={() => {
                    onSelect(suggestion.name);
                    onClose();
                  }}
                  className="py-3 px-4 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  就吃这个
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};