import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { toast } from 'react-toastify';
import {
  ArrowLeft,
  Send,
  Loader2,
  Terminal,
  StopCircle,
  PlayCircle,
  Award
} from 'lucide-react';

const MockInterviewTerminal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [internship, setInternship] = useState(null);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const { data } = await api.get(`/internships/${id}`);
        setInternship(data);
      } catch {
        toast.error('Failed to load internship details');
        navigate(-1);
      }
    };
    fetchInternship();
  }, [id, navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startInterview = async () => {
    setInterviewStarted(true);
    setLoading(true);
    try {
      const { data } = await api.post(`/ai/live-interview/${id}`, {
        message: "Hello, I am ready to begin the interview.",
        history: [] // empty history signifies the start
      });
      setMessages([{ role: 'assistant', content: data.content }]);
    } catch {
      toast.error('Failed to connect to the SmartED Technical Interviewer');
      setInterviewStarted(false);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    const newHistory = [...messages, { role: 'user', content: userMsg }];
    setMessages(newHistory);
    setLoading(true);

    try {
      const { data } = await api.post(`/ai/live-interview/${id}`, {
        message: userMsg,
        history: messages // pass previous messages for context
      });
      setMessages([...newHistory, { role: 'assistant', content: data.content }]);
    } catch {
      toast.error('Connection unstable. Try again.');
      setMessages([...newHistory, { role: 'assistant', content: "[SYSTEM_ERROR]: Reconnection failed. Please refresh." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!internship) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-blue-600 mb-2 flex items-center gap-2 group transition-colors uppercase font-black tracking-widest text-[10px]">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Internship
          </button>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
            <Terminal className="text-blue-600" /> AI Interview Simulator
          </h1>
          <p className="text-sm text-slate-500 mt-1">Role: <span className="text-slate-900 font-bold">{internship.title}</span></p>
        </div>
      </div>

      {/* Terminal Window */}
      <div className="flex-1 bg-slate-900 rounded-3xl p-6 overflow-y-auto flex flex-col gap-6 shadow-2xl relative border-4 border-slate-800">
        {!interviewStarted ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm z-10 p-6 text-center">
            <Award size={48} className="text-blue-500 mb-6 animate-pulse" />
            <h2 className="text-xl font-black text-white mb-4 uppercase">Start Mock Interview</h2>
            <p className="max-w-md text-slate-400 mb-8 text-sm">
              Practice your technical and communication skills with our AI interviewer. 
              The session will focus on the requirements for the {internship.title} role.
            </p>
            <button onClick={startInterview} disabled={loading} className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest flex items-center gap-2 rounded-xl transition-all shadow-lg shadow-blue-500/25">
              {loading ? <Loader2 className="animate-spin" /> : <PlayCircle />} Begin Session
            </button>
          </div>
        ) : null}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-4xl ${msg.role === 'user' ? 'ml-auto' : 'mr-auto'}`}>
            <span className={`text-[10px] uppercase font-black tracking-widest mb-1 ${msg.role === 'user' ? 'text-blue-400' : 'text-emerald-400'}`}>
              {msg.role === 'user' ? 'You' : 'AI Interviewer'}
            </span>
            <div className={`p-4 rounded-2xl text-sm md:text-base leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200'}`}>
              {msg.content.split('\n').map((line, i) => (
                <p key={i} className="mb-2 last:mb-0">{line}</p>
              ))}
            </div>
          </div>
        ))}
        {loading && interviewStarted && (
          <div className="flex flex-col items-start">
            <span className="text-[10px] uppercase font-black tracking-widest mb-1 text-emerald-400">AI is thinking...</span>
            <div className="p-4 rounded-2xl bg-slate-800 text-emerald-400 flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-150"></span>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-300"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="mt-6 flex gap-4">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading || !interviewStarted}
          placeholder={interviewStarted ? "Type your response..." : "Awaiting start..."}
          className="flex-1 bg-white border border-slate-200 p-4 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 transition-all shadow-sm"
        />
        <button
          type="submit"
          disabled={loading || !input.trim() || !interviewStarted}
          className="px-8 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 rounded-2xl transition-all uppercase tracking-widest font-black flex items-center gap-2 shadow-lg shadow-blue-500/25"
        >
          Send <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default MockInterviewTerminal;
