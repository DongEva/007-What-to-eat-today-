import React, { useState } from 'react';
import { X, Plus, Trash2, Edit3, List, RefreshCcw } from 'lucide-react';
import { FoodItem } from '../types';

interface MenuManagerProps {
  items: FoodItem[];
  onAdd: (name: string) => void;
  onRemove: (id: string) => void;
  onToggleActive: (id: string) => void;
  onClose: () => void;
  onReset: () => void;
  onBulkUpdate: (names: string[]) => void;
}

export const MenuManager: React.FC<MenuManagerProps> = ({ 
  items, 
  onAdd, 
  onRemove, 
  onToggleActive,
  onClose,
  onReset,
  onBulkUpdate
}) => {
  const [newItemName, setNewItemName] = useState('');
  const [viewMode, setViewMode] = useState<'tags' | 'bulk'>('tags');
  const [bulkText, setBulkText] = useState('');

  // Initialize bulk text when switching to bulk mode
  const handleViewModeChange = (mode: 'tags' | 'bulk') => {
    if (mode === 'bulk') {
      setBulkText(items.map(i => i.name).join(' '));
    } else {
      // Save bulk changes when switching back
      const names = bulkText.split(/[\s,，、]+/).filter(n => n.trim().length > 0);
      // Remove duplicates
      const uniqueNames = Array.from(new Set(names));
      onBulkUpdate(uniqueNames);
    }
    setViewMode(mode);
  };

  const handleAdd = () => {
    if (newItemName.trim()) {
      onAdd(newItemName.trim());
      setNewItemName('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-900/30 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-rose-100 flex items-center justify-between bg-gradient-to-r from-orange-50 to-rose-50">
          <div className="flex items-center gap-3">
             <h2 className="text-2xl font-black text-gray-800 font-display">菜单设置</h2>
             <div className="flex bg-white rounded-lg p-1 border border-rose-100 shadow-sm">
                <button 
                  onClick={() => handleViewModeChange('tags')}
                  className={`px-3 py-1 rounded-md text-sm font-bold transition-colors ${viewMode === 'tags' ? 'bg-rose-100 text-rose-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleViewModeChange('bulk')}
                  className={`px-3 py-1 rounded-md text-sm font-bold transition-colors ${viewMode === 'bulk' ? 'bg-rose-100 text-rose-600' : 'text-gray-400 hover:text-gray-600'}`}
                  title="批量编辑"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-rose-100 rounded-full text-gray-400 hover:text-rose-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {viewMode === 'tags' ? (
          <>
            {/* Input Area (Tags Mode) */}
            <div className="p-5 border-b border-gray-100 space-y-4 bg-white z-10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="输入菜名，回车添加..."
                  className="flex-1 px-5 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-orange-400 focus:bg-white transition-all text-gray-700 placeholder-gray-400"
                />
                <button
                  onClick={handleAdd}
                  disabled={!newItemName.trim()}
                  className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-colors font-bold shadow-lg shadow-gray-200"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              
               <div className="flex justify-end items-center px-1">
                 <button 
                    onClick={onReset}
                    className="text-sm flex items-center text-gray-400 hover:text-red-500 font-medium px-2 py-1 transition-colors"
                 >
                    <RefreshCcw className="w-3 h-3 mr-1" />
                    重置默认
                 </button>
               </div>
            </div>

            {/* List Area */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[#fdfdfd]">
              <div className="flex flex-wrap gap-3 content-start">
                {items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onToggleActive(item.id)}
                    className={`
                      group relative flex items-center px-4 py-2.5 rounded-xl border-2 cursor-pointer select-none transition-all duration-200
                      ${item.active 
                        ? 'bg-white border-orange-100 shadow-sm text-gray-700 hover:border-orange-300 hover:shadow-md' 
                        : 'bg-gray-50 border-gray-100 text-gray-400 grayscale'}
                    `}
                  >
                    <span className="font-bold text-sm md:text-base">{item.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(item.id);
                      }}
                      className="ml-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {items.length === 0 && (
                  <div className="w-full text-center py-20 text-gray-400 flex flex-col items-center">
                    <span className="text-4xl mb-4">🍽️</span>
                    <p>菜单空空如也，快去添加点好吃的吧！</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-3 bg-gray-50 text-center text-xs text-gray-400 border-t border-gray-100">
              点击菜名可暂时屏蔽，不参与随机
            </div>
          </>
        ) : (
          /* Bulk Edit Mode */
          <div className="flex-1 flex flex-col p-6 bg-gray-50">
             <div className="mb-2 text-sm text-gray-500 font-medium">
               直接编辑菜单列表（用空格或逗号分隔）：
             </div>
             <textarea 
                className="flex-1 w-full p-4 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:outline-none resize-none font-medium text-gray-700 leading-relaxed shadow-inner"
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder="例如：红烧肉 盖浇饭 面条..."
             />
             <div className="mt-4 flex justify-end">
                <button 
                  onClick={() => handleViewModeChange('tags')}
                  className="px-6 py-2 bg-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all"
                >
                  保存并返回
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};