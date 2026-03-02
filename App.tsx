
import React, { useState, useEffect } from 'react';
import { StoryAnalysis, Tab, ArchiveEntry } from './types';
import { analyzeManuscript, generateAdaptation } from './services/geminiService';
import CharacterSection from './components/CharacterSection';
import OutlineSection from './components/OutlineSection';
import InspirationSection from './components/InspirationSection';
import AdaptationSection from './components/AdaptationSection';
import { Download, Upload, Save, FileText, Loader2, Sparkles, BookOpen, BrainCircuit, Users, Terminal, Database, Trash2, X, ExternalLink, Repeat } from 'lucide-react';
import mammoth from 'mammoth';

const App: React.FC = () => {
  const [analysis, setAnalysis] = useState<StoryAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdaptationLoading, setIsAdaptationLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Characters);
  const [statusMsg, setStatusMsg] = useState('');
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [archives, setArchives] = useState<ArchiveEntry[]>([]);

  useEffect(() => {
    // 加载当前活跃分析
    const saved = localStorage.getItem('story_analysis_industrial');
    if (saved) {
      try {
        setAnalysis(JSON.parse(saved));
      } catch (e) {
        console.error("无法加载保存的分析", e);
      }
    }
    // 加载仓库存档
    const savedArchives = localStorage.getItem('story_repository_v1');
    if (savedArchives) {
      try {
        setArchives(JSON.parse(savedArchives));
      } catch (e) {
        console.error("无法加载仓库数据", e);
      }
    }
  }, []);

  const handleTabChange = async (tab: Tab) => {
    setActiveTab(tab);
    if (tab === Tab.Adaptation && analysis && !analysis.adaptation && !isAdaptationLoading) {
      setIsAdaptationLoading(true);
      try {
        const adaptation = await generateAdaptation(analysis);
        const updatedAnalysis = { ...analysis, adaptation };
        setAnalysis(updatedAnalysis);
        localStorage.setItem('story_analysis_industrial', JSON.stringify(updatedAnalysis));
      } catch (error) {
        console.error("生成仿写失败", error);
        alert("生成仿写灵感失败，请重试。");
      } finally {
        setIsAdaptationLoading(false);
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setStatusMsg('SYSTEM: INITIALIZING_SCAN...');
    
    try {
      let text = '';
      const fileName = file.name.toLowerCase();
      
      if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else {
        text = await file.text();
      }

      if (!text || text.trim().length === 0) {
        throw new Error("EMPTY_DATA_BUFFER");
      }

      setStatusMsg('SYSTEM: AI_NEURAL_PROCESSING...');
      const result = await analyzeManuscript(text);
      setAnalysis(result);
      localStorage.setItem('story_analysis_industrial', JSON.stringify(result));
      setStatusMsg('');
    } catch (error) {
      console.error("分析失败", error);
      alert("错误：文档读取失败。请检查文件格式。");
    } finally {
      setIsLoading(false);
      event.target.value = '';
    }
  };

  const handleSaveToRepository = () => {
    if (analysis) {
      const newEntry: ArchiveEntry = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        title: analysis.title,
        data: JSON.parse(JSON.stringify(analysis))
      };
      
      const updatedArchives = [newEntry, ...archives];
      setArchives(updatedArchives);
      localStorage.setItem('story_repository_v1', JSON.stringify(updatedArchives));
      localStorage.setItem('story_analysis_industrial', JSON.stringify(analysis));
      alert(`已成功存入仓库：${analysis.title}`);
    }
  };

  const deleteArchive = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('确定要删除此存档吗？')) {
      const updated = archives.filter(a => a.id !== id);
      setArchives(updated);
      localStorage.setItem('story_repository_v1', JSON.stringify(updated));
    }
  };

  const loadFromArchive = (entry: ArchiveEntry) => {
    setAnalysis(entry.data);
    localStorage.setItem('story_analysis_industrial', JSON.stringify(entry.data));
    setIsArchiveOpen(false);
  };

  const handleExportHTML = () => {
    if (!analysis) return;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${analysis.title} - 故事分析报告</title>
    <style>
        body { font-family: sans-serif; background: #f4f4f5; color: #18181b; padding: 40px; }
        .container { max-width: 800px; margin: 0 auto; background: white; border: 2px solid #18181b; box-shadow: 8px 8px 0px #18181b; padding: 40px; }
        h1 { border-bottom: 4px solid #fbbf24; padding-bottom: 10px; text-transform: uppercase; }
        .section { margin-bottom: 40px; }
        .card { border: 1px solid #e4e4e7; padding: 20px; margin-bottom: 20px; background: #fafafa; }
        .label { font-size: 10px; font-weight: bold; color: #71717a; text-transform: uppercase; margin-bottom: 5px; }
        .char-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media print { body { background: white; padding: 0; } .container { border: none; box-shadow: none; width: 100%; } }
    </style>
</head>
<body>
    <div class="container">
        <h1>FILE: ${analysis.title}</h1>
        <div class="section">
            <h2>人员档案 (Personnel)</h2>
            ${analysis.characters.map(c => `
                <div class="card">
                    <div class="label">NAME / ROLE</div>
                    <h3>${c.name} [${c.role}]</h3>
                    <div class="char-grid">
                        <div><div class="label">PERSONALITY</div><p>${c.personality}</p></div>
                        <div><div class="label">APPEARANCE</div><p>${c.appearance}</p></div>
                    </div>
                    <div class="label">BIO</div>
                    <p>${c.bio}</p>
                </div>
            `).join('')}
        </div>
        <div class="section">
            <h2>行动纲要 (Outline)</h2>
            <div class="card">
                <div class="label">STORY SUMMARY</div>
                <p>${analysis.outline.storySummary}</p>
            </div>
            ${analysis.outline.chapters.map((ch, idx) => `
                <div class="card">
                    <div class="label">CHAPTER ${idx + 1}: ${ch.title}</div>
                    <p>${ch.summary}</p>
                </div>
            `).join('')}
        </div>
        <div class="section">
            <h2>技术灵感 (Intel)</h2>
            <div class="card">
                <div class="label">INNOVATIONS</div>
                <p>${analysis.inspiration.innovations.join('; ')}</p>
            </div>
            <div class="card">
                <div class="label">CONCEPTS</div>
                <p>${analysis.inspiration.concepts.join('; ')}</p>
            </div>
        </div>
        <div class="section">
            <h2>同类仿写 (Adaptation)</h2>
            ${analysis.adaptation ? `
                <div class="card">
                    <div class="label">CORE ESSENCE</div>
                    <p>${analysis.adaptation.essence}</p>
                </div>
                ${analysis.adaptation.rewrites.map(r => `
                    <div class="card">
                        <div class="label">REWRITE: ${r.title}</div>
                        <p><strong>Concept:</strong> ${r.concept}</p>
                        <p>${r.rewrite}</p>
                    </div>
                `).join('')}
            ` : '<p>尚未生成仿写灵感数据。</p>'}
        </div>
        <footer style="margin-top: 50px; font-size: 10px; color: #71717a; text-align: center;">
            STORY ANALYZER INDUSTRIAL SERIES - GENERATED AT ${new Date().toLocaleString()}
        </footer>
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `STORY_DATA_${analysis.title.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col pb-10">
      {/* 工业风页眉 */}
      <header className="bg-zinc-900 text-white border-b-4 border-yellow-500 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-500 text-zinc-900 p-1 font-black mono text-xs">V2.6</div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic flex items-center gap-2">
              <Terminal className="w-5 h-5" />
              StoryAnalyzer <span className="text-yellow-500">PRO</span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsArchiveOpen(true)}
              className="flex items-center gap-2 px-4 py-1 text-xs font-black bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 transition-colors uppercase mr-2"
            >
              <Database className="w-3 h-3 text-yellow-500" />
              Repository
            </button>
            {analysis && (
              <div className="hidden sm:flex gap-2">
                <button onClick={handleSaveToRepository} className="px-3 py-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 transition-colors uppercase flex items-center gap-1">
                  <Save className="w-3 h-3" />
                  Save_Data
                </button>
                <button onClick={handleExportHTML} className="px-3 py-1 text-xs font-bold bg-blue-600 hover:bg-blue-500 transition-colors uppercase flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  Export
                </button>
              </div>
            )}
            <label className="bg-yellow-500 text-zinc-900 px-4 py-1 text-xs font-black uppercase cursor-pointer hover:bg-yellow-400 transition-all flex items-center gap-2">
              <Upload className="w-3 h-3" />
              Scan
              <input type="file" className="hidden" accept=".docx,.doc,.txt,.md" onChange={handleFileUpload} />
            </label>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8">
        {!analysis && !isLoading ? (
          <div className="mt-20 flex flex-col items-center">
            <div className="industrial-border p-12 bg-white industrial-shadow max-w-lg w-full text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 bg-zinc-900 text-white px-3 py-1 text-[10px] font-bold mono">ID: SOURCE_ENTRY</div>
               <FileText className="w-16 h-16 mx-auto mb-6 text-zinc-300" />
               <h2 className="text-2xl font-black mb-4 uppercase tracking-tight">等待载入文稿...</h2>
               <p className="text-sm text-zinc-500 mb-8 mono">SUPPORTED_FORMATS: [DOCX, TXT, MD]</p>
               <label className="block w-full py-4 bg-zinc-900 text-yellow-500 font-black text-lg industrial-btn-hover industrial-btn-active cursor-pointer transition-all uppercase tracking-widest">
                  Initialize Scan
                  <input type="file" className="hidden" accept=".docx,.doc,.txt,.md" onChange={handleFileUpload} />
               </label>
            </div>
            
            <button 
              onClick={() => setIsArchiveOpen(true)}
              className="mt-8 flex items-center gap-3 px-6 py-3 border-2 border-zinc-900 bg-white industrial-shadow-sm font-black text-sm uppercase hover:bg-zinc-50 transition-all"
            >
              <Database className="w-4 h-4" />
              打开存档仓库查看已保存的项目
            </button>
          </div>
        ) : isLoading ? (
          <div className="mt-20 flex flex-col items-center">
             <div className="w-64 h-2 bg-zinc-200 industrial-border overflow-hidden mb-4">
                <div className="h-full bg-yellow-500 w-1/2 animate-[progress_2s_infinite_linear]"></div>
             </div>
             <div className="mono text-sm font-bold animate-pulse text-zinc-600">{statusMsg}</div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* 作品标题条 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-l-8 border-zinc-900 pl-6 gap-4">
              <div>
                <div className="mono text-[10px] font-black text-zinc-400 bg-zinc-100 px-2 py-0.5 inline-block mb-1 uppercase">Object_Title</div>
                <h2 className="text-4xl font-black text-zinc-900 uppercase tracking-tighter">{analysis?.title}</h2>
              </div>
              
              {/* 标签切换器 */}
              <nav className="flex bg-zinc-200 p-1 border-2 border-zinc-900 industrial-shadow-sm overflow-x-auto scrollbar-hide">
                {(['Characters', 'Outline', 'Inspiration', 'Adaptation'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => handleTabChange(Tab[t])}
                    className={`px-4 md:px-6 py-2 text-xs font-black uppercase transition-all whitespace-nowrap ${
                      activeTab === Tab[t] 
                      ? 'bg-zinc-900 text-yellow-500' 
                      : 'text-zinc-500 hover:text-zinc-900'
                    }`}
                  >
                    {t === 'Characters' ? 'Personnel' : t === 'Outline' ? 'Mission' : t === 'Inspiration' ? 'Intel' : 'Adaptation'}
                  </button>
                ))}
              </nav>
            </div>

            {/* 内容区域 */}
            <div className="min-h-[600px] animate-in fade-in slide-in-from-bottom-2 duration-300">
              {activeTab === Tab.Characters && analysis && (
                <CharacterSection 
                  data={analysis.characters} 
                  onChange={(newData) => setAnalysis({ ...analysis, characters: newData })} 
                />
              )}
              {activeTab === Tab.Outline && analysis && (
                <OutlineSection 
                  data={analysis.outline} 
                  onChange={(newData) => setAnalysis({ ...analysis, outline: newData })} 
                />
              )}
              {activeTab === Tab.Inspiration && analysis && (
                <InspirationSection 
                  data={analysis.inspiration} 
                  onChange={(newData) => setAnalysis({ ...analysis, inspiration: newData })} 
                />
              )}
              {activeTab === Tab.Adaptation && analysis && (
                isAdaptationLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-white border-2 border-zinc-900 industrial-shadow">
                    <Loader2 className="w-12 h-12 text-yellow-500 animate-spin mb-4" />
                    <div className="mono text-sm font-black uppercase tracking-widest animate-pulse">
                      Generating_Adaptation_Intel...
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-2 mono">NEURAL_NETWORK_PROCESSING</div>
                  </div>
                ) : analysis.adaptation ? (
                  <AdaptationSection 
                    data={analysis.adaptation} 
                    onChange={(newData) => setAnalysis({ ...analysis, adaptation: newData })} 
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 bg-white border-2 border-zinc-900 industrial-shadow">
                    <Repeat className="w-12 h-12 text-zinc-300 mb-4" />
                    <p className="text-zinc-500 font-bold">未生成仿写数据</p>
                    <button 
                      onClick={() => handleTabChange(Tab.Adaptation)}
                      className="mt-4 px-6 py-2 bg-zinc-900 text-yellow-500 font-black text-xs uppercase industrial-shadow-sm"
                    >
                      Retry_Generation
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </main>

      {/* 仓库抽屉/弹窗 */}
      {isArchiveOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsArchiveOpen(false)} />
          <div className="relative w-full max-w-md bg-zinc-100 h-full industrial-border border-y-0 border-r-0 flex flex-col industrial-shadow animate-in slide-in-from-right duration-300">
            <div className="bg-zinc-900 text-yellow-500 p-6 flex justify-between items-center border-b-4 border-yellow-500">
              <div className="flex items-center gap-3">
                <Database className="w-6 h-6" />
                <h2 className="text-xl font-black uppercase tracking-tighter">Repository_Archives</h2>
              </div>
              <button onClick={() => setIsArchiveOpen(false)} className="p-2 hover:bg-zinc-800 transition-colors">
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {archives.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-zinc-300 text-zinc-400 mono italic text-sm">
                  NO_ARCHIVES_FOUND
                </div>
              ) : (
                archives.map((entry) => (
                  <div 
                    key={entry.id} 
                    onClick={() => loadFromArchive(entry)}
                    className="bg-white border-2 border-zinc-900 p-4 industrial-shadow-sm hover:translate-x-1 hover:-translate-y-1 transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="mono text-[10px] font-black text-blue-600 uppercase">
                        {new Date(entry.timestamp).toLocaleDateString()}
                      </div>
                      <button 
                        onClick={(e) => deleteArchive(entry.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-red-500 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="font-black text-lg text-zinc-900 uppercase tracking-tight">{entry.title}</h3>
                    <div className="mt-2 text-[10px] font-bold text-zinc-400 mono uppercase flex gap-4">
                      <span>Chars: {entry.data.characters.length}</span>
                      <span>Steps: {entry.data.outline.chapters.length}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 bg-zinc-200 border-t-2 border-zinc-300 text-[9px] mono text-zinc-500 uppercase">
              Storage: Local_Disk_Cache (Sync Enabled)
            </div>
          </div>
        </div>
      )}

      {/* 底部条 */}
      <footer className="mt-auto border-t-2 border-zinc-300 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold mono text-zinc-400 uppercase tracking-widest">
          <div className="flex items-center gap-4">
            <span>Status: Operational</span>
            <span className="text-emerald-500 animate-pulse">● System_Online</span>
          </div>
          <div>© StoryAnalyzer_Industrial_Series_2024</div>
          <div className="flex gap-4">
            <button onClick={() => setIsArchiveOpen(true)} className="hover:text-zinc-900 transition-colors">Open_Repository</button>
            <span>Encryption: AES-256</span>
          </div>
        </div>
      </footer>

      {/* 隐藏的辅助导出容器 */}
      <div id="pdf-export-content" className="hidden"></div>
    </div>
  );
};

export default App;
