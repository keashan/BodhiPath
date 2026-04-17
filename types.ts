
export type Language = 'en' | 'si';

export enum AppView {
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  CHAT = 'CHAT',
  MEDITATION = 'MEDITATION',
  JOURNAL = 'JOURNAL',
  SUTTA = 'SUTTA',
  TEMPLE = 'TEMPLE',
  CLASSROOM = 'CLASSROOM',
  DAILY_DROPS = 'DAILY_DROPS',
  ADMIN = 'ADMIN'
}

export type AppPage = 'HOME' | 'ABOUT' | 'CONTACT' | 'TERMS' | 'PRIVACY' | 'APP';

export interface UserPreferences {
  hasCompletedOnboarding: boolean;
  language: Language;
  goals: string[];
  receiveDailyDrops: boolean;
  isGuided: boolean;
  name?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood?: 'peaceful' | 'neutral' | 'restless';
  tags: string[];
}

export interface DailyDrop {
  quote: string;
  source: string;
  reflection: string;
  timestamp: number;
  // Facebook Metadata (for automation tracking)
  fb_posted?: boolean;
  fb_posted_at?: number;
  fb_post_id?: string;
}

export interface Lesson {
  id: string;
  title: { en: string; si: string };
  description: { en: string; si: string };
  completed: boolean;
}
