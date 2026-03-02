import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GlitchText } from '../common/GlitchText';

interface LoginBoxProps {
  onLogin: () => void;
  onPurge: () => void;
}

export const LoginBox: React.FC<LoginBoxProps> = ({ onLogin, onPurge }) => {
  const [passcode, setPasscode] = useState('');

  return (
    <section className="flex-1 flex flex-col items-center justify-center relative px-4 md:px-10">
      {/* Background Sigil */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <div className="w-64 h-64 md:w-96 md:h-96 border-4 border-terminal-gold rounded-full flex items-center justify-center border-dashed animate-[spin_60s_linear_infinite]">
          <div className="w-40 h-40 md:w-64 md:h-64 border-8 border-terminal-gold rounded-full relative">
            <div className="absolute inset-0 bg-terminal-gold/20 blur-xl rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Glitched Login Box */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="z-10 w-full max-w-lg p-6 md:p-10 bg-terminal-bg/80 backdrop-blur-sm glitch-border flex flex-col gap-6 md:gap-8 text-center"
      >
        <div className="flex flex-col gap-2">
          <h2 className="text-xl md:text-3xl font-bold tracking-widest text-terminal-red crt-glow-red">
            <GlitchText text="检测到未经授权的访问" />
          </h2>
          <div className="h-1 w-full bg-terminal-red/20">
            <motion.div 
              className="h-full bg-terminal-red"
              animate={{ width: ['0%', '100%', '0%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 md:gap-6">
          <p className="text-xs md:text-sm tracking-widest opacity-80 uppercase leading-relaxed font-mono">
            &gt; 系统完整性受损<br/>
            &gt; 生物特征追踪中...<br/>
            &gt; 请输入管理员凭据
          </p>
          
          <div className="relative group">
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 text-terminal-gold animate-pulse">&gt;</div>
            <input 
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full bg-transparent border-b border-terminal-gold/40 focus:border-terminal-gold focus:ring-0 text-center text-lg md:text-xl tracking-[0.3em] md:tracking-[0.5em] placeholder:text-terminal-gold/20 placeholder:text-[10px] outline-none"
              placeholder="[ 需要通行码 ]"
              onKeyDown={(e) => e.key === 'Enter' && onLogin()}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
            <button 
              onClick={onLogin}
              className="px-8 py-2 bg-terminal-gold text-terminal-bg font-bold text-sm tracking-widest hover:bg-terminal-gold/80 transition-colors uppercase"
            >
              执行
            </button>
            <button 
              onClick={onPurge}
              className="px-8 py-2 border border-terminal-red/40 text-terminal-red text-xs tracking-widest hover:bg-terminal-red/10 transition-colors uppercase"
            >
              紧急清除
            </button>
          </div>
        </div>
      </motion.div>

      <div className="mt-8 text-[8px] md:text-[10px] opacity-40 uppercase tracking-[0.2em] font-mono text-center">
        正在追踪 IP: 192.XXX.XX.84 // 位置：[机密]
      </div>
    </section>
  );
};
