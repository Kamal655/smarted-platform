import React, { useState } from 'react';
import {
  MessageSquare,
  HelpCircle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Brain,
  ShieldCheck,
  Zap
} from 'lucide-react';

const AIInterviewPrep = ({ data, loading }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  if (loading) {
    return (
      <div className="glass-card animate-pulse space-y-4 !p-10">
        <div className="h-6 bg-slate-100 rounded-lg w-1/4" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-slate-50 rounded-2xl w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) return null;

  return (
    <div className="glass-card !p-8 border-l-8 border-l-blue-600 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
            <MessageSquare size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 leading-tight">AI Interview Prep</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Tailored Questions · Targeted Tips</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl text-blue-600 text-xs font-black">
          <ShieldCheck size={14} /> 5 Custom Questions
        </div>
      </div>

      <div className="space-y-4">
        {data.map((item, i) => (
          <div
            key={i}
            className={`rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden
              ${expandedIndex === i ? 'bg-white border-blue-200 shadow-xl' : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-blue-100'}`}
            onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
          >
            <div className="p-5 flex items-start gap-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5
                ${item.type === 'Technical' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                <HelpCircle size={18} />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full
                    ${item.type === 'Technical' ? 'bg-indigo-50 text-indigo-500' : 'bg-emerald-50 text-emerald-500'}`}>
                    {item.type}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-800 leading-relaxed group-hover:text-blue-600">
                  {item.question}
                </h3>
              </div>

              <div className="text-slate-400">
                {expandedIndex === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>

            {expandedIndex === i && (
              <div className="px-5 pb-5 pt-0 animate-fade-in">
                <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3 border border-blue-100">
                  <Lightbulb size={18} className="text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">AI Coaching Tip</p>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">{item.tip}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-[10px] text-slate-400 font-bold italic flex items-center justify-center gap-2">
          <Zap size={12} className="text-yellow-500" /> These questions are generated in real-time by analyzing your profile against the job description.
        </p>
      </div>
    </div>
  );
};

export default AIInterviewPrep;
