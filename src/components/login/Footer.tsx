import React from 'react';

export const Footer = () => {
  return (
    <footer className="mt-auto pt-4 flex flex-col md:flex-row items-center justify-between border-t border-terminal-gold/30 gap-4">
      <div className="flex items-center gap-4 md:gap-8">
        <div className="flex flex-col">
          <span className="text-[8px] opacity-40 uppercase tracking-widest">内存负载</span>
          <span className="text-[10px] md:text-xs font-bold font-mono">14.8 GB / 64 GB</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[8px] opacity-40 uppercase tracking-widest">处理器温度</span>
          <span className="text-[10px] md:text-xs font-bold font-mono">72°C</span>
        </div>
        <div className="hidden sm:flex flex-col">
          <span className="text-[8px] opacity-40 uppercase tracking-widest">活动线程</span>
          <span className="text-[10px] md:text-xs font-bold font-mono">1,024</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-2 md:px-3 py-1 bg-terminal-gold/5 border border-terminal-gold/20 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_green]"></span>
          <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest">安全握手：正常</span>
        </div>
        <div className="hidden xs:block text-[8px] md:text-[10px] opacity-40 font-mono tracking-tighter">
          UID: 0x908551_RM_LEAK_PORT
        </div>
      </div>
    </footer>
  );
};
