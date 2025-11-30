export enum Language {
  EN = 'en',
  ZH = 'zh'
}

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark'
}

export enum ModelProvider {
  GEMINI = 'gemini',
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  XAI = 'xai'
}

export interface FlowerTheme {
  id: string;
  nameEn: string;
  nameZh: string;
  primary: string;
  secondary: string;
  accent: string;
  bgLight: string;
  bgDark: string;
}

export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  model: string;
  maxTokens: number;
  temperature: number;
  systemPrompt: string;
  provider: ModelProvider;
}

export interface ExecutionLog {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'error';
  message: string;
}

export interface AppState {
  health: number;
  mana: number;
  experience: number;
  level: number;
}

export interface ApiKeys {
  [ModelProvider.GEMINI]: string;
  [ModelProvider.OPENAI]: string;
  [ModelProvider.ANTHROPIC]: string;
  [ModelProvider.XAI]: string;
}