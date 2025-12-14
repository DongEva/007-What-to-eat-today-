import React from 'react';
import { Play, Square, UtensilsCrossed } from 'lucide-react';

interface MainStageProps {
  currentFood: string;
  isRunning: boolean;
  onToggle: () => void;
}

export const MainStage: React.FC<MainStageProps> = ({ currentFood, isRunning, onToggle }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto p-4 md:p-8 text-center">
      
      <div className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-display text-rose-500 tracking-wider drop-shadow-sm flex items-center justify-center gap-3">
          <UtensilsCrossed className="w-8 h-8 md:w-12 md:h-12" />
          今天吃啥呀
        </h1>
        <p className="text-rose-300 mt-2 font-medium">解决你的选择困难症</p>
      </div>
      
      <div className="relative w-full py-12 md:py-20 mb-12 flex items-center justify-center">
        {/* Background Decorative Circle */}
        <div className={`absolute w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-orange-100 to-rose-100 rounded-full blur-3xl transition-all duration-300 ${isRunning ? 'scale-110 opacity-80' : 'scale-100 opacity-50'}`}></div>
        
        {/* Main Text */}
        <div className={`
            relative z-10 font-black text-gray-800 transition-all duration-75 select-none
            ${isRunning ? 'text-6xl md:text-8xl opacity-80 blur-[1px]' : 'text-7xl md:text-9xl animate-pop text-rose-600 drop-shadow-xl'}
            font-display
          `}>
          {currentFood}
        </div>
      </div>

      <button
        onClick={onToggle}
        className={`
          group relative inline-flex items-center justify-center px-16 py-6 text-2xl font-black text-white transition-all duration-200 
          rounded-2xl shadow-[0_8px_0_rgb(0,0,0,0.2)] hover:shadow-[0_4px_0_rgb(0,0,0,0.2)] hover:translate-y-1 active:shadow-none active:translate-y-2
          ${isRunning 
            ? 'bg-rose-400 hover:bg-rose-500 shadow-rose-700/30' 
            : 'bg-gradient-to-b from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 shadow-orange-700/30'}
        `}
      >
        {isRunning ? (
          <>
            <Square className="w-8 h-8 mr-3 fill-current" />
            停 止
          </>
        ) : (
          <>
            <Play className="w-8 h-8 mr-3 fill-current" />
            开 始
          </>
        )}
      </button>

      <div className="mt-12 text-rose-400/60 text-sm font-medium">
        {isRunning ? "快速翻动中..." : "按下空格键也可以开始/停止"}
      </div>
    </div>
  );
};