import React, { useState } from 'react';
import { ConcisenessLevel, OutputLanguage, AnalysisRequest, AppState, UILanguage, TRANSLATIONS } from './types';
import { analyzeMedia } from './services/geminiService';
import { Input, Select, Toggle } from './components/Controls';
import { ResultCard } from './components/ResultCard';
import { ScriptGenerator } from './components/ScriptGenerator';
import { ImageGenerator } from './components/ImageGenerator';
import { HomePage } from './components/HomePage';
import { Sparkles, PlayCircle, AlertCircle, Loader2, Video, FileText, Image as ImageIcon, Home, Globe } from 'lucide-react';

type ViewMode = 'home' | 'analyzer' | 'script-generator' | 'image-generator';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>('home');
  const [uiLanguage, setUiLanguage] = useState<UILanguage>('en');

  const t = TRANSLATIONS[uiLanguage];

  // Analyzer Form State
  const [url, setUrl] = useState('');
  const [conciseness, setConciseness] = useState<ConcisenessLevel>(ConcisenessLevel.MODERATE);
  const [language, setLanguage] = useState<OutputLanguage>(OutputLanguage.ENGLISH);
  const [includeComments, setIncludeComments] = useState(true);

  // Analyzer Logic State
  const [analyzerState, setAnalyzerState] = useState<AppState>({
    isLoading: false,
    error: null,
    result: null,
  });

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setAnalyzerState(prev => ({ ...prev, error: "Please enter a valid URL." }));
      return;
    }

    setAnalyzerState({ isLoading: true, error: null, result: null });

    const request: AnalysisRequest = {
      url,
      conciseness,
      language,
      includeComments,
    };

    try {
      const result = await analyzeMedia(request);
      setAnalyzerState({ isLoading: false, error: null, result });
    } catch (err: any) {
      setAnalyzerState({ 
        isLoading: false, 
        error: err.message || "An unexpected error occurred.", 
        result: null 
      });
    }
  };

  const NavButton = ({ mode, icon: Icon, label }: { mode: ViewMode; icon: React.ElementType; label: string }) => (
    <button 
      onClick={() => setView(mode)}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
        view === mode
          ? 'bg-indigo-600 text-white shadow-sm' 
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden md:inline">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm backdrop-blur-md bg-white/90">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setView('home')}>
            <div className="bg-gradient-to-tr from-indigo-600 to-purple-500 p-2 rounded-lg text-white group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight hidden sm:block bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-indigo-800">
              {t.appTitle}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Navigation Tabs */}
            <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
               <NavButton mode="home" icon={Home} label={t.nav.home} />
               <NavButton mode="analyzer" icon={FileText} label={t.nav.analyzer} />
               <NavButton mode="script-generator" icon={Video} label={t.nav.script} />
               <NavButton mode="image-generator" icon={ImageIcon} label={t.nav.image} />
            </div>

            {/* Language Switcher */}
            <button 
              onClick={() => setUiLanguage(prev => prev === 'en' ? 'zh' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors text-sm font-medium"
            >
               <Globe className="w-4 h-4" />
               {uiLanguage === 'en' ? 'EN' : '中文'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {view === 'home' ? (
          <HomePage uiLanguage={uiLanguage} onNavigate={setView} />
        ) : view === 'script-generator' ? (
          <ScriptGenerator uiLanguage={uiLanguage} />
        ) : view === 'image-generator' ? (
          <ImageGenerator uiLanguage={uiLanguage} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Left Column: Input Panel */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sticky top-24">
                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-indigo-600" />
                  {t.analyzer.title}
                </h2>
                
                <form onSubmit={handleAnalyze} className="space-y-6">
                  <Input
                    label={t.analyzer.urlLabel}
                    type="url"
                    placeholder={t.analyzer.placeholder}
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                  />

                  <div className="grid grid-cols-1 gap-4">
                    <Select
                      label={t.analyzer.concisenessLabel}
                      value={conciseness}
                      onChange={(e) => setConciseness(e.target.value as ConcisenessLevel)}
                      options={Object.values(ConcisenessLevel).map((v) => ({ label: v, value: v }))}
                    />

                    <Select
                      label={t.analyzer.langLabel}
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as OutputLanguage)}
                      options={Object.values(OutputLanguage).map((v) => ({ label: v, value: v }))}
                    />
                  </div>

                  <div className="border-t border-slate-100 pt-4 mt-2">
                    <Toggle
                      label={t.analyzer.commentsLabel}
                      checked={includeComments}
                      onChange={setIncludeComments}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={analyzerState.isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                  >
                    {analyzerState.isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {t.common.loading}
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        {t.analyzer.btn}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Output Panel */}
            <div className="lg:col-span-8">
              {analyzerState.error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r mb-6 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-red-800">{t.common.error}</h3>
                      <p className="text-sm text-red-700 mt-1">{analyzerState.error}</p>
                    </div>
                  </div>
                </div>
              )}

              {!analyzerState.result && !analyzerState.isLoading && !analyzerState.error && (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-white/50 min-h-[400px]">
                  <div className="bg-slate-50 p-4 rounded-full mb-4">
                    <Sparkles className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">{t.analyzer.readyTitle}</h3>
                  <p className="max-w-xs mx-auto">
                    {t.analyzer.readyDesc}
                  </p>
                </div>
              )}

              {analyzerState.isLoading && (
                <div className="space-y-6">
                   <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-96 animate-pulse">
                      <div className="h-8 bg-slate-200 rounded w-1/3 mb-6"></div>
                      <div className="space-y-3">
                        <div className="h-4 bg-slate-200 rounded w-full"></div>
                        <div className="h-4 bg-slate-200 rounded w-full"></div>
                        <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                        <div className="h-4 bg-slate-200 rounded w-4/6"></div>
                      </div>
                      <div className="mt-8 space-y-3">
                        <div className="h-4 bg-slate-200 rounded w-full"></div>
                        <div className="h-4 bg-slate-200 rounded w-full"></div>
                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      </div>
                   </div>
                </div>
              )}

              {analyzerState.result && (
                <ResultCard result={analyzerState.result} />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;