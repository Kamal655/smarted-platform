import React from 'react';
import {
  Sparkles,
  Target,
  AlertTriangle,
  CheckCircle2,
  BrainCircuit,
  TrendingUp,
  Award
} from 'lucide-react';

const AICandidateSummary = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 animate-pulse space-y-3">
        <div className="h-4 bg-slate-200 rounded w-1/2" />
        <div className="h-3 bg-slate-200 rounded w-full" />
      </div>
    );
  }

  if (!data) return null;

  const getVerdictStyles = (verdict) => {
    if (verdict?.includes('Expert')) return 'bg-purple-100 text-purple-700 border-purple-200';
    if (verdict?.includes('Strong')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    return 'bg-blue-100 text-blue-700 border-blue-200';
  };

  return (
    <div className="bg-white border border-indigo-100 rounded-3xl p-5 shadow-xl shadow-indigo-500/5 animate-fade-in relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
        <BrainCircuit size={80} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-indigo-500" />
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI Suitability Analysis</h4>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${getVerdictStyles(data.verdict)}`}>
            {data.verdict}
          </span>
        </div>

        <p className="text-xs font-bold text-slate-700 leading-relaxed mb-4 italic px-2 border-l-2 border-indigo-300">
          "{data.summary}"
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h5 className="text-[9px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1">
              <Award size={10} /> Top Strengths
            </h5>
            <ul className="space-y-1">
              {data.topStrengths?.map((s, i) => (
                <li key={i} className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5">
                  <CheckCircle2 size={10} className="text-emerald-400" /> {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h5 className="text-[9px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-1">
              <AlertTriangle size={10} /> Potential Gap
            </h5>
            <p className="text-[10px] font-bold text-slate-500 flex items-start gap-1.5 leading-tight">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1 shrink-0" /> {data.potentialGap}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICandidateSummary;
