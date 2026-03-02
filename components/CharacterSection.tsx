
import React, { useState } from 'react';
import { Character } from '../types';
import { User, Shield, FileText, Settings, Cpu, ChevronRight } from 'lucide-react';

interface Props {
  data: Character[];
  onChange: (data: Character[]) => void;
}

const CharacterSection: React.FC<Props> = ({ data, onChange }) => {
  const [selectedId, setSelectedId] = useState<string>(data[0]?.id || '');
  const [isEditing, setIsEditing] = useState(false);

  const selectedChar = data.find(c => c.id === selectedId) || data[0];

  const handleUpdate = (field: keyof Character, value: any) => {
    const newData = data.map(c => c.id === selectedId ? { ...c, [field]: value } : c);
    onChange(newData);
  };

  // 工业级动态头像引擎
  const getAvatarUrl = (char: Character) => {
    if (!char.isHuman) {
      // 非人类：使用工业感十足的 Identicon (色块)
      return `https://api.dicebear.com/7.x/identicon/svg?seed=${char.avatarSeed}`;
    }
    
    // 人类：根据性别和年龄段调整种子
    const genderPrefix = char.gender === '男' ? 'male' : char.gender === '女' ? 'female' : 'neutral';
    const ageTag = char.ageRange === '少儿' ? 'child' : char.ageRange === '老年' ? 'senior' : 'adult';
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${genderPrefix}-${ageTag}-${char.avatarSeed}`;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* 人物索引 - 工业侧边栏 */}
      <div className="lg:w-80 flex-shrink-0">
        <div className="bg-zinc-900 text-yellow-500 px-4 py-2 text-[11px] font-black mono uppercase mb-3 flex justify-between items-center">
          <span>Personnel_Database</span>
          <span className="bg-yellow-500 text-zinc-900 px-1">{data.length}</span>
        </div>
        <div className="flex lg:flex-col overflow-x-auto lg:overflow-y-auto gap-3 pb-4 lg:pb-0 lg:max-h-[70vh] scrollbar-hide">
          {data.map((char) => (
            <button
              key={char.id}
              onClick={() => setSelectedId(char.id)}
              className={`flex-shrink-0 w-56 lg:w-full flex items-center p-4 transition-all border-2 relative group ${
                selectedId === char.id 
                ? 'bg-yellow-500 border-zinc-900 translate-x-1 -translate-y-1 industrial-shadow-sm' 
                : 'bg-white border-zinc-200 text-zinc-500 hover:border-zinc-400'
              }`}
            >
              <div className="w-12 h-12 bg-zinc-900 border-2 border-zinc-900 mr-4 flex-shrink-0 flex items-center justify-center">
                <span className="text-yellow-500 font-black text-xl">{char.name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="text-left overflow-hidden">
                <div className="font-black text-sm truncate uppercase mb-0.5">{char.name}</div>
                <div className={`mono text-[10px] font-bold truncate opacity-70`}>
                  [{char.gender} | {char.ageRange}]
                </div>
              </div>
              {selectedId === char.id && <ChevronRight className="absolute right-2 w-4 h-4 text-zinc-900" />}
            </button>
          ))}
        </div>
      </div>

      {/* 核心档案卡 */}
      <div className="flex-1">
        {selectedChar ? (
          <div className="bg-white border-2 border-zinc-900 industrial-shadow">
            {/* 档案头部 */}
            <div className="bg-zinc-100 border-b-2 border-zinc-900 p-6 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 opacity-5 pointer-events-none">
                <Cpu className="w-full h-full rotate-12" />
              </div>
              
              <div className="w-32 h-32 bg-zinc-900 border-4 border-zinc-900 flex-shrink-0 industrial-shadow-sm flex items-center justify-center">
                <span className="text-yellow-500 font-black text-6xl">{selectedChar.name.charAt(0).toUpperCase()}</span>
              </div>

              <div className="flex-1 text-center md:text-left space-y-2">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <span className="mono text-[10px] font-black bg-blue-600 text-white px-2 py-0.5 uppercase tracking-widest">Active_Subject</span>
                  {!selectedChar.isHuman && <span className="mono text-[10px] font-black bg-zinc-900 text-yellow-500 px-2 py-0.5 uppercase">Non_Human</span>}
                </div>
                <input
                  disabled={!isEditing}
                  value={selectedChar.name}
                  onChange={(e) => handleUpdate('name', e.target.value)}
                  className={`text-4xl font-black text-zinc-900 bg-transparent outline-none w-full uppercase tracking-tighter ${isEditing ? 'border-b-2 border-dashed border-blue-400' : ''}`}
                />
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="mono text-xs font-bold text-zinc-400 uppercase">Role: <span className="text-zinc-900">{selectedChar.role}</span></div>
                  <div className="mono text-xs font-bold text-zinc-400 uppercase">Spec: <span className="text-zinc-900">{selectedChar.gender}/{selectedChar.ageRange}</span></div>
                </div>
              </div>

              <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`px-8 py-3 font-black text-xs uppercase border-2 border-zinc-900 transition-all industrial-shadow-sm ${
                  isEditing ? 'bg-zinc-900 text-yellow-500' : 'bg-white text-zinc-900 hover:bg-zinc-50'
                }`}
              >
                {isEditing ? 'Save_Changes' : 'Modify_Entry'}
              </button>
            </div>

            {/* 详细数据区 */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-3 border-b-2 border-zinc-100 pb-1">
                    <label className="flex items-center text-[11px] font-black uppercase text-zinc-900 mono">
                      <Settings className="w-3 h-3 mr-2 text-blue-600" /> Behavioral_Matrix / 性格特征
                    </label>
                  </div>
                  <textarea
                    disabled={!isEditing}
                    value={selectedChar.personality}
                    onChange={(e) => handleUpdate('personality', e.target.value)}
                    rows={4}
                    className={`w-full text-sm font-bold bg-zinc-50 p-5 border-2 border-zinc-100 outline-none focus:border-zinc-900 transition-all leading-relaxed ${isEditing ? 'bg-white' : 'resize-none'}`}
                  />
                </div>
                <div>
                   <div className="flex items-center justify-between mb-3 border-b-2 border-zinc-100 pb-1">
                    <label className="flex items-center text-[11px] font-black uppercase text-zinc-900 mono">
                      <Cpu className="w-3 h-3 mr-2 text-red-600" /> Physical_Observation / 外貌描写
                    </label>
                  </div>
                  <textarea
                    disabled={!isEditing}
                    value={selectedChar.appearance}
                    onChange={(e) => handleUpdate('appearance', e.target.value)}
                    rows={4}
                    className={`w-full text-sm font-bold bg-zinc-50 p-5 border-2 border-zinc-100 outline-none focus:border-zinc-900 transition-all leading-relaxed ${isEditing ? 'bg-white' : 'resize-none'}`}
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-3 border-b-2 border-zinc-100 pb-1">
                  <label className="flex items-center text-[11px] font-black uppercase text-zinc-900 mono">
                    <FileText className="w-3 h-3 mr-2 text-zinc-400" /> Subject_Timeline / 人物小传
                  </label>
                </div>
                <textarea
                  disabled={!isEditing}
                  value={selectedChar.bio}
                  onChange={(e) => handleUpdate('bio', e.target.value)}
                  className={`flex-1 w-full text-sm font-bold bg-zinc-50 p-5 border-2 border-zinc-100 outline-none focus:border-zinc-900 transition-all leading-relaxed ${isEditing ? 'bg-white' : 'resize-none'}`}
                  rows={10}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full border-4 border-dashed border-zinc-200 mono text-zinc-300 text-xl font-black">
            NO_SUBJECT_LOADED
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterSection;
