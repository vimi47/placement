import { useState, useRef, useEffect } from 'react';
import {
  Bot, Send, FileText, Target, MessageSquare, Map, Sparkles, User as UserIcon,
} from 'lucide-react';
import { SectionHeader } from '@/components/ui';
import { demoChatMessages, demoAgents } from '@/data/demoData';
import type { ChatMessage } from '@/types';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText, Target, MessageSquare, Map,
};

export function CoachPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(demoChatMessages);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = {
      id: `m${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setThinking(true);

    // Simulated AI response
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `m${Date.now() + 1}`,
        role: 'assistant',
        content: "I've analyzed your request and updated your preparation plan accordingly. Based on your current progress and target role, I recommend focusing on system design fundamentals this week. Would you like me to add specific tasks to your roadmap?",
        timestamp: new Date().toISOString(),
        agent_source: 'Planning Agent',
      };
      setMessages((prev) => [...prev, aiMsg]);
      setThinking(false);
    }, 1800);
  };

  const suggestions = [
    'What should I focus on this week?',
    'How ready am I for Amazon?',
    'Suggest a 30-day interview prep plan',
    'Review my skill gaps',
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <SectionHeader
        title="AI Career Coach"
        subtitle="Your personalized AI assistant powered by 4 specialized agents"
        icon={<Bot className="w-5 h-5" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Agent sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-5 sticky top-20">
            <h3 className="section-title mb-4 text-sm">AI Agents</h3>
            <div className="space-y-3">
              {demoAgents.map((agent) => {
                const Icon = iconMap[agent.icon] || Bot;
                return (
                  <div key={agent.name} className="p-3 rounded-xl bg-ink-50/50 hover:bg-ink-50 transition-colors">
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm">
                        <Icon className="w-4 h-4 text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink-800 truncate">{agent.name}</p>
                      </div>
                      <span className={`w-2 h-2 rounded-full shrink-0 ${
                        agent.status === 'done' ? 'bg-success-500' :
                        agent.status === 'thinking' ? 'bg-warning-500 animate-pulse' :
                        agent.status === 'error' ? 'bg-error-500' : 'bg-ink-300'
                      }`} />
                    </div>
                    <p className="text-xs text-ink-400">{agent.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 pt-5 border-t border-ink-100">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-accent-500" />
                <span className="text-xs font-medium text-ink-600">How it works</span>
              </div>
              <p className="text-xs text-ink-400 leading-relaxed">
                The orchestrator routes your queries to the right agent. Each agent specializes in a domain — resume, skills, interviews, and planning.
              </p>
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div className="lg:col-span-3">
          <div className="card flex flex-col h-[calc(100vh-220px)] min-h-[500px]">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-slide-up`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-accent-400 to-accent-600 text-white'
                      : 'bg-gradient-to-br from-primary-500 to-primary-700 text-white'
                  }`}>
                    {msg.role === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`max-w-[75%] ${msg.role === 'user' ? 'items-end' : ''}`}>
                    {msg.agent_source && (
                      <span className="badge-primary text-[10px] mb-1.5">{msg.agent_source}</span>
                    )}
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-primary-600 text-white rounded-tr-md'
                        : 'bg-ink-50 text-ink-800 rounded-tl-md'
                    }`}>
                      {msg.content}
                    </div>
                    <p className={`text-[10px] text-ink-400 mt-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                      {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}

              {thinking && (
                <div className="flex gap-3 animate-fade-in">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-ink-50 px-4 py-3 rounded-2xl rounded-tl-md">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-ink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-ink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-ink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      <span className="text-xs text-ink-400 ml-2">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Suggestions */}
            {messages.length <= 3 && (
              <div className="px-6 pb-2 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    className="px-3 py-1.5 rounded-full text-xs bg-ink-50 text-ink-600 border border-ink-100 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-ink-100">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask your AI coach anything..."
                  className="input flex-1"
                  disabled={thinking}
                />
                <button onClick={handleSend} disabled={thinking || !input.trim()} className="btn-primary shrink-0">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
