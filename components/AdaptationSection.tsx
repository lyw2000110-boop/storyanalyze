
import React, { useState } from 'react';
import { Adaptation, AdaptationItem } from '../types';
import { Sparkles, Lightbulb, Repeat, BookOpen, Edit2, Save } from 'lucide-react';

interface Props {
  data: Adaptation;
  onChange: (data: Adaptation) => void;
}

const AdaptationSection: React.FC<Props> = ({ data, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);

  const updateRewrite = (index: number, field: keyof AdaptationItem, value: string) => {
    const newRewrites = [...data.rewrites];
    newRewrites[index] = { ...newRewrites[index], [field]: value };
    onChange({ ...data, rewrites: newRewrites });
  };

  const updateEssence = (value: string) => {
    onChange({ ...data, essence: value });
  };

  return (
    <div className="space-y-8">
      {/* 顶部控制栏 */}
      <div className="flex justify-end">
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-black uppercase transition-all border-2 border-zinc-900 industrial-shadow-sm ${
            isEditing ? 'bg-emerald-500 text-white' : 'bg-white text-zinc-900 hover:bg-zinc-50'
          }`}
        >
          {isEditing ? <Save className="w-3 h-3" /> : <Edit2 className="w-3 h-3" />}
          {isEditing ? 'Confirm_Changes' : 'Modify_Intel'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 同类仿写/灵感改写 - 扩展模块 */}
        <section className="md:col-span-2 space-y-6">
          <div className="flex items-center text-zinc-900 font-black text-xl uppercase tracking-tighter mb-2">
            <Repeat className="w-6 h-6 mr-3 text-blue-600" />
            同类仿写与灵感重构
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {data.rewrites.map((item, idx) => (
              <div key={idx} className="bg-white border-2 border-zinc-900 p-6 industrial-shadow relative group hover:translate-x-1 transition-all">
                <div className="absolute top-0 right-0 bg-zinc-100 text-zinc-400 px-3 py-1 text-[9px] mono font-bold border-l-2 border-b-2 border-zinc-900">
                  REWRITE_MODULE_{idx + 1}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-[10px] font-black text-zinc-400 uppercase mb-1">Target_Title</div>
                    <input
                      disabled={!isEditing}
                      value={item.title}
                      onChange={(e) => updateRewrite(idx, 'title', e.target.value)}
                      className={`w-full text-lg font-black text-zinc-900 bg-transparent outline-none ${
                        isEditing ? 'border-b-2 border-blue-400 pb-1' : ''
                      }`}
                      placeholder="改写标题"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-6">
                    <div>
                      <div className="text-[10px] font-black text-blue-600 uppercase mb-2 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Core_Concept
                      </div>
                      <textarea
                        disabled={!isEditing}
                        value={item.concept}
                        onChange={(e) => updateRewrite(idx, 'concept', e.target.value)}
                        className={`w-full text-xs font-bold text-zinc-600 bg-zinc-50 p-3 border-2 border-zinc-100 outline-none leading-relaxed ${
                          isEditing ? 'bg-white border-zinc-300' : 'resize-none'
                        }`}
                        rows={6}
                        placeholder="核心梗概..."
                      />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-emerald-600 uppercase mb-2 flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        Draft_Content
                      </div>
                      <textarea
                        disabled={!isEditing}
                        value={item.rewrite}
                        onChange={(e) => updateRewrite(idx, 'rewrite', e.target.value)}
                        className={`w-full text-xs font-bold text-zinc-600 bg-zinc-50 p-3 border-2 border-zinc-100 outline-none leading-relaxed ${
                          isEditing ? 'bg-white border-zinc-300' : 'resize-none'
                        }`}
                        rows={6}
                        placeholder="改写内容..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 故事精华提取 - 核心模块 */}
        <section className="bg-zinc-900 text-white border-2 border-zinc-900 p-6 industrial-shadow relative md:col-span-1">
          <div className="absolute top-0 right-0 bg-yellow-500 text-zinc-900 px-3 py-1 text-[9px] mono font-black">CORE_ESSENCE</div>
          <div className="flex items-center font-black text-lg mb-6 uppercase tracking-tighter">
            <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
            精华设定提取
          </div>
          <div className="relative">
            <div className="absolute -left-2 top-0 bottom-0 w-1 bg-yellow-500"></div>
            <textarea
              disabled={!isEditing}
              value={data.essence}
              onChange={(e) => updateEssence(e.target.value)}
              className={`w-full text-sm font-bold bg-zinc-800 p-4 border-none outline-none leading-relaxed transition-all ${
                isEditing ? 'bg-zinc-700 ring-2 ring-yellow-500' : 'resize-none'
              }`}
              rows={30}
              placeholder="正在提取核心精华..."
            />
          </div>
          <div className="mt-4 text-[9px] mono text-zinc-500 uppercase">
            Status: Extraction_Complete // Precision: 98.4%
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdaptationSection;
