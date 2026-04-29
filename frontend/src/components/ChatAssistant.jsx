import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  Send, 
  X, 
  Minimize2, 
  Bot, 
  User, 
  Loader2, 
  Sparkles,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import api from '../api/axiosConfig';

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your SmartED AI Assistant. Need help with internships or resume tips?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const { data } = await api.post('/chat', { 
        message: userMessage.content,
        history: messages.slice(1) // skip the initial greeting
      });

      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having a bit of trouble connecting to my brain! Please try again in a moment." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const SuggestionChip = ({ text }) => (
    <button 
      onClick={() => {
        setMessage(text);
        // We trigger the effect manually since state update is async
        setTimeout(() => document.getElementById('chat-submit').click(), 50);
      }}
      className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[11px] font-bold border border-blue-100 hover:bg-blue-600 hover:text-white transition-all flex items-center gap-1 group"
    >
      {text}
      <ChevronRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
    </button>
  );

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 pt-6 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <Bot size={22} className="text-white" />
              </div>
              <div>
                <h3 className="font-black text-sm tracking-tight leading-none uppercase">SmartED AI</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-sm shadow-emerald-400/50"></span>
                  <span className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">Active Assistant</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <Minimize2 size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50"
          >
            {messages.map((msg, idx) => (
              <div 
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm
                    ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-slate-400'}`}>
                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={`p-3.5 rounded-2xl text-[13px] leading-relaxed shadow-sm
                    ${msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none font-medium' 
                      : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'}`}>
                    {msg.content.split('\n').map((line, i) => (
                      <p key={i} className={i > 0 ? 'mt-1.5' : ''}>
                        {line.startsWith('•') ? <span className="mr-2 inline-block">•</span> : ''}
                        {line.replace(/^•\s*/, '')}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-xl bg-white text-slate-400 flex items-center justify-center shadow-sm">
                    <Bot size={14} />
                  </div>
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-2">
                    <Loader2 size={16} className="text-blue-600 animate-spin" />
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Processing...</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Quick Suggestions */}
            {!isLoading && messages.length < 5 && (
              <div className="pt-2 flex flex-wrap gap-2">
                <SuggestionChip text="Suggest Internships" />
                <SuggestionChip text="Resume Tips" />
                <SuggestionChip text="Career Advice" />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 focus-within:border-blue-500 transition-colors">
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-slate-400 placeholder:font-medium font-medium text-slate-700"
              />
              <button 
                id="chat-submit"
                type="submit"
                disabled={isLoading || !message.trim()}
                className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center transition-all hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg shadow-blue-500/20"
              >
                <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>
            <p className="text-[10px] text-center text-slate-400 mt-3 font-bold uppercase tracking-widest flex items-center justify-center gap-1">
              <Sparkles size={10} className="text-blue-400" /> Powered by SmartED Intelligence
            </p>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group
          ${isOpen 
            ? 'bg-rose-500 text-white rotate-90' 
            : 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white'}`}
      >
        {isOpen ? (
          <X size={28} />
        ) : (
          <div className="relative">
            <MessageCircle size={28} className="group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-slate-50 rounded-full animate-bounce"></span>
          </div>
        )}
      </button>
    </div>
  );
};

export default ChatAssistant;
