import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, 
  Activity, 
  Play, 
  Terminal, 
  Heart, 
  Zap, 
  Award,
  Plus,
  Trash2,
  Save,
  Moon,
  Sun
} from 'lucide-react';
import Jackslot from './components/Jackslot';
import Dashboard from './components/Dashboard';
import { 
  FLOWER_THEMES, 
  AI_MODELS, 
  INITIAL_AGENTS, 
  FOLLOW_UP_QUESTIONS 
} from './constants';
import { 
  AppState, 
  AgentConfig, 
  ExecutionLog, 
  ApiKeys, 
  Language, 
  ThemeMode, 
  ModelProvider,
  FlowerTheme
} from './types';
import { callGemini } from './services/geminiService';
import { callOpenAI, callAnthropic, callXAI } from './services/mockService';

const App: React.FC = () => {
  // -- State --
  const [theme, setTheme] = useState<FlowerTheme>(FLOWER_THEMES[0]);
  const [mode, setMode] = useState<ThemeMode>(ThemeMode.LIGHT);
  const [lang, setLang] = useState<Language>(Language.EN);
  
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    gemini: process.env.API_KEY || '',
    openai: '',
    anthropic: '',
    xai: ''
  });

  const [agents, setAgents] = useState<AgentConfig[]>(INITIAL_AGENTS);
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  
  const [appState, setAppState] = useState<AppState>({
    health: 100,
    mana: 100,
    experience: 0,
    level: 1
  });

  const [activeTab, setActiveTab] = useState<'pipeline' | 'dashboard' | 'logs'>('pipeline');
  const [globalInput, setGlobalInput] = useState("");
  const [agentOutputs, setAgentOutputs] = useState<Record<string, string>>({});
  const [loadingAgentId, setLoadingAgentId] = useState<string | null>(null);

  // -- Effects for Theme --
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--secondary', theme.secondary);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--bg-color', mode === ThemeMode.LIGHT ? theme.bgLight : theme.bgDark);
    root.style.setProperty('--text-color', mode === ThemeMode.LIGHT ? '#1f2937' : '#f3f4f6');
    root.style.setProperty('--card-bg', mode === ThemeMode.LIGHT ? 'rgba(255, 255, 255, 0.7)' : 'rgba(17, 24, 39, 0.7)');
  }, [theme, mode]);

  // -- Helpers --
  const addLog = (type: 'info' | 'success' | 'error', message: string) => {
    setLogs(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message
    }, ...prev]);
  };

  const updateStats = (manaCost: number, xpGain: number) => {
    setAppState(prev => {
      let newMana = prev.mana - manaCost;
      let newHealth = prev.health;
      if (newMana < 0) {
        newMana = 0;
        newHealth = Math.max(0, prev.health - 10); // Penalty for exhaustion
      }
      const newXp = prev.experience + xpGain;
      const newLevel = 1 + Math.floor(newXp / 100);
      return { ...prev, mana: newMana, health: newHealth, experience: newXp, level: newLevel };
    });
  };

  const handleApiKeyChange = (provider: ModelProvider, value: string) => {
    setApiKeys(prev => ({ ...prev, [provider]: value }));
  };

  // -- Execution Logic --
  const runAgent = async (agent: AgentConfig, input: string) => {
    if (appState.mana < 10) {
      addLog('error', 'Not enough Mana to run agent! Rest needed.');
      return;
    }

    setLoadingAgentId(agent.id);
    addLog('info', `Starting agent: ${agent.name} (${agent.model})...`);
    
    const key = apiKeys[agent.provider];
    
    try {
      let result = "";
      if (agent.provider === ModelProvider.GEMINI) {
        result = await callGemini(key, agent.model, agent.systemPrompt, input, agent.maxTokens, agent.temperature);
      } else if (agent.provider === ModelProvider.OPENAI) {
        result = await callOpenAI(key, agent.model, agent.systemPrompt, input, agent.maxTokens, agent.temperature);
      } else if (agent.provider === ModelProvider.ANTHROPIC) {
        result = await callAnthropic(key, agent.model, agent.systemPrompt, input, agent.maxTokens, agent.temperature);
      } else if (agent.provider === ModelProvider.XAI) {
        result = await callXAI(key, agent.model, agent.systemPrompt, input, agent.maxTokens, agent.temperature);
      }

      setAgentOutputs(prev => ({ ...prev, [agent.id]: result }));
      addLog('success', `Agent ${agent.name} completed successfully.`);
      updateStats(15, 25); // Cost 15 mana, gain 25 XP
    } catch (err: any) {
      addLog('error', `Agent ${agent.name} failed: ${err.message}`);
      // Minimal penalty on fail
      updateStats(5, 5);
    } finally {
      setLoadingAgentId(null);
    }
  };

  // -- UI Components --

  const WowStatus = () => (
    <div className="glass-panel p-4 rounded-full flex items-center gap-6 shadow-lg mb-8 mx-auto max-w-4xl justify-between">
       <div className="flex items-center gap-2">
         <div className="relative">
           <Heart className={`w-6 h-6 ${appState.health < 30 ? 'text-red-600 animate-pulse' : 'text-red-500'}`} fill="currentColor" />
         </div>
         <div className="flex flex-col">
           <span className="text-xs font-bold opacity-70">HEALTH</span>
           <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
             <div className="h-full bg-red-500 transition-all duration-500" style={{ width: `${appState.health}%` }} />
           </div>
         </div>
       </div>

       <div className="flex items-center gap-2">
         <Zap className="w-6 h-6 text-yellow-400" fill="currentColor" />
         <div className="flex flex-col">
           <span className="text-xs font-bold opacity-70">MANA</span>
           <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
             <div className="h-full bg-yellow-400 transition-all duration-500" style={{ width: `${appState.mana}%` }} />
           </div>
         </div>
       </div>

        {/* Central Orb */}
       <div className="relative w-16 h-16 rounded-full flex items-center justify-center border-4" style={{ borderColor: theme.accent, backgroundColor: theme.primary }}>
          <div className="absolute inset-0 rounded-full animate-pulse-slow bg-white opacity-20"></div>
          <span className="text-2xl font-bold text-white relative z-10">{appState.level}</span>
          <span className="absolute -bottom-6 text-xs font-bold whitespace-nowrap" style={{color: theme.primary}}>LEVEL</span>
       </div>

       <div className="flex items-center gap-2">
         <Award className="w-6 h-6 text-purple-500" />
         <div className="flex flex-col">
           <span className="text-xs font-bold opacity-70">XP</span>
           <span className="font-mono text-sm">{appState.experience}</span>
         </div>
       </div>

       <div className="flex items-center gap-2">
          <Jackslot onThemeSelect={setTheme} currentTheme={theme} />
       </div>
    </div>
  );

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans text-theme-text transition-colors duration-500">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-theme-primary mb-1">
            {lang === Language.EN ? theme.nameEn : theme.nameZh}
          </h1>
          <p className="opacity-75 text-sm md:text-base">Agentic 510(k) Review System</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setLang(lang === Language.EN ? Language.ZH : Language.EN)}
            className="px-3 py-1 rounded border border-current text-xs font-bold hover:bg-theme-secondary hover:text-black transition"
          >
            {lang === Language.EN ? 'ZH' : 'EN'}
          </button>
          <button 
            onClick={() => setMode(mode === ThemeMode.LIGHT ? ThemeMode.DARK : ThemeMode.LIGHT)}
            className="p-2 rounded-full hover:bg-black/5 transition"
          >
            {mode === ThemeMode.LIGHT ? <Moon className="w-5 h-5"/> : <Sun className="w-5 h-5"/>}
          </button>
        </div>
      </header>

      {/* Gamification Bar */}
      <WowStatus />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sidebar / Settings */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-panel p-5 rounded-2xl">
            <div className="flex items-center gap-2 mb-4 text-theme-primary">
              <Settings className="w-5 h-5" />
              <h2 className="font-bold">API Configuration</h2>
            </div>
            
            <div className="space-y-4">
               {Object.values(ModelProvider).map((p) => {
                 const hasEnv = p === ModelProvider.GEMINI && process.env.API_KEY;
                 return (
                  <div key={p}>
                    <label className="text-xs font-semibold uppercase opacity-70 mb-1 block">{p}</label>
                    {hasEnv ? (
                      <div className="text-xs text-green-600 bg-green-100 dark:bg-green-900 px-2 py-1 rounded flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Loaded from ENV
                      </div>
                    ) : (
                      <input 
                        type="password"
                        placeholder={`Enter ${p} Key`}
                        value={apiKeys[p]}
                        onChange={(e) => handleApiKeyChange(p, e.target.value)}
                        className="w-full bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 text-sm focus:outline-none focus:border-theme-primary"
                      />
                    )}
                  </div>
                 );
               })}
            </div>
          </div>
          
          <div className="glass-panel p-5 rounded-2xl">
             <div className="flex items-center gap-2 mb-4 text-theme-primary">
              <Activity className="w-5 h-5" />
              <h2 className="font-bold">Controls</h2>
            </div>
            <div className="flex flex-col gap-2">
               <button 
                 onClick={() => setActiveTab('pipeline')}
                 className={`p-3 rounded-lg text-left transition ${activeTab === 'pipeline' ? 'bg-theme-primary text-white shadow-md' : 'hover:bg-white/10'}`}
               >
                 Agent Pipeline
               </button>
               <button 
                 onClick={() => setActiveTab('dashboard')}
                 className={`p-3 rounded-lg text-left transition ${activeTab === 'dashboard' ? 'bg-theme-primary text-white shadow-md' : 'hover:bg-white/10'}`}
               >
                 Interactive Dashboard
               </button>
               <button 
                 onClick={() => setActiveTab('logs')}
                 className={`p-3 rounded-lg text-left transition ${activeTab === 'logs' ? 'bg-theme-primary text-white shadow-md' : 'hover:bg-white/10'}`}
               >
                 Execution Logs
               </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9">
          
          {activeTab === 'dashboard' && (
            <Dashboard appState={appState} logs={logs} themeColor={theme.primary} />
          )}

          {activeTab === 'logs' && (
             <div className="glass-panel p-6 rounded-2xl min-h-[500px]">
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                  <Terminal className="w-5 h-5" /> System Logs
                </h3>
                <div className="space-y-2 font-mono text-sm max-h-[600px] overflow-y-auto">
                  {logs.length === 0 && <span className="opacity-50">No logs yet.</span>}
                  {logs.map(log => (
                    <div key={log.id} className="border-b border-gray-100 dark:border-gray-800 pb-2">
                      <span className="opacity-50 mr-3">[{log.timestamp}]</span>
                      <span className={`${
                        log.type === 'success' ? 'text-green-500' :
                        log.type === 'error' ? 'text-red-500' : 'text-blue-500'
                      } font-bold mr-2 uppercase text-xs`}>{log.type}</span>
                      <span>{log.message}</span>
                    </div>
                  ))}
                </div>
             </div>
          )}

          {activeTab === 'pipeline' && (
            <div className="space-y-8">
              {/* Global Input */}
              <div className="glass-panel p-6 rounded-2xl border-l-4" style={{borderLeftColor: theme.primary}}>
                <label className="block font-bold text-lg mb-2">Initial Case Context (Global Input)</label>
                <textarea 
                  className="w-full h-32 p-3 rounded-lg bg-white/40 dark:bg-black/20 focus:ring-2 focus:ring-theme-primary focus:outline-none resize-y"
                  placeholder="Describe the medical device, indication for use, and testing summary..."
                  value={globalInput}
                  onChange={(e) => setGlobalInput(e.target.value)}
                />
              </div>

              {/* Agents List */}
              {agents.map((agent, index) => {
                 const prevAgent = index > 0 ? agents[index - 1] : null;
                 const defaultInput = index === 0 ? globalInput : (agentOutputs[prevAgent?.id || ''] || '');
                 
                 return (
                  <div key={agent.id} className="glass-panel p-6 rounded-2xl relative overflow-hidden transition-all hover:shadow-xl">
                    <div className="absolute top-0 left-0 w-full h-1" style={{background: `linear-gradient(to right, ${theme.primary}, ${theme.accent})`}}></div>
                    
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-sm" style={{backgroundColor: theme.primary}}>
                           {index + 1}
                         </div>
                         <div>
                           <h3 className="font-bold text-lg">{agent.name}</h3>
                           <p className="text-xs opacity-70">{agent.description}</p>
                         </div>
                      </div>
                      <div className="flex gap-2">
                        {/* Config Toggles */}
                        <select 
                          className="text-xs p-1 rounded bg-white/50 dark:bg-black/30 border-none"
                          value={agent.model}
                          onChange={(e) => {
                             const newAgents = [...agents];
                             newAgents[index].model = e.target.value;
                             setAgents(newAgents);
                          }}
                        >
                           {AI_MODELS[agent.provider]?.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                         <input 
                           type="number" 
                           className="w-20 text-xs p-1 rounded bg-white/50 dark:bg-black/30"
                           value={agent.maxTokens}
                           onChange={(e) => {
                             const newAgents = [...agents];
                             newAgents[index].maxTokens = parseInt(e.target.value);
                             setAgents(newAgents);
                           }}
                         />
                      </div>
                    </div>

                    {/* Prompts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                       <div>
                         <label className="text-xs font-bold opacity-60 uppercase mb-1 block">System Prompt</label>
                         <textarea 
                           className="w-full h-24 text-xs p-2 rounded bg-black/5 dark:bg-white/5 resize-none font-mono"
                           value={agent.systemPrompt}
                           onChange={(e) => {
                             const newAgents = [...agents];
                             newAgents[index].systemPrompt = e.target.value;
                             setAgents(newAgents);
                           }}
                         />
                       </div>
                       <div>
                         <label className="text-xs font-bold opacity-60 uppercase mb-1 block">Input Data</label>
                         <textarea 
                           className="w-full h-24 text-xs p-2 rounded bg-black/5 dark:bg-white/5 resize-none font-mono"
                           value={defaultInput} // In a real app we might want state for this input too
                           readOnly
                           placeholder="Waiting for previous step..."
                         />
                       </div>
                    </div>

                    {/* Action */}
                    <div className="flex justify-end gap-2">
                       <button 
                         onClick={() => runAgent(agent, defaultInput)}
                         disabled={loadingAgentId === agent.id}
                         className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold text-white shadow-lg transform transition active:scale-95 disabled:opacity-50`}
                         style={{backgroundColor: theme.secondary, color: '#000'}}
                       >
                         {loadingAgentId === agent.id ? <span className="animate-spin">⌛</span> : <Play className="w-4 h-4" />}
                         Run Agent
                       </button>
                    </div>

                    {/* Output */}
                    {agentOutputs[agent.id] && (
                       <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-2">
                         <div className="flex justify-between items-center mb-2">
                           <h4 className="font-bold text-sm">Generated Output</h4>
                           <button className="text-xs opacity-60 hover:opacity-100 flex items-center gap-1"><Save className="w-3 h-3"/> Save</button>
                         </div>
                         <div className="bg-white/60 dark:bg-black/40 p-4 rounded-lg text-sm whitespace-pre-wrap max-h-96 overflow-y-auto font-serif leading-relaxed">
                           {agentOutputs[agent.id]}
                         </div>
                       </div>
                    )}
                  </div>
                 );
              })}
              
              {/* Follow Up Questions Section (Always visible at bottom) */}
              <div className="glass-panel p-6 rounded-2xl border-t-4 mt-8" style={{borderTopColor: theme.accent}}>
                 <h3 className="font-bold text-lg mb-4">Comprehensive Follow-up Questions</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                   {FOLLOW_UP_QUESTIONS.map((q, i) => (
                     <div key={i} className="flex items-start gap-2 text-sm opacity-80 hover:opacity-100 transition p-2 rounded hover:bg-white/10 cursor-pointer">
                        <span className="text-theme-accent font-bold">•</span>
                        {q}
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;