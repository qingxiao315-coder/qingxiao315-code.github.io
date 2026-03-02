import React, { useState, useEffect } from 'react';
import { Terminal, Lock, Wifi, Clock } from 'lucide-react';
import { GlitchText } from '../common/GlitchText';

export const Header = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: false }));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="flex items-center justify-between border-b border-terminal-gold/30 pb-4 mb-4 md:mb-8">
      <div className="flex items-center gap-2 md:gap-4">
        <Terminal className="w-6 h-6 md:w-8 md:h-8 crt-glow" />
        <div className="flex flex-col">
          <h1 className="text-sm md:text-xl font-bold tracking-widest uppercase crt-glow">
            <GlitchText text="红月泄密端口 // RED MOON LEAK PORT" />
          </h1>
          <p className="text-[8px] md:text-[10px] opacity-60 tracking-[0.2em] md:tracking-[0.3em] font-mono">
            系统终端 v4.0.2 - 安全节点_09
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-6">
        <div className="hidden sm:flex px-2 md:px-3 py-1 bg-terminal-gold/10 border border-terminal-gold/20 rounded">
          <span className="text-[10px] md:text-xs font-bold flex items-center gap-1 md:gap-2">
            <Lock className="w-3 h-3" /> 加密等级：9
          </span>
        </div>
        <div className="px-2 md:px-3 py-1 border border-terminal-red/50 text-terminal-red/80 rounded animate-pulse">
          <span className="text-[10px] md:text-xs font-bold flex items-center gap-1 md:gap-2">
            <Wifi className="w-3 h-3" /> <span className="hidden xs:inline">信号：</span>不稳定
          </span>
        </div>
        <div className="hidden md:flex text-xs opacity-50 font-mono items-center gap-2">
          <Clock className="w-3 h-3" /> UTC {time}
        </div>
      </div>
    </header>
  );
};
