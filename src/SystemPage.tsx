import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Volume2, VolumeX, Zap, Database, Shield, Globe, RefreshCw, Save, X, Check, Server } from 'lucide-react';

interface SystemPageProps {
  onNavigate: (view: string) => void;
  playSound: (type: 'click' | 'hover' | 'success' | 'error' | 'boot' | 'login' | 'button') => void;
}

const SystemPage: React.FC<SystemPageProps> = ({ onNavigate, playSound }) => {
  // 系统设置状态
  const [settings, setSettings] = useState({
    audio: {
      enabled: true,
      volume: 70,
      bgMusic: true
    },
    interface: {
      theme: 'dark',
      animations: true,
      cursor: true
    },
    security: {
      purgeEnabled: true,
      autoLogout: true,
      sessionTimeout: 30 // 分钟
    },
    system: {
      autoSave: true,
      notifications: true,
      language: 'zh-CN'
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 更新设置
  const updateSetting = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
  };

  // 保存设置
  const handleSave = () => {
    playSound('button');
    setIsSaving(true);
    
    // 模拟保存过程
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      playSound('success');
      
      // 3秒后隐藏成功提示
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1500);
  };

  // 重置设置
  const handleReset = () => {
    playSound('button');
    setSettings({
      audio: {
        enabled: true,
        volume: 70,
        bgMusic: true
      },
      interface: {
        theme: 'dark',
        animations: true,
        cursor: true
      },
      security: {
        purgeEnabled: true,
        autoLogout: true,
        sessionTimeout: 30
      },
      system: {
        autoSave: true,
        notifications: true,
        language: 'zh-CN'
      }
    });
  };

  return (
    <div className="w-full h-full bg-gradient-to-b from-[#121110] via-[#0a0a0a] to-[#121110] text-slate-200 p-6">
      {/* 顶部导航 */}
      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-terminal-gold/20 rounded-full flex items-center justify-center">
            <Zap className="w-6 h-6 text-terminal-gold" />
          </div>
          <h1 className="text-2xl font-bold text-terminal-gold">系统配置中心</h1>
        </div>
        <button
          onClick={() => {
            playSound('button');
            onNavigate('search');
          }}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-sm transition-colors border border-white/10"
        >
          <X className="w-4 h-4" />
          <span>关闭</span>
        </button>
      </div>

      {/* 保存成功提示 */}
      {saveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-6 right-6 bg-green-900/80 backdrop-blur-sm border border-green-500/30 px-4 py-2 rounded-sm flex items-center gap-2 z-50"
        >
          <Check className="w-4 h-4 text-green-400" />
          <span className="text-green-400 text-sm">设置已保存</span>
        </motion.div>
      )}

      {/* 设置面板 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 音频设置 */}
        <div className="bg-white/5 border border-white/10 rounded-sm p-6 hover:border-terminal-gold/50 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <Volume2 className="w-5 h-5 text-terminal-gold" />
            <h2 className="text-lg font-semibold">音频设置</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">音效启用</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.audio.enabled}
                  onChange={(e) => updateSetting('audio', 'enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-terminal-gold"></div>
              </label>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">音量</span>
                <span className="text-sm text-terminal-gold">{settings.audio.volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.audio.volume}
                onChange={(e) => updateSetting('audio', 'volume', parseInt(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-terminal-gold"
              />
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">背景音乐</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.audio.bgMusic}
                  onChange={(e) => updateSetting('audio', 'bgMusic', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-terminal-gold"></div>
              </label>
            </div>
          </div>
        </div>

        {/* 界面设置 */}
        <div className="bg-white/5 border border-white/10 rounded-sm p-6 hover:border-terminal-gold/50 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-terminal-gold" />
            <h2 className="text-lg font-semibold">界面设置</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">主题</span>
              <select
                value={settings.interface.theme}
                onChange={(e) => updateSetting('interface', 'theme', e.target.value)}
                className="bg-white/5 border border-white/10 rounded-sm px-3 py-1 text-sm focus:outline-none focus:border-terminal-gold"
              >
                <option value="dark">深色模式</option>
              </select>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">动画效果</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.interface.animations}
                  onChange={(e) => updateSetting('interface', 'animations', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-terminal-gold"></div>
              </label>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">自定义光标</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.interface.cursor}
                  onChange={(e) => updateSetting('interface', 'cursor', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-terminal-gold"></div>
              </label>
            </div>
          </div>
        </div>

        {/* 安全设置 */}
        <div className="bg-white/5 border border-white/10 rounded-sm p-6 hover:border-terminal-gold/50 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-terminal-gold" />
            <h2 className="text-lg font-semibold">安全设置</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">清除功能</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.security.purgeEnabled}
                  onChange={(e) => updateSetting('security', 'purgeEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-terminal-gold"></div>
              </label>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">自动登出</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.security.autoLogout}
                  onChange={(e) => updateSetting('security', 'autoLogout', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-terminal-gold"></div>
              </label>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">会话超时</span>
                <span className="text-sm text-terminal-gold">{settings.security.sessionTimeout}分钟</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                value={settings.security.sessionTimeout}
                onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-terminal-gold"
              />
            </div>
          </div>
        </div>

        {/* 系统设置 */}
        <div className="bg-white/5 border border-white/10 rounded-sm p-6 hover:border-terminal-gold/50 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-terminal-gold" />
            <h2 className="text-lg font-semibold">系统设置</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">自动保存</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.system.autoSave}
                  onChange={(e) => updateSetting('system', 'autoSave', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-terminal-gold"></div>
              </label>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">通知</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.system.notifications}
                  onChange={(e) => updateSetting('system', 'notifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-terminal-gold"></div>
              </label>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">语言</span>
              <select
                value={settings.system.language}
                onChange={(e) => updateSetting('system', 'language', e.target.value)}
                className="bg-white/5 border border-white/10 rounded-sm px-3 py-1 text-sm focus:outline-none focus:border-terminal-gold"
              >
                <option value="zh-CN">中文</option>
                <option value="en-US">English</option>
              </select>
            </div>
          </div>
        </div>

        {/* 系统状态 */}
        <div className="bg-white/5 border border-white/10 rounded-sm p-6 hover:border-terminal-gold/50 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <RefreshCw className="w-5 h-5 text-terminal-gold" />
            <h2 className="text-lg font-semibold">系统状态</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">系统版本</span>
              <span className="text-sm font-mono">v1.0.0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">上次更新</span>
              <span className="text-sm font-mono">2026-03-02</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">连接状态</span>
              <span className="text-sm text-green-400">在线</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">存储空间</span>
              <span className="text-sm font-mono">75% 可用</span>
            </div>
          </div>
        </div>

        {/* 操作面板 */}
        <div className="bg-white/5 border border-white/10 rounded-sm p-6 hover:border-terminal-gold/50 transition-colors flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-terminal-gold" />
            <h2 className="text-lg font-semibold">操作面板</h2>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => {
                playSound('button');
                onNavigate('system-terminal');
              }}
              className="w-full px-4 py-2 bg-white/5 hover:bg-white/10 rounded-sm transition-colors border border-white/10 flex items-center justify-center gap-2"
            >
              <Server className="w-4 h-4" />
              <span>系统终端</span>
            </button>
            
            <button
              onClick={() => {
                playSound('button');
                if (confirm('确定要重启系统吗？')) {
                  // 模拟系统重启
                  alert('系统正在重启...');
                }
              }}
              className="w-full px-4 py-2 bg-white/5 hover:bg-white/10 rounded-sm transition-colors border border-white/10 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>重启系统</span>
            </button>
            
            <button
              onClick={handleReset}
              className="w-full px-4 py-2 bg-white/5 hover:bg-white/10 rounded-sm transition-colors border border-white/10 flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              <span>重置设置</span>
            </button>
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full px-4 py-2 bg-terminal-gold/20 hover:bg-terminal-gold/30 rounded-sm transition-colors border border-terminal-gold/50 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{isSaving ? '保存中...' : '保存设置'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemPage;