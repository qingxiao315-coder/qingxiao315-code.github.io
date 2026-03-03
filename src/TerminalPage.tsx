import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Server, 
  Cpu, 
  Database, 
  Network, 
  Shield, 
  Activity, 
  AlertTriangle, 
  ChevronRight, 
  Clock,
  Wifi,
  Zap
} from 'lucide-react';

interface TerminalPageProps {
  onNavigate: (view: string) => void;
  playSound: (type: 'click' | 'hover' | 'success' | 'error' | 'boot' | 'login' | 'button') => void;
}

const TerminalPage: React.FC<TerminalPageProps> = ({ onNavigate, playSound }) => {
  const [systemStats, setSystemStats] = useState({
    memory: 72.4,
    cpu: 42.0,
    storage: 38.1,
    temperature: 42,
    bandwidth: 1.2,
    status: 'NORMAL'
  });

  const [systemLogs, setSystemLogs] = useState([
    { time: '[12:04:16]', message: '初始化认知引擎...' },
    { time: '[12:04:23]', message: '世界同步率: 91.2%' },
    { time: '[12:05:12]', message: '在石城区域检测到异常' },
    { time: '[12:06:00]', message: '深层网络连接稳定: +5%' },
    { time: '[12:08:45]', message: '三维模型重建坐标修正中...' }
  ]);

  const [currentTime, setCurrentTime] = useState('');
  const [systemUptime, setSystemUptime] = useState('142:55:12:30');

  // 更新系统时间
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // 模拟系统数据变化
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats(prev => ({
        ...prev,
        memory: (prev.memory + (Math.random() - 0.5) * 2).toFixed(1),
        cpu: (prev.cpu + (Math.random() - 0.5) * 3).toFixed(1),
        bandwidth: (prev.bandwidth + (Math.random() - 0.5) * 0.2).toFixed(1)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // 模拟系统日志更新
  useEffect(() => {
    const logMessages = [
      '深层网络连接稳定: +2%',
      '认知引擎性能提升: 5%',
      '世界同步率: 91.8%',
      '在石城区域检测到异常活动',
      '三维模型重建完成: 78%',
      '系统安全检查通过',
      '深层网络连接不稳定: -3%',
      '认知引擎负载过高: 87%'
    ];

    const interval = setInterval(() => {
      const randomMessage = logMessages[Math.floor(Math.random() * logMessages.length)];
      const now = new Date();
      const timeString = `[${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}]`;
      
      setSystemLogs(prev => [
        { time: timeString, message: randomMessage },
        ...prev.slice(0, 4)
      ]);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full bg-[#0a0a0a] text-green-400 font-mono text-sm overflow-hidden">
      {/* 顶部导航栏 */}
      <div className="flex justify-between items-center px-6 py-3 border-b border-green-800/50 bg-black/50">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-green-400">UNDER THE RED MOON 终端系统</h1>
          <nav className="flex gap-6">
            <button className="text-green-400 hover:text-green-300 transition-colors">核心调度</button>
            <button className="text-green-600 hover:text-green-300 transition-colors">节点监控</button>
            <button className="text-green-600 hover:text-green-300 transition-colors">性能分析</button>
            <button className="text-green-600 hover:text-green-300 transition-colors">安全协议</button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-green-600">权限级别: OMEGA-6459</span>
          <button 
            onClick={() => {
              playSound('button');
              onNavigate('search');
            }}
            className="text-green-600 hover:text-green-400 transition-colors flex items-center gap-1"
          >
            <ChevronRight className="w-4 h-4" />
            退出
          </button>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex h-[calc(100vh-56px)] overflow-hidden">
        {/* 左侧监控面板 */}
        <div className="w-64 border-r border-green-800/50 bg-black/30 p-4">
          <h2 className="text-green-400 font-bold mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            实时配置监控
          </h2>
          
          <div className="space-y-6">
            {/* 内存分配 */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-green-600">内存分配</span>
                <span className="text-green-400">{systemStats.memory}%</span>
              </div>
              <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-green-400"
                  initial={{ width: '0%' }}
                  animate={{ width: `${systemStats.memory}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              <div className="text-xs text-green-700 mt-1">世界现象映射</div>
            </div>

            {/* 可视化引擎 */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-green-600">可视化引擎</span>
                <span className="text-green-400">{systemStats.storage}%</span>
              </div>
              <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-green-500"
                  initial={{ width: '0%' }}
                  animate={{ width: `${systemStats.storage}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              <div className="text-xs text-green-700 mt-1">渲染负载</div>
            </div>

            {/* 核心温度 */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-green-600">核心温度</span>
                <span className="text-green-400">{systemStats.temperature}°C</span>
              </div>
              <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-green-600"
                  initial={{ width: '0%' }}
                  animate={{ width: `${(systemStats.temperature / 80) * 100}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              <div className="text-xs text-green-700 mt-1">系统稳定性</div>
            </div>
          </div>
        </div>

        {/* 中央地图区域 */}
        <div className="flex-1 border-r border-green-800/50 p-4 relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-green-400 font-bold">MAP PROJECTOR v4.2</h2>
            <div className="flex items-center gap-2 text-green-600">
              <Clock className="w-4 h-4" />
              <span>{currentTime}</span>
            </div>
          </div>
          
          <div className="relative w-full h-[calc(100%-40px)] border border-green-800/50 bg-[#0a0a1a] rounded-sm overflow-hidden">
            {/* 网格背景 */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzA4MjYwOCIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')]"></div>
            
            {/* 世界地图 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="600" height="300" viewBox="0 0 1000 500" className="opacity-70">
                <path 
                  d="M100,250 Q200,150 300,200 T500,180 T700,220 T900,250" 
                  fill="none" 
                  stroke="#08c078" 
                  strokeWidth="2"
                />
                <path 
                  d="M150,300 Q250,250 350,280 T550,260 T750,290 T850,300" 
                  fill="none" 
                  stroke="#08c078" 
                  strokeWidth="2"
                />
                <path 
                  d="M200,350 Q300,300 400,330 T600,310 T800,340" 
                  fill="none" 
                  stroke="#08c078" 
                  strokeWidth="2"
                />
                {/* 地标点 */}
                <circle cx="450" cy="200" r="3" fill="#08c078" className="animate-pulse" />
                <circle cx="650" cy="250" r="3" fill="#08c078" className="animate-pulse" />
                <circle cx="300" cy="300" r="3" fill="#08c078" className="animate-pulse" />
              </svg>
            </div>
            
            {/* 地图信息 */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-xs text-green-600">
              <div>月面坐标系 A-12</div>
              <div>LAT: 34.22.11 / LONG: 108.98.32</div>
              <div>DATA STREAM STATUS: STABLE</div>
            </div>
            
            {/* 系统指标 */}
            <div className="absolute bottom-16 left-4 right-4 grid grid-cols-3 gap-4">
              <div className="bg-black/50 border border-green-800/50 p-2 rounded-sm">
                <div className="text-xs text-green-700">认知引擎负载</div>
                <div className="text-lg font-bold text-green-400">{systemStats.cpu}%</div>
                <div className="text-xs text-green-600">DECREASING -2%</div>
              </div>
              <div className="bg-black/50 border border-green-800/50 p-2 rounded-sm">
                <div className="text-xs text-green-700">系统运行稳定性</div>
                <div className="text-lg font-bold text-green-400">99.8%</div>
                <div className="text-xs text-green-600">NORMAL</div>
              </div>
              <div className="bg-black/50 border border-green-800/50 p-2 rounded-sm">
                <div className="text-xs text-green-700">上行带宽吞吐</div>
                <div className="text-lg font-bold text-yellow-400">{systemStats.bandwidth} TB/s</div>
                <div className="text-xs text-yellow-600">WARNING -5%</div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧系统信息 */}
        <div className="w-80 bg-black/30 p-4">
          {/* 硬件状态 */}
          <div className="mb-6">
            <h2 className="text-green-400 font-bold mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              硬件实时诊断
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-green-600">处理单元 (CPU)</span>
                <span className="text-green-400">Cognitive-Logic 8-Core Pro</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-600">内存类型 (RAM)</span>
                <span className="text-green-400">Quantum-Bio RAM 128GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-600">冷却系统 (COOLING)</span>
                <span className="text-green-400">Liquid Shadow Sub-Zero</span>
              </div>
            </div>
          </div>

          {/* 核心引擎状态 */}
          <div className="mb-6">
            <h2 className="text-green-400 font-bold mb-4 flex items-center gap-2">
              <Server className="w-4 h-4" />
              核心引擎状态
            </h2>
            
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {systemLogs.map((log, index) => (
                <div key={index} className="flex gap-2">
                  <span className="text-green-700 min-w-[80px]">{log.time}</span>
                  <span className="text-green-400">{log.message}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 系统信息 */}
          <div>
            <h2 className="text-green-400 font-bold mb-4 flex items-center gap-2">
              <Database className="w-4 h-4" />
              系统信息
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-green-600">系统健康度</span>
                <span className="text-green-400">良好 (NORMAL)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-600">运行时间</span>
                <span className="text-green-400">{systemUptime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-600">身份验证</span>
                <span className="text-green-400">ALPHA-09</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-600">加密方式</span>
                <span className="text-green-400">AES-256-QUANTUM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-600">连接状态</span>
                <span className="text-green-400">SECURE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalPage;