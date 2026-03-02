/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal, 
  ChevronRight, 
  Shield, 
  Activity, 
  Cpu, 
  Database, 
  Lock, 
  AlertTriangle,
  Wifi,
  Clock,
  Search,
  Library,
  Upload,
  Settings,
  Command,
  Network,
  Grid,
  Anchor,
  FileText,
  Plus,
  Minus,
  Compass,
  ArrowUpRight,
  Server,
  Crosshair,
  Globe,
  History,
  GitBranch,
  ChevronLeft,
  Share2,
  Download,
  Printer,
  ChevronUp,
  FolderPlus,
  FilePlus,
  Save,
  X,
  Unlock,
  Move,
  Maximize2,
  Link2,
  Image as ImageIcon,
  Volume2,
  VolumeX
} from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import mammoth from 'mammoth';
import { Document, Packer, Paragraph, TextRun, ImageRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

// Import components
import { Header, Sidebar, LogsSidebar, LoginBox, Footer } from './components/login';
import { GlitchText, DecryptedText } from './components/common';
import type { ViewType } from './types';
import SystemPage from './SystemPage';
import SystemTerminalPage from './SystemTerminalPage';

// --- Page Components ---

const SearchPage = ({ onLogout, onNavigate, archives, onSelectArchive, onSelectItem, bgMusicEnabled, onToggleBgMusic }: { 
  onLogout: () => void, 
  onNavigate: (view: 'search' | 'archive' | 'history' | 'terminal' | 'details' | 'submission' | 'system' | 'system-terminal') => void,
  archives: Record<string, { title: string, items: any[] }>,
  onSelectArchive: (id: string) => void,
  onSelectItem: (id: string) => void,
  bgMusicEnabled: boolean,
  onToggleBgMusic: () => void
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ type: 'archive' | 'item', id: string, title: string, archiveId?: string, level?: string }>>([]);
  const [showResults, setShowResults] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 处理搜索
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const results: Array<{ type: 'archive' | 'item', id: string, title: string, archiveId?: string, level?: string }> = [];
    const lowerQuery = query.toLowerCase();

    // 搜索档案和档案项
    Object.entries(archives).forEach(([archiveId, archive]) => {
      // 搜索档案标题
      if (archive.title.toLowerCase().includes(lowerQuery) || archiveId.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'archive',
          id: archiveId,
          title: archive.title
        });
      }
      
      // 搜索档案内的项目
      archive.items.forEach((item: any) => {
        if (item.title.toLowerCase().includes(lowerQuery) || item.id.toLowerCase().includes(lowerQuery)) {
          results.push({
            type: 'item',
            id: item.id,
            title: item.title,
            archiveId: archiveId,
            level: item.level
          });
        }
      });
    });

    setSearchResults(results.slice(0, 8)); // 最多显示8个结果
    setShowResults(true);
  };

  // 处理点击搜索结果
  const handleResultClick = (result: typeof searchResults[0]) => {
    if (result.type === 'archive') {
      onSelectArchive(result.id);
      onNavigate('terminal');
    } else {
      onSelectArchive(result.archiveId!);
      onSelectItem(result.id);
      onNavigate('details');
    }
    setShowResults(false);
    setSearchQuery('');
  };

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setShowResults(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
          <History className="w-3 h-3 md:w-4 md:h-4 group-hover:crt-glow" /> <span className="hidden xs:inline">历史</span><span className="hidden sm:inline"> (History)</span>
        </button>
        <button 
          onClick={() => onNavigate('submission')}
          className="hover:text-terminal-gold transition-colors duration-300 flex items-center gap-1 md:gap-2 cursor-pointer group"
        >
          <Upload className="w-3 h-3 md:w-4 md:h-4 group-hover:crt-glow" /> <span className="hidden xs:inline">提交</span><span className="hidden sm:inline"> (Submit)</span>
        </button>
        <button 
          onClick={onToggleBgMusic}
          className={`hover:text-terminal-gold transition-colors duration-300 flex items-center gap-1 md:gap-2 cursor-pointer group ${bgMusicEnabled ? 'text-terminal-gold' : ''}`}
        >
          {bgMusicEnabled ? <Volume2 className="w-3 h-3 md:w-4 md:h-4 group-hover:crt-glow" /> : <VolumeX className="w-3 h-3 md:w-4 md:h-4" />} <span className="hidden xs:inline">{bgMusicEnabled ? '音乐' : '静音'}</span>
        </button>
        <button 
          onClick={() => onNavigate('system')}
          className="hover:text-terminal-gold transition-colors duration-300 flex items-center gap-1 md:gap-2 cursor-pointer group"
        >
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

        <div className="w-full max-w-2xl group relative">
          <div className="relative flex items-center border border-terminal-gold/40 rounded-sm bg-terminal-bg/50 transition-all duration-500 hover:border-terminal-gold/80 px-4 md:px-6 py-3 md:py-4 shadow-[0_0_15px_rgba(144,133,81,0.05)] focus-within:shadow-[0_0_20px_rgba(144,133,81,0.1)]">
            <Search className="w-4 h-4 md:w-5 md:h-5 text-terminal-gold/60 mr-3 md:mr-4 font-light" />
            <input 
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchResults.length > 0) {
                  handleResultClick(searchResults[0]);
                }
              }}
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
          
          {/* 搜索结果下拉框 */}
          {showResults && searchResults.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 border border-terminal-gold/30 bg-black/95 backdrop-blur-sm rounded-sm overflow-hidden z-50"
            >
              <div className="max-h-64 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <div
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleResultClick(result)}
                    className="px-4 py-3 border-b border-terminal-gold/10 hover:bg-terminal-gold/10 cursor-pointer transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-terminal-gold/50">
                        {result.type === 'archive' ? '📁' : '📄'}
                      </span>
                      <div>
                        <div className="text-sm text-white/90 group-hover:text-terminal-gold transition-colors">
                          {result.title}
                        </div>
                        <div className="text-[10px] font-mono text-terminal-gold/40">
                          {result.type === 'archive' ? `档案: ${result.id}` : `项目: ${result.id}`}
                        </div>
                      </div>
                    </div>
                    {result.level && (
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${
                        result.level === 'SAFE' ? 'bg-green-900/30 text-green-400' :
                        result.level === 'EUCLID' ? 'bg-yellow-900/30 text-yellow-400' :
                        result.level === 'KETER' ? 'bg-red-900/30 text-red-400' :
                        'bg-purple-900/30 text-purple-400'
                      }`}>
                        {result.level}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 bg-terminal-gold/5 text-[9px] text-terminal-gold/40 font-mono text-center">
                找到 {searchResults.length} 个结果 | 按 Enter 选择第一个 | ESC 关闭
              </div>
            </motion.div>
          )}
          
          {/* 无结果提示 */}
          {showResults && searchQuery && searchResults.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 right-0 mt-2 border border-terminal-gold/30 bg-black/95 backdrop-blur-sm rounded-sm overflow-hidden z-50"
            >
              <div className="px-4 py-6 text-center">
                <div className="text-terminal-gold/60 text-sm mb-1">未找到相关档案</div>
                <div className="text-[10px] text-terminal-gold/30">尝试其他关键词或档案编号</div>
              </div>
            </motion.div>
          )}
        </div>
        
        <div className="mt-4 flex justify-center gap-4 md:gap-6 text-[9px] md:text-[11px] font-light text-terminal-gold/50 tracking-widest uppercase">
          <span className="cursor-pointer hover:text-terminal-gold transition-colors">高级搜索</span>
          <span>/</span>
          <span className="cursor-pointer hover:text-terminal-gold transition-colors">分类索引</span>
          <span className="hidden xs:inline">/</span>
          <span className="hidden xs:inline cursor-pointer hover:text-terminal-gold transition-colors">实时解密</span>
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

const PurgeOverlay = ({ onComplete }: { onComplete: () => void }) => {
  const [stage, setStage] = useState(0);
  const [showImage, setShowImage] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const messages = [
    "正在启动紧急清除程序...",
    "正在擦除核心内存...",
    "正在销毁加密密钥...",
    "正在断开所有外部连接...",
    "正在清除生物特征数据...",
    "系统重启中..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStage(s => {
        if (s >= messages.length - 1) {
          clearInterval(timer);
          // 显示图片
          setShowImage(true);
          // 播放音频
          const audio = new Audio('https://image2url.com/r2/default/audio/1772442700.wav');
          audioRef.current = audio;
          
          audio.onended = () => {
            // 音频播放完毕后显示失败信息
            setShowFailure(true);
            setTimeout(() => {
              onComplete();
            }, 2000);
          };
          
          audio.play().catch(error => {
            console.error('音频播放失败:', error);
            // 音频播放失败时也显示失败信息
            setShowFailure(true);
            setTimeout(() => {
              onComplete();
            }, 2000);
          });
          
          return s;
        }
        return s + 1;
      });
    }, 600);
    return () => {
      clearInterval(timer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [onComplete, messages.length]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-10 font-mono text-terminal-red"
    >
      <div className="crt-overlay"></div>
      
      {!showImage && !showFailure ? (
        <motion.div 
          animate={{ 
            opacity: [1, 0.5, 1, 0.8, 1],
            x: [0, -2, 2, -1, 0]
          }}
          transition={{ duration: 0.2, repeat: Infinity }}
          className="flex flex-col items-center gap-8 max-w-md w-full"
        >
          <AlertTriangle className="w-20 h-20 animate-pulse" />
          <h2 className="text-2xl font-bold tracking-[0.3em] text-center uppercase">
            紧急清除进行中
          </h2>
          <div className="w-full h-2 bg-terminal-red/20 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-terminal-red"
              initial={{ width: "0%" }}
              animate={{ width: `${(stage / (messages.length - 1)) * 100}%` }}
            />
          </div>
          <div className="h-20 flex items-center justify-center text-center">
            <AnimatePresence mode="wait">
              <motion.p 
                key={stage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm tracking-widest uppercase"
              >
                &gt; {messages[stage]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      ) : showImage && !showFailure ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-8"
        >
          <img 
            src="./屏幕截图 2025-10-01 230554.png" 
            alt="系统状态" 
            className="max-w-full max-h-[70vh] object-contain"
            onError={(e) => {
              console.error('图片加载失败:', e);
              // 图片加载失败时也显示失败信息
              setShowFailure(true);
              setTimeout(() => {
                onComplete();
              }, 2000);
            }}
          />
          <div className="text-sm tracking-widest uppercase">
            &gt; 正在执行最终清除...
          </div>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-8 max-w-md w-full text-center"
        >
          <AlertTriangle className="w-20 h-20 animate-pulse text-terminal-red" />
          <h2 className="text-2xl font-bold tracking-[0.3em] text-center uppercase text-terminal-red">
            清除失败
          </h2>
          <p className="text-sm tracking-widest uppercase text-terminal-red/80">
            &gt; 系统完整性受损
            <br />
            &gt; 无法完成清除操作
            <br />
            &gt; 请联系系统管理员
          </p>
        </motion.div>
      )}
      
      {/* Glitch noise overlay */}
      <motion.div 
        animate={{ opacity: [0, 0.1, 0, 0.2, 0] }}
        transition={{ duration: 0.1, repeat: Infinity }}
        className="absolute inset-0 pointer-events-none bg-[url('https://picsum.photos/seed/noise/1920/1080?blur=10')] opacity-10 mix-blend-screen"
      />
    </motion.div>
  );
};

// --- Components for Archive Page ---

const ArchivePage = ({ onNavigate, onSelectArchive, archives }: { onNavigate: (view: 'search' | 'archive' | 'history' | 'terminal' | 'details' | 'submission') => void, onSelectArchive: (id: string) => void, archives: Record<string, any> }) => {
  const folders = Object.entries(archives).map(([id, data]) => ({
    id,
    title: data.title,
    date: data.items?.[0]?.time?.split(' ')[0] || '2024.01.01'
  }));

  return (
    <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden p-4 md:p-10 border-[4px] md:border-[16px] border-black bg-terminal-bg text-white font-sans selection:bg-terminal-gold selection:text-black">
      <div className="crt-overlay"></div>
      <div className="scanline"></div>

      {/* Decorative UI Elements (Corner Brackets) */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-terminal-gold/40 z-50"></div>
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-terminal-gold/40 z-50"></div>
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-terminal-gold/40 z-50"></div>
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-terminal-gold/40 z-50"></div>

      <div className="relative z-[150] flex flex-1 overflow-hidden">
        <aside className="hidden md:flex w-16 border-r border-white/5 flex-col items-center py-12 gap-12 bg-black/20 backdrop-blur-md">
          <button 
            onClick={() => onNavigate('search')}
            className="text-terminal-gold/60 cursor-pointer hover:text-terminal-gold transition-colors p-2 relative z-[150]"
          >
            <Terminal className="w-6 h-6" />
          </button>
          <nav className="flex flex-col gap-10 mt-12 flex-1">
            <a className="[writing-mode:vertical-rl] text-orientation-mixed text-[11px] tracking-[0.4em] text-terminal-gold font-medium hover:text-white transition-colors" href="#">官方机构</a>
            <button 
              onClick={() => onNavigate('history')}
              className="[writing-mode:vertical-rl] text-orientation-mixed text-[11px] tracking-[0.4em] text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              历史年鉴
            </button>
          </nav>
          <div className="text-[9px] text-white/20 tracking-widest font-light [writing-mode:vertical-rl] text-orientation-mixed">SECURE NODE</div>
        </aside>

        <main className="flex-1 flex flex-col p-4 md:p-12 overflow-y-auto">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-16 px-0 md:px-4 gap-4 relative">
            <button 
              onClick={() => onNavigate('search')}
              className="md:hidden absolute -top-2 -right-2 p-2 text-terminal-gold/60 hover:text-terminal-gold transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="space-y-1">
              <div className="flex items-center gap-2 md:block">
                <button 
                  onClick={() => onNavigate('search')}
                  className="md:hidden text-terminal-gold/60 hover:text-terminal-gold transition-colors"
                >
                  <Terminal className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => onNavigate('history')}
                  className="md:hidden text-terminal-gold/60 hover:text-terminal-gold transition-colors"
                >
                  <History className="w-4 h-4" />
                </button>
                <p className="text-[7px] md:text-[10px] text-terminal-gold tracking-[0.3em] md:tracking-[0.6em] font-medium uppercase">Archive Access Portal</p>
              </div>
              <h1 className="text-lg md:text-3xl font-light tracking-widest text-white/90">档案资料库</h1>
            </div>
            <div className="flex items-center gap-3 md:gap-6 text-[7px] md:text-[10px] tracking-widest text-white/40 font-mono">
              <div className="flex flex-col items-start md:items-end">
                <span>权限: A级特许</span>
                <span>状态: 稳定</span>
              </div>
              <div className="w-px h-5 md:h-8 bg-white/10"></div>
              <div className="flex flex-col items-start md:items-end text-terminal-gold/60">
                <span>UTC 08:00:44</span>
                <span>NODE_0921_HY</span>
              </div>
            </div>
          </header>

          <div className="flex-1 flex justify-center pb-12 md:pb-32">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 md:gap-x-12 gap-y-8 md:gap-y-16 max-w-6xl w-full">
              {folders.map((folder, i) => (
                <motion.div 
                  key={folder.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => {
                  onSelectArchive(folder.id);
                  onNavigate('terminal');
                }}
                className="group relative cursor-pointer hover:-translate-y-1 md:hover:-translate-y-3 transition-transform duration-300"
                >
                  <div className="absolute -top-3 md:-top-4 left-0 w-16 md:w-24 h-4 md:h-5 bg-terminal-gold/20 group-hover:bg-terminal-gold/40 transition-colors [clip-path:polygon(0%_0%,75%_0%,100%_100%,0%_100%)]"></div>
                  <div className="absolute -top-2.5 md:-top-3.5 left-1.5 md:left-2 text-[7px] md:text-[9px] font-bold text-terminal-gold group-hover:text-white transition-colors tracking-tighter font-mono">{folder.id}</div>
                  <div className="bg-[#1a1a1a] border border-white/10 rounded-r-sm rounded-bl-sm aspect-[4/3] p-3 md:p-6 flex flex-col justify-between shadow-2xl">
                    <div className="space-y-1.5 md:space-y-2">
                      <div className="w-5 md:w-8 h-0.5 md:h-1 bg-terminal-gold/40"></div>
                      <h3 className="text-xs md:text-lg font-medium text-white/80 tracking-wide line-clamp-2">{folder.title}</h3>
                    </div>
                    <div className="text-[7px] md:text-[10px] text-white/30 tracking-widest border-t border-white/5 pt-1.5 md:pt-3 font-mono">
                      更新: {folder.date}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <footer className="mt-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[8px] md:text-[10px] text-white/20 tracking-[0.1em] md:tracking-[0.2em] font-light border-t border-white/5 pt-6 md:pt-8 px-2 md:px-4 font-mono text-center">
            <div className="flex gap-4 md:gap-8 uppercase">
              <span>Secure Protocol v4.0.1</span>
              <span>Classified Materials</span>
            </div>
            <div className="flex gap-2 md:gap-4 items-center">
              <span className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-terminal-gold/40"></span>
              <span>所有访问均已通过生物特征加密审计</span>
            </div>
          </footer>
        </main>
      </div>
      
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-0 opacity-5">
        <div className="w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full border border-terminal-gold/20 flex items-center justify-center">
          <div className="w-40 md:w-80 h-40 md:h-80 rounded-full border border-terminal-gold/20"></div>
        </div>
      </div>
    </div>
  );
};

// --- Components for Terminal Page ---

const TerminalPage = ({ archiveId, onNavigate, onSelectItem, archives, playSound }: { archiveId: string | null, onNavigate: (view: 'search' | 'archive' | 'history' | 'terminal' | 'details' | 'submission') => void, onSelectItem: (id: string) => void, archives: Record<string, { title: string, items: any[] }>, playSound: (type: 'click' | 'hover' | 'success' | 'error' | 'boot' | 'login' | 'button') => void }) => {
  const [decryptionId, setDecryptionId] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [commandValue, setCommandValue] = useState('');

  useEffect(() => {
    if (decryptionId) {
      setIsDecrypting(true);
      playSound('boot');
      const timer = setTimeout(() => {
        setIsDecrypting(false);
        playSound('success');
        onSelectItem(decryptionId);
        onNavigate('details');
        setDecryptionId(null);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [decryptionId]);
  
  const currentArchive = archiveId ? archives[archiveId] : null;

  const handleCommandKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentArchive) {
      const index = parseInt(commandValue, 10);
      if (!isNaN(index) && index > 0 && index <= currentArchive.items.length) {
        const item = currentArchive.items[index - 1];
        setDecryptionId(item.id);
        setCommandValue('');
      }
    }
  };

  return (
    <div className="relative flex h-[100dvh] w-full flex-col bg-black text-[#a0a0a0] font-mono antialiased overflow-hidden selection:bg-terminal-gold selection:text-black text-[10px] md:text-xs">
      <div className="fixed inset-0 structural-grid pointer-events-none z-0"></div>
      
      <header className="relative z-10 border-b border-terminal-gold/30 px-2 md:px-4 py-1 flex flex-col md:flex-row justify-between items-start md:items-center text-[8px] md:text-[10px] tracking-tighter text-[#4a4a4a] gap-1 md:gap-0">
        <div className="flex flex-wrap gap-2 md:gap-6">
          <span className="text-terminal-gold/60">[红月核心：绝密指令终端 V4.0.96]</span>
          <span className="hidden sm:inline">COORD: [35.6895° N / 139.6917° E]</span>
          <span className="hidden lg:inline">NODE: JP-TYO-SEC-01</span>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-6">
          <span className="hidden xs:inline">UPTIME: 14:22:09:11</span>
          <span className="hidden sm:inline">ENCRYPTION: 4096-BIT RSA</span>
          <span className="text-terminal-gold/80">STATUS: 接入授权已验证</span>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col p-4 md:p-8 overflow-hidden">
        <div className="mb-4 md:mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => onNavigate('archive')}
              className="text-terminal-gold hover:text-white transition-colors flex items-center gap-1 md:gap-2"
            >
              <Terminal className="w-3 h-3 md:w-4 md:h-4" /> [ 返回档案库 ]
            </button>
            <span className="text-[#4a4a4a]">/</span>
            <span className="text-terminal-gold font-bold tracking-widest truncate max-w-[150px] md:max-w-none">{currentArchive?.title || '未知档案'}</span>
          </div>
          <div className="text-[8px] md:text-[10px] text-terminal-gold/40">ARCHIVE_ID: {archiveId}</div>
        </div>

        <div className="flex-1 flex flex-col min-h-0 overflow-x-auto">
          <div className="md:hidden text-[7px] text-terminal-gold/30 mb-1 animate-pulse"> &gt;&gt; 左右滑动查看完整数据表 </div>
          <div className="min-w-[600px] md:min-w-0 flex flex-col h-full">
            <div className="grid grid-cols-12 text-[8px] md:text-[10px] tracking-[0.1em] md:tracking-[0.2em] text-terminal-gold/50 uppercase">
              <div className="col-span-2 border border-terminal-gold/50 p-2 border-b-0 border-r-0">OBJ_ID</div>
              <div className="col-span-5 border border-terminal-gold/50 p-2 border-b-0 border-r-0">SUBJECT_TITLE</div>
              <div className="col-span-3 border border-terminal-gold/50 p-2 border-b-0 border-r-0">THREAT_LEVEL</div>
              <div className="col-span-2 border border-terminal-gold/50 p-2 border-b-0">TIMESTAMP</div>
            </div>
            
            <div className="flex-1 overflow-y-auto border-t border-terminal-gold/50">
              {currentArchive?.items.map((item, idx) => (
                <div 
                  key={item.id}
                  onClick={() => setDecryptionId(item.id)}
                  className="grid grid-cols-12 group cursor-pointer hover:bg-terminal-gold/5 transition-colors"
                >
                  <div className="col-span-2 border border-terminal-gold/50 p-2 border-t-0 border-r-0 text-terminal-gold font-bold flex items-center gap-1 md:gap-2">
                    <span className="text-[7px] md:text-[8px] opacity-30 font-normal">[{idx + 1}]</span>
                    {item.id}
                  </div>
                  <div className="col-span-5 border border-terminal-gold/50 p-2 border-t-0 border-r-0 text-[#a0a0a0]/60 group-hover:text-[#a0a0a0] truncate">{item.title}</div>
                  <div className={`col-span-3 border border-terminal-gold/50 p-2 border-t-0 border-r-0 ${item.level === 'KETER' ? 'text-red-800' : 'text-terminal-gold/80'}`}>{item.level}</div>
                  <div className="col-span-2 border border-terminal-gold/50 p-2 border-t-0 text-[#4a4a4a]">{item.time}</div>
                </div>
              ))}
              {/* Empty rows for aesthetic */}
              {[...Array(5)].map((_, i) => (
                <div key={i} className="grid grid-cols-12 opacity-10">
                  <div className="col-span-2 border border-terminal-gold/50 p-2 border-t-0 border-r-0 h-8"></div>
                  <div className="col-span-5 border border-terminal-gold/50 p-2 border-t-0 border-r-0 h-8"></div>
                  <div className="col-span-3 border border-terminal-gold/50 p-2 border-t-0 border-r-0 h-8"></div>
                  <div className="col-span-2 border border-terminal-gold/50 p-2 border-t-0 h-8"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 md:mt-8 border-t border-terminal-gold/20 pt-4 md:pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 md:gap-4 text-terminal-gold">
            <span className="text-[10px] md:text-xs font-bold tracking-widest whitespace-nowrap">SUBJECT_ACCESS_NODE:</span>
            <div className="flex-1 flex items-center w-full">
              <input 
                autoFocus 
                value={commandValue}
                onChange={(e) => setCommandValue(e.target.value)}
                onKeyDown={handleCommandKeyDown}
                className="bg-transparent border-none p-0 text-xs md:text-sm tracking-widest focus:ring-0 w-full text-terminal-gold placeholder:text-terminal-gold/10 outline-none" 
                placeholder="键入对象编号以调取档案..." 
                type="text"
              />
              <span className="inline-block w-2 h-3.5 bg-terminal-gold animate-pulse ml-1"></span>
            </div>
          </div>
        </div>
      </main>

      {/* Decryption Overlay */}
      <AnimatePresence>
        {decryptionId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm"
          >
            <div className="relative w-full max-w-lg p-6 md:p-8 border border-terminal-gold bg-black shadow-[0_0_50px_rgba(144,133,81,0.2)]">
              {/* Corner Brackets */}
              <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-terminal-gold"></div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-terminal-gold"></div>

              <div className="mb-4 md:mb-6 flex justify-between items-center text-[8px] md:text-[10px] text-terminal-gold/60 border-b border-terminal-gold/20 pb-2">
                <span>INTEL_DECRYPT_PROTOCOL_v.7</span>
                <span className="animate-pulse">正在解密扇区数据...</span>
              </div>

              <div className="h-32 md:h-40 text-[#00ff41] text-[8px] md:text-[10px] leading-tight overflow-hidden font-mono mb-4 md:mb-6">
                <motion.div
                  initial={{ y: 0 }}
                  animate={{ y: -200 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  01010111 01001000 01000001 01010100 00100000 01001001 01010011 00100000 01010100 01001000 01000101 00100000 01010010 01000101 01000100 00100000 01001101 01001111 01001111 01001110 00111111<br/>
                  0x00FF01 0x44A291 0xBC8811 0x001122 0xFFEEAA 0x992211 0xCCBB00<br/>
                  &gt; INITIATING_MEMETIC_FILTER<br/>
                  &gt; BYPASSING_SECURITY_LAYER_01<br/>
                  &gt; ACCESSING_CORE_FRAGMENTS<br/>
                  &gt; STABILIZING_NEURAL_LINK<br/>
                  &gt; [SUCCESS] 0x0021-X90<br/>
                  11010010 10110101 01101111 11001101 01101111 11001101 01101111 00111111<br/>
                  &gt; PARSING_SUBJECT_METADATA...<br/>
                  &gt; DECRYPTING_SECTOR_0x99...<br/>
                  01010111 01001000 01000001 01010100 00100000 01001001 01010011<br/>
                  &gt; AUTHENTICATION_LOCKED<br/>
                  &gt; RE-ROUTING_THROUGH_PROXY<br/>
                  &gt; [WARNING] MEMETIC_HAZARD_DETECTED<br/>
                  &gt; ATTEMPTING_RECOVERY...
                </motion.div>
              </div>

              <div className="text-center">
                <h2 className="text-lg md:text-xl text-white tracking-tighter mb-2">
                  {currentArchive?.items.find(i => i.id === decryptionId)?.title}
                </h2>
                <div className="text-[8px] md:text-[9px] text-terminal-gold/40 tracking-widest uppercase mt-2 md:mt-4">
                  DECRYPTING SECTOR... [DONE] / STABILIZING STREAM... [LOCKED]
                </div>
              </div>

              <div className="mt-6 md:mt-8 flex justify-center">
                <button 
                  onClick={() => setDecryptionId(null)}
                  className="px-6 py-2 border border-terminal-gold/40 text-[8px] md:text-[10px] text-terminal-gold hover:bg-terminal-gold hover:text-black transition-colors uppercase tracking-widest"
                >
                  [ 取消解密 ]
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main App Component ---

const HistoryPage = ({ onNavigate, historyData }: { 
  onNavigate: (view: 'search' | 'archive' | 'history' | 'terminal' | 'details' | 'submission') => void,
  historyData: any[]
}) => {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [activeEpoch, setActiveEpoch] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pan state for mini-map synchronization
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleDeepAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      onNavigate('details');
      setIsAnalyzing(false);
    }, 1500);
  };

  const filteredEvents = historyData.filter(e => {
    const matchesEpoch = e.epoch === activeEpoch;
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         e.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesEpoch && matchesSearch;
  });

  const searchResults = searchQuery ? historyData.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.id.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  return (
    <div className="relative flex h-[100dvh] w-full flex-col bg-terminal-bg text-slate-100 overflow-hidden font-sans selection:bg-terminal-gold selection:text-black">
      <div className="crt-overlay opacity-20"></div>
      <div className="scanline opacity-10"></div>
      
      <header className="z-40 flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/10 bg-terminal-bg/90 backdrop-blur-md px-4 md:px-6 py-2 gap-2 md:gap-0">
        <div className="flex items-center justify-between w-full md:w-auto gap-4 md:gap-6">
          <div className="flex items-center gap-2 text-terminal-gold">
            <Network className="w-4 h-4 md:w-5 md:h-5" />
            <h1 className="text-slate-100 text-[10px] md:text-sm font-bold tracking-[0.1em] md:tracking-[0.2em] uppercase whitespace-nowrap">历史脉络 <span className="hidden xs:inline">：全屏因果图谱</span></h1>
          </div>
          <div className="h-4 w-px bg-white/10 hidden md:block"></div>
          <nav className="flex items-center gap-3 md:gap-6">
            {[1, 2, 3].map((num) => (
              <button 
                key={num}
                onClick={() => {
                  setActiveEpoch(num);
                  setSelectedEvent(null);
                }}
                className={`text-[9px] md:text-xs font-bold tracking-widest transition-colors uppercase cursor-pointer ${activeEpoch === num ? 'text-terminal-gold' : 'text-slate-500 hover:text-terminal-gold'}`}
              >
                {num === 1 ? '一' : num === 2 ? '二' : '三'}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center justify-between w-full md:w-auto gap-2 md:gap-4">
          <div className="relative flex-1 md:w-48 group">
            <Search className={`absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 transition-colors ${searchQuery ? 'text-terminal-gold' : 'text-slate-600 group-focus-within:text-terminal-gold'}`} />
            <input 
              className="w-full bg-transparent border-b border-white/10 rounded-none text-slate-200 text-[10px] md:text-xs pl-7 md:pl-8 pr-2 py-1 focus:ring-0 focus:border-terminal-gold placeholder:text-slate-600 transition-all outline-none" 
              placeholder="因果检索..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#121110]/95 backdrop-blur-xl border border-white/10 shadow-2xl z-50 max-h-60 overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map(result => (
                    <div 
                      key={result.id}
                      onClick={() => {
                        setActiveEpoch(result.epoch);
                        setSelectedEvent(result);
                        setSearchQuery('');
                      }}
                      className="p-3 border-b border-white/5 hover:bg-terminal-gold/10 cursor-pointer transition-colors group/res"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-slate-200 text-[10px] font-bold uppercase">{result.title}</span>
                        <span className="text-terminal-gold/50 text-[8px]">EPOCH {result.epoch}</span>
                      </div>
                      <div className="text-slate-500 text-[8px] truncate">{result.description}</div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-slate-600 text-[10px]">未找到相关因果节点</div>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-0 md:gap-1">
            <button className="p-1.5 md:p-2 text-slate-400 hover:text-terminal-gold transition-colors" title="因果图例">
              <Compass className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button 
              onClick={() => onNavigate('archive')}
              className="p-1.5 md:p-2 text-slate-400 hover:text-terminal-gold transition-colors" title="全局视图"
            >
              <Grid className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button className="p-1.5 md:p-2 text-slate-400 hover:text-terminal-gold transition-colors" title="绝密文档">
              <FileText className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
          <div className="h-6 w-px bg-white/10 mx-1 md:mx-2 hidden sm:block"></div>
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter hidden lg:block">Access: Administrator</span>
            <div className="h-6 w-6 md:h-7 md:w-7 rounded-full border border-terminal-gold/50 overflow-hidden ring-1 ring-terminal-gold/20">
              <img 
                alt="Avatar" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" 
                src="https://picsum.photos/seed/admin/100/100"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="relative flex-1 overflow-hidden bg-terminal-bg nexus-canvas">
        <motion.div 
          className="absolute inset-0 origin-center"
          style={{ x: pan.x, y: pan.y, scale: zoom }}
          drag
          dragConstraints={{ left: -1000, right: 1000, top: -1000, bottom: 1000 }}
          dragElastic={0.1}
          onDrag={(e, info) => {
            setPan({ x: info.point.x - (window.innerWidth / 2), y: info.point.y - (window.innerHeight / 2) });
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 120 }}
        >
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="lineGrad" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor="#908551" stopOpacity="0.1"></stop>
                <stop offset="50%" stopColor="#908551" stopOpacity="0.5"></stop>
                <stop offset="100%" stopColor="#908551" stopOpacity="0.1"></stop>
              </linearGradient>
            </defs>
            {/* Dynamic Causality Lines */}
            {filteredEvents.map(event => 
              event.links?.map(linkId => {
                const target = historyData.find(h => h.id === linkId);
                if (!target) return null;
                return (
                  <motion.line 
                    key={`${event.id}-${linkId}`}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.4 }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    stroke="url(#lineGrad)" 
                    strokeWidth="1" 
                    x1={event.pos.left} 
                    y1={event.pos.top} 
                    x2={target.pos.left} 
                    y2={target.pos.top} 
                    strokeDasharray="5,5"
                  />
                );
              })
            )}
          </svg>

          {/* Dynamic Nodes */}
          {filteredEvents.map((event) => (
            <div 
              key={event.id}
              className="absolute group -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
              style={{ top: event.pos.top, left: event.pos.left }}
              onClick={() => setSelectedEvent(event)}
            >
              <motion.div 
                whileHover={{ scale: 1.5 }}
                animate={event.id === 'E3-000' ? {
                  scale: [1, 1.2, 1],
                  boxShadow: [
                    '0 0 10px rgba(144,133,81,0.8)',
                    '0 0 25px rgba(144,133,81,1)',
                    '0 0 10px rgba(144,133,81,0.8)'
                  ]
                } : {}}
                transition={event.id === 'E3-000' ? {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                } : {}}
                className={`w-4 h-4 rounded-full shadow-[0_0_10px_rgba(144,133,81,0.8)] transition-colors ${selectedEvent?.id === event.id ? 'bg-white scale-150' : 'bg-terminal-gold'}`}
              ></motion.div>
              <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className={`text-[10px] font-bold tracking-widest uppercase bg-terminal-bg/60 px-2 transition-colors ${selectedEvent?.id === event.id ? 'text-white' : 'text-terminal-gold'}`}>
                  {event.title}
                </span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Navigation Breadcrumbs */}
        <div className="absolute top-10 left-10 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 z-30">
          <button onClick={() => onNavigate('archive')} className="hover:text-terminal-gold cursor-pointer transition-colors">ARCHIVE</button>
          <span className="w-1 h-1 rounded-full bg-slate-700"></span>
          <span className="hover:text-terminal-gold cursor-pointer transition-colors">NEXUS</span>
          <span className="w-1 h-1 rounded-full bg-slate-700"></span>
          <span className="text-terminal-gold">EPOCH_0{activeEpoch}_MAP</span>
        </div>

        {/* Mini Map */}
        <div className="absolute bottom-10 right-10 flex flex-col gap-4 items-end z-30">
          <div 
            className="w-56 h-36 bg-[#121110]/60 backdrop-blur-xl border border-white/10 rounded-sm p-1.5 overflow-hidden shadow-2xl relative group/map cursor-crosshair"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const rx = (e.clientX - rect.left) / rect.width;
              const ry = (e.clientY - rect.top) / rect.height;
              // Map back to pan coordinates (roughly)
              setPan({
                x: (0.5 - rx) * 2000,
                y: (0.5 - ry) * 2000
              });
            }}
          >
            <div className="absolute inset-0 opacity-10 pointer-events-none nexus-canvas bg-repeat"></div>
            {filteredEvents.map(e => (
              <div 
                key={`dot-${e.id}`}
                className="absolute w-1 h-1 rounded-full bg-terminal-gold/40"
                style={{ top: e.pos.top, left: e.pos.left }}
              ></div>
            ))}
            
            {/* Viewfinder */}
            <motion.div 
              className="absolute border border-terminal-gold/60 bg-terminal-gold/5 pointer-events-none"
              animate={{
                left: `${50 - (pan.x / 2000 * 100) - (50 / zoom)}%`,
                top: `${50 - (pan.y / 2000 * 100) - (50 / zoom)}%`,
                width: `${100 / zoom}%`,
                height: `${100 / zoom}%`
              }}
              transition={{ type: 'spring', damping: 25 }}
            ></motion.div>

            <div className="absolute bottom-2 left-3 flex items-center gap-2">
              <span className="text-[8px] text-slate-500 uppercase tracking-widest">Global Scan Area</span>
              <span className="w-1.5 h-1.5 rounded-full bg-terminal-gold animate-pulse"></span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-[#121110]/60 backdrop-blur-xl border border-white/10 rounded-sm text-[10px] font-mono text-terminal-gold">
              ZOOM: {Math.round(zoom * 100)}%
            </div>
            <div className="flex items-center bg-[#121110]/60 backdrop-blur-xl border border-white/10 rounded-sm">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setZoom(prev => Math.min(prev + 0.2, 3));
                }}
                className="p-2.5 text-slate-400 hover:text-terminal-gold transition-colors border-r border-white/10 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setZoom(prev => Math.max(prev - 0.2, 0.3));
                }}
                className="p-2.5 text-slate-400 hover:text-terminal-gold transition-colors cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
              className="p-3 bg-[#121110]/60 backdrop-blur-xl border border-white/10 rounded-sm text-slate-400 hover:text-terminal-gold transition-colors shadow-lg cursor-pointer"
              title="重置视图"
            >
              <Compass className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Focus Panel / Detail View */}
        <AnimatePresence>
          {selectedEvent ? (
            <motion.div 
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              className="absolute bottom-10 left-10 max-w-lg z-40"
            >
              <div className="bg-[#121110]/90 backdrop-blur-2xl border border-white/10 p-8 border-l-4 border-l-terminal-gold relative overflow-hidden shadow-2xl">
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute -right-12 -top-12 opacity-[0.03] pointer-events-none">
                  <History className="w-40 h-40" />
                </div>
                {/* Technical Micro-labels */}
                <div className="absolute top-0 left-0 w-full flex justify-between px-8 py-2 pointer-events-none">
                  <span className="text-[8px] font-mono opacity-20 uppercase tracking-[0.3em]">Sector: 09-Alpha // Node: Core_Sync</span>
                  <span className="text-[8px] font-mono opacity-20 uppercase tracking-[0.3em]">Timestamp: {new Date().getTime()}</span>
                </div>

                <div className="flex items-center gap-4 mb-3">
                  <span className="text-terminal-gold text-[10px] font-bold uppercase tracking-[0.2em]">当前聚焦节点</span>
                  <div className="h-px flex-1 bg-white/10"></div>
                </div>
                <h2 className="text-slate-100 text-3xl font-bold mb-2 tracking-tight">
                  {selectedEvent.title} 
                  <span className="text-terminal-gold/40 font-light text-xl ml-3">#{selectedEvent.id}</span>
                </h2>
                <div className="flex gap-2 mb-6">
                  {selectedEvent.tags.map((tag: string) => (
                    <span key={tag} className="text-[8px] text-terminal-gold/60 border border-terminal-gold/20 px-2 py-0.5 uppercase tracking-widest">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6 font-serif">
                  <DecryptedText text={selectedEvent.details} speed={20} />
                </p>
                <div className="flex items-center justify-between border-t border-white/5 pt-6">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-500 uppercase tracking-tighter">观测时间点</span>
                    <span className="text-slate-200 font-mono text-xs">{selectedEvent.time}</span>
                  </div>
                  <button 
                    onClick={handleDeepAnalysis}
                    className="px-6 py-2 bg-terminal-gold text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white transition-all"
                  >
                    [ <GlitchText text="进入深度解析" /> ]
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="absolute bottom-10 left-10 max-w-xs z-30">
              <div className="bg-[#121110]/60 backdrop-blur-xl border border-white/10 p-6 border-l-4 border-l-terminal-gold/30">
                <p className="text-slate-400 text-xs leading-relaxed italic">
                  "历史不是线性的，而是无数因果节点交织而成的网络。点击任何节点以展开其详细的时间轴数据。"
                </p>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Analysis Overlay */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center gap-6 backdrop-blur-md"
            >
              <div className="relative w-64 h-1 bg-white/10 overflow-hidden">
                <motion.div 
                  className="absolute inset-0 bg-terminal-gold"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-terminal-gold text-[10px] font-bold uppercase tracking-[0.5em] animate-pulse">
                  正在同步因果链条...
                </span>
                <span className="text-white/20 text-[8px] font-mono">
                  DECRYPTING_TEMPORAL_NODE_{selectedEvent?.id}
                </span>
              </div>
              <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="scanline"></div>
                <div className="crt-overlay"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timeline Slider */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 z-50">
          <div className="absolute inset-0 flex items-center justify-between px-20">
            {historyData.map((e, i) => (
              <div 
                key={`marker-${e.id}`}
                className={`w-1 h-3 transition-all cursor-pointer ${selectedEvent?.id === e.id ? 'bg-terminal-gold h-6' : 'bg-white/20 hover:bg-white/40'}`}
                onClick={() => setSelectedEvent(e)}
              ></div>
            ))}
          </div>
        </div>
      </main>

      <footer className="z-40 h-7 border-t border-white/10 bg-terminal-bg/95 flex items-center justify-between px-6 text-[9px] text-slate-500 font-bold tracking-widest uppercase font-mono">
        <div className="flex gap-8 items-center">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-terminal-gold/40"></span>
            <span>System: Online</span>
          </div>
          <div className="flex items-center gap-2">
            <Server className="w-3 h-3 text-slate-600" />
            <span>Core_Nexus_Alpha</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-slate-600" />
            <span>Nodes: 1,402 / Connected: 89%</span>
          </div>
        </div>
        <div className="flex gap-8 items-center">
          <div className="flex items-center gap-2">
            <Crosshair className="w-3 h-3 text-slate-600" />
            <span>Grid: 34.22.11 / -118.45.02</span>
          </div>
          <span className="text-terminal-gold/60">Historical Integrity Verified</span>
          <div className="flex items-center gap-1.5">
            <Globe className="w-3 h-3" />
            <span>ZH_CN</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- Components for Boot Sequence ---

const BootSequence = ({ onComplete }: { onComplete: () => void }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'logs' | 'logo' | 'complete'>('logs');

  const bootLogs = [
    "SYSTEM INITIALIZING...",
    "KERNEL_VERSION: 4.0.96-REDMOON",
    "LOADING MEMETIC_FILTERS...",
    "BYPASSING SECURITY_LAYER_01...",
    "ESTABLISHING NEURAL_LINK...",
    "DECRYPTING SECTOR_0x99...",
    "ACCESSING CORE_FRAGMENTS...",
    "STABILIZING STREAM...",
    "AUTHORIZATION_GRANTED",
    "WELCOME TO RED MOON CORE"
  ];

  useEffect(() => {
    let currentLog = 0;
    const logInterval = setInterval(() => {
      if (currentLog < bootLogs.length) {
        const logToAdd = bootLogs[currentLog];
        setLogs(prev => [...prev, logToAdd]);
        currentLog++;
      } else {
        clearInterval(logInterval);
        setTimeout(() => setPhase('logo'), 500);
      }
    }, 200);

    return () => clearInterval(logInterval);
  }, []);

  useEffect(() => {
    if (phase === 'logo') {
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => onComplete(), 1500);
            return 100;
          }
          return prev + 2;
        });
      }, 30);
      return () => clearInterval(progressInterval);
    }
  }, [phase]);

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-10 font-mono text-terminal-gold overflow-hidden">
      <div className="crt-overlay"></div>
      <div className="scanline"></div>

      <AnimatePresence mode="wait">
        {phase === 'logs' ? (
          <motion.div 
            key="logs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-2xl space-y-1"
          >
            {logs.map((log, i) => (
              <div key={i} className="flex gap-4">
                <span className="opacity-40">[{new Date().toLocaleTimeString()}]</span>
                <span className={log?.includes('GRANTED') ? 'text-white font-bold' : ''}>{log}</span>
              </div>
            ))}
            <motion.span 
              animate={{ opacity: [0, 1] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
              className="inline-block w-2 h-4 bg-terminal-gold ml-2"
            />
          </motion.div>
        ) : (
          <motion.div 
            key="logo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-12"
          >
            <div className="relative">
              <motion.div 
                animate={{ 
                  boxShadow: ["0 0 20px rgba(144,133,81,0.2)", "0 0 60px rgba(144,133,81,0.6)", "0 0 20px rgba(144,133,81,0.2)"] 
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-48 h-48 rounded-full border-4 border-terminal-gold flex items-center justify-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-terminal-gold/10 animate-pulse"></div>
                <img 
                  src="https://i.postimg.cc/SK123SmX/hong-yue-zhi-xia.png" 
                  alt="Red Moon" 
                  className="w-full h-full object-cover relative z-10 opacity-90 mix-blend-screen"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              <div className="absolute -inset-4 border border-terminal-gold/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
              <div className="absolute -inset-8 border border-terminal-gold/10 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
            </div>

            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold tracking-[0.5em] glitch-text uppercase" data-text="RED MOON CORE">
                RED MOON CORE
              </h1>
              <p className="text-xs tracking-[0.8em] opacity-40 uppercase">Neural Interface v4.0.96</p>
            </div>

            <div className="w-80 space-y-2">
              <div className="flex justify-between text-[10px] tracking-widest uppercase">
                <span>Decrypting...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1 w-full bg-terminal-gold/10 relative overflow-hidden">
                <motion.div 
                  className="absolute top-0 left-0 h-full bg-terminal-gold"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Components for Details Page ---

const DetailsPage = ({ itemId, onNavigate, archives, onSelectItem }: { itemId: string | null, onNavigate: (view: 'search' | 'archive' | 'history' | 'terminal' | 'details' | 'submission') => void, archives: Record<string, { title: string, items: any[] }>, onSelectItem: (id: string) => void }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isZenMode, setIsZenMode] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Flatten all items for navigation
  const allItems = Object.values(archives).flatMap(archive => archive.items);
  const currentIndex = allItems.findIndex(item => item.id === itemId);

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectItem(allItems[currentIndex - 1].id);
      containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (currentIndex < allItems.length - 1) {
      onSelectItem(allItems[currentIndex + 1].id);
      containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 下载文件功能
  const downloadFile = (file: any) => {
    try {
      setIsDownloading(true);
      
      // 创建下载链接
      const link = document.createElement('a');
      link.href = file.content;
      link.download = file.name;
      
      // 模拟下载过程
      setTimeout(() => {
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsDownloading(false);
      }, 1000);
    } catch (error) {
      console.error('下载文件失败:', error);
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `红月档案: ${content.title}`,
      text: content.subtitle,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('链接已复制到剪贴板');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const sections = [];

      // Header info
      sections.push(
        new Paragraph({
          text: `档案编号: ${content.code}`,
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `${content.title} ${content.subtitle}`,
              bold: true,
              size: 32,
            }),
          ],
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `日期: ${content.date}`, size: 20 }),
            new TextRun({ text: ` | 地点: ${content.loc}`, size: 20 }),
            new TextRun({ text: ` | 权限: ${content.auth}`, size: 20 }),
          ],
          spacing: { after: 400 },
        })
      );

      // Images
      const images = content.images || (content.image ? [{ content: content.image, name: 'MAIN_IMAGE', width: '100%', align: 'none' }] : []);
      
      for (const img of images) {
        try {
          const response = await fetch(img.content);
          const blob = await response.blob();
          const buffer = await blob.arrayBuffer();
          
          sections.push(
            new Paragraph({
              children: [
                new ImageRun({
                  data: new Uint8Array(buffer),
                  transformation: {
                    width: 600,
                    height: 400,
                  },
                } as any),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { before: 200, after: 400 },
            })
          );
        } catch (imgErr) {
          console.error('Failed to include image in docx:', imgErr);
        }
      }

      // Content sections
      const addSection = (title: string, body: string) => {
        sections.push(
          new Paragraph({
            children: [new TextRun({ text: `--- ${title} ---`, bold: true, color: "888888" })],
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: body })],
            spacing: { after: 300 },
          })
        );
      };

      addSection("摘要", content.quote);
      addSection("正文", content.section1);
      addSection("深度解析", content.section2);
      addSection("访谈记录", content.interview);

      // Footer
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "© 2144 GLOBAL DEFENSE COUNCIL ARCHIVE",
              italics: true,
              size: 18,
              color: "aaaaaa",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 400 },
        })
      );

      const doc = new Document({
        sections: [{
          properties: {},
          children: sections,
        }],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${content.code}_${content.title}.docx`);
    } catch (err) {
      console.error('Error generating docx:', err);
      alert('生成文档失败，请重试');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const totalHeight = scrollHeight - clientHeight;
      const progress = totalHeight > 0 ? (scrollTop / totalHeight) * 100 : 0;
      setScrollProgress(progress);
    }
  };

  // Mock data for different items
  const itemContent: Record<string, any> = {
    'ANM-072': {
      code: 'RED_MOON_INCIDENT',
      title: '赤月事件总览：',
      subtitle: '维度侵蚀与认知坍塌',
      date: '2144.05.12',
      loc: 'ANTARCTICA',
      auth: 'OVERSEER',
      quote: '在第二次“赤月”升起之后的第十四个地球日，位于南极洲的深空观测站首次记录到了非自然频率的电磁波动。',
      section1: '根据现场勘查，物理常数在受灾区域发生了显著改变。重力加速度在局部范围内波动幅度达到了 14.5% RECOVERY_REQUIRED。更令人不安的是，目击者报告称在红光笼罩下，他们能够看到“已经逝去的时间线”在空气中交织。',
      interview: '“月亮不是红色的，它是...它是某种巨大的、正在注视着我们的角膜。当它睁开时，天空便裂开了。”',
      section2: '根据《赤月防御协定》，任何接触过赤月直射光超过 DATA_EXPUNGED 的人员必须立即接受认知清洗。初步症状包括：',
      symptoms: ['对自身生物特征的排斥感', '能够听见低频的、无法解析的群体低语', '在镜子中观察到 NON_HUMAN_OCULAR', '强烈的寻求“归乡”的冲动'],
      image: 'https://picsum.photos/seed/redmoon/1200/800?grayscale'
    },
    'ANM-105': {
      code: 'DEFENSE_PROTOCOL',
      title: '枢纽防御协议：',
      subtitle: '第四阶段实施细则',
      date: '2144.03.11',
      loc: 'CORE_NEXUS',
      auth: 'COMMANDER',
      quote: '防御不是为了生存，而是为了推迟必然的终结。',
      section1: '第四阶段协议涉及对核心区域的物理封锁。所有非必要人员已撤离至地下避难所。目前，核心同步率保持在 88.2%，处于可控范围边缘。',
      interview: '“如果大门关不上，我们就把自己锁在里面。”',
      section2: '封锁期间的资源配给将严格按照贡献度执行。任何试图破坏封锁的行为将被视为叛国。',
      symptoms: ['对封闭空间的异常适应', '对外部信号的极度恐惧', '集体性幻觉：看到墙壁在呼吸'],
      image: 'https://picsum.photos/seed/defense/1200/800?grayscale'
    }
  };

  // Find metadata from archives
  const itemMetadata = Object.values(archives).flatMap(a => a.items).find(i => i.id === itemId);

  const content = itemMetadata ? {
    code: 'UPLOADED_DOCUMENT',
    title: itemMetadata.title,
    subtitle: itemMetadata.files && itemMetadata.files.length > 0 ? `源文件: ${itemMetadata.files.map(f => f.name).join(', ')}` : '管理员上传文档',
    date: itemMetadata.time.split(' ')[0],
    loc: 'REMOTE_UPLOAD',
    auth: 'ADMIN_OVERRIDE',
    quote: '',
    section1: itemMetadata.fileContent || (itemMetadata.files && itemMetadata.files.filter(f => !f.type.startsWith('image/')).map(f => f.content).join('\n\n---\n\n')) || '该文档未包含文字内容。',
    interview: '',
    section2: '',
    symptoms: [],
    images: itemMetadata.files ? itemMetadata.files.filter(f => f.type.startsWith('image/')) : [],
    image: itemMetadata.files ? (itemMetadata.files.find(f => f.type.startsWith('image/'))?.content || 'https://picsum.photos/seed/document/1200/800?grayscale') : 'https://picsum.photos/seed/document/1200/800?grayscale'
  } : (itemId && itemContent[itemId] ? itemContent[itemId] : {
    code: 'UNKNOWN_DATA',
    title: '数据缺失：',
    subtitle: '该档案尚未录入详细内容',
    date: 'UNKNOWN',
    loc: 'UNKNOWN',
    auth: 'SYSTEM',
    quote: '无法在当前数据库中检索到该对象的详细描述。',
    section1: '该档案可能已被删除、移动或尚未由管理员完成录入。请联系系统管理员获取进一步权限。',
    interview: '“没有任何记录。就像它从未存在过一样。”',
    section2: '如果这是由于系统错误导致的，请尝试重新同步数据库。',
    symptoms: ['数据损坏', '访问权限不足', '文件未找到'],
    image: 'https://picsum.photos/seed/unknown/1200/800?grayscale'
  });

  return (
    <div 
      ref={containerRef}
      onScroll={handleScroll}
      className={`h-[100dvh] overflow-y-auto font-mono relative transition-colors duration-700 selection:bg-terminal-gold/30 ${isLightMode ? 'bg-[#f5f5f0] text-black selection:text-black' : 'bg-terminal-bg text-slate-300 selection:text-terminal-gold'}`}
    >
      <div className={`fixed inset-0 structural-grid pointer-events-none z-0 transition-opacity duration-700 ${isLightMode ? 'opacity-5' : 'opacity-20'}`}></div>
      <div className="noise-overlay"></div>
      
      <AnimatePresence>
        {isDownloading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center gap-6"
          >
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-terminal-gold/20 rounded-full"></div>
              <motion.div 
                className="absolute inset-0 border-4 border-terminal-gold border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-terminal-gold font-bold tracking-[0.3em] uppercase">正在构建加密文档</h3>
              <p className="text-[10px] text-terminal-gold/40 tracking-widest uppercase animate-pulse">正在提取图像并注入元数据...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <header className={`fixed top-0 left-0 w-full z-50 border-b transition-all duration-700 ${isZenMode ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'} ${isLightMode ? 'bg-white/90 border-black/10' : 'bg-black/90 border-terminal-gold/30'}`}>
        <div className="h-[2px] bg-terminal-gold/20 w-full">
          <motion.div 
            className="h-full bg-terminal-gold shadow-[0_0_15px_rgba(144,133,81,1)]" 
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
        <div className="flex items-center justify-between px-4 md:px-6 py-2 text-[8px] md:text-[10px] tracking-[0.1em] md:tracking-[0.2em] font-mono text-terminal-gold/70">
          <div className="flex items-center gap-3 md:gap-6">
            <span className="flex items-center gap-1 md:gap-2"><span className="w-1.5 md:w-2 h-1.5 md:h-2 bg-terminal-gold animate-pulse"></span> <span className="hidden xs:inline">SYSTEM:</span> ONLINE</span>
            <span className="hidden md:inline">ENCRYPTION: AES-256-RDM</span>
            <span className="hidden lg:inline text-terminal-gold">ID: {itemId || 'UNKNOWN'}</span>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <span className="text-terminal-gold font-bold truncate max-w-[100px] md:max-w-none">MODE: TERMINAL_RESTRICTED</span>
            <span className="opacity-50 hidden xs:inline">UTF-8 / SC</span>
          </div>
        </div>
      </header>

      <div className={`layout-container flex flex-col items-center pb-20 px-4 md:px-8 relative z-10 transition-all duration-700 ${isZenMode ? 'pt-8 md:pt-12' : 'pt-20 md:pt-24'}`}>
        <div className={`max-w-4xl w-full flex flex-row justify-between items-center mb-6 md:mb-8 gap-4 transition-all duration-700 ${isZenMode ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
          <nav className="flex gap-1 md:gap-2 font-mono">
            <button onClick={() => onNavigate('terminal')} className={`terminal-btn text-[9px] md:text-xs ${isLightMode ? 'border-black/20 text-black/60 hover:border-black hover:text-black' : ''}`}>[ <GlitchText text="返回" /> ]</button>
            <button 
              onClick={() => setIsLightMode(!isLightMode)} 
              className={`terminal-btn text-[9px] md:text-xs transition-all ${isLightMode ? 'bg-black text-white border-black' : 'active'}`}
            >
              [ <GlitchText text={isLightMode ? '终端' : '阅读'} /> ]
            </button>
          </nav>
          <div className={`flex gap-3 md:gap-4 text-[9px] md:text-[11px] font-mono transition-colors ${isLightMode ? 'text-black/40' : 'text-terminal-gold/60'}`}>
            <span className="hidden sm:inline hover:text-black cursor-pointer transition-colors">/CMD: EXPORT</span>
            <button onClick={() => onNavigate('search')} className="hover:text-black cursor-pointer transition-colors">/CMD: LOGOUT</button>
            <span className={isLightMode ? 'text-black/60' : 'text-terminal-gold'}>TEMP: 34°C</span>
          </div>
        </div>

        <main className={`max-w-4xl w-full border backdrop-blur-sm relative overflow-hidden transition-all duration-700 ${isLightMode ? 'bg-white border-black/10 shadow-xl' : 'bg-black/85 border-terminal-gold/30'}`}>
          <div className={`scanline ${isLightMode ? 'opacity-0' : ''}`}></div>
          <div className={`border-b px-6 py-3 flex justify-between items-center transition-colors ${isLightMode ? 'bg-black/5 border-black/10' : 'bg-terminal-gold/5 border-terminal-gold/30'}`}>
            <div className="flex items-center gap-4">
              <div className="flex gap-1.5">
                <div className={`w-2 h-2 border ${isLightMode ? 'border-black/20' : 'border-terminal-gold/50'}`}></div>
                <div className={`w-2 h-2 border ${isLightMode ? 'border-black/20' : 'border-terminal-gold/50'}`}></div>
                <div className={`w-2 h-2 border ${isLightMode ? 'border-black/20 bg-black/10' : 'border-terminal-gold/50 bg-terminal-gold/30'}`}></div>
              </div>
              <h2 className={`text-xs font-bold tracking-[0.3em] uppercase transition-colors ${isLightMode ? 'text-black/80' : 'text-terminal-gold'}`}>Secure Lore Database v4.0.1</h2>
            </div>
            <div className={`text-[10px] font-mono transition-colors ${isLightMode ? 'text-black/30' : 'text-terminal-gold/40'}`}>
              SEC_LEVEL: 05 // EYES_ONLY
            </div>
          </div>

          <article className="p-6 md:p-16 space-y-8 md:space-y-12 relative">
            {/* Technical Micro-labels */}
            <div className="absolute top-0 left-0 w-full flex justify-between px-4 md:px-8 py-2 pointer-events-none">
              <span className="text-[7px] md:text-[8px] font-mono opacity-20 uppercase tracking-[0.2em] md:tracking-[0.3em]">Sector: 09-Alpha // Node: Core_Sync</span>
              <span className="text-[7px] md:text-[8px] font-mono opacity-20 uppercase tracking-[0.2em] md:tracking-[0.3em]">Timestamp: {new Date().getTime()}</span>
            </div>
            
            {/* Archive Stamp */}
            <motion.div 
              initial={{ scale: 2, opacity: 0, rotate: 25 }}
              animate={{ scale: 1, opacity: 0.4, rotate: 15 }}
              transition={{ duration: 0.4, delay: 1.2, type: 'spring', damping: 12 }}
              className="absolute -top-4 -right-4 md:-top-12 md:-right-12 w-32 h-32 md:w-[28rem] md:h-[28rem] pointer-events-none z-20 select-none"
            >
              <img 
                src="https://i.postimg.cc/W3mLY6sJ/IMG-20251123-001115-941.png" 
                alt="OFFICIAL_STAMP" 
                className={`w-full h-full object-contain ${isLightMode ? 'mix-blend-multiply' : ''}`}
                style={{ 
                  filter: isLightMode 
                    ? 'contrast(1.2) sepia(1) saturate(8) hue-rotate(-50deg)' 
                    : 'sepia(1) saturate(5) brightness(1.2) contrast(1.2)' 
                }}
                referrerPolicy="no-referrer"
              />
            </motion.div>

            <header className="space-y-4 md:space-y-6 relative z-10">
              <div className={`inline-block border px-2 md:px-3 py-1 transition-colors ${isLightMode ? 'border-black/10' : 'border-terminal-gold/20'}`}>
                <span className={`text-[8px] md:text-[10px] tracking-widest font-mono transition-colors ${isLightMode ? 'text-black/40' : 'text-terminal-gold'}`}>CODE_NAME: {content.code}</span>
              </div>
              <h1 className={`text-xl md:text-5xl font-bold tracking-tighter font-mono leading-tight transition-colors ${isLightMode ? 'text-black' : 'text-white'}`}>
                {content.title}<br/>
                <span className={`text-sm md:text-2xl ${isLightMode ? 'text-black/60' : 'text-terminal-gold/90'}`}>
                  {content.subtitle}
                </span>
              </h1>
              <div className={`grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 py-4 md:py-6 border-y text-[9px] md:text-[11px] font-mono transition-colors ${isLightMode ? 'border-black/10 text-black/40' : 'border-terminal-gold/10 text-terminal-gold/60'}`}>
                <div>DATE: {content.date}</div>
                <div>LOC: {content.loc}</div>
                <div>AUTH: {content.auth}</div>
                <div>STATUS: CLASSIFIED</div>
              </div>
            </header>

            <section className={`space-y-6 md:space-y-10 leading-relaxed transition-colors ${isLightMode ? 'text-black/80' : 'text-slate-300'}`}>
              <div className="flex items-start gap-2 md:gap-4">
                <span className={`text-2xl md:text-5xl font-bold leading-none mt-1 transition-colors ${isLightMode ? 'text-black/20' : 'text-terminal-gold'}`}>“</span>
                <p className={`text-sm md:text-2xl font-serif italic leading-snug transition-colors ${isLightMode ? 'text-black' : 'text-slate-200'}`}>
                  {content.quote}
                </p>
              </div>

              <div className="space-y-4 md:space-y-6">
                <h3 className={`font-mono text-sm md:text-lg font-bold flex items-center gap-2 md:gap-3 transition-colors ${isLightMode ? 'text-black' : 'text-terminal-gold'}`}>
                  <span className={`w-1 h-3 md:h-5 transition-colors ${isLightMode ? 'bg-black' : 'bg-terminal-gold'}`}></span>
                  01. 事件描述：维度裂隙
                </h3>
                <div className="font-serif text-sm md:text-lg opacity-90 overflow-hidden">
                  {(() => {
                    const text = content.section1 || '';
                    const images = content.images || [];
                    
                    // If no images or legacy string images, just render text
                    if (images.length === 0 || typeof images[0] === 'string') {
                      return (
                        <>
                          {images.length > 0 && typeof images[0] === 'string' && (
                            <div className="grid grid-cols-1 gap-8 mb-8 clear-both mt-8">
                              {images.map((img: any, idx: number) => (
                                <div key={idx} className={`border p-2 transition-colors ${isLightMode ? 'border-black/10' : 'border-terminal-gold/20'}`}>
                                  <img src={img} alt={`Content ${idx}`} className="w-full grayscale hover:grayscale-0 transition-all duration-500" />
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="whitespace-pre-wrap leading-relaxed">
                            {text}
                          </div>
                        </>
                      );
                    }

                    // For new object-based images, support placeholders and floating
                    const referencedNames = new Set();
                    const parts = text.split(/(\[IMG_.*?\])/g);
                    
                    const renderMedia = (file: any, idx: number) => {
                      // 音频文件
                      if (file.type && file.type.startsWith('audio/')) {
                        return (
                          <div 
                            key={`audio-${idx}`} 
                            className={`border p-4 my-4 transition-colors ${isLightMode ? 'border-black/10 bg-black/5' : 'border-terminal-gold/20 bg-terminal-gold/5'}`}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <svg className="w-5 h-5 text-terminal-gold" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4c.73 0 1.41-.21 2-.55V21h2v-8h-2zM10 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                              </svg>
                              <span className="text-xs font-mono uppercase">{file.name}</span>
                            </div>
                            <audio 
                              controls 
                              src={file.content} 
                              className="w-full"
                            />
                          </div>
                        );
                      }
                      
                      // 图片文件
                      return (
                        <div 
                          key={`img-${idx}`} 
                          style={{ 
                            float: file.align === 'none' ? 'none' : (file.align || 'left'), 
                            width: file.width || '50%',
                            height: file.height === 'auto' ? 'auto' : file.height,
                            margin: file.align === 'right' ? '0 0 1.5rem 1.5rem' : (file.align === 'left' ? '0 1.5rem 1.5rem 0' : '0 0 1.5rem 0')
                          }}
                          className={`border p-1 transition-colors ${isLightMode ? 'border-black/10' : 'border-terminal-gold/20'} ${file.align === 'none' ? 'mx-auto mb-8 clear-both' : ''}`}
                        >
                          <img src={file.content} alt={file.name} className="w-full h-full grayscale hover:grayscale-0 transition-all duration-500" style={{ objectFit: file.height === 'auto' ? 'contain' : 'fill' }} />
                          <div className={`mt-1 text-[8px] font-mono uppercase transition-colors ${isLightMode ? 'text-black/30' : 'text-terminal-gold/40'}`}>
                            IMG_REF: {file.name}
                          </div>
                        </div>
                      );
                    };

                    // Find unreferenced images to float at the top
                    const unreferencedImages = images.filter((f: any) => {
                      const isRef = text.includes(`[IMG_${f.name}]`);
                      if (isRef) referencedNames.add(f.name);
                      return !isRef;
                    });

                    return (
                      <>
                        {unreferencedImages.map((f: any, i: number) => renderMedia(f, i))}
                        <div className="whitespace-pre-wrap leading-relaxed inline">
                          {parts.map((part, i) => {
                            const match = part.match(/\[IMG_(.*?)\]/);
                            if (match) {
                              const name = match[1];
                              const file = images.find((f: any) => f.name === name);
                              if (file) return renderMedia(file, i);
                            }
                            return <span key={i}>{part}</span>;
                          })}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {content.section2 && (
                <div className="space-y-6">
                  <h3 className={`font-mono text-lg font-bold flex items-center gap-3 transition-colors ${isLightMode ? 'text-black' : 'text-terminal-gold'}`}>
                    <span className={`w-1 h-5 transition-colors ${isLightMode ? 'bg-black' : 'bg-terminal-gold'}`}></span>
                    02. 深度解析：因果纠缠
                  </h3>
                  <div className="font-serif text-lg opacity-90 leading-relaxed">
                    {content.section2}
                  </div>
                </div>
              )}

              {content.interview && (
                <div className={`p-8 border-l-2 italic transition-colors ${isLightMode ? 'border-black/10 bg-black/5 text-black/70' : 'border-terminal-gold/20 bg-terminal-gold/5 text-slate-400'}`}>
                  <div className="flex items-start gap-4">
                    <span className="text-2xl font-bold opacity-20">“</span>
                    <p className="text-lg">
                      {content.interview}
                    </p>
                  </div>
                </div>
              )}

              <div className={`relative border p-1 transition-colors ${isLightMode ? 'border-black/10' : 'border-terminal-gold/20'}`}>
                <div className="absolute top-4 right-4 z-20 flex gap-2">
                  <span className={`text-[8px] border px-2 py-0.5 transition-colors ${isLightMode ? 'bg-white/80 text-black border-black/20' : 'bg-black/80 text-terminal-gold border-terminal-gold/30'}`}>HISTOGRAM: SIG_PEAK</span>
                </div>
                <img 
                  alt="Space anomaly" 
                  className={`w-full grayscale contrast-125 transition-all duration-700 ${isLightMode ? 'opacity-80 hover:opacity-100' : 'opacity-40 hover:opacity-70'}`} 
                  src={content.image}
                  referrerPolicy="no-referrer"
                />
                <div className={`absolute inset-0 pointer-events-none transition-colors ${isLightMode ? 'bg-black/5' : 'bg-terminal-gold/5'}`}></div>
                <div className={`mt-2 flex justify-between font-mono text-[9px] uppercase transition-colors ${isLightMode ? 'text-black/30' : 'text-terminal-gold/40'}`}>
                  <span>Capture_ID: ANOMALY_S_POLE_2144</span>
                  <span>Source: SAT_ORBIT_9</span>
                </div>
              </div>

              <div className={`mt-12 border-t pt-8 transition-colors ${isLightMode ? 'border-black/10' : 'border-terminal-gold/20'}`}>
                {/* Removed Security Breach Box as per request */}
              </div>

              {itemMetadata?.files && itemMetadata.files.length > 0 && (
                <div className={`mt-8 border p-6 transition-colors ${isLightMode ? 'border-black/10 bg-black/5' : 'border-terminal-gold/20 bg-terminal-gold/5'}`}>
                  <div className={`flex items-center gap-3 mb-4 font-bold tracking-widest text-xs ${isLightMode ? 'text-black' : 'text-terminal-gold'}`}>
                    <FileText className="w-4 h-4" />
                    ATTACHED_DOCUMENTS: [ENCRYPTED_ASSETS]
                  </div>
                  <div className="space-y-4">
                    {itemMetadata.files.map((file: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between border-b border-terminal-gold/10 pb-4 last:border-0 last:pb-0">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 border flex items-center justify-center ${isLightMode ? 'border-black/20 text-black/40' : 'border-terminal-gold/30 text-terminal-gold/40'}`}>
                            {file.type.startsWith('image/') ? <Grid className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                          </div>
                          <div>
                            <p className={`text-xs font-bold ${isLightMode ? 'text-black' : 'text-terminal-gold'}`}>{file.name}</p>
                            <p className={`text-[9px] opacity-40 uppercase ${isLightMode ? 'text-black' : 'text-terminal-gold'}`}>Type: {file.type.toUpperCase()}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => downloadFile(file)}
                          className={`px-4 py-2 border text-[10px] font-bold uppercase tracking-widest transition-all ${isLightMode ? 'border-black/20 text-black hover:bg-black hover:text-white' : 'border-terminal-gold/30 text-terminal-gold hover:bg-terminal-gold hover:text-black'}`}
                        >
                          [ <GlitchText text="下载" /> ]
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <footer className={`pt-12 border-t flex flex-col md:flex-row justify-between items-center gap-8 transition-colors ${isLightMode ? 'border-black/10' : 'border-terminal-gold/20'}`}>
              <div className="flex gap-4 w-full md:w-auto">
                <button 
                  onClick={handlePrev}
                  disabled={currentIndex <= 0}
                  className={`flex-1 md:flex-none terminal-btn flex items-center justify-center gap-2 ${isLightMode ? 'border-black/20 text-black/60 hover:border-black hover:text-black' : ''} ${currentIndex <= 0 ? 'opacity-20 cursor-not-allowed' : ''}`}
                >
                  <ChevronLeft className="w-4 h-4" /> <GlitchText text="PREV_LOG" />
                </button>
                <button 
                  onClick={handleNext}
                  disabled={currentIndex >= allItems.length - 1}
                  className={`flex-1 md:flex-none terminal-btn flex items-center justify-center gap-2 ${isLightMode ? 'border-black/20 text-black/60 hover:border-black hover:text-black' : ''} ${currentIndex >= allItems.length - 1 ? 'opacity-20 cursor-not-allowed' : ''}`}
                >
                  <GlitchText text="NEXT_LOG" /> <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className={`flex gap-6 transition-colors ${isLightMode ? 'text-black/30' : 'text-terminal-gold/40'}`}>
                <Share2 onClick={handleShare} className="w-4 h-4 hover:text-black cursor-pointer transition-colors" />
                <Download onClick={handleDownload} className="w-4 h-4 hover:text-black cursor-pointer transition-colors" />
                <Printer onClick={handlePrint} className="w-4 h-4 hover:text-black cursor-pointer transition-colors" />
              </div>
            </footer>
          </article>
        </main>
        <div className={`mt-8 text-[10px] font-mono tracking-widest text-center w-full max-w-4xl border-t pt-4 transition-colors ${isLightMode ? 'border-black/5 text-black/20' : 'border-terminal-gold/10 text-terminal-gold/30'}`}>
          © 2144 GLOBAL DEFENSE COUNCIL ARCHIVE // ALL RIGHTS RESERVED // RM-RESTRICTED-ASSET
        </div>
      </div>

      <aside className="fixed left-6 bottom-6 flex flex-col gap-3 z-50">
        <button 
          onClick={() => containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`w-10 h-10 border flex items-center justify-center transition-all group relative ${isLightMode ? 'border-black/20 text-black/40 hover:bg-black hover:text-white' : 'border-terminal-gold/40 text-terminal-gold hover:bg-terminal-gold hover:text-black'}`}
        >
          <ChevronUp className="w-5 h-5" />
          <span className={`absolute left-12 top-1/2 -translate-y-1/2 px-2 py-1 text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ${isLightMode ? 'bg-black text-white' : 'bg-terminal-gold text-black'}`}>TOP</span>
        </button>
        <button 
          onClick={() => setIsZenMode(!isZenMode)}
          className={`w-10 h-10 border flex items-center justify-center transition-all group relative ${isZenMode ? (isLightMode ? 'bg-black text-white border-black' : 'bg-terminal-gold text-black border-terminal-gold') : (isLightMode ? 'border-black/20 text-black/40 hover:bg-black hover:text-white' : 'border-terminal-gold/40 text-terminal-gold hover:bg-terminal-gold hover:text-black')}`}
        >
          <Terminal className="w-5 h-5" />
          <span className={`absolute left-12 top-1/2 -translate-y-1/2 px-2 py-1 text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ${isLightMode ? 'bg-black text-white' : 'bg-terminal-gold text-black'}`}>
            {isZenMode ? 'EXIT_ZEN' : 'ZEN_MODE'}
          </span>
        </button>
      </aside>
    </div>
  );
};

