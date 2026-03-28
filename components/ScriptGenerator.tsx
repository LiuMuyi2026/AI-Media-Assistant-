import React, { useState } from 'react';
import { ScriptRequest, ScriptResult, VIDEO_STYLES, VideoStyle, OutputLanguage, UILanguage, TRANSLATIONS } from '../types';
import { generateVideoScript } from '../services/geminiService';
import { Select, Toggle } from './Controls';
import { Sparkles, Video, CheckCircle, AlertTriangle, Loader2, Copy, PenTool } from 'lucide-react';

interface ScriptGeneratorProps {
  uiLanguage: UILanguage;
}

export const ScriptGenerator: React.FC<ScriptGeneratorProps> = ({ uiLanguage }) => {
  const t = TRANSLATIONS[uiLanguage].script;
  const commonT = TRANSLATIONS[uiLanguage].common;

  const [topic, setTopic] = useState('');
  const [selectedStyles, setSelectedStyles] = useState<VideoStyle[]>([]);
  const [customInstructions, setCustomInstructions] = useState('');
  const [duration, setDuration] = useState('60 seconds');
  const [language, setLanguage] = useState<OutputLanguage>(OutputLanguage.ENGLISH);
  const [safetyCheck, setSafetyCheck] = useState(true);
  const [factCheck, setFactCheck] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScriptResult | null>(null);

  const toggleStyle = (style: VideoStyle) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter(s => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError("Please enter a topic.");
      return;
    }
    // Allow generation if styles exist OR custom instructions exist
    if (selectedStyles.length === 0 && !customInstructions.trim()) {
      setError("Please select at least one style or provide creative inspiration.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const request: ScriptRequest = {
        topic,
        styles: selectedStyles,
        customInstructions,
        duration,
        language,
        safetyCheck,
        factCheck,
      };
      const data = await generateVideoScript(request);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to generate script");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Input Panel */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sticky top-24">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Video className="w-5 h-5 text-indigo-600" />
            {t.title}
          </h2>

          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t.topicLabel}
              </label>
              <textarea
                className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 transition-colors placeholder-slate-400 min-h-[100px]"
                placeholder={t.placeholder}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                {t.styleLabel}
              </label>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1 mb-4">
                {VIDEO_STYLES.map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => toggleStyle(style)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      selectedStyles.includes(style)
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-300 hover:border-indigo-400 hover:text-indigo-600'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
              
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <PenTool className="w-3 h-3" />
                  {t.customLabel}
                </label>
                <textarea
                  className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 transition-colors placeholder-slate-400 min-h-[80px]"
                  placeholder="e.g. Write it like a 1950s noir detective..."
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.durationLabel}</label>
                <input
                  type="text"
                  className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  placeholder="e.g. 60 sec, 300 words"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
              <Select
                label={t.langLabel}
                value={language}
                onChange={(e) => setLanguage(e.target.value as OutputLanguage)}
                options={Object.values(OutputLanguage).map((v) => ({ label: v, value: v }))}
              />
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2">
              <Toggle
                label={t.safetyLabel}
                checked={safetyCheck}
                onChange={setSafetyCheck}
              />
              <Toggle
                label={t.factLabel}
                checked={factCheck}
                onChange={setFactCheck}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {commonT.loading}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  {t.btn}
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Result Panel */}
      <div className="lg:col-span-7">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r mb-6 animate-in fade-in slide-in-from-bottom-2">
             <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 animate-pulse space-y-4">
             <div className="h-6 bg-slate-200 rounded w-3/4"></div>
             <div className="h-4 bg-slate-200 rounded w-full"></div>
             <div className="h-4 bg-slate-200 rounded w-full"></div>
             <div className="h-32 bg-slate-200 rounded w-full"></div>
          </div>
        )}

        {!result && !isLoading && !error && (
           <div className="h-full flex flex-col items-center justify-center text-center p-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-white/50 min-h-[400px]">
             <div className="bg-slate-50 p-4 rounded-full mb-4">
               <Video className="w-10 h-10 text-slate-300" />
             </div>
             <h3 className="text-lg font-medium text-slate-900 mb-2">{t.readyTitle}</h3>
             <p className="max-w-xs mx-auto">
               {t.readyDesc}
             </p>
           </div>
        )}

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Titles Section */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100">
               <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Suggested Titles</h3>
               <div className="grid gap-3">
                 {result.titles.map((title, i) => (
                   <div key={i} className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-900 font-medium">
                     <span>{title}</span>
                     <button className="text-indigo-400 hover:text-indigo-600" onClick={() => navigator.clipboard.writeText(title)}>
                        <Copy className="w-4 h-4" />
                     </button>
                   </div>
                 ))}
               </div>
            </div>

            {/* Checks Report */}
            {(result.safetyReport || result.factCheckReport) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.safetyReport && (
                   <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                      <div className="flex items-center gap-2 mb-2 text-emerald-800 font-semibold">
                        <CheckCircle className="w-4 h-4" /> Safety Check
                      </div>
                      <p className="text-xs text-emerald-700">{result.safetyReport}</p>
                   </div>
                )}
                {result.factCheckReport && (
                   <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                      <div className="flex items-center gap-2 mb-2 text-blue-800 font-semibold">
                         <AlertTriangle className="w-4 h-4" /> Fact Check
                      </div>
                      <p className="text-xs text-blue-700">{result.factCheckReport}</p>
                   </div>
                )}
              </div>
            )}

            {/* Script Content */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
              <div className="p-6 md:p-8 space-y-8">
                
                {/* Strategy */}
                <div>
                   <span className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold mb-3">Strategy</span>
                   <p className="text-slate-600 text-sm italic">{result.strategy}</p>
                </div>

                <div className="border-t border-slate-100 pt-6">
                   <h3 className="text-lg font-bold text-slate-900 mb-2">1. The Hook (0-3s)</h3>
                   <div className="p-4 bg-slate-50 rounded-lg border-l-4 border-indigo-500 text-slate-800 whitespace-pre-line font-medium">
                     {result.hook}
                   </div>
                </div>

                <div>
                   <h3 className="text-lg font-bold text-slate-900 mb-2">2. Script Body</h3>
                   <div className="prose prose-slate max-w-none text-slate-700 whitespace-pre-line">
                     {result.scriptBody}
                   </div>
                </div>

                <div>
                   <h3 className="text-lg font-bold text-slate-900 mb-2">3. Closing / CTA</h3>
                   <div className="p-4 bg-slate-50 rounded-lg border-l-4 border-emerald-500 text-slate-800 whitespace-pre-line">
                     {result.closing}
                   </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-xl">
                   <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description & Hashtags</h4>
                   <p className="text-sm text-slate-600 whitespace-pre-line">{result.description}</p>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};