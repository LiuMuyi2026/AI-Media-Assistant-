import React from 'react';
import { UILanguage, TRANSLATIONS } from '../types';
import { FileText, Video, Image as ImageIcon, ArrowRight } from 'lucide-react';

interface HomePageProps {
  uiLanguage: UILanguage;
  onNavigate: (view: 'analyzer' | 'script-generator' | 'image-generator') => void;
}

export const HomePage: React.FC<HomePageProps> = ({ uiLanguage, onNavigate }) => {
  const t = TRANSLATIONS[uiLanguage].home;

  const tools = [
    {
      id: 'analyzer',
      icon: FileText,
      title: t.tools.analyzer.title,
      description: t.tools.analyzer.desc,
      color: 'bg-blue-500',
      nav: 'analyzer' as const,
    },
    {
      id: 'script',
      icon: Video,
      title: t.tools.script.title,
      description: t.tools.script.desc,
      color: 'bg-purple-500',
      nav: 'script-generator' as const,
    },
    {
      id: 'image',
      icon: ImageIcon,
      title: t.tools.image.title,
      description: t.tools.image.desc,
      color: 'bg-pink-500',
      nav: 'image-generator' as const,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-12 px-4 animate-in fade-in zoom-in duration-500">
      <div className="text-center max-w-2xl mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          {t.welcome}
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {tools.map((tool) => (
          <div 
            key={tool.id}
            onClick={() => onNavigate(tool.nav)}
            className="group relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-1"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 ${tool.color} opacity-5 rounded-bl-full transition-transform group-hover:scale-150 duration-500`}></div>
            
            <div className={`w-14 h-14 ${tool.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:rotate-6 transition-transform`}>
              <tool.icon className="w-7 h-7" />
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 mb-3">{tool.title}</h3>
            <p className="text-slate-500 mb-6 leading-relaxed">
              {tool.description}
            </p>
            
            <div className="flex items-center text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              {t.start} <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
