import React, { useState, useEffect } from 'react';
import { GlitchText } from '../common/GlitchText';

export const LogsSidebar = () => {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const logPool = [
      { type: '信息', msg: '从节点 12.8 拦截到数据包' },
      { type: '警告', msg: '报头签名不匹配' },
      { type: '信息', msg: '正在尝试解密 (AES-512)...' },
      { type: '失败', msg: '盐值不匹配。正在重试...', color: 'text-terminal-red' },
      { type: '信息', msg: '在 0x4f22 检测到缓冲区溢出' },
      { type: '信息', msg: '已建立到网关的追踪路由' },
      { type: '信息', msg: '信号强度：-84dBm' },
      { type: '信息', msg: '正在将核心转储至 /dev/null' },
      { type: '信息', msg: '正在与红月主时钟同步' },
      { type: '信息', msg: '端口 8080：正在监听' },
      { type: '信息', msg: '正在拦截 SSL 握手...' },
      { type: '警告', msg: '检测到延迟抖动' },
      { type: '警报', msg: '未经授权的 Shell 访问', color: 'text-terminal-red' },
      { type: '信息', msg: '正在加密临时日志...' },
      { type: '信息', msg: '心跳响应正常' }
    ];

    const interval = setInterval(() => {
      setLogs(prev => {
        const item = logPool[Math.floor(Math.random() * logPool.length)];
        const newLog = {
          time: new Date().toLocaleTimeString('en-US', { hour12: false }),
          ...item
        };
        return [...prev.slice(-14), newLog];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="w-64 hidden xl:flex flex-col border-l border-terminal-gold/20 pl-6 py-4">
      <div className="flex items-center justify-between mb-4 border-b border-terminal-gold/20 pb-2">
        <h3 className="text-[10px] font-bold uppercase tracking-widest"><GlitchText text="实时系统日志" /></h3>
        <div className="w-2 h-2 rounded-full bg-terminal-gold animate-pulse"></div>
      </div>
      <div className="flex-1 flex flex-col gap-2 font-mono text-[9px] opacity-60 overflow-hidden leading-tight">
        {logs.map((log, i) => (
          <p key={i} className={log.color || 'text-terminal-gold'}>
            {log.time} [{log.type}] {log.msg}
          </p>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-terminal-gold/20">
        <div className="grid grid-cols-4 gap-1 h-32 opacity-20">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`bg-terminal-gold/${Math.floor(Math.random() * 80 + 10)} h-full w-full`}></div>
          ))}
        </div>
        <p className="text-[8px] mt-2 opacity-50 uppercase tracking-widest text-center">频率分析表</p>
      </div>
    </aside>
  );
};
