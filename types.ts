export enum ConcisenessLevel {
  BRIEF = 'Brief (Key Highlights, ~500 words)',
  MODERATE = 'Moderate (In-depth Analysis, ~1000 words)',
  DETAILED = 'Detailed (Full Comprehensive Report, ~2000+ words)',
}

export enum OutputLanguage {
  CHINESE = 'Chinese (Simplified)',
  ENGLISH = 'English',
  JAPANESE = 'Japanese',
  SPANISH = 'Spanish',
  FRENCH = 'French',
}

export interface AnalysisRequest {
  url: string;
  conciseness: ConcisenessLevel;
  language: OutputLanguage;
  includeComments: boolean;
}

export interface AnalysisResult {
  summary: string;
  originalContent: string;
  commentsSummary?: string;
  groundingUrls: string[];
}

export interface AppState {
  isLoading: boolean;
  error: string | null;
  result: AnalysisResult | null;
}

// --- Script Generator Types ---

export type VideoStyle =
  | 'Humorous' | 'Concise' | 'Educational' | 'Tutorial' | 'Cool'
  | 'Shocking' | 'Social Topic' | 'Emotional' | 'Storytelling' | 'Controversial'
  | 'Motivational' | 'Behind-the-scenes' | 'Q&A' | 'Unboxing' | 'Review'
  | 'Listicle' | 'News' | 'Rant' | 'Cinematic';

export const VIDEO_STYLES: VideoStyle[] = [
  'Humorous', 'Concise', 'Educational', 'Tutorial', 'Cool',
  'Shocking', 'Social Topic', 'Emotional', 'Storytelling', 'Controversial',
  'Motivational', 'Behind-the-scenes', 'Q&A', 'Unboxing', 'Review',
  'Listicle', 'News', 'Rant', 'Cinematic'
];

export interface ScriptRequest {
  topic: string;
  styles: VideoStyle[];
  customInstructions: string;
  duration: string; // e.g. "60 seconds", "300 words"
  language: OutputLanguage;
  safetyCheck: boolean;
  factCheck: boolean;
}

export interface ScriptResult {
  titles: string[];
  hook: string;
  scriptBody: string;
  closing: string;
  description: string;
  strategy: string;
  factCheckReport?: string;
  safetyReport?: string;
}

// --- Image Generator Types ---

export type ImageStyle = 
  | 'Realistic' | 'Anime' | '3D Render' | 'Minimalist' | 'Cyberpunk'
  | 'Watercolor' | 'Oil Painting' | 'Pop Art' | 'Vintage' | 'Sketch'
  | 'Flat Design' | 'Neon' | 'Cinematic' | 'Surreal' | 'Pixel Art'
  | 'Sticker' | 'Vector' | 'Ghibli' | 'Pixar' | 'Abstract';

export const IMAGE_STYLES: ImageStyle[] = [
  'Realistic', 'Anime', '3D Render', 'Minimalist', 'Cyberpunk',
  'Watercolor', 'Oil Painting', 'Pop Art', 'Vintage', 'Sketch',
  'Flat Design', 'Neon', 'Cinematic', 'Surreal', 'Pixel Art',
  'Sticker', 'Vector', 'Ghibli', 'Pixar', 'Abstract'
];

export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';

export interface AspectRatioInfo {
  value: AspectRatio;
  label: string;
  description: string;
  iconClass: string; // Tailwind class for aspect ratio box
}

export const ASPECT_RATIOS: AspectRatioInfo[] = [
  { value: '1:1', label: 'Square', description: 'Instagram Post', iconClass: 'aspect-square' },
  { value: '9:16', label: 'Vertical', description: 'TikTok / Reels / RedNote', iconClass: 'aspect-[9/16]' },
  { value: '16:9', label: 'Horizontal', description: 'YouTube Cover', iconClass: 'aspect-video' },
  { value: '3:4', label: 'Portrait', description: 'Instagram / Post', iconClass: 'aspect-[3/4]' },
  { value: '4:3', label: 'Standard', description: 'Blog / Article', iconClass: 'aspect-[4/3]' },
];

export interface ImageGenerationRequest {
  prompt: string;
  style: ImageStyle;
  ratio: AspectRatio;
  count: number;
  generateCaption: boolean;
}

export interface ImageGenerationResult {
  images: { base64: string; mimeType: string }[];
  caption?: string;
}

// --- UI / i18n ---

export type UILanguage = 'en' | 'zh';

