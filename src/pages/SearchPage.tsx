import React from 'react';
import { motion } from 'motion/react';
import { Search, Library, Upload, Settings, Lock, Command, History as HistoryIcon } from 'lucide-react';
import type { ViewType } from '../types';

interface SearchPageProps {
  onLogout: () => void;
  onNavigate: (view: ViewType) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ onLogout, onNavigate }) => {
  return (
    <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden p-4 md:p-10 border-[4px] md:border-[16px] border-black bg-terminal-bg selection:bg-terminal-gold selection:text-terminal-bg">
      <div className="crt-overlay"></div>
      <div className="scanline"></div>
      
      {/* Decorative UI Elements (Corner Brackets) */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-terminal-gold/40 z-50"></div>
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-terminal-gold/40 z-50"></div>
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-terminal-gold/40 z-50"></div>
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-terminal-gold/40 z-50"></div>

      <nav className="relative z-[150] w-full max-w-7xl mx-auto px-2 md:px-4 py-4 flex justify-end gap-3 md:gap-10 text-[10px] md:text-sm tracking-widest font-light">
        <button 
          onClick={() => onNavigate('archive')}
          className="hover:text-terminal-gold transition-colors duration-300 flex items-center gap-1 md:gap-2 cursor-pointer group relative z-[150]"
        >
          <Library className="w-3 h-3 md:w-4 md:h-4 group-hover:crt-glow" /> <span className="hidden xs:inline">档案库</span><span className="hidden sm:inline"> (Library)</span>
        </button>
        <button 
          onClick={() => onNavigate('history')}
          className="hover:text-terminal-gold transition-colors duration-300 flex items-center gap-1 md:gap-2 cursor-pointer group"
        >
          <HistoryIcon className="w-3 h-3 md:w-4 md:h-4 group-hover:crt-glow" /> <span className="hidden xs:inline">历史</span><span className="hidden sm:inline"> (History)</span>
        </button>
        <button 
          onClick={() => onNavigate('submission')}
          className="hover:text-terminal-gold transition-colors duration-300 flex items-center gap-1 md:gap-2 cursor-pointer group"
        >
          <Upload className="w-3 h-3 md:w-4 md:h-4 group-hover:crt-glow" /> <span className="hidden xs:inline">提交</span><span className="hidden sm:inline"> (Submit)</span>
        </button>
        <button className="hover:text-terminal-gold transition-colors duration-300 flex items-center gap-1 md:gap-2 cursor-pointer group">
          <Settings className="w-3 h-3 md:w-4 md:h-4 group-hover:crt-glow" /> <span className="hidden xs:inline">系统</span><span className="hidden sm:inline"> (System)</span>
        </button>
        <button 
          onClick={onLogout}
          className="hover:text-terminal-red transition-colors duration-300 flex items-center gap-1 md:gap-2 cursor-pointer group"
        >
          <Lock className="w-3 h-3 md:w-4 md:h-4 group-hover:crt-glow-red" /> <span className="hidden xs:inline">登出</span><span className="hidden sm:inline"> (Logout)</span>
        </button>
      </nav>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-4 md:px-6 -mt-10">
        <div className="flex flex-col items-center mb-8 md:mb-12">
          <motion.div 
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            className="mb-4 md:mb-6"
          >
            <svg fill="none" height="60" viewBox="0 0 100 100" width="60" xmlns="http://www.w3.org/2000/svg" className="md:w-20 md:h-20">
              <circle cx="50" cy="50" opacity="0.4" r="48" stroke="#908551" strokeWidth="1.5"></circle>
              <path d="M50 15C30.67 15 15 30.67 15 50C15 69.33 30.67 85 50 85" stroke="#908551" strokeLinecap="round" strokeWidth="3"></path>
              <circle cx="50" cy="50" fill="#908551" fillOpacity="0.15" r="22"></circle>
              <circle cx="50" cy="50" fill="#908551" r="12"></circle>
            </svg>
          </motion.div>
          <h1 className="text-xl md:text-3xl font-light tracking-[0.3em] md:tracking-[0.5em] text-terminal-gold mb-2 crt-glow">红月之下</h1>
          <h2 className="text-[8px] md:text-[10px] uppercase font-mono tracking-[0.2em] md:tracking-[0.4em] opacity-60">Public Retrieval Center</h2>
        </div>

        <div className="w-full max-w-2xl group">
          <div className="relative flex items-center border border-terminal-gold/40 rounded-sm bg-terminal-bg/50 transition-all duration-500 hover:border-terminal-gold/80 px-4 md:px-6 py-3 md:py-4 shadow-[0_0_15px_rgba(144,133,81,0.05)] focus-within:shadow-[0_0_20px_rgba(144,133,81,0.1)]">
            <Search className="w-4 h-4 md:w-5 md:h-5 text-terminal-gold/60 mr-3 md:mr-4 font-light" />
            <input 
              className="w-full bg-transparent border-none focus:ring-0 text-base md:text-lg font-light tracking-wider text-white/90 placeholder:text-terminal-gold/30 outline-none" 
              placeholder="请输入检索指令或档案编号..." 
              type="text"
            />
            <div className="absolute right-4 hidden sm:flex items-center gap-2">
              <span className="text-[9px] font-mono text-terminal-gold/40 px-1.5 py-0.5 border border-terminal-gold/20 rounded-sm flex items-center gap-1">
                <Command className="w-2 h-2" /> K
              </span>
            </div>
          </div>
          <div className="mt-4 flex justify-center gap-4 md:gap-6 text-[9px] md:text-[11px] font-light text-terminal-gold/50 tracking-widest uppercase">
            <span className="cursor-pointer hover:text-terminal-gold transition-colors">高级搜索</span>
            <span>/</span>
            <span className="cursor-pointer hover:text-terminal-gold transition-colors">分类索引</span>
            <span className="hidden xs:inline">/</span>
            <span className="hidden xs:inline cursor-pointer hover:text-terminal-gold transition-colors">实时解密</span>
          </div>
        </div>
      </main>

      <footer className="w-full py-8 md:py-12 flex flex-col items-center gap-4">
        <div className="h-[1px] w-12 bg-terminal-gold/20 mb-2"></div>
        <div className="font-mono text-[8px] md:text-[10px] tracking-[0.2em] text-terminal-gold/70 uppercase">
          8,563,291 Records Synced
        </div>
        <div className="text-[8px] md:text-[9px] font-light text-white/20 tracking-widest uppercase font-mono text-center">
          Terminal Node: RM-ALPHA-09 // Status: Heavy Stability
        </div>
      </footer>

      <div className="fixed top-0 left-0 w-16 md:w-32 h-16 md:h-32 border-t-[1px] border-l-[1px] border-terminal-gold/10 pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-16 md:w-32 h-16 md:h-32 border-b-[1px] border-r-[1px] border-terminal-gold/10 pointer-events-none"></div>
    </div>
  );
};
