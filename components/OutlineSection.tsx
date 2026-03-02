
import React, { useState } from 'react';
import { Outline, Chapter } from '../types';
import { Layers, Activity, Edit2 } from 'lucide-react';

interface Props {
  data: Outline;
  onChange: (data: Outline) => void;
}

const OutlineSection: React.FC<Props> = ({ data, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleChapterUpdate = (index: number, field: keyof Chapter, value: string) => {
    const newChapters = [...data.chapters];
    newChapters[index] = { ...newChapters[index], [field]: value };
    onChange({ ...data, chapters: newChapters });
  };

  return (
    <div className="space-y-10">
      {/* 核心概述 */}
      <div className="bg-zinc-900 text-white p-8 border-b-8 border-yellow-500 industrial-shadow">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
             <div className="bg-white text-zinc-900 p-2 border-2 border-yellow-500">
                <Layers className="w-6 h-6" />
             </div>
             <div>
                <div className="mono text-[10px] font-black text-zinc-500 uppercase">Mission_Briefing</div>
                <h3 className="text-2xl font-black uppercase tracking-tighter">总体行动纲要</h3>
             </div>
          </div>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 border-2 border-white text-xs font-black uppercase hover:bg-white hover:text-zinc-900 transition-all"
          >
            {isEditing ? 'Sync_Save' : 'Modify_Data'}
          </button>
        </div>
        <textarea
          disabled={!isEditing}
          value={data.storySummary}
          onChange={(e) => onChange({ ...data, storySummary: e.target.value })}
          className={`w-full text-lg font-medium leading-relaxed bg-zinc-800 text-zinc-100 p-6 border-2 border-zinc-700 outline-none focus:border-yellow-500 transition-all ${isEditing ? 'bg-zinc-700' : 'resize-none'}`}
          rows={5}
        />
      </div>

      {/* 模块化章节 */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-zinc-900" />
          <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest mono">Phased_Operations</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.chapters.map((chapter, idx) => (
            <div key={chapter.id} className="bg-white border-2 border-zinc-900 industrial-shadow-sm group">
              <div className="bg-zinc-100 border-b-2 border-zinc-900 p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="mono text-[10px] font-black bg-zinc-900 text-white px-2 py-0.5">STEP_${(idx + 1).toString().padStart(2, '0')}</span>
                  <input
                    disabled={!isEditing}
                    value={chapter.title}
                    onChange={(e) => handleChapterUpdate(idx, 'title', e.target.value)}
                    className={`font-black text-sm text-zinc-800 bg-transparent outline-none uppercase ${isEditing ? 'border-b border-dashed border-zinc-400' : ''}`}
                  />
                </div>
              </div>
              <div className="p-4">
                <textarea
                  disabled={!isEditing}
                  value={chapter.summary}
                  onChange={(e) => handleChapterUpdate(idx, 'summary', e.target.value)}
                  className={`w-full text-sm font-medium leading-relaxed text-zinc-600 bg-transparent outline-none transition-all ${isEditing ? 'p-2 bg-zinc-50 border border-zinc-200' : 'resize-none'}`}
                  rows={4}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OutlineSection;
