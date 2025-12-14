import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Settings, Utensils, Volume2, VolumeX } from 'lucide-react';
import { MainStage } from './components/MainStage';
import { MenuManager } from './components/MenuManager';
import { INITIAL_FOOD_ITEMS, DEFAULT_FOODS } from './constants';
import { FoodItem } from './types';
import { audioService } from './services/audioService';

function App() {
  // --- State ---
  const [items, setItems] = useState<FoodItem[]>(() => {
    try {
        const saved = localStorage.getItem('chisha_items');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
                if (typeof parsed[0] === 'string') {
                    return parsed.map((name: string) => ({ 
                        id: Math.random().toString(36).substr(2, 9), 
                        name, 
                        active: true 
                    }));
                } else if (!('active' in parsed[0])) {
                     return parsed.map((item: any) => ({ ...item, active: true }));
                }
            }
            return parsed;
        }
    } catch (e) {
        console.error("Failed to load saved items", e);
    }
    return INITIAL_FOOD_ITEMS;
  });
  
  const [currentFood, setCurrentFood] = useState<string>("今天吃啥呀");
  const [isRunning, setIsRunning] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(audioService.muted);
  
  const timerRef = useRef<number | null>(null);

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem('chisha_items', JSON.stringify(items));
  }, [items]);

  // --- Audio Init ---
  // Initialize audio context on first click anywhere in the app
  useEffect(() => {
    const initAudio = () => {
      audioService.init();
      window.removeEventListener('click', initAudio);
    };
    window.addEventListener('click', initAudio);
    return () => window.removeEventListener('click', initAudio);
  }, []);

  // --- Handlers ---
  const handleToggle = useCallback(() => {
    const activeItems = items.filter(i => i.active);

    if (isRunning) {
      // Stop
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setIsRunning(false);
      audioService.playWin();
    } else {
      // Start
      if (activeItems.length === 0) {
        alert("没有选中的菜品哦，请在菜单中启用一些！");
        setIsMenuOpen(true);
        return;
      }
      
      // Ensure BGM plays when starting interaction if not muted
      audioService.playBgm();
      
      setIsRunning(true);
      timerRef.current = window.setInterval(() => {
        const randomIndex = Math.floor(Math.random() * activeItems.length);
        setCurrentFood(activeItems[randomIndex].name);
        audioService.playTick(); // Play tick sound
      }, 50);
    }
  }, [isRunning, items]);

  const toggleMute = () => {
    const muted = audioService.toggleMute();
    setIsMuted(muted);
    audioService.playClick();
  };

  const openMenu = () => {
    audioService.playClick();
    setIsMenuOpen(true);
  };

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isMenuOpen) {
        e.preventDefault(); // Prevent scrolling
        handleToggle();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleToggle, isMenuOpen]);

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleAddItem = (name: string) => {
    if (!items.some(i => i.name === name)) {
        setItems(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), name, active: true }]);
        audioService.playClick();
    }
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    audioService.playClick();
  };
  
  const handleToggleItemActive = (id: string) => {
      setItems(prev => prev.map(item => 
          item.id === id ? { ...item, active: !item.active } : item
      ));
      audioService.playClick();
  };

  const handleReset = () => {
    if (confirm('确定要重置菜单到默认状态吗？')) {
      const resetItems = DEFAULT_FOODS.map(name => ({
        id: Math.random().toString(36).substr(2, 9),
        name,
        active: true
      }));
      setItems(resetItems);
      audioService.playClick();
    }
  };
  
  const handleBulkUpdate = (names: string[]) => {
      const newItems = names.map(name => {
          const existing = items.find(i => i.name === name);
          if (existing) return existing;
          return {
              id: Math.random().toString(36).substr(2, 9),
              name,
              active: true
          };
      });
      setItems(newItems);
      audioService.playClick();
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      
      {/* Header / Nav */}
      <header className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center z-20">
        <div className="flex items-center gap-2 text-rose-800 font-display text-xl cursor-default opacity-80 hover:opacity-100 transition-opacity">
          <Utensils className="w-6 h-6 text-orange-500" />
          <span className="hidden sm:inline">EatWhat.app</span>
        </div>
        
        <div className="flex gap-2 sm:gap-3 items-center">
          <button
             onClick={toggleMute}
             className="p-2 rounded-full bg-white/50 hover:bg-white/80 transition-colors text-rose-600 mr-1"
             title={isMuted ? "开启音效" : "静音"}
          >
             {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          
          <button
            onClick={openMenu}
            className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md border border-orange-100 text-gray-700 rounded-full hover:bg-orange-50 transition-all shadow-sm hover:shadow-md font-bold text-sm"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">菜单 / 设置</span>
            <span className="sm:hidden">设置</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10">
        <div className="flex-1 flex items-center justify-center">
          <MainStage 
            currentFood={currentFood}
            isRunning={isRunning}
            onToggle={handleToggle}
          />
        </div>
        
        {/* Footer */}
        <footer className="p-6 text-center text-rose-300 text-sm font-medium">
           © {new Date().getFullYear()} 今天吃啥呀 • 吃饱了才有力气减肥
        </footer>
      </main>

      {/* Modals */}
      {isMenuOpen && (
        <MenuManager
          items={items}
          onAdd={handleAddItem}
          onRemove={handleRemoveItem}
          onToggleActive={handleToggleItemActive}
          onReset={handleReset}
          onClose={() => setIsMenuOpen(false)}
          onBulkUpdate={handleBulkUpdate}
        />
      )}
    </div>
  );
}

export default App;