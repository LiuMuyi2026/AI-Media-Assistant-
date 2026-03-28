import React, { useState } from 'react';
import { ImageGenerationRequest, ImageGenerationResult, IMAGE_STYLES, ASPECT_RATIOS, ImageStyle, AspectRatio, UILanguage, TRANSLATIONS } from '../types';
import { generateSocialImages } from '../services/geminiService';
import { Toggle } from './Controls';
import { Image, Download, Loader2, Sparkles, AlertCircle, Copy } from 'lucide-react';
import JSZip from 'jszip';

interface ImageGeneratorProps {
  uiLanguage: UILanguage;
}

export const ImageGenerator: React.FC<ImageGeneratorProps> = ({ uiLanguage }) => {
  const t = TRANSLATIONS[uiLanguage].image;
  const commonT = TRANSLATIONS[uiLanguage].common;

  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<ImageStyle>('Realistic');
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>('9:16');
  const [count, setCount] = useState(1);
  const [generateCaption, setGenerateCaption] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImageGenerationResult | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const request: ImageGenerationRequest = {
        prompt,
        style: selectedStyle,
        ratio: selectedRatio,
        count,
        generateCaption,
      };
      const data = await generateSocialImages(request);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to generate images");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBatchDownload = async () => {
    if (!result?.images) return;
    const zip = new JSZip();
    result.images.forEach((img, i) => {
      zip.file(`image_${i + 1}.png`, img.base64, { base64: true });
    });
    
    // Add caption as text file if exists
    if (result.caption) {
      zip.file("caption.txt", result.caption);
    }

    const content = await zip.generateAsync({ type: "blob" });
    const url = window.URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generated_images_${Date.now()}.zip`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Input Panel */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sticky top-24">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Image className="w-5 h-5 text-indigo-600" />
            {t.title}
          </h2>

          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t.promptLabel}
              </label>
              <textarea
                className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 transition-colors placeholder-slate-400 min-h-[100px]"
                placeholder={t.placeholder}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
              />
            </div>

            {/* Aspect Ratio Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                {t.ratioLabel}
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {ASPECT_RATIOS.map((ratio) => (
                  <button
                    key={ratio.value}
                    type="button"
                    onClick={() => setSelectedRatio(ratio.value)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                      selectedRatio === ratio.value
                        ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500'
                        : 'bg-white border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className={`w-6 bg-current mb-1 opacity-80 rounded-sm ${ratio.iconClass} ${selectedRatio === ratio.value ? 'text-indigo-600' : 'text-slate-400'}`}></div>
                    <span className={`text-[10px] font-bold ${selectedRatio === ratio.value ? 'text-indigo-700' : 'text-slate-600'}`}>{ratio.value}</span>
                  </button>
                ))}
              </div>
              <div className="mt-2 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-center gap-2">
                 <AlertCircle className="w-3 h-3 text-indigo-500" />
                 {ASPECT_RATIOS.find(r => r.value === selectedRatio)?.description}
              </div>
            </div>

            {/* Style Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                {t.styleLabel}
              </label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1 custom-scrollbar">
                {IMAGE_STYLES.map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setSelectedStyle(style)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      selectedStyle === style
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-300 hover:border-indigo-400 hover:text-indigo-600'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Slider */}
            <div>
               <div className="flex items-center justify-between mb-2">
                 <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                   {t.qtyLabel}: {count}
                 </label>
               </div>
               <input 
                 type="range" 
                 min="1" 
                 max="15" 
                 value={count} 
                 onChange={(e) => setCount(parseInt(e.target.value))}
                 className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
               />
               <div className="flex justify-between text-xs text-slate-400 mt-1 px-1">
                 <span>1</span>
                 <span>15</span>
               </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <Toggle
                label={t.captionLabel}
                checked={generateCaption}
                onChange={setGenerateCaption}
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

        {!result && !isLoading && !error && (
           <div className="h-full flex flex-col items-center justify-center text-center p-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-white/50 min-h-[400px]">
             <div className="bg-slate-50 p-4 rounded-full mb-4">
               <Image className="w-10 h-10 text-slate-300" />
             </div>
             <h3 className="text-lg font-medium text-slate-900 mb-2">{t.readyTitle}</h3>
             <p className="max-w-xs mx-auto">
               {t.readyDesc}
             </p>
           </div>
        )}

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
             {[...Array(count > 4 ? 4 : count)].map((_, i) => (
                <div key={i} className="bg-slate-200 rounded-xl aspect-square w-full"></div>
             ))}
          </div>
        )}

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             
             {/* Text/Caption Section */}
             {result.caption && (
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative group">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Generated Caption</h3>
                  <p className="text-slate-800 text-sm whitespace-pre-wrap">{result.caption}</p>
                  <button 
                    onClick={() => navigator.clipboard.writeText(result.caption || '')}
                    className="absolute top-4 right-4 text-slate-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
               </div>
             )}

             {/* Actions */}
             <div className="flex items-center justify-between">
               <h3 className="text-lg font-bold text-slate-900">Generated Images ({result.images.length})</h3>
               <button
                  onClick={handleBatchDownload}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm px-4 py-2 rounded-lg transition-colors"
               >
                 <Download className="w-4 h-4" />
                 {commonT.download}
               </button>
             </div>

             {/* Grid */}
             <div className={`grid gap-4 ${result.images.length === 1 ? 'grid-cols-1 max-w-md mx-auto' : 'grid-cols-1 sm:grid-cols-2'}`}>
                {result.images.map((img, i) => (
                  <div key={i} className="group relative bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <img 
                      src={`data:${img.mimeType};base64,${img.base64}`} 
                      alt={`Generated ${i}`} 
                      className="w-full h-auto object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                       <a 
                         href={`data:${img.mimeType};base64,${img.base64}`} 
                         download={`generated_image_${i}.png`}
                         className="bg-white text-slate-900 p-2 rounded-full hover:bg-indigo-50 transition-colors"
                         title="Download"
                       >
                         <Download className="w-5 h-5" />
                       </a>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};