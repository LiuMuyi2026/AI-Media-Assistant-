import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { FileText, MessageSquare, AlignLeft, ExternalLink } from 'lucide-react';

interface ResultCardProps {
  result: AnalysisResult;
}

type Tab = 'summary' | 'original' | 'comments';

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState<Tab>('summary');

  // Simple Markdown-like parser for bold text and lists
  const renderText = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Bold text handling **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <div key={i} className={`mb-2 ${line.startsWith('-') || line.startsWith('•') ? 'pl-4' : ''}`}>
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
            }
            return <span key={j}>{part}</span>;
          })}
        </div>
      );
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Tabs Header */}
      <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto">
        <button
          onClick={() => setActiveTab('summary')}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'summary'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <AlignLeft className="w-4 h-4" />
          Summary
        </button>
        <button
          onClick={() => setActiveTab('original')}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'original'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          Original / Transcript
        </button>
        {result.commentsSummary && (
          <button
            onClick={() => setActiveTab('comments')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'comments'
                ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Comments & Insights
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="p-6 md:p-8 min-h-[300px] text-slate-700 leading-relaxed">
        {activeTab === 'summary' && (
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Content Summary</h3>
            <div className="prose prose-slate max-w-none text-sm md:text-base">
              {renderText(result.summary)}
            </div>
            
            {result.groundingUrls.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-200">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Sources</h4>
                <div className="flex flex-wrap gap-2">
                  {result.groundingUrls.map((url, idx) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded hover:bg-indigo-100 transition-colors truncate max-w-[200px]"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {new URL(url).hostname}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'original' && (
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Original Text / Transcript</h3>
            <div className="prose prose-slate max-w-none text-sm md:text-base bg-slate-50 p-4 rounded-lg border border-slate-200 font-mono">
              {renderText(result.originalContent)}
            </div>
          </div>
        )}

        {activeTab === 'comments' && result.commentsSummary && (
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Community Insights & Corrections</h3>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 mb-6 text-sm">
               <span className="font-bold">Focus:</span> This section highlights user comments that correct factual errors or provide brilliant additional context.
            </div>
            <div className="prose prose-slate max-w-none text-sm md:text-base">
              {renderText(result.commentsSummary)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
