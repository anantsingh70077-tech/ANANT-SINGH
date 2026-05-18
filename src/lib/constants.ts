import { 
  Sparkles, 
  BookOpen, 
  Code, 
  Briefcase, 
  Palette, 
  Search, 
  Zap,
  Video,
  Scissors,
  Brain,
  ImageIcon,
  Activity,
  Globe
} from 'lucide-react';

export const APP_NAME = "INDUS";
export const CEO = "Anant Singh";

export enum AppView {
  SPLASH = 'splash',
  AUTH = 'auth',
  HOME = 'home',
  CHAT = 'chat',
  WORKSPACE = 'workspace',
  TOOLS = 'tools',
  PROFILE = 'profile',
  MEMBERSHIP = 'membership',
  SETTINGS = 'settings',
  NEURAL_LAB = 'neural_lab',
  WEB_BUILDER = 'web_builder',
  ADMIN = 'admin'
}

export const AI_MODES = [
  { id: 'general', name: 'General AI', icon: Sparkles, color: 'text-indus-cyan' },
  { id: 'video', name: 'Video AI', icon: Video, color: 'text-indus-blue' },
  { id: 'editing', name: 'AI Editor', icon: Scissors, color: 'text-indus-purple' },
  { id: 'study', name: 'Study AI', icon: BookOpen, color: 'text-indus-purple' },
  { id: 'coding', name: 'Coding AI', icon: Code, color: 'text-indus-blue' },
  { id: 'career', name: 'Career AI', icon: Briefcase, color: 'text-emerald-400' },
  { id: 'creative', name: 'Creative AI', icon: Palette, color: 'text-rose-400' },
  { id: 'research', name: 'Research AI', icon: Search, color: 'text-amber-400' },
  { id: 'productivity', name: 'Productivity AI', icon: Zap, color: 'text-orange-400' },
  { id: 'india', name: 'Bharat AI', icon: Globe, color: 'text-emerald-500' },
  { id: 'healthcare', name: 'Vital AI', icon: Activity, color: 'text-rose-500' },
];

export const AI_MODELS = [
  { id: 'gemini-3-flash-preview', name: 'INDUS Flash', description: 'Deep reasoning & neural speed.', icon: Brain },
  { id: 'gemini-3.1-flash-lite', name: 'INDUS Lite', description: 'Efficiency & daily synthesis.', icon: Zap },
  { id: 'gemini-2.5-flash-image', name: 'INDUS Vision', description: 'High-fidelity visual imagination.', icon: ImageIcon },
  { id: 'veo-3.1-lite-generate-preview', name: 'INDUS Video', description: 'High-fidelity video generation.', icon: Video },
];

export const QUICK_PROMPTS = [
  "Help me study",
  "Explain AI",
  "Analyze this PDF",
  "Create a business idea",
  "Generate notes"
];
