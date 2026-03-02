
export interface Character {
  id: string;
  name: string;
  role: string;
  appearance: string;
  personality: string;
  bio: string;
  avatarSeed: string;
  gender: '男' | '女' | '未知';
  ageRange: '少儿' | '青年' | '中年' | '老年';
  isHuman: boolean;
}

export interface Chapter {
  id: string;
  title: string;
  summary: string;
}

export interface Outline {
  storySummary: string;
  chapters: Chapter[];
}

export interface Term {
  name: string;
  description: string;
}

export interface Inspiration {
  innovations: string[];
  settings: string[];
  terms: Term[];
  concepts: string[];
}

export interface AdaptationItem {
  title: string;
  concept: string;
  rewrite: string;
}

export interface Adaptation {
  essence: string;
  rewrites: AdaptationItem[];
}

export interface StoryAnalysis {
  title: string;
  characters: Character[];
  outline: Outline;
  inspiration: Inspiration;
  adaptation?: Adaptation;
}

export interface ArchiveEntry {
  id: string;
  timestamp: number;
  title: string;
  data: StoryAnalysis;
}

export enum Tab {
  Characters = 'characters',
  Outline = 'outline',
  Inspiration = 'inspiration',
  Adaptation = 'adaptation'
}
