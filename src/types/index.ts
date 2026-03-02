export type ViewType = 'search' | 'archive' | 'history' | 'terminal' | 'details' | 'submission';

export interface ArchiveItem {
  id: string;
  title: string;
  time: string;
  level: string;
  pos: {
    top: string;
    left: string;
  };
  description: string;
  details: string;
  tags: string;
  links: string[];
  files?: FileItem[];
  fileContent?: string;
}

export interface FileItem {
  name: string;
  type: string;
  content: string;
  config?: {
    width?: string;
    align?: 'left' | 'right' | 'none';
    float?: 'left' | 'right';
  };
}

export interface Archive {
  title: string;
  items: ArchiveItem[];
}

export interface Archives {
  [key: string]: Archive;
}

export interface HistoryEvent {
  id: string;
  year: string;
  date: string;
  title: string;
  category: string;
  details: string;
  connections: string[];
}

export interface NavItem {
  label: string;
  id: string;
}

export interface ContentData {
  code: string;
  title: string;
  subtitle: string;
  date: string;
  loc: string;
  auth: string;
  quote: string;
  section1: string;
  section2: string;
  interview: string;
  symptoms: string[];
  image: string;
  images?: FileItem[];
}
