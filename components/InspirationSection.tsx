
import React, { useState } from 'react';
import { Inspiration, Term } from '../types';
import { Zap, Map, Database, Crosshair, Edit2 } from 'lucide-react';

interface Props {
  data: Inspiration;
  onChange: (data: Inspiration) => void;
}

const InspirationSection: React.FC<Props> = ({ data, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);

  const updateList = (field: keyof Inspiration, index: number, value: string) => {
    const newList = [...(data[field] as any[])];
    newList[index] = value;
    onChange({ ...data, [field]: newList });
  };

  const updateTerm = (index: number, field: keyof Term, value: string) => {
    const newTerms = [...data.terms];
    newTerms[index] = { ...newTerms[index], [field]: value };
    onChange({ ...data, terms: newTerms });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* 核心创新 - 技术参数面板 */}
      <section className="bg-white border-2 border-zinc-900 p-6 industrial-shadow relative">
        <div className="absolute top-0 right-0 bg-zinc-900 text-yellow-500 px-3 py-1 text-[9px] mono font-bold">CORE_INNOVATIONS</div>
        <div className="flex items-center text-zinc-900 font-black text-lg mb-6 uppercase tracking-tighter">
          <Zap className="w-5 h-5 mr-2 text-yellow-500 fill-yellow-500" />
          系统核心创新
        </div>
        <div className="space-y-4">
          {data.innovations.map((item, idx) => (
            <div key={idx} className="flex items-start group">
              <div className="mono text-[10px] font-black text-zinc-300 mr-4 mt-1">[{idx+1}]</div>
              <textarea
                disabled={!isEditing}
                value={item}
                onChange={(e) => updateList('innovations', idx, e.target.value)}
                className={`w-full text-sm font-bold bg-zinc-50 p-3 border-2 border-zinc-100 outline-none transition-all ${isEditing ? 'border-zinc-300 bg-white' : 'resize-none'}`}
                rows={2}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 世界观设定 - 拓扑结构 */}
      <section className="bg-zinc-900 text-zinc-100 border-2 border-zinc-900 p-6 industrial-shadow relative overflow-hidden">
        <div className="absolute top-[-20px] left-[-20px] w-40 h-40 border-2 border-zinc-800 rounded-full opacity-20"></div>
        <div className="flex items-center text-white font-black text-lg mb-6 uppercase tracking-tighter">
          <Map className="w-5 h-5 mr-2 text-blue-400" />
          环境拓扑设定
        </div>
        <div className="flex flex-wrap gap-3 relative z-10">
          {data.settings.map((item, idx) => (
            <div key={idx} className="bg-zinc-800 border border-zinc-700 px-4 py-2 text-xs font-black mono text-blue-300">
              {isEditing ? (
                <input 
                  value={item}
                  onChange={(e) => updateList('settings', idx, e.target.value)}
                  className="bg-transparent border-none outline-none w-24 text-center"
                />
              ) : `> ${item.toUpperCase()}`}
            </div>
          ))}
        </div>
      </section>

      {/* 名词词典 - 数据库视图 */}
      <section className="bg-white border-2 border-zinc-900 p-6 md:col-span-2 industrial-shadow relative">
        <div className="flex items-center text-zinc-900 font-black text-lg mb-8 uppercase tracking-tighter">
          <Database className="w-5 h-5 mr-2 text-zinc-500" />
          专用术语及核心逻辑
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {data.terms.map((term, idx) => (
            <div key={idx} className="p-5 border-2 border-zinc-200 bg-zinc-50 space-y-3 hover:border-zinc-900 transition-colors">
              <input
                disabled={!isEditing}
                value={term.name}
                onChange={(e) => updateTerm(idx, 'name', e.target.value)}
                className={`text-sm font-black text-zinc-900 bg-transparent outline-none w-full uppercase ${isEditing ? 'border-b-2 border-blue-400' : ''}`}
                placeholder="名称"
              />
              <textarea
                disabled={!isEditing}
                value={term.description}
                onChange={(e) => updateTerm(idx, 'description', e.target.value)}
                className={`text-[11px] font-bold text-zinc-500 bg-transparent outline-none w-full leading-relaxed ${isEditing ? 'bg-white p-2 border border-zinc-200 mt-2' : 'resize-none'}`}
                rows={3}
                placeholder="功能定义..."
              />
            </div>
          ))}
        </div>
      </section>

      {/* 概念资产 - 资产清单 */}
      <section className="bg-yellow-500 border-2 border-zinc-900 p-6 md:col-span-2 industrial-shadow">
        <div className="flex items-center text-zinc-900 font-black text-lg mb-6 uppercase tracking-tighter">
          <Crosshair className="w-5 h-5 mr-2" />
          特种装备及核心概念清单
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {data.concepts.map((concept, idx) => (
            <div key={idx} className="flex items-center p-3 bg-zinc-900 text-yellow-500 border-2 border-zinc-900">
              <div className="w-1.5 h-1.5 bg-yellow-500 mr-3"></div>
              <input
                disabled={!isEditing}
                value={concept}
                onChange={(e) => updateList('concepts', idx, e.target.value)}
                className={`text-[11px] font-black bg-transparent outline-none w-full uppercase ${isEditing ? 'border-b border-yellow-700' : ''}`}
                placeholder="ASSET_ID"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default InspirationSection;