// --- Admin Components ---

const LivePreviewRenderer = ({ content, files, onUpdateContent, onUpdateFile, isLightMode }: { content: string, files: any[], onUpdateContent: (newContent: string) => void, onUpdateFile?: (name: string, config: any) => void, isLightMode?: boolean }) => {
  const parseToChunks = (text: string, images: any[]) => {
    const parts = (text || '').split(/(\[IMG_.*?\])/g);
    return parts.filter(p => p !== '').map((part, i) => {
      const match = part.match(/\[IMG_(.*?)\]/);
      if (match) {
        const name = match[1];
        const file = images.find(f => f.name === name);
        if (file) return { id: `img-${name}-${i}`, type: 'image', name, file };
      }
      return { id: `text-${i}`, type: 'text', content: part };
    });
  };

  const chunks = parseToChunks(content, files);

  const handleReorder = (newChunks: any[]) => {
    const newContent = newChunks.map(chunk => {
      if (chunk.type === 'image') return `[IMG_${chunk.name}]`;
      return chunk.content;
    }).join('');
    onUpdateContent(newContent);
  };

  // 简化的图片预览组件
  const EditableImage = ({ file, idx }: { file: any, idx: number | string }) => {
    // 音频文件直接显示播放器
    if (file.type.startsWith('audio/')) {
      return (
        <div className="my-6 flex flex-col items-center gap-4 w-full max-w-2xl">
          <div className="w-full p-6 border-2 border-terminal-gold/30 bg-terminal-gold/5 rounded-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-terminal-gold/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-terminal-gold" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4c.73 0 1.41-.21 2-.55V21h2v-8h-2zM10 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-terminal-gold truncate">{file.name}</p>
                <p className="text-[10px] opacity-40 uppercase">{file.type.split('/')[1] || 'AUDIO'}</p>
              </div>
            </div>
            <audio 
              controls 
              src={file.content} 
              className="w-full"
            />
          </div>
        </div>
      );
    }

    // 图片拖拽功能
    const handleImageDrag = (e: React.DragEvent) => {
      e.dataTransfer.setData('text/plain', `[IMG_${file.name}]`);
      e.dataTransfer.effectAllowed = 'copy';
    };

    // 切换对齐方式
    const toggleAlign = () => {
      const aligns = ['left', 'none', 'right'];
      const currentIndex = aligns.indexOf(file.align || 'left');
      const nextAlign = aligns[(currentIndex + 1) % aligns.length];
      if (onUpdateFile) {
        onUpdateFile(file.name, { align: nextAlign });
      }
    };

    return (
      <div 
        className={`relative my-4 ${file.align === 'right' ? 'ml-auto' : file.align === 'left' ? 'mr-auto' : 'mx-auto'}`}
        style={{ 
          width: file.width || '50%',
          float: file.align === 'none' ? 'none' : (file.align || 'left'),
          clear: file.align === 'none' ? 'both' : 'none',
          margin: file.align === 'right' ? '0 0 1rem 1rem' : file.align === 'left' ? '0 1rem 1rem 0' : '1rem auto'
        }}
      >
        {/* 图片容器 */}
        <div 
          className="relative border-2 border-transparent hover:border-terminal-gold/40 transition-all cursor-grab active:cursor-grabbing group"
          draggable
          onDragStart={handleImageDrag}
        >
          <img 
            src={file.content} 
            alt={file.name}
            className="w-full h-auto object-cover pointer-events-none"
            draggable={false}
          />
          
          {/* 对齐切换按钮 */}
          <button
            onClick={toggleAlign}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-terminal-gold/90 text-black p-1.5 rounded hover:bg-terminal-gold"
            title="切换对齐方式"
          >
            {file.align === 'left' ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3v2z"/>
              </svg>
            ) : file.align === 'right' ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3v2z"/>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z"/>
              </svg>
            )}
          </button>
        </div>

        {/* 图片标题 */}
        <div className="mt-1 text-[7px] font-mono uppercase opacity-40 text-center pointer-events-none">
          {file.name}
        </div>
      </div>
    );
  };

  const unreferencedImages = files.filter(f => !(content || '').includes(`[IMG_${f.name}]`));

  return (
    <div className={`p-8 md:p-12 font-serif text-lg leading-relaxed opacity-90 min-h-[400px] ${isLightMode ? 'text-black' : 'text-slate-300'}`}>
      {unreferencedImages.length > 0 && (
        <div className="mb-12 p-4 border border-dashed border-terminal-gold/20 bg-terminal-gold/5">
          <p className="text-[10px] uppercase tracking-widest text-terminal-gold/40 mb-4 flex items-center gap-2">
            <Plus className="w-3 h-3" /> 未分配位置的文件 (拖动下方文件到正文)
          </p>
          <div className="flex flex-wrap gap-4">
            {unreferencedImages.map((f, i) => (
              <div 
                key={`unref-${i}`}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', `[IMG_${f.name}]`);
                  e.dataTransfer.effectAllowed = 'copy';
                }}
                className={`w-24 aspect-square border border-terminal-gold/20 p-1 bg-black/40 cursor-grab active:cursor-grabbing hover:border-terminal-gold/60 transition-all group ${f.type.startsWith('audio/') ? 'flex flex-col items-center justify-center' : ''}`}
              >
                {f.type.startsWith('audio/') ? (
                  <>
                    <svg className="w-8 h-8 text-terminal-gold" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4c.73 0 1.41-.21 2-.55V21h2v-8h-2zM10 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                    </svg>
                    <div className="text-[6px] truncate mt-1 opacity-40 text-center">{f.name}</div>
                  </>
                ) : (
                  <>
                    <img src={f.content} className="w-full h-full object-cover grayscale group-hover:grayscale-0" draggable={false} />
                    <div className="text-[6px] truncate mt-1 opacity-40">{f.name}</div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-0">
        {chunks.map((chunk) => (
          <div key={chunk.id} className="relative group/item">
            {chunk.type === 'image' ? (
              <EditableImage file={chunk.file} idx={chunk.id} />
            ) : (
              <div className="relative py-2">
                <p className="whitespace-pre-wrap leading-relaxed">{chunk.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 显示未在正文中引用的音频文件 */}
      {unreferencedImages.filter(f => f.type.startsWith('audio/')).length > 0 && (
        <div className="mt-12 p-4 border border-dashed border-terminal-gold/20 bg-terminal-gold/5">
          <p className="text-[10px] uppercase tracking-widest text-terminal-gold/40 mb-4 flex items-center gap-2">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4c.73 0 1.41-.21 2-.55V21h2v-8h-2zM10 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
            </svg>
            未嵌入的音频文件
          </p>
          <div className="space-y-2">
            {unreferencedImages.filter(f => f.type.startsWith('audio/')).map((f, i) => (
              <div key={`audio-unref-${i}`} className="flex items-center gap-4 p-3 border border-terminal-gold/20 bg-black/40">
                <div className="w-10 h-10 rounded-full bg-terminal-gold/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-terminal-gold" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4c.73 0 1.41-.21 2-.55V21h2v-8h-2zM10 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-terminal-gold truncate">{f.name}</p>
                  <p className="text-[10px] opacity-40 uppercase">{f.type.split('/')[1] || 'AUDIO'}</p>
                </div>
                <audio 
                  controls 
                  src={f.content} 
                  className="w-48"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {chunks.length === 0 && unreferencedImages.length === 0 && (
        <p className="text-terminal-gold/20 italic">等待输入内容或上传附件...</p>
      )}
    </div>
  );
};

const FileItem = ({ file, onRemove }: { file: any, onRemove: () => void }) => {
  return (
    <div className="border border-terminal-gold/20 bg-terminal-gold/5 p-3 flex justify-between items-center">
      <div 
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', `[IMG_${file.name}]`);
          e.dataTransfer.effectAllowed = 'copy';
        }}
        className="cursor-copy flex items-center gap-2"
        title="拖动此图标到正文插入图片"
      >
        <Maximize2 className="w-4 h-4 rotate-45 text-terminal-gold/60" />
        <span className="text-xs font-bold tracking-widest truncate max-w-[200px] text-terminal-gold/80">{file.name}</span>
      </div>
      <button type="button" onClick={onRemove} className="text-red-800 hover:text-red-600 transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// 内容编辑器组件 - 支持插入文件
const ContentEditor = ({ value, onChange, files }: { value: string, onChange: (val: string) => void, files: any[] }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showFileSelector, setShowFileSelector] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);

  const insertFileTag = (fileName: string) => {
    const start = cursorPosition;
    const end = cursorPosition;
    const tag = `[IMG_${fileName}]`;
    const newContent = value.substring(0, start) + tag + value.substring(end);
    onChange(newContent);
    setShowFileSelector(false);
    
    // 恢复焦点并设置光标位置
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newPos = start + tag.length;
        textareaRef.current.setSelectionRange(newPos, newPos);
        setCursorPosition(newPos);
      }
    }, 0);
  };

  const handleTextareaClick = () => {
    if (textareaRef.current) {
      setCursorPosition(textareaRef.current.selectionStart);
    }
  };

  const handleTextareaKeyUp = () => {
    if (textareaRef.current) {
      setCursorPosition(textareaRef.current.selectionStart);
    }
  };

  return (
    <div className="relative">
      <textarea 
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={handleTextareaClick}
        onKeyUp={handleTextareaKeyUp}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const tag = e.dataTransfer.getData('text/plain');
          if (tag && tag.startsWith('[IMG_')) {
            const start = (e.target as HTMLTextAreaElement).selectionStart;
            const end = (e.target as HTMLTextAreaElement).selectionEnd;
            const newContent = value.substring(0, start) + tag + value.substring(end);
            onChange(newContent);
          }
        }}
        className="w-full bg-black border border-terminal-gold/30 p-3 text-sm outline-none h-32 font-serif"
        placeholder="输入档案详细描述..."
      />
      
      {/* 插入文件按钮 */}
      <div className="absolute bottom-2 right-2">
        <button
          onClick={() => {
            if (textareaRef.current) {
              setCursorPosition(textareaRef.current.selectionStart);
            }
            setShowFileSelector(!showFileSelector);
          }}
          disabled={files.length === 0}
          className={`px-3 py-1.5 text-[10px] uppercase tracking-widest border transition-all ${
            files.length === 0 
              ? 'border-terminal-gold/20 text-terminal-gold/30 cursor-not-allowed' 
              : 'border-terminal-gold/50 text-terminal-gold hover:bg-terminal-gold hover:text-black'
          }`}
        >
          [ 插入文件 ]
        </button>
      </div>

      {/* 文件选择器弹窗 */}
      {showFileSelector && files.length > 0 && (
        <div className="absolute bottom-10 right-0 w-64 bg-black border border-terminal-gold/30 shadow-lg z-50">
          <div className="p-2 border-b border-terminal-gold/20">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-widest text-terminal-gold/60">选择要插入的文件</span>
              <button 
                onClick={() => setShowFileSelector(false)}
                className="text-terminal-gold/40 hover:text-terminal-gold"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto p-2 space-y-1">
            {files.map((file, idx) => (
              <button
                key={idx}
                onClick={() => insertFileTag(file.name)}
                className="w-full text-left p-2 text-xs hover:bg-terminal-gold/10 border border-transparent hover:border-terminal-gold/30 transition-all flex items-center gap-2"
              >
                {file.type?.startsWith('image/') ? (
                  <ImageIcon className="w-3 h-3 text-terminal-gold/60" />
                ) : file.type?.startsWith('audio/') ? (
                  <svg className="w-3 h-3 text-terminal-gold/60" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4c.73 0 1.41-.21 2-.55V21h2v-8h-2z"/>
                  </svg>
                ) : (
                  <FileText className="w-3 h-3 text-terminal-gold/60" />
                )}
                <span className="truncate text-terminal-gold/80">{file.name}</span>
              </button>
            ))}
          </div>
          <div className="p-2 border-t border-terminal-gold/20 text-[8px] text-terminal-gold/40 text-center">
            点击文件插入到光标位置
          </div>
        </div>
      )}
    </div>
  );
};

const SubmissionPage = ({ onNavigate, onSubmit, archives }: { onNavigate: (view: any) => void, onSubmit: (submission: any) => void, archives: any }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(Object.keys(archives)[0] || '');
  const [files, setFiles] = useState<{name: string, content: string, type: string}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      Array.from(selectedFiles).forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          setFiles(prev => [...prev, {
            id: `file_${Date.now()}_${Math.random()}`,
            name: file.name,
            content: event.target?.result as string,
            type: file.type,
            width: '50%',
            height: 'auto',
            align: 'left'
          } as any]);
        };
        // Use readAsDataURL for all files to ensure binary data is preserved
        reader.readAsDataURL(file);
      });
    }
  };

  const updateFileConfig = (idx: number, config: {width?: string, align?: 'left' | 'right' | 'none'}) => {
    setFiles(prev => prev.map((f, i) => i === idx ? { ...f, ...config } : f));
  };

  const updateFileConfigByName = (name: string, config: {width?: string, height?: string | number, align?: 'left' | 'right' | 'none'}) => {
    setFiles(prev => prev.map((f) => f.name === name ? { ...f, ...config } : f));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    const submission = {
      id: `SUB_${Date.now()}`,
      title,
      content,
      category: selectedCategory,
      categoryTitle: archives[selectedCategory]?.title || '未知栏目',
      files,
      timestamp: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '.'),
      status: 'PENDING'
    };
    onSubmit(submission);
    alert('投稿已提交，正在等待管理员审核。');
  };

  return (
    <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden p-4 md:p-10 border-[4px] md:border-[16px] border-black bg-terminal-bg text-white font-sans selection:bg-terminal-gold selection:text-black">
      <div className="crt-overlay"></div>
      <div className="scanline"></div>
      
      <header className="flex items-center justify-between border-b border-terminal-gold/30 pb-4 mb-6 md:mb-8 relative z-10">
        <div className="flex items-center gap-2 md:gap-4">
          <Upload className="w-6 h-6 md:w-8 md:h-8 crt-glow text-terminal-gold" />
          <h1 className="text-sm md:text-xl font-bold tracking-widest uppercase crt-glow text-terminal-gold truncate max-w-[200px] md:max-w-none">
            数据投稿端口 <span className="hidden sm:inline">// DATA_SUBMISSION_PORT</span>
          </h1>
        </div>
        <button onClick={() => onNavigate('search')} className="terminal-btn text-[10px] md:text-xs">[ 返回 ]</button>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full overflow-y-auto relative z-10 space-y-6 md:space-y-8 pb-20 no-scrollbar">
        <div className="bg-terminal-gold/5 border border-terminal-gold/20 p-4 md:p-6">
          <p className="text-[10px] md:text-xs leading-relaxed text-terminal-gold/80 italic">
            “如果你掌握了红月背后的真相，或者在废墟中发现了未被记录的残片，请通过此加密通道提交。
            所有投稿将经过严格的合规性审查，一旦采纳，将永久记录在核心资料库中。”
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="space-y-2">
            <label className="text-[8px] md:text-[10px] uppercase tracking-widest text-terminal-gold/60">目标栏目 (TARGET_CATEGORY)</label>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-black/40 border border-terminal-gold/30 p-2 md:p-3 text-xs md:text-sm focus:border-terminal-gold outline-none transition-colors appearance-none cursor-pointer"
              required
            >
              {Object.entries(archives).map(([id, data]: [string, any]) => (
                <option key={id} value={id}>{data.title} ({id})</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[8px] md:text-[10px] uppercase tracking-widest text-terminal-gold/60">档案标题 (ARCHIVE_TITLE)</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-black/40 border border-terminal-gold/30 p-2 md:p-3 text-xs md:text-sm focus:border-terminal-gold outline-none transition-colors"
              placeholder="输入档案名称..."
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[8px] md:text-[10px] uppercase tracking-widest text-terminal-gold/60">详细描述 (DETAILED_DESCRIPTION)</label>
            <div className="text-[8px] md:text-[9px] text-terminal-gold/40 mb-1 italic">
              提示：在正文中输入 [IMG_文件名] 即可将图片插入到指定位置。
            </div>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const tag = e.dataTransfer.getData('text/plain');
                if (tag && tag.startsWith('[IMG_')) {
                  const start = (e.target as HTMLTextAreaElement).selectionStart;
                  const end = (e.target as HTMLTextAreaElement).selectionEnd;
                  const newContent = content.substring(0, start) + tag + content.substring(end);
                  setContent(newContent);
                }
              }}
              className="w-full bg-black/40 border border-terminal-gold/30 p-2 md:p-3 text-xs md:text-sm focus:border-terminal-gold outline-none transition-colors h-32 md:h-48 resize-none"
              placeholder="描述你发现的内容..."
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[8px] md:text-[10px] uppercase tracking-widest text-terminal-gold/60">附件上传 (ATTACHMENTS)</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-terminal-gold/20 p-6 md:p-10 flex flex-col items-center justify-center gap-2 md:gap-3 cursor-pointer hover:bg-terminal-gold/5 hover:border-terminal-gold/40 transition-all group"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                multiple
              />
              <FilePlus className="w-8 h-8 md:w-10 md:h-10 text-terminal-gold/30 group-hover:text-terminal-gold/60" />
              <p className="text-[10px] md:text-xs font-bold tracking-widest">点击或拖拽文件至此上传</p>
            </div>
            {files.length > 0 && (
              <Reorder.Group axis="y" values={files} onReorder={setFiles} className="space-y-4 mt-4">
                {files.map((file, idx) => (
                  <Reorder.Item key={file.id || file.name} value={file}>
                    <FileItem 
                      file={file} 
                      onRemove={() => setFiles(prev => prev.filter((_, i) => i !== idx))}
                    />
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            )}
          </div>

          <button 
            type="submit"
            className="w-full py-3 md:py-4 bg-terminal-gold text-black font-bold uppercase tracking-[0.2em] md:tracking-[0.4em] hover:bg-white transition-all shadow-[0_0_20px_rgba(144,133,81,0.3)] text-xs md:text-sm"
          >
            [ 发送加密投稿 ]
          </button>
        </form>

        {/* Live Layout Preview Section */}
        <section className="mt-12 md:mt-20 space-y-4 md:space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-terminal-gold/20 pb-2 gap-2">
            <div className="flex items-center gap-2 md:gap-4">
              <Maximize2 className="w-3 h-3 md:w-4 md:h-4 text-terminal-gold" />
              <h2 className="text-[10px] md:text-xs font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase text-terminal-gold">实时排版预览</h2>
            </div>
            <div className="text-[7px] md:text-[9px] text-terminal-gold/40 uppercase tracking-widest">
              交互提示: 拖动图片块可调整位置
            </div>
          </div>
          
          <div className="bg-black/40 border border-terminal-gold/10 relative overflow-hidden">
            <LivePreviewRenderer 
              content={content} 
              files={files} 
              onUpdateContent={setContent} 
              onUpdateFile={updateFileConfigByName}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

const AdminLogin = ({ onLogin, onCancel }: { onLogin: () => void, onCancel: () => void }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'JGXQ123456') {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md p-8 border border-terminal-gold bg-black relative"
      >
        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-terminal-gold"></div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-terminal-gold"></div>
        
        <div className="flex items-center gap-3 mb-8 text-terminal-gold">
          <Lock className="w-5 h-5" />
          <h2 className="text-lg font-bold tracking-widest uppercase">管理员授权验证</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] text-terminal-gold/60 uppercase tracking-widest">请输入访问密钥</label>
            <input 
              autoFocus
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-terminal-gold/5 border ${error ? 'border-red-600' : 'border-terminal-gold/30'} p-3 text-terminal-gold outline-none focus:border-terminal-gold transition-colors font-mono`}
              placeholder="ACCESS_KEY_REQUIRED"
            />
            {error && <p className="text-red-600 text-[10px] animate-pulse">密钥验证失败：拒绝访问</p>}
          </div>

          <div className="flex gap-4">
            <button 
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 border border-terminal-gold/30 text-terminal-gold/60 text-xs uppercase tracking-widest hover:bg-terminal-gold/5 transition-colors"
            >
              [ 取消 ]
            </button>
            <button 
              type="submit"
              className="flex-1 py-3 bg-terminal-gold text-black text-xs font-bold uppercase tracking-widest hover:bg-terminal-gold/80 transition-colors"
            >
              [ 授权 ]
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const VisualHistoryManager = ({ historyData, onUpdateHistory }: { historyData: any[], onUpdateHistory: (newHistory: any[]) => void }) => {
  const [activeEpoch, setActiveEpoch] = useState(1);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isLinkMode, setIsLinkMode] = useState(false);
  const [linkSource, setLinkSource] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>(null);

  const filteredEvents = (historyData || []).filter(e => e.epoch === activeEpoch);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isLinkMode || isEditing) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setEditForm({
      id: `NODE-${Date.now().toString().slice(-4)}`,
      title: '新因果节点',
      epoch: activeEpoch,
      time: '',
      level: 'III',
      pos: { top: `${y.toFixed(1)}%`, left: `${x.toFixed(1)}%` },
      description: '',
      details: '',
      tags: '',
      links: []
    });
    setIsEditing(true);
    setSelectedNode(null);
  };

  const handleNodeClick = (e: React.MouseEvent, node: any) => {
    e.stopPropagation();
    if (isLinkMode) {
      if (!linkSource) {
        setLinkSource(node.id);
      } else if (linkSource === node.id) {
        setLinkSource(null);
      } else {
        // Toggle link
        const newHistory = historyData.map(h => {
          if (h.id === linkSource) {
            const links = h.links || [];
            if (links.includes(node.id)) {
              return { ...h, links: links.filter((id: string) => id !== node.id) };
            } else {
              return { ...h, links: [...links, node.id] };
            }
          }
          return h;
        });
        onUpdateHistory(newHistory);
        setLinkSource(null);
      }
    } else {
      setSelectedNode(node);
      setEditForm({ ...node, tags: Array.isArray(node.tags) ? node.tags.join(', ') : node.tags });
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    const formattedNode = {
      ...editForm,
      tags: typeof editForm.tags === 'string' ? editForm.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t) : editForm.tags
    };

    if (historyData.find(h => h.id === formattedNode.id && (!selectedNode || h.id !== selectedNode.id))) {
      alert('节点 ID 已存在');
      return;
    }

    if (selectedNode) {
      onUpdateHistory(historyData.map(h => h.id === selectedNode.id ? formattedNode : h));
      alert(`节点 [${formattedNode.title}] 已更新。`);
    } else {
      onUpdateHistory([...historyData, formattedNode]);
      alert(`新节点 [${formattedNode.title}] 已锚定到纪元 0${formattedNode.epoch}。`);
    }
    setIsEditing(false);
    setSelectedNode(null);
  };

  const handleDelete = () => {
    if (!selectedNode) return;
    onUpdateHistory(historyData.filter(h => h.id !== selectedNode.id));
    setIsEditing(false);
    setSelectedNode(null);
  };

  return (
    <div className="flex flex-col h-full gap-6 min-h-[600px]">
      <div className="flex items-center justify-between border-b border-terminal-gold/20 pb-4">
        <div className="flex flex-col gap-1">
          <div className="flex gap-4">
            {[1, 2, 3].map(num => (
              <button 
                key={num}
                onClick={() => { setActiveEpoch(num); setIsEditing(false); setSelectedNode(null); }}
                className={`px-4 py-1 text-[10px] border transition-all ${activeEpoch === num ? 'bg-terminal-gold text-black border-terminal-gold' : 'border-terminal-gold/30 hover:border-terminal-gold'}`}
              >
                EPOCH 0{num}
              </button>
            ))}
          </div>
          <span className="text-[9px] opacity-40 uppercase tracking-tighter">当前视图：第 0{activeEpoch} 纪元因果图谱</span>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsLinkMode(!isLinkMode)}
            className={`px-4 py-1 text-[10px] border flex items-center gap-2 transition-all ${isLinkMode ? 'bg-blue-900 text-white border-blue-500' : 'border-terminal-gold/30 hover:border-terminal-gold'}`}
          >
            <Link2 className="w-3 h-3" /> {isLinkMode ? '正在连接节点...' : '因果连接模式'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        <div 
          className="flex-1 bg-black/40 border border-terminal-gold/20 relative cursor-crosshair overflow-hidden"
          onClick={handleMapClick}
        >
          <div className="absolute inset-0 structural-grid opacity-10 pointer-events-none"></div>
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {filteredEvents.map(event => 
              event.links?.map((linkId: string) => {
                const target = (historyData || []).find(h => h.id === linkId);
                if (!target || target.epoch !== activeEpoch) return null;
                return (
                  <line 
                    key={`${event.id}-${linkId}`}
                    x1={event.pos.left} y1={event.pos.top}
                    x2={target.pos.left} y2={target.pos.top}
                    stroke="#908551" strokeWidth="1" strokeDasharray="4" opacity="0.4"
                  />
                );
              })
            )}
          </svg>

          {filteredEvents.map(node => (
            <div 
              key={node.id}
              className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20`}
              style={{ top: node.pos.top, left: node.pos.left }}
              onClick={(e) => handleNodeClick(e, node)}
            >
              <div className={`w-4 h-4 rounded-full border-2 shadow-[0_0_15px_rgba(144,133,81,0.6)] transition-all ${linkSource === node.id ? 'bg-blue-500 scale-150 border-white' : (selectedNode?.id === node.id ? 'bg-white scale-150 border-terminal-gold' : 'bg-terminal-gold border-black hover:scale-125')}`}></div>
              <div className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-30">
                <span className="text-[10px] font-bold bg-black/90 px-2 py-0.5 border border-terminal-gold/40 text-terminal-gold shadow-xl">{node.title}</span>
              </div>
            </div>
          ))}

          {/* New Node Preview */}
          {isEditing && !selectedNode && editForm && (
            <div 
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
              style={{ top: editForm.pos.top, left: editForm.pos.left }}
            >
              <div className="w-4 h-4 rounded-full bg-white border-2 border-terminal-gold animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.8)]"></div>
              <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="text-[10px] font-bold text-white bg-terminal-gold px-2 py-0.5 uppercase tracking-widest">
                  [ 正在锚定新节点 ]
                </span>
              </div>
            </div>
          )}

          <div className="absolute bottom-4 left-4 text-[8px] opacity-40 uppercase tracking-widest">
            [ 点击空白处新增节点 ] [ 点击节点编辑/连接 ]
          </div>
        </div>

        {isEditing && (
          <div className="w-80 border border-terminal-gold/20 bg-terminal-gold/5 p-6 space-y-4 overflow-y-auto">
            <h3 className="text-xs font-bold border-b border-terminal-gold/20 pb-2 uppercase tracking-widest">
              {selectedNode ? '编辑因果节点' : '新增因果节点'}
            </h3>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[9px] opacity-60 uppercase">节点编号 (ID)</label>
                <input 
                  value={editForm.id}
                  onChange={e => setEditForm({...editForm, id: e.target.value})}
                  className="w-full bg-black border border-terminal-gold/30 p-2 text-xs outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] opacity-60 uppercase">标题 (TITLE)</label>
                <input 
                  value={editForm.title}
                  onChange={e => setEditForm({...editForm, title: e.target.value})}
                  className="w-full bg-black border border-terminal-gold/30 p-2 text-xs outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[9px] opacity-60 uppercase">纪元 (EPOCH)</label>
                  <select 
                    value={editForm.epoch}
                    onChange={e => setEditForm({...editForm, epoch: parseInt(e.target.value)})}
                    className="w-full bg-black border border-terminal-gold/30 p-2 text-xs outline-none"
                  >
                    <option value={1}>01</option>
                    <option value={2}>02</option>
                    <option value={3}>03</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] opacity-60 uppercase">时间 (TIME)</label>
                  <input 
                    value={editForm.time}
                    onChange={e => setEditForm({...editForm, time: e.target.value})}
                    className="w-full bg-black border border-terminal-gold/30 p-2 text-xs outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] opacity-60 uppercase">简述 (DESC)</label>
                <input 
                  value={editForm.description}
                  onChange={e => setEditForm({...editForm, description: e.target.value})}
                  className="w-full bg-black border border-terminal-gold/30 p-2 text-xs outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] opacity-60 uppercase">详情 (DETAILS)</label>
                <textarea 
                  value={editForm.details}
                  onChange={e => setEditForm({...editForm, details: e.target.value})}
                  className="w-full bg-black border border-terminal-gold/30 p-2 text-xs outline-none h-20"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] opacity-60 uppercase">标签 (TAGS)</label>
                <input 
                  value={editForm.tags}
                  onChange={e => setEditForm({...editForm, tags: e.target.value})}
                  className="w-full bg-black border border-terminal-gold/30 p-2 text-xs outline-none"
                  placeholder="用逗号分隔"
                />
              </div>
            </div>

            <div className="pt-4 flex flex-col gap-2">
              <button 
                onClick={handleSave}
                className="w-full py-2 bg-terminal-gold text-black font-bold text-[10px] uppercase tracking-widest hover:bg-white transition-all"
              >
                [ 保存节点 ]
              </button>
              {selectedNode && (
                <button 
                  onClick={handleDelete}
                  className="w-full py-2 border border-red-900 text-red-800 font-bold text-[10px] uppercase tracking-widest hover:bg-red-900/10 transition-all"
                >
                  [ 删除节点 ]
                </button>
              )}
              <button 
                onClick={() => { setIsEditing(false); setSelectedNode(null); }}
                className="w-full py-2 text-[10px] opacity-40 uppercase tracking-widest hover:opacity-100 transition-all"
              >
                [ 取消 ]
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AdminDashboard = ({ 
  archives, 
  submissions, 
  historyData,
  onUpdateArchives, 
  onUpdateSubmissions, 
  onUpdateHistory,
  onClose 
}: { 
  archives: Record<string, any>, 
  submissions: any[], 
  historyData: any[],
  onUpdateArchives: (newArchives: Record<string, any>) => void, 
  onUpdateSubmissions: (newSubmissions: any[]) => void, 
  onUpdateHistory: (newHistory: any[]) => void,
  onClose: () => void 
}) => {
  const [activeTab, setActiveTab] = useState<'categories' | 'items' | 'submissions' | 'history'>('categories');
  const [selectedArchiveId, setSelectedArchiveId] = useState<string>(Object.keys(archives)[0] || '');

  // 确保 selectedArchiveId 总是有效的
  useEffect(() => {
    const archiveKeys = Object.keys(archives);
    if (archiveKeys.length > 0 && !archiveKeys.includes(selectedArchiveId)) {
      setSelectedArchiveId(archiveKeys[0]);
    }
  }, [archives, selectedArchiveId]);
  
  // Category management
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryTitle, setEditingCategoryTitle] = useState('');
  
  // Item management
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<{id: string, title: string, level: string, time: string, fileContent: string, files: any[]}>({
    id: '',
    title: '',
    level: 'SAFE',
    time: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '.'),
    fileContent: '',
    files: []
  });

  // History management
  const [isHistoryVisualMode, setIsHistoryVisualMode] = useState(true);
  const [newHistoryItem, setNewHistoryItem] = useState({
    id: '',
    title: '',
    epoch: 1,
    time: '',
    level: 'III',
    pos: { top: '50%', left: '50%' },
    description: '',
    details: '',
    tags: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    for (const file of Array.from(selectedFiles) as File[]) {
      // 处理 Docx 文件 - 自动解析图片和文字
      if (file.name.endsWith('.docx') || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.convertToHtml({ arrayBuffer });
          
          // 解析 HTML 内容，提取文字和图片
          const parser = new DOMParser();
          const doc = parser.parseFromString(result.value, 'text/html');
          
          let extractedText = '';
          const extractedImages: {id: string, name: string, content: string, type: string, width: string, height: string, align: string}[] = [];
          let imageCounter = 1;
          
          // 遍历所有元素
          const processNode = (node: Node) => {
            if (node.nodeType === Node.TEXT_NODE) {
              const text = node.textContent?.trim();
              if (text) {
                extractedText += text + '\n';
              }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              
              // 处理图片
              if (element.tagName === 'IMG') {
                const src = element.getAttribute('src');
                if (src && src.startsWith('data:image')) {
                  // 检查对齐方式
                  let imageAlign: 'left' | 'right' | 'none' = 'left';
                  
                  // 检查父元素的样式
                  const parent = element.parentElement;
                  if (parent) {
                    const parentStyle = parent.getAttribute('style') || '';
                    const textAlign = parentStyle.match(/text-align:\s*(left|center|right)/i);
                    if (textAlign) {
                      if (textAlign[1].toLowerCase() === 'center') {
                        imageAlign = 'none';
                      } else if (textAlign[1].toLowerCase() === 'right') {
                        imageAlign = 'right';
                      }
                    }
                  }
                  
                  // 检查图片本身的样式
                  const imgStyle = element.getAttribute('style') || '';
                  const floatMatch = imgStyle.match(/float:\s*(left|right|none)/i);
                  if (floatMatch) {
                    if (floatMatch[1].toLowerCase() === 'right') {
                      imageAlign = 'right';
                    } else if (floatMatch[1].toLowerCase() === 'none') {
                      imageAlign = 'none';
                    } else {
                      imageAlign = 'left';
                    }
                  }
                  
                  // 检查align属性
                  const alignAttr = element.getAttribute('align');
                  if (alignAttr) {
                    if (alignAttr.toLowerCase() === 'center') {
                      imageAlign = 'none';
                    } else if (alignAttr.toLowerCase() === 'right') {
                      imageAlign = 'right';
                    }
                  }
                  
                  const imageName = `image_${Date.now()}_${imageCounter++}.png`;
                  extractedImages.push({
                    id: `file_${Date.now()}_${Math.random()}`,
                    name: imageName,
                    content: src,
                    type: 'image/png',
                    width: '50%',
                    height: 'auto',
                    align: imageAlign
                  });
                  // 在文字中插入图片标记
                  extractedText += `[IMG_${imageName}]\n`;
                }
              }
              
              // 处理段落和换行
              if (element.tagName === 'P' || element.tagName === 'DIV' || element.tagName === 'BR') {
                extractedText += '\n';
              }
              
              // 递归处理子节点
              element.childNodes.forEach(child => processNode(child));
            }
          };
          
          processNode(doc.body);
          
          // 更新状态：添加解析的图片和文字
          setNewItem(prev => ({
            ...prev,
            files: [...prev.files, ...extractedImages],
            fileContent: prev.fileContent + (prev.fileContent ? '\n\n' : '') + extractedText.trim()
          }));
          
        } catch (error) {
          console.error('解析 Docx 文件失败:', error);
          // 解析失败时作为普通文件上传
          const reader = new FileReader();
          reader.onload = (event) => {
            setNewItem(prev => ({
              ...prev,
              files: [...prev.files, {
                id: `file_${Date.now()}_${Math.random()}`,
                name: file.name,
                content: event.target?.result as string,
                type: file.type,
                width: '50%',
                height: 'auto',
                align: 'left'
              }]
            }));
          };
          reader.readAsDataURL(file);
        }
      } else {
        // 非 Docx 文件，使用原来的处理方式
        const reader = new FileReader();
        reader.onload = (event) => {
          setNewItem(prev => ({
            ...prev,
            files: [...prev.files, {
              id: `file_${Date.now()}_${Math.random()}`,
              name: file.name,
              content: event.target?.result as string,
              type: file.type,
              width: '50%',
              height: 'auto',
              align: 'left'
            }]
          }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const updateFileConfig = (idx: number, config: {width?: string, align?: 'left' | 'right' | 'none'}) => {
    setNewItem(prev => ({
      ...prev,
      files: prev.files.map((f, i) => i === idx ? { ...f, ...config } : f)
    }));
  };

  // 通过文件名更新文件配置（用于 LivePreviewRenderer）
  const updateFileConfigByName = (name: string, config: {width?: string, height?: string | number, align?: 'left' | 'right' | 'none'}) => {
    setNewItem(prev => ({
      ...prev,
      files: prev.files.map((f) => f.name === name ? { ...f, ...config } : f)
    }));
  };

  const removeFile = (index: number) => {
    setNewItem(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const getNextCategoryId = () => {
    const ids = Object.keys(archives).filter(id => id.startsWith('REF_'));
    if (ids.length === 0) return 'REF_001';
    const maxId = Math.max(...ids.map(id => parseInt(id.replace('REF_', ''), 10)));
    return `REF_${(maxId + 1).toString().padStart(3, '0')}`;
  };

  const handleAddCategory = () => {
    if (!newCategoryTitle) return;
    const id = getNextCategoryId();
    const newArchives = {
      ...archives,
      [id]: { title: newCategoryTitle, items: [] }
    };
    onUpdateArchives(newArchives);
    setNewCategoryTitle('');
    setSelectedArchiveId(id);
    alert(`栏目 [${newCategoryTitle}] 已创建。`);
  };

  const handleAddItem = () => {
    if (!newItem.id || !newItem.title || !selectedArchiveId) return;
    const newArchives = { ...archives };
    
    if (editingItemId) {
      // Update existing item
      newArchives[selectedArchiveId].items = newArchives[selectedArchiveId].items.map((item: any) => 
        item.id === editingItemId ? { ...newItem } : item
      );
      alert(`档案 [${newItem.title}] 已更新。`);
    } else {
      // Add new item
      newArchives[selectedArchiveId].items = [
        ...newArchives[selectedArchiveId].items,
        { ...newItem }
      ];
      alert(`档案 [${newItem.title}] 已录入。`);
    }
    
    onUpdateArchives(newArchives);
    setNewItem({
      id: '',
      title: '',
      level: 'SAFE',
      time: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '.'),
      fileContent: '',
      files: []
    });
    setEditingItemId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEditItem = (archiveId: string, item: any) => {
    setSelectedArchiveId(archiveId);
    setNewItem({ ...item });
    setEditingItemId(item.id);
    setActiveTab('items');
  };

  const handleUpdateCategory = () => {
    if (!editingCategoryId || !editingCategoryTitle) return;
    const newArchives = { ...archives };
    newArchives[editingCategoryId].title = editingCategoryTitle;
    onUpdateArchives(newArchives);
    setEditingCategoryId(null);
    setEditingCategoryTitle('');
    alert('栏目名称已更新。');
  };

  const handleDeleteCategory = (id: string) => {
    const newArchives = { ...archives };
    delete newArchives[id];
    onUpdateArchives(newArchives);
    if (selectedArchiveId === id) {
      setSelectedArchiveId(Object.keys(newArchives)[0] || '');
    }
  };

  const handleDeleteItem = (archiveId: string, itemId: string) => {
    const newArchives = { ...archives };
    newArchives[archiveId].items = newArchives[archiveId].items.filter((i: any) => i.id !== itemId);
    onUpdateArchives(newArchives);
  };

  const handleApproveSubmission = (submission: any) => {
    const targetCategory = submission.category && archives[submission.category] 
      ? submission.category 
      : selectedArchiveId;

    if (!targetCategory) {
      alert('无法确定目标栏目，请先在侧边栏选择一个栏目。');
      return;
    }

    const newArchives = { ...archives };
    newArchives[targetCategory].items = [
      ...newArchives[targetCategory].items,
      {
        id: submission.id,
        title: submission.title,
        level: 'EUCLID',
        time: submission.timestamp,
        files: submission.files || [],
        fileContent: submission.content || '',
        fileName: submission.files?.[0]?.name || 'DOCUMENT'
      }
    ];
    onUpdateArchives(newArchives);
    onUpdateSubmissions(submissions.filter(s => s.id !== submission.id));
    alert(`投稿已批准并加入 [${archives[targetCategory].title}] 档案库。`);
  };

  const handleRejectSubmission = (id: string) => {
    onUpdateSubmissions(submissions.filter(s => s.id !== id));
  };

  const handleAddHistoryItem = () => {
    if (!newHistoryItem.id || !newHistoryItem.title) return;
    const itemToAdd = {
      ...newHistoryItem,
      tags: newHistoryItem.tags.split(',').map(t => t.trim()).filter(t => t)
    };
    onUpdateHistory([...historyData, itemToAdd]);
    setNewHistoryItem({
      id: '',
      title: '',
      epoch: 1,
      time: '',
      level: 'III',
      pos: { top: '50%', left: '50%' },
      description: '',
      details: '',
      tags: ''
    });
  };

  const handleDeleteHistoryItem = (id: string) => {
    onUpdateHistory(historyData.filter(h => h.id !== id));
  };

  // 404档案功能
  const handleSet404Item = (archiveId: string, itemId: string) => {
    if (window.confirm('确定要将该档案设置为404页面吗？此操作将替换所有内容为404错误页面。')) {
      const newArchives = { ...archives };
      const itemIndex = newArchives[archiveId].items.findIndex((i: any) => i.id === itemId);
      if (itemIndex !== -1) {
        newArchives[archiveId].items[itemIndex] = {
          id: itemId,
          title: '404 - 档案未找到',
          level: 'SAFE',
          time: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '.'),
          fileContent: '页面文件损坏或已丢失，请联系管理员',
          files: [],
          is404: true
        };
        onUpdateArchives(newArchives);
        alert(`档案 ${itemId} 已设置为404页面。`);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black flex flex-col font-mono text-terminal-gold selection:bg-terminal-gold selection:text-black">
      <div className="crt-overlay"></div>
      <div className="scanline"></div>
      
      <header className="border-b border-terminal-gold/30 p-4 flex justify-between items-center bg-black/80 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-4">
          <Settings className="w-5 h-5 animate-spin-slow" />
          <h1 className="text-sm font-bold tracking-[0.4em] uppercase">核心系统管理终端 v4.0.0-ADMIN</h1>
        </div>
        <button 
          onClick={onClose}
          className="p-2 border border-terminal-gold/30 hover:bg-terminal-gold hover:text-black transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden relative z-10">
        <nav className="w-64 border-r border-terminal-gold/20 p-6 space-y-4">
          <button 
            onClick={() => setActiveTab('categories')}
            className={`w-full text-left p-3 text-xs tracking-widest uppercase transition-all flex items-center gap-3 ${activeTab === 'categories' ? 'bg-terminal-gold text-black' : 'hover:bg-terminal-gold/10'}`}
          >
            <FolderPlus className="w-4 h-4" /> 栏目管理
          </button>
          <button 
            onClick={() => setActiveTab('items')}
            className={`w-full text-left p-3 text-xs tracking-widest uppercase transition-all flex items-center gap-3 ${activeTab === 'items' ? 'bg-terminal-gold text-black' : 'hover:bg-terminal-gold/10'}`}
          >
            <FilePlus className="w-4 h-4" /> 档案录入
          </button>
          <button 
            onClick={() => setActiveTab('submissions')}
            className={`w-full text-left p-3 text-xs tracking-widest uppercase transition-all flex items-center gap-3 ${activeTab === 'submissions' ? 'bg-terminal-gold text-black' : 'hover:bg-terminal-gold/10'}`}
          >
            <Share2 className="w-4 h-4" /> 投稿审核
            {submissions && submissions.length > 0 && (
              <span className="ml-auto bg-red-600 text-white text-[8px] px-1.5 py-0.5 rounded-full animate-pulse">
                {submissions.length}
              </span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`w-full text-left p-3 text-xs tracking-widest uppercase transition-all flex items-center gap-3 ${activeTab === 'history' ? 'bg-terminal-gold text-black' : 'hover:bg-terminal-gold/10'}`}
          >
            <History className="w-4 h-4" /> 历史管理
          </button>
        </nav>

        <main className="flex-1 p-10 overflow-y-auto">
          {activeTab === 'categories' ? (
            <div key="categories" className="space-y-10 max-w-4xl">
              <section className="space-y-4">
                <h2 className="text-xs font-bold tracking-widest uppercase border-b border-terminal-gold/20 pb-2">新建栏目 (New Category)</h2>
                <div className="flex gap-4">
                  <input 
                    type="text"
                    value={newCategoryTitle}
                    onChange={(e) => setNewCategoryTitle(e.target.value)}
                    className="flex-1 bg-terminal-gold/5 border border-terminal-gold/30 p-3 text-sm outline-none focus:border-terminal-gold"
                    placeholder="请输入栏目名称..."
                  />
                  <button 
                    onClick={handleAddCategory}
                    className="px-8 bg-terminal-gold text-black font-bold text-xs uppercase tracking-widest hover:bg-terminal-gold/80 transition-all"
                  >
                    [ 创建 ]
                  </button>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-xs font-bold tracking-widest uppercase border-b border-terminal-gold/20 pb-2">现有栏目列表 (Existing Categories)</h2>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(archives).map(([id, data]) => (
                    <div key={id} className="flex justify-between items-center p-4 border border-terminal-gold/10 bg-terminal-gold/5 group">
                      <div className="flex items-center gap-6 flex-1">
                        <span className="text-[10px] opacity-40 font-mono">{id}</span>
                        {editingCategoryId === id ? (
                          <div className="flex gap-2 flex-1">
                            <input 
                              type="text"
                              value={editingCategoryTitle}
                              onChange={(e) => setEditingCategoryTitle(e.target.value)}
                              className="flex-1 bg-black border border-terminal-gold/30 p-1 text-sm outline-none"
                              autoFocus
                            />
                            <button onClick={handleUpdateCategory} className="text-[10px] text-green-600 uppercase">[ 保存 ]</button>
                            <button onClick={() => setEditingCategoryId(null)} className="text-[10px] text-red-600 uppercase">[ 取消 ]</button>
                          </div>
                        ) : (
                          <>
                            <span className="text-sm font-bold">{data.title}</span>
                            <span className="text-[10px] text-terminal-gold/40">[{data.items.length} 份档案]</span>
                          </>
                        )}
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                          onClick={() => {
                            setEditingCategoryId(id);
                            setEditingCategoryTitle(data.title);
                          }}
                          className="p-2 text-terminal-gold/60 hover:text-terminal-gold transition-all"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteCategory(id)}
                          className="p-2 text-red-800 hover:bg-red-900/10 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          ) : activeTab === 'items' ? (
            <div key="items" className="space-y-10 max-w-4xl">
              <section className="space-y-4">
                <h2 className="text-xs font-bold tracking-widest uppercase border-b border-terminal-gold/20 pb-2">档案录入 (New Archive Item)</h2>
                <div className="grid grid-cols-2 gap-6 bg-terminal-gold/5 p-6 border border-terminal-gold/10">
                  <div className="col-span-2 flex justify-between items-center mb-2">
                    <h3 className="text-[10px] font-bold text-terminal-gold uppercase tracking-widest">
                      {editingItemId ? `正在编辑: ${editingItemId}` : '新建档案录入'}
                    </h3>
                    {editingItemId && (
                      <button 
                        onClick={() => {
                          setEditingItemId(null);
                          setNewItem({
                            id: '',
                            title: '',
                            level: 'SAFE',
                            time: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '.'),
                            fileContent: '',
                            files: []
                          });
                        }}
                        className="text-[8px] text-red-600 uppercase border border-red-600/30 px-2 py-1"
                      >
                        [ 取消编辑 ]
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] opacity-60 uppercase">目标栏目</label>
                    <select 
                      value={selectedArchiveId}
                      onChange={(e) => setSelectedArchiveId(e.target.value)}
                      className="w-full bg-black border border-terminal-gold/30 p-3 text-sm outline-none"
                    >
                      {Object.entries(archives).map(([id, data]) => (
                        <option key={id} value={id}>{data.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] opacity-60 uppercase">对象编号 (OBJ_ID)</label>
                    <input 
                      type="text"
                      value={newItem.id}
                      onChange={(e) => setNewItem({...newItem, id: e.target.value})}
                      className="w-full bg-black border border-terminal-gold/30 p-3 text-sm outline-none"
                      placeholder="例如: ANM-999"
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] opacity-60 uppercase">档案标题 (SUBJECT_TITLE)</label>
                    <input 
                      type="text"
                      value={newItem.title}
                      onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                      className="w-full bg-black border border-terminal-gold/30 p-3 text-sm outline-none"
                      placeholder="请输入档案详细标题..."
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] opacity-60 uppercase">档案正文 (CONTENT_BODY)</label>
                    <div className="text-[9px] text-terminal-gold/40 mb-1 italic">
                      提示：点击下方按钮插入已上传的文件，或使用 [IMG_文件名] 标记。
                    </div>
                    <ContentEditor 
                      value={newItem.fileContent}
                      onChange={(val) => setNewItem({...newItem, fileContent: val})}
                      files={newItem.files}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] opacity-60 uppercase">威胁等级 (THREAT_LEVEL)</label>
                    <select 
                      value={newItem.level}
                      onChange={(e) => setNewItem({...newItem, level: e.target.value})}
                      className="w-full bg-black border border-terminal-gold/30 p-3 text-sm outline-none"
                    >
                      <option value="SAFE">SAFE</option>
                      <option value="EUCLID">EUCLID</option>
                      <option value="KETER">KETER</option>
                      <option value="THAUMIEL">THAUMIEL</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] opacity-60 uppercase">时间戳 (TIMESTAMP)</label>
                    <input 
                      type="text"
                      value={newItem.time}
                      onChange={(e) => setNewItem({...newItem, time: e.target.value})}
                      className="w-full bg-black border border-terminal-gold/30 p-3 text-sm outline-none"
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] opacity-60 uppercase">附件上传 (ATTACHMENTS)</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-terminal-gold/20 p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-terminal-gold/5 hover:border-terminal-gold/40 transition-all group"
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        multiple
                      />
                      <Upload className={`w-8 h-8 ${newItem.files.length > 0 ? 'text-terminal-gold' : 'text-terminal-gold/30 group-hover:text-terminal-gold/60'}`} />
                      <div className="text-center">
                        <p className="text-xs font-bold tracking-widest">
                          {newItem.files.length > 0 ? `已添加 ${newItem.files.length} 个文件` : '点击或拖拽文件至此上传 (支持多选)'}
                        </p>
                        <p className="text-[10px] opacity-40 mt-1 uppercase">SUPPORTED: PDF, DOCX, TXT, MD, IMAGES, AUDIO</p>
                      </div>
                    </div>

                    {newItem.files.length > 0 && (
                      <Reorder.Group axis="y" values={newItem.files} onReorder={(newFiles) => setNewItem({...newItem, files: newFiles})} className="space-y-3 mt-4">
                        {newItem.files.map((file, idx) => (
                          <Reorder.Item key={file.id || file.name} value={file}>
                            <FileItem 
                              file={file} 
                              onRemove={() => removeFile(idx)}
                            />
                          </Reorder.Item>
                        ))}
                      </Reorder.Group>
                    )}
                  </div>
                  <div className="col-span-2 pt-4">
                    <button 
                      onClick={handleAddItem}
                      className="w-full py-4 bg-terminal-gold text-black font-bold text-xs uppercase tracking-widest hover:bg-terminal-gold/80 transition-all flex items-center justify-center gap-3"
                    >
                      <Save className="w-4 h-4" /> [ {editingItemId ? '更新档案数据库' : '录入档案数据库'} ]
                    </button>
                  </div>

                  {/* Live Layout Preview Section for Admin */}
                  <div className="col-span-2 mt-8 space-y-4">
                    <div className="flex items-center gap-3 border-b border-terminal-gold/20 pb-2">
                      <Maximize2 className="w-3 h-3 text-terminal-gold" />
                      <h3 className="text-[10px] font-bold tracking-widest uppercase text-terminal-gold">实时排版预览 // LIVE_LAYOUT_PREVIEW</h3>
                    </div>
                    
                    <div className="bg-black/40 border border-terminal-gold/10 relative overflow-hidden">
                      <LivePreviewRenderer 
                        content={newItem.fileContent} 
                        files={newItem.files} 
                        onUpdateContent={(val) => setNewItem({...newItem, fileContent: val})}
                        onUpdateFile={updateFileConfigByName}
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-xs font-bold tracking-widest uppercase border-b border-terminal-gold/20 pb-2">
                  {archives[selectedArchiveId]?.title || '选择栏目'} - 档案列表
                </h2>
                <div className="border border-terminal-gold/20">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-terminal-gold/10 border-b border-terminal-gold/20">
                      <tr>
                        <th className="p-3 font-bold uppercase tracking-widest">ID</th>
                        <th className="p-3 font-bold uppercase tracking-widest">Title</th>
                        <th className="p-3 font-bold uppercase tracking-widest">Attachment</th>
                        <th className="p-3 font-bold uppercase tracking-widest">Level</th>
                        <th className="p-3 font-bold uppercase tracking-widest">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(archives[selectedArchiveId]?.items || []).map((item: any) => (
                        <tr key={item.id} className="border-b border-terminal-gold/5 hover:bg-terminal-gold/5 transition-colors">
                          <td className="p-3 font-bold">{item.id}</td>
                          <td className="p-3 opacity-70">{item.title}</td>
                          <td className="p-3">
                            {item.files && item.files.length > 0 ? (
                              <span className="flex items-center gap-2 text-terminal-gold/60 italic">
                                <FileText className="w-3 h-3" /> {item.files.length} 个附件
                              </span>
                            ) : (
                              <span className="text-terminal-gold/20 italic">NONE</span>
                            )}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 border ${item.level === 'KETER' ? 'border-red-900 text-red-800' : 'border-terminal-gold/30 text-terminal-gold/60'}`}>
                              {item.level}
                            </span>
                          </td>
                          <td className="p-3 text-right flex justify-end gap-2">
                            <button 
                              onClick={() => handleEditItem(selectedArchiveId, item)}
                              className="text-terminal-gold/60 hover:text-terminal-gold transition-colors"
                            >
                              <Settings className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleSet404Item(selectedArchiveId, item.id)}
                              className="text-blue-800 hover:text-blue-600 transition-colors"
                              title="设置为404页面"
                            >
                              <AlertTriangle className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteItem(selectedArchiveId, item.id)}
                              className="text-red-800 hover:text-red-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          ) : activeTab === 'history' ? (
            <div key="history" className="space-y-6 h-full flex flex-col">
              <div className="flex justify-between items-center border-b border-terminal-gold/20 pb-2">
                <h2 className="text-xs font-bold tracking-widest uppercase">历史因果管理 (History Causality Management)</h2>
                <button 
                  onClick={() => setIsHistoryVisualMode(!isHistoryVisualMode)}
                  className="text-[10px] border border-terminal-gold/30 px-3 py-1 hover:bg-terminal-gold hover:text-black transition-all"
                >
                  [ 切换至{isHistoryVisualMode ? '列表' : '可视化'}模式 ]
                </button>
              </div>

              {isHistoryVisualMode ? (
                <VisualHistoryManager historyData={historyData} onUpdateHistory={onUpdateHistory} />
              ) : (
                <div className="space-y-10 max-w-4xl">
                  <section className="space-y-4">
                    <h2 className="text-xs font-bold tracking-widest uppercase border-b border-terminal-gold/20 pb-2">新增历史节点 (New History Node)</h2>
                    <div className="grid grid-cols-2 gap-6 bg-terminal-gold/5 p-6 border border-terminal-gold/10">
                      <div className="space-y-2">
                        <label className="text-[10px] opacity-60 uppercase">节点编号 (NODE_ID)</label>
                        <input 
                          type="text"
                          value={newHistoryItem.id}
                          onChange={(e) => setNewHistoryItem({...newHistoryItem, id: e.target.value})}
                          className="w-full bg-black border border-terminal-gold/30 p-3 text-sm outline-none"
                          placeholder="例如: BMR-005"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] opacity-60 uppercase">节点标题 (NODE_TITLE)</label>
                        <input 
                          type="text"
                          value={newHistoryItem.title}
                          onChange={(e) => setNewHistoryItem({...newHistoryItem, title: e.target.value})}
                          className="w-full bg-black border border-terminal-gold/30 p-3 text-sm outline-none"
                          placeholder="请输入节点标题..."
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] opacity-60 uppercase">所属纪元 (EPOCH)</label>
                        <select 
                          value={newHistoryItem.epoch}
                          onChange={(e) => setNewHistoryItem({...newHistoryItem, epoch: parseInt(e.target.value)})}
                          className="w-full bg-black border border-terminal-gold/30 p-3 text-sm outline-none"
                        >
                          <option value={1}>第一纪元</option>
                          <option value={2}>第二纪元</option>
                          <option value={3}>第三纪元</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] opacity-60 uppercase">时间点 (TIMESTAMP)</label>
                        <input 
                          type="text"
                          value={newHistoryItem.time}
                          onChange={(e) => setNewHistoryItem({...newHistoryItem, time: e.target.value})}
                          className="w-full bg-black border border-terminal-gold/30 p-3 text-sm outline-none"
                          placeholder="例如: E1. 500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] opacity-60 uppercase">坐标 X (LEFT %)</label>
                        <input 
                          type="text"
                          value={newHistoryItem.pos.left}
                          onChange={(e) => setNewHistoryItem({...newHistoryItem, pos: {...newHistoryItem.pos, left: e.target.value}})}
                          className="w-full bg-black border border-terminal-gold/30 p-3 text-sm outline-none"
                          placeholder="例如: 50%"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] opacity-60 uppercase">坐标 Y (TOP %)</label>
                        <input 
                          type="text"
                          value={newHistoryItem.pos.top}
                          onChange={(e) => setNewHistoryItem({...newHistoryItem, pos: {...newHistoryItem.pos, top: e.target.value}})}
                          className="w-full bg-black border border-terminal-gold/30 p-3 text-sm outline-none"
                          placeholder="例如: 50%"
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <label className="text-[10px] opacity-60 uppercase">简短描述 (SHORT_DESC)</label>
                        <input 
                          type="text"
                          value={newHistoryItem.description}
                          onChange={(e) => setNewHistoryItem({...newHistoryItem, description: e.target.value})}
                          className="w-full bg-black border border-terminal-gold/30 p-3 text-sm outline-none"
                          placeholder="显示在地图上的简短描述..."
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <label className="text-[10px] opacity-60 uppercase">详细因果 (DETAILED_CAUSALITY)</label>
                        <textarea 
                          value={newHistoryItem.details}
                          onChange={(e) => setNewHistoryItem({...newHistoryItem, details: e.target.value})}
                          className="w-full bg-black border border-terminal-gold/30 p-3 text-sm outline-none h-24"
                          placeholder="点击节点后显示的详细背景资料..."
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <label className="text-[10px] opacity-60 uppercase">标签 (TAGS - 逗号分隔)</label>
                        <input 
                          type="text"
                          value={newHistoryItem.tags}
                          onChange={(e) => setNewHistoryItem({...newHistoryItem, tags: e.target.value})}
                          className="w-full bg-black border border-terminal-gold/30 p-3 text-sm outline-none"
                          placeholder="例如: 战争, 科技, 变异"
                        />
                      </div>
                      <div className="col-span-2 pt-4">
                        <button 
                          onClick={handleAddHistoryItem}
                          className="w-full py-4 bg-terminal-gold text-black font-bold text-xs uppercase tracking-widest hover:bg-terminal-gold/80 transition-all flex items-center justify-center gap-3"
                        >
                          <Save className="w-4 h-4" /> [ 锚定因果节点 ]
                        </button>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-xs font-bold tracking-widest uppercase border-b border-terminal-gold/20 pb-2">现有历史节点 (Existing Nodes)</h2>
                    <div className="border border-terminal-gold/20">
                      <table className="w-full text-left text-[11px]">
                        <thead className="bg-terminal-gold/10 border-b border-terminal-gold/20">
                          <tr>
                            <th className="p-3 font-bold uppercase tracking-widest">ID</th>
                            <th className="p-3 font-bold uppercase tracking-widest">Title</th>
                            <th className="p-3 font-bold uppercase tracking-widest">Epoch</th>
                            <th className="p-3 font-bold uppercase tracking-widest">Pos</th>
                            <th className="p-3 font-bold uppercase tracking-widest">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(historyData || []).map((item: any) => (
                            <tr key={item.id} className="border-b border-terminal-gold/5 hover:bg-terminal-gold/5 transition-colors">
                              <td className="p-3 font-bold">{item.id}</td>
                              <td className="p-3 opacity-70">{item.title}</td>
                              <td className="p-3">EPOCH {item.epoch}</td>
                              <td className="p-3 text-[9px] opacity-40">{item.pos.left}, {item.pos.top}</td>
                              <td className="p-3 text-right">
                                <button 
                                  onClick={() => handleDeleteHistoryItem(item.id)}
                                  className="text-red-800 hover:text-red-600 transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>
              )}
            </div>
          ) : (
            <div key="submissions" className="space-y-10 max-w-4xl">
              <section className="space-y-6">
                <h2 className="text-sm font-bold tracking-[0.3em] uppercase flex items-center gap-3">
                  <Share2 className="w-4 h-4" /> 待审核投稿 (PENDING_SUBMISSIONS)
                </h2>
                {(!submissions || submissions.length === 0) ? (
                  <div className="border border-terminal-gold/20 p-12 text-center">
                    <p className="text-xs opacity-40 italic">暂无待审核的投稿数据。</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {submissions.map((sub) => (
                      <div key={sub.id} className="border border-terminal-gold/20 bg-terminal-gold/5 p-6 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-bold">{sub.title}</h3>
                            <div className="flex gap-4 items-center mt-1">
                              <p className="text-[10px] opacity-40 font-mono">SUBMITTED_AT: {sub.timestamp}</p>
                              {sub.categoryTitle && (
                                <span className="text-[10px] bg-terminal-gold/20 px-2 py-0.5 border border-terminal-gold/30">
                                  TARGET: {sub.categoryTitle} ({sub.category})
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleApproveSubmission(sub)}
                              className="px-4 py-2 bg-terminal-gold text-black text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all"
                            >
                              [ 批准 ]
                            </button>
                            <button 
                              onClick={() => handleRejectSubmission(sub.id)}
                              className="px-4 py-2 border border-red-900 text-red-800 text-[10px] font-bold uppercase tracking-widest hover:bg-red-900 hover:text-white transition-all"
                            >
                              [ 拒绝 ]
                            </button>
                          </div>
                        </div>
                        <div className="bg-black/40 p-4 border border-terminal-gold/10">
                          <p className="text-xs leading-relaxed opacity-80 whitespace-pre-wrap">{sub.content}</p>
                        </div>
                        {sub.files.length > 0 && (
                          <div className="grid grid-cols-4 gap-2">
                            {sub.files.map((f: any, i: number) => (
                              <div key={i} className="relative group border border-terminal-gold/20 bg-black/40 aspect-video flex items-center justify-center overflow-hidden">
                                {f.type.startsWith('image/') ? (
                                  <img src={f.content} alt={f.name} className="w-full h-full object-cover opacity-50 hover:opacity-100 transition-opacity" />
                                ) : (
                                  <div className="flex flex-col items-center gap-1 text-terminal-gold/30">
                                    <FileText className="w-4 h-4" />
                                    <span className="text-[7px] truncate max-w-[50px]">{f.name}</span>
                                  </div>
                                )}
                                <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-[6px] p-0.5 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                                  {f.name}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}
        </main>
      </div>

      <footer className="border-t border-terminal-gold/30 p-3 text-[9px] text-terminal-gold/40 flex justify-between items-center relative z-10">
        <div className="flex gap-6">
          <span>DB_STATUS: CONNECTED</span>
          <span>WRITE_ACCESS: GRANTED</span>
        </div>
        <span>© 2144 TERMINAL_ADMIN_OVERRIDE</span>
      </footer>
    </div>
  );
};

// --- Main App Component ---

const SystemStatus = () => {
  const [metrics, setMetrics] = useState({ cpu: 12, mem: 45, net: 120 });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        cpu: Math.floor(Math.random() * 20) + 5,
        mem: Math.floor(Math.random() * 5) + 42,
        net: Math.floor(Math.random() * 50) + 100
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-1 pointer-events-none select-none">
      <div className="flex items-center gap-3 text-[9px] font-mono tracking-tighter opacity-40">
        <span className="flex items-center gap-1"><Cpu className="w-2 h-2" /> CPU: {metrics.cpu}%</span>
        <span className="flex items-center gap-1"><Activity className="w-2 h-2" /> MEM: {metrics.mem}%</span>
        <span className="flex items-center gap-1"><Wifi className="w-2 h-2" /> NET: {metrics.net}kb/s</span>
      </div>
      <div className="text-[8px] font-mono tracking-[0.2em] opacity-20 uppercase">Node_Status: Online // Enc: AES-256</div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<'boot' | 'login' | 'search' | 'archive' | 'history' | 'terminal' | 'details' | 'submission' | 'system' | 'system-terminal'>('boot');
  const [selectedArchiveId, setSelectedArchiveId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isPurging, setIsPurging] = useState(false);
  
  // 音效管理
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [userInteracted, setUserInteracted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // 背景音乐管理
  const [bgMusicEnabled, setBgMusicEnabled] = useState(true);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [useLocalAudio, setUseLocalAudio] = useState(false);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const bgMusicOscillatorRef = useRef<OscillatorNode | null>(null);
  const bgMusicGainRef = useRef<GainNode | null>(null);
  
  // 背景音乐播放列表
  const playlist = [
    'https://image2url.com/r2/default/audio/1772440569934-e45879ff-366e-45ff-8d12-a60fea223fdf.wav',
    'https://image2url.com/r2/default/audio/1772440627725-13ba91ca-2fd5-4389-9f39-47b057f5a82c.wav',
    '/黑暗洞穴.wav',
    '/背景.wav'
  ];
  
  // 检查本地音频文件是否存在
  useEffect(() => {
    const checkAudioFiles = async () => {
      try {
        // 尝试加载第一个音频文件（远程 URL）
        const audio = new Audio(playlist[0]);
        
        // 等待音频加载完成
        await new Promise((resolve, reject) => {
          audio.addEventListener('canplaythrough', resolve);
          audio.addEventListener('error', reject);
          audio.load();
        });
        
        setUseLocalAudio(true);
      } catch (error) {
        console.log('音频文件加载失败，使用 Web Audio API');
        setUseLocalAudio(false);
      }
    };
    
    checkAudioFiles();
  }, []);
  
  // 初始化音效和背景音乐
  useEffect(() => {
    // 创建背景音乐
    bgMusicRef.current = new Audio();
    bgMusicRef.current.volume = 0.3;
    
    // 监听音乐结束事件，自动切换到下一首
    const handleEnded = () => {
      setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
    };
    
    bgMusicRef.current.addEventListener('ended', handleEnded);
    
    // 监听用户交互
    const handleUserInteraction = () => {
      setUserInteracted(true);
      // 创建 AudioContext
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };
    
    window.addEventListener('click', handleUserInteraction, { once: true });
    window.addEventListener('keydown', handleUserInteraction, { once: true });
    
    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (bgMusicRef.current) {
        bgMusicRef.current.removeEventListener('ended', handleEnded);
        bgMusicRef.current.pause();
        bgMusicRef.current.src = '';
      }
      if (bgMusicOscillatorRef.current) {
        bgMusicOscillatorRef.current.stop();
      }
    };
  }, []);
  
  // 切换音乐轨道
  useEffect(() => {
    if (!useLocalAudio || !bgMusicRef.current || !userInteracted) return;
    
    bgMusicRef.current.src = playlist[currentTrackIndex];
    bgMusicRef.current.load();
    
    if (bgMusicEnabled) {
      bgMusicRef.current.play().catch(err => console.warn('音乐播放失败:', err));
    }
  }, [currentTrackIndex, useLocalAudio, userInteracted]);
  
  // 控制背景音乐播放/暂停
  useEffect(() => {
    if (useLocalAudio) {
      // 使用本地音频文件
      if (bgMusicRef.current && userInteracted) {
        if (bgMusicEnabled) {
          bgMusicRef.current.play().catch(err => console.warn('音乐播放失败:', err));
        } else {
          bgMusicRef.current.pause();
        }
      }
    } else {
      // 使用 Web Audio API 生成音乐
      if (!audioContextRef.current || !userInteracted) return;
      
      const ctx = audioContextRef.current;
      
      if (bgMusicEnabled) {
        // 创建环境音乐 - 低频嗡鸣声
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = 55; // 低音A
        
        filter.type = 'lowpass';
        filter.frequency.value = 200;
        
        gainNode.gain.value = 0.08;
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.start();
        
        bgMusicOscillatorRef.current = oscillator;
        bgMusicGainRef.current = gainNode;
        
        // 添加缓慢的音量变化
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.1; // 非常慢的变化
        lfoGain.gain.value = 0.02;
        lfo.connect(lfoGain);
        lfoGain.connect(gainNode.gain);
        lfo.start();
      } else {
        if (bgMusicOscillatorRef.current) {
          bgMusicOscillatorRef.current.stop();
          bgMusicOscillatorRef.current = null;
        }
      }
    }
    
    return () => {
      if (!useLocalAudio && bgMusicOscillatorRef.current) {
        bgMusicOscillatorRef.current.stop();
        bgMusicOscillatorRef.current = null;
      }
    };
  }, [bgMusicEnabled, useLocalAudio, userInteracted]);
  
  // 切换背景音乐
  const toggleBgMusic = () => {
    setBgMusicEnabled(!bgMusicEnabled);
  };
  
  // 播放音效
  const playSound = (type: 'click' | 'hover' | 'success' | 'error' | 'boot' | 'login' | 'button') => {
    if (!soundEnabled || !userInteracted || !audioContextRef.current) return;
    
    try {
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      // 根据类型设置不同的音效
      switch (type) {
        case 'click':
        case 'button':
          oscillator.frequency.value = 800;
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
          oscillator.start(ctx.currentTime);
          oscillator.stop(ctx.currentTime + 0.1);
          break;
        case 'login':
        case 'success':
          oscillator.frequency.value = 523.25; // C5
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
          oscillator.start(ctx.currentTime);
          oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
          oscillator.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
          oscillator.stop(ctx.currentTime + 0.3);
          break;
        case 'error':
          oscillator.frequency.value = 200;
          oscillator.type = 'sawtooth';
          gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
          oscillator.start(ctx.currentTime);
          oscillator.stop(ctx.currentTime + 0.2);
          break;
        case 'boot':
          oscillator.frequency.value = 440;
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
          oscillator.start(ctx.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5);
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
          oscillator.stop(ctx.currentTime + 0.5);
          break;
        case 'hover':
          oscillator.frequency.value = 600;
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
          oscillator.start(ctx.currentTime);
          oscillator.stop(ctx.currentTime + 0.05);
          break;
      }
    } catch (err) {
      console.warn('音效播放失败:', err);
    }
  };
  
  // Admin state
  const [isAdminLoginVisible, setIsAdminLoginVisible] = useState(false);
  const [isAdminDashboardVisible, setIsAdminDashboardVisible] = useState(false);

  // Submissions state
  const [submissions, setSubmissions] = useState<any[]>([]);

  // Global archive data state
  const [archives, setArchives] = useState<Record<string, { title: string, items: any[] }>>({
    'REF_001': {
      title: '官方机密卷宗',
      items: [
        { id: 'ANM-072', title: '关于“红月”同步率异常增长的初步报告', level: 'EUCLID', time: '2024.03.12 14:02' },
        { id: 'ANM-105', title: '枢纽防御协议：第四阶段实施细则', level: 'SAFE', time: '2024.03.11 09:45' },
      ]
    },
    'REF_002': {
      title: '红月地理图志',
      items: [
        { id: 'GEO-001', title: '静止海域深度测绘数据', level: 'SAFE', time: '2024.03.11 10:20' },
        { id: 'GEO-042', title: '核心枢纽周边地形变异监测', level: 'EUCLID', time: '2024.03.10 15:30' },
      ]
    },
    'REF_003': {
      title: '变异物种目录',
      items: [
        { id: 'BIO-112', title: '“影舞者”生物特征与弱点分析', level: 'KETER', time: '2024.03.10 22:15' },
        { id: 'BIO-009', title: '红月植物光合作用替代机制研究', level: 'SAFE', time: '2024.03.09 08:40' },
      ]
    },
    'REF_004': {
      title: '旧神文明残片',
      items: [
        { id: 'ARC-441', title: '苏美尔深层遗址：楔形文字破译进度', level: 'THAUMIEL', time: '2024.03.08 12:30' },
        { id: 'ARC-012', title: '以太能量传导回路复刻实验记录', level: 'EUCLID', time: '2024.03.07 19:00' },
      ]
    },
    'REF_005': {
      title: '幸存者行动志',
      items: [
        { id: 'LOG-901', title: '第12探索小队：最后一次无线电传输', level: 'KETER', time: '2024.03.05 03:12' },
        { id: 'LOG-055', title: '核心区幸存者营地资源分配方案', level: 'SAFE', time: '2024.03.04 11:50' },
      ]
    },
    'REF_006': {
      title: '精神阈值研究',
      items: [
        { id: 'PSY-221', title: '长期暴露于红月光照下的心理畸变模型', level: 'EUCLID', time: '2024.03.02 16:45' },
        { id: 'PSY-003', title: '精神稳定剂：第三代临床试验报告', level: 'SAFE', time: '2024.03.01 09:20' },
      ]
    },
    'REF_007': {
      title: '收容失效记录',
      items: [
        { id: 'CON-219', title: 'L-09 区域清除记录：收容失效后续影响', level: 'KETER', time: '2024.02.28 23:58' },
        { id: 'CON-088', title: '核心枢纽电力系统故障导致的收容风险', level: 'EUCLID', time: '2024.02.27 14:10' },
      ]
    },
    'REF_008': {
      title: '核心枢纽协议',
      items: [
        { id: 'PRO-001', title: '枢纽自毁程序：最终授权序列', level: 'THAUMIEL', time: '2024.02.25 00:01' },
        { id: 'PRO-015', title: '跨维度通讯协议：紧急呼叫频率', level: 'SAFE', time: '2024.02.24 18:30' },
      ]
    }
  });

  const [historyData, setHistoryData] = useState<any[]>([
    // Epoch 1: Age of Gods (第一纪元：神权时代)
    {
      id: 'E1-001',
      title: '血月叛乱',
      epoch: 1,
      time: '78-82',
      level: 'V',
      pos: { top: '60%', left: '20%' },
      description: '神权统治下的第一次大规模武装反抗，标志着旧神秩序的初步动摇。',
      details: '在血月当空之夜，被压迫的底层信徒与异端者联手冲击了圣殿。虽然最终被镇压，但神权的绝对权威从此产生了裂痕。',
      tags: ['叛乱', '神权', '血月'],
      links: ['E1-002', 'E1-005']
    },
    {
      id: 'E1-002',
      title: '诸王时代',
      epoch: 1,
      time: '5-14世纪',
      level: 'III',
      pos: { top: '50%', left: '15%' },
      description: '世俗王权与神权交织的漫长岁月，文明在阴影中缓慢扩张。',
      details: '这是一个群雄并起的时代，各方势力在神权的默许下划分疆域，同时也为后来的大变革埋下了伏笔。',
      tags: ['王权', '扩张', '中世纪'],
      links: ['E1-003']
    },
    {
      id: 'E1-003',
      title: '黑死病',
      epoch: 1,
      time: '1348',
      level: 'VI',
      pos: { top: '40%', left: '25%' },
      description: '夺走3000万生命的恐怖瘟疫，被视为神罚的降临。',
      details: '这场瘟疫彻底摧毁了旧有的社会结构，劳动力短缺迫使技术开始萌芽，也让人们开始怀疑神明的护佑。',
      tags: ['瘟疫', '灾难', '社会变革'],
      links: ['E1-004', 'E1-006']
    },
    {
      id: 'E1-004',
      title: '工业革命',
      epoch: 1,
      time: 'E1. 1800',
      level: 'IV',
      pos: { top: '30%', left: '35%' },
      description: '蒸汽与钢铁的崛起，人类第一次尝试用技术挑战神迹。',
      details: '随着机器的轰鸣，生产力得到了前所未有的释放。神权时代开始向资本与技术让步。',
      tags: ['技术', '蒸汽', '工业'],
      links: ['E1-007']
    },
    {
      id: 'E1-005',
      title: '白神教镇压',
      epoch: 1,
      time: 'E1. 150',
      level: 'III',
      pos: { top: '70%', left: '15%' },
      description: '白神教对异端思想的残酷清洗，试图挽回摇摇欲坠的信仰。',
      details: '无数先驱者在火刑架上陨落，但真理的种子已经播下。',
      tags: ['清洗', '信仰', '冲突'],
      links: ['E1-001']
    },
    {
      id: 'E1-006',
      title: '文明保存方案',
      epoch: 1,
      time: 'E1. 1900',
      level: 'V',
      pos: { top: '25%', left: '20%' },
      description: '维兰纽瓦家族秘密接收的远古遗产，旨在末日来临时保存火种。',
      details: '这套方案包含了超越时代的知识，成为了后来所有核心技术的源头。',
      tags: ['遗产', '火种', '维兰纽瓦'],
      links: ['E1-004']
    },
    {
      id: 'E1-007',
      title: '巴罗萨攻坚',
      epoch: 1,
      time: 'E1. 2040',
      level: 'V',
      pos: { top: '45%', left: '35%' },
      description: '巴罗萨势力攻破三十七个圣地，神权时代正式终结。',
      details: '圣地的陷落标志着旧神彻底退出历史舞台，理性与科学的时代即将开启。',
      tags: ['终结', '圣地', '巴罗萨'],
      links: ['E2-001']
    },
    {
      id: 'E1-008',
      title: '升格潮汐',
      epoch: 1,
      time: 'E1. 1950',
      level: 'IV',
      pos: { top: '65%', left: '35%' },
      description: '天教发动的精神升格运动，试图通过集体意识共鸣接触神明。',
      details: '这次尝试虽然以失败告终，但它为后来的意识上传技术提供了最初的理论基础。',
      tags: ['升格', '天教', '意识'],
      links: ['E1-007']
    },

    // Epoch 2: Age of Reason (第二纪元：理性时代)
    {
      id: 'E2-001',
      title: '黄金三十年',
      epoch: 2,
      time: '2047-2077',
      level: 'III',
      pos: { top: '30%', left: '50%' },
      description: '技术爆炸带来的虚假繁荣，人类进入了前所未有的高速发展期。',
      details: '在这个时代，一切似乎都在向好发展，但阶级固化与资源枯竭的阴影已悄然降临。',
      tags: ['繁荣', '发展', '黄金时代'],
      links: ['E2-002', 'E2-003']
    },
    {
      id: 'E2-002',
      title: '技术爆炸',
      epoch: 2,
      time: '2050s',
      level: 'IV',
      pos: { top: '40%', left: '55%' },
      description: '科学发现呈指数级增长，但成果仅被少数精英阶层垄断。',
      details: '阶级固化达到了顶峰，底层民众成为了技术的牺牲品而非受益者。',
      tags: ['垄断', '科技', '不平等'],
      links: ['E2-004', 'E2-005']
    },
    {
      id: 'E2-003',
      title: '意识上传',
      epoch: 2,
      time: '2065',
      level: 'V',
      pos: { top: '20%', left: '45%' },
      description: '原心公司推出的“富人永生”方案，将人类意识数字化。',
      details: '这不仅是技术的突破，更是伦理的崩塌。人类开始分化为“肉身者”与“数字神明”。',
      tags: ['永生', '原心公司', '数字化'],
      links: ['E2-002']
    },
    {
      id: 'E2-004',
      title: '底层实验',
      epoch: 2,
      time: '2070',
      level: 'V',
      pos: { top: '20%', left: '60%' },
      description: '圣保罗医院沦为活体实验场，底层民众成为新药与义体的试验品。',
      details: '在光鲜亮丽的城市下方，隐藏着无数被遗弃的实验体。',
      tags: ['实验', '圣保罗', '黑暗'],
      links: ['E2-005']
    },
    {
      id: 'E2-005',
      title: '联盟崩溃',
      epoch: 2,
      time: '2090s',
      level: 'VI',
      pos: { top: '50%', left: '65%' },
      description: '巴罗萨联盟因内部矛盾与资源争夺而土崩瓦解，全球陷入混乱。',
      details: '曾经的秩序化为乌有，战争与饥荒再次席卷大地。',
      tags: ['崩溃', '战争', '混乱'],
      links: ['E2-006', 'E2-007']
    },
    {
      id: 'E2-006',
      title: '政府雏形',
      epoch: 2,
      time: '2098',
      level: 'IV',
      pos: { top: '40%', left: '70%' },
      description: '红月政府在混乱中萌芽，承诺通过绝对秩序终结苦难。',
      details: '人们为了安全而放弃了自由，一个更加庞大且冷酷的机器开始运转。',
      tags: ['秩序', '红月', '集权'],
      links: ['E3-001']
    },
    {
      id: 'E2-007',
      title: '遗忘回廊',
      epoch: 2,
      time: '2105',
      level: 'V',
      pos: { top: '60%', left: '60%' },
      description: '探险者联盟在深层地壳发现的超古代遗迹，揭示了循环的真相。',
      details: '回廊中的壁画预言了红月的降临，但这份警告被当权者封锁。',
      tags: ['遗迹', '预言', '真相'],
      links: ['E2-009']
    },
    {
      id: 'E2-008',
      title: '不熄赞歌',
      epoch: 2,
      time: '2108',
      level: 'IV',
      pos: { top: '55%', left: '75%' },
      description: '亚历山大调频广播的最后一段旋律，成为了旧时代最后的挽歌。',
      details: '这段旋律被认为含有某种精神稳定频率，至今仍在某些废墟中回荡。',
      tags: ['赞歌', '调频', '挽歌'],
      links: ['E2-005']
    },
    {
      id: 'E2-009',
      title: '裂痕时代',
      epoch: 2,
      time: '新历 100-108',
      level: 'V',
      pos: { top: '70%', left: '70%' },
      description: '现实维度出现物理性裂痕，虚空物质开始渗入。',
      details: '红月政府利用这些裂痕开发了全新的能源系统，但也带来了不可逆转的污染。',
      tags: ['裂痕', '虚空', '能源'],
      links: ['E3-006']
    },

    // Epoch 3: Red Moon Order (第三纪元：红月秩序)
    {
      id: 'E3-000',
      title: 'ROOT',
      epoch: 3,
      time: '∞',
      level: 'VII',
      pos: { top: '50%', left: '50%' },
      description: '红月之下·主线强化版。所有因果的交汇点，系统的核心节点。',
      details: '这里是所有可能性的终点，也是新循环的起点。只有通过深度分析才能触及。',
      tags: ['核心', 'ROOT', '因果'],
      links: ['E3-001', 'E3-007']
    },
    {
      id: 'E3-001',
      title: '红月政府',
      epoch: 3,
      time: '新历 1',
      level: 'VI',
      pos: { top: '40%', left: '80%' },
      description: '人类历史上第一次将“压迫”系统化、制度化、永久化。',
      details: '红月政府通过全方位的监控与精神控制，建立了一个绝对稳定的静止社会。',
      tags: ['压迫', '监控', '绝对秩序'],
      links: ['E3-004', 'E3-009']
    },
    {
      id: 'E3-002',
      title: 'ECO基金会',
      epoch: 3,
      time: '新历 15',
      level: 'V',
      pos: { top: '30%', left: '85%' },
      description: '被称为“工业心脏”的垄断组织，掌控着全球的能源与生产。',
      details: 'ECO基金会不仅是经济实体，更是红月政府维持统治的物质基础。',
      tags: ['能源', '垄断', '工业'],
      links: ['E3-003']
    },
    {
      id: 'E3-003',
      title: '中央统合部',
      epoch: 3,
      time: '新历 20',
      level: 'V',
      pos: { top: '30%', left: '92%' },
      description: '负责决策与核心算法的“大脑”，处理海量的社会运行数据。',
      details: '在这里，每一个人的命运都被简化为一个概率模型。',
      tags: ['算法', '决策', '数据'],
      links: ['E3-001']
    },
    {
      id: 'E3-004',
      title: '红月奠基',
      epoch: 3,
      time: '新历 1-30',
      level: 'IV',
      pos: { top: '50%', left: '85%' },
      description: '红月秩序的巩固期，完成了对全球资源的重新分配。',
      details: '通过一系列残酷的法令，反抗力量被彻底肃清。',
      tags: ['巩固', '分配', '肃清'],
      links: ['E3-005']
    },
    {
      id: 'E3-005',
      title: '净化者叛乱',
      epoch: 3,
      time: '新历 85',
      level: 'V',
      pos: { top: '60%', left: '90%' },
      description: '针对红月政府的高层暗杀与系统破坏行动。',
      details: '虽然行动失败，但它证明了即使在绝对秩序下，自由的火种依然存在。',
      tags: ['暗杀', '反抗', '火种'],
      links: ['E3-006']
    },
    {
      id: 'E3-006',
      title: '黎明惊梦',
      epoch: 3,
      time: '新历 112',
      level: 'VI',
      pos: { top: '75%', left: '55%' },
      description: '全球性的集体幻觉事件，数亿人同时梦见了同一个终焉场景。',
      details: '这次事件导致了严重的社会动荡，红月政府的认知控制系统首次出现大规模过载。',
      tags: ['幻觉', '动荡', '过载'],
      links: ['E3-007']
    },
    {
      id: 'E3-007',
      title: '末日幻象',
      epoch: 3,
      time: '2024.12.18',
      level: 'VI',
      pos: { top: '85%', left: '45%' },
      description: '全球同步出现的末日幻象，天空被巨大的钟塔虚影覆盖。',
      details: '这一刻，时间似乎停止了。所有人都在等待那个最终的审判。',
      tags: ['末日', '钟塔', '审判'],
      links: ['E3-008']
    },
    {
      id: 'E3-008',
      title: '梦境残留者',
      epoch: 3,
      time: '新历 115',
      level: 'IV',
      pos: { top: '80%', left: '30%' },
      description: '在幻象事件后无法回归现实的人群，被政府强制进行心理疏导。',
      details: '他们声称自己看到了“真实”的世界，但这被官方定义为严重的精神畸变。',
      tags: ['心理疏导', '真实', '畸变'],
      links: ['E3-000']
    },
    {
      id: 'E3-009',
      title: '红月协议',
      epoch: 3,
      time: '新历 5',
      level: 'V',
      pos: { top: '20%', left: '80%' },
      description: '超越一切伦理的绝对权力契约，确立了红月政府的合法性。',
      details: '协议规定，为了人类种群的延续，任何个体牺牲都是必要的。',
      tags: ['契约', '牺牲', '合法性'],
      links: ['E3-010']
    },
    {
      id: 'E3-010',
      title: '统治哲学',
      epoch: 3,
      time: '新历 10',
      level: 'IV',
      pos: { top: '15%', left: '90%' },
      description: '静态平衡：任何变量都必须被抹除。',
      details: '这是红月政府的核心统治逻辑，旨在通过消除所有不确定性来实现永恒的稳定。',
      tags: ['哲学', '平衡', '稳定'],
      links: ['E3-003']
    }
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '~' || e.key === '`') {
        e.preventDefault();
        setIsAdminLoginVisible(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleBootComplete = () => {
    setView('login');
  };

  const handleLogin = () => {
    playSound('login');
    setView('search');
  };

  const handlePurge = () => {
    playSound('button');
    setIsPurging(true);
  };

  const handlePurgeComplete = () => {
    playSound('success');
    setIsPurging(false);
    setView('login');
  };

  const handleLogout = () => {
    playSound('button');
    setView('login');
  };

  const handleNavigate = (newView: 'search' | 'archive' | 'history' | 'terminal' | 'details' | 'submission') => {
    playSound('click');
    console.log('Changing view to:', newView);
    setView(newView);
  };

  useEffect(() => {
    console.log('Current view state:', view);
  }, [view]);

  return (
    <>
      <AnimatePresence>
        {isPurging && <PurgeOverlay onComplete={handlePurgeComplete} />}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {view === 'boot' ? (
          <BootSequence onComplete={handleBootComplete} />
        ) : view === 'login' ? (
          <motion.div 
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(20px)' }}
            transition={{ duration: 0.8 }}
            className="relative flex h-screen w-full flex-col overflow-hidden p-6 md:p-10 border-[16px] border-black"
          >
            <div className="crt-overlay"></div>
            <div className="scanline"></div>
            <div className="noise-overlay"></div>
            <SystemStatus />
            
            <Header />
            
            <main className="flex flex-1 gap-10 overflow-hidden relative">
              <Sidebar onNavigate={handleNavigate} />
              <LoginBox onLogin={handleLogin} onPurge={handlePurge} />
              <LogsSidebar />
            </main>
            
            <Footer />

            {/* Decorative UI Elements (Corner Brackets) */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-terminal-gold/40"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-terminal-gold/40"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-terminal-gold/40"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-terminal-gold/40"></div>
          </motion.div>
        ) : view === 'search' ? (
          <motion.div
            key="search"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full"
          >
            <SearchPage onLogout={handleLogout} onNavigate={handleNavigate} archives={archives} onSelectArchive={setSelectedArchiveId} onSelectItem={setSelectedItemId} bgMusicEnabled={bgMusicEnabled} onToggleBgMusic={toggleBgMusic} />
          </motion.div>
        ) : view === 'archive' ? (
          <motion.div
            key="archive"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <ArchivePage onNavigate={handleNavigate} onSelectArchive={setSelectedArchiveId} archives={archives} />
          </motion.div>
        ) : view === 'history' ? (
          <motion.div
            key="history"
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <HistoryPage onNavigate={handleNavigate} historyData={historyData} />
          </motion.div>
        ) : view === 'terminal' ? (
          <motion.div
            key="terminal"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full"
          >
            <TerminalPage archiveId={selectedArchiveId} onNavigate={handleNavigate} onSelectItem={setSelectedItemId} archives={archives} playSound={playSound} />
          </motion.div>
        ) : view === 'details' ? (
          <motion.div
            key="details"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <DetailsPage itemId={selectedItemId} onNavigate={handleNavigate} archives={archives} onSelectItem={setSelectedItemId} />
          </motion.div>
        ) : view === 'submission' ? (
          <motion.div
            key="submission"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <SubmissionPage 
              onNavigate={handleNavigate} 
              archives={archives}
              onSubmit={(submission) => {
                setSubmissions(prev => [submission, ...prev]);
                handleNavigate('search');
              }} 
            />
          </motion.div>
        ) : view === 'system' ? (
          <motion.div
            key="system"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <SystemPage onNavigate={handleNavigate} playSound={playSound} />
          </motion.div>
        ) : view === 'system-terminal' ? (
          <motion.div
            key="system-terminal"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full"
          >
            <SystemTerminalPage onNavigate={handleNavigate} playSound={playSound} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isAdminLoginVisible && (
          <AdminLogin 
            onLogin={() => {
              playSound('login');
              setIsAdminLoginVisible(false);
              // 使用 setTimeout 确保 AdminLogin 完全退出后再显示 AdminDashboard
              setTimeout(() => {
                setIsAdminDashboardVisible(true);
              }, 300);
            }} 
            onCancel={() => {
              playSound('button');
              setIsAdminLoginVisible(false);
            }} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAdminDashboardVisible && (
          <AdminDashboard 
            archives={archives} 
            submissions={submissions}
            historyData={historyData}
            onUpdateArchives={setArchives}
            onUpdateSubmissions={setSubmissions}
            onUpdateHistory={setHistoryData}
            onClose={() => {
              playSound('button');
              setIsAdminDashboardVisible(false);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