export const TRANSLATIONS = {
  en: {
    appTitle: "AI Media Assistant",
    nav: { home: "Home", analyzer: "Analyzer", script: "Script Gen", image: "Image Gen" },
    home: {
      welcome: "Welcome to AI Media Studio",
      subtitle: "Your all-in-one suite for content creation and analysis.",
      start: "Get Started",
      tools: {
        analyzer: { title: "Media Analyzer", desc: "Summarize videos, extract transcripts, and analyze comments for insights." },
        script: { title: "Script Generator", desc: "Create viral video scripts with hooks, strategy, and fact-checking." },
        image: { title: "Image Studio", desc: "Generate consistent social media covers and images in batch." }
      }
    },
    common: {
      submit: "Generate",
      loading: "Processing...",
      error: "Error",
      copy: "Copy",
      download: "Download",
    },
    analyzer: {
      title: "Media Analysis",
      urlLabel: "Media URL",
      concisenessLabel: "Detail Level",
      langLabel: "Output Language",
      commentsLabel: "Analyze Comments",
      btn: "Generate Insights",
      placeholder: "Paste a URL from YouTube or a news site...",
      readyTitle: "Ready to Analyze",
      readyDesc: "Paste a URL to get started.",
    },
    script: {
      title: "Script Configuration",
      topicLabel: "Video Topic / Key Points",
      styleLabel: "Video Styles",
      customLabel: "Creative Inspiration / Custom Style",
      durationLabel: "Duration / Length",
      langLabel: "Output Language",
      safetyLabel: "Content Safety Check",
      factLabel: "Fact Check (Web Search)",
      btn: "Generate Script",
      placeholder: "e.g. 5 tips for growing tomatoes...",
      readyTitle: "Script Generator",
      readyDesc: "Enter a topic to generate a viral video script.",
    },
    image: {
      title: "Cover & Image Gen",
      promptLabel: "Image Subject / Description",
      ratioLabel: "Aspect Ratio",
      styleLabel: "Art Style",
      qtyLabel: "Quantity",
      captionLabel: "Generate Caption / Text",
      btn: "Generate Images",
      placeholder: "e.g. A futuristic neon city street...",
      readyTitle: "Image Studio",
      readyDesc: "Create viral covers for YouTube, TikTok, or RedNote.",
    }
  },
  zh: {
    appTitle: "AI 媒体助手",
    nav: { home: "首页", analyzer: "媒体分析", script: "脚本生成", image: "图文生成" },
    home: {
      welcome: "欢迎使用 AI 媒体工作室",
      subtitle: "您的一站式内容创作与分析套件。",
      start: "开始使用",
      tools: {
        analyzer: { title: "媒体分析器", desc: "视频总结、提取文案、分析评论区见解。" },
        script: { title: "脚本生成器", desc: "创作带有钩子、策略和事实核查的爆款脚本。" },
        image: { title: "图文工作室", desc: "批量生成风格统一的社交媒体封面和配图。" }
      }
    },
    common: {
      submit: "生成",
      loading: "处理中...",
      error: "错误",
      copy: "复制",
      download: "下载",
    },
    analyzer: {
      title: "媒体分析",
      urlLabel: "媒体链接 (URL)",
      concisenessLabel: "详尽程度",
      langLabel: "输出语言",
      commentsLabel: "分析评论区",
      btn: "生成分析报告",
      placeholder: "粘贴 YouTube 或新闻网站链接...",
      readyTitle: "准备分析",
      readyDesc: "粘贴链接以获取数据丰富的总结。",
    },
    script: {
      title: "脚本配置",
      topicLabel: "视频主题 / 关键点",
      styleLabel: "视频风格 (多选)",
      customLabel: "创意灵感 / 自定义风格",
      durationLabel: "时长 / 字数",
      langLabel: "输出语言",
      safetyLabel: "内容安全检查",
      factLabel: "事实核查 (联网)",
      btn: "生成脚本",
      placeholder: "例如：种植番茄的5个技巧...",
      readyTitle: "脚本生成器",
      readyDesc: "输入主题以生成爆款视频脚本。",
    },
    image: {
      title: "封面与图文生成",
      promptLabel: "画面描述 / 主题",
      ratioLabel: "图片比例",
      styleLabel: "艺术风格",
      qtyLabel: "数量",
      captionLabel: "生成配文/标题",
      btn: "生成图片",
      placeholder: "例如：未来的霓虹街道，赛博朋克风格...",
      readyTitle: "图文工作室",
      readyDesc: "为 YouTube, TikTok, 小红书制作爆款封面。",
    }
  }
};
