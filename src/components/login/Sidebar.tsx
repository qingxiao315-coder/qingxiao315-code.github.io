import React from 'react';
import { ChevronRight } from 'lucide-react';
import { GlitchText } from '../common/GlitchText';
import type { ViewType } from '../../types';

interface SidebarProps {
  onNavigate: (view: ViewType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  const navItems = [
    { label: '档案库', id: 'archive' },
    { label: '投稿', id: 'submission' },
    { label: '地图', id: 'MAP' }
  ];
  
  return (
    <nav className="hidden md:flex w-48 flex-col gap-8 pt-10">
      {navItems.map((item) => (
        <div 
          key={item.id} 
          className="group cursor-pointer"
          onClick={() => {
            if (item.id === 'archive' || item.id === 'submission') {
              onNavigate(item.id as ViewType);
            }
          }}
        >
          <div className="flex items-center gap-3 transition-all group-hover:translate-x-2">
            <ChevronRight className="w-4 h-4 opacity-50" />
            <span className="text-lg font-medium tracking-tighter opacity-70 group-hover:opacity-100 group-hover:crt-glow transition-opacity">
              <GlitchText text={item.label} />
            </span>
          </div>
          <div className="h-[1px] w-0 bg-terminal-gold group-hover:w-full transition-all duration-300 mt-1 opacity-30"></div>
        </div>
      ))}
      <div className="mt-auto pb-10 flex flex-col gap-2">
        <p className="text-[9px] opacity-40 uppercase tracking-widest">终端状态</p>
        <div className="flex gap-1">
          <div className="w-1 h-3 bg-terminal-gold"></div>
          <div className="w-1 h-3 bg-terminal-gold"></div>
          <div className="w-1 h-3 bg-terminal-gold/20"></div>
          <div className="w-1 h-3 bg-terminal-gold/20"></div>
        </div>
      </div>
    </nav>
  );
};
