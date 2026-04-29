import React from 'react';
import {
  Zap,
  Target,
  BookOpen,
  Map as MapIcon,
  ChevronRight,
  Clock,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

const AIRoadmap = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="glass-card animate-pulse space-y-6 !p-10">
        <div className="h-8 bg-slate-100 rounded-xl w-1/3" />
        <div className="h-4 bg-slate-100 rounded-lg w-full" />
        <div className="space-y-4 pt-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-4">
              <div className="w-10 h-10 bg-slate-100 rounded-full shrink-0" />
              <div className="h-20 bg-slate-50 rounded-2xl w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="glass-card !p-8 border-l-8 border-l-violet-600 animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-purple-500/20">
          <MapIcon size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 leading-tight">{data.title}</h2>
          <p className="text-sm text-slate-500 font-medium max-w-xl">{data.summary}</p>
        </div>
      </div>

      <div className="relative space-y-8">
        {/* Timeline Line */}
        <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-slate-100" />

        {data.weeks?.map((week, i) => (
          <div key={i} className="relative flex gap-6 group">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 z-10 
              transition-all duration-300 group-hover:scale-110
              ${i === 0 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white border-2 border-slate-100 text-slate-400'}`}>
              <span className="text-sm font-black">{week.week}</span>
            </div>

            <div className="bg-slate-50 rounded-3xl p-6 flex-1 border border-slate-100 group-hover:border-violet-200 group-hover:bg-white transition-all duration-300 group-hover:shadow-xl group-hover:shadow-violet-500/5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Target size={16} className="text-violet-500" />
                  {week.topic}
                </h3>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Clock size={12} /> Week {week.week}
                </span>
              </div>

              <ul className="space-y-2 mb-4">
                {week.tasks?.map((task, j) => (
                  <li key={j} className="text-xs text-slate-600 flex items-start gap-2">
                    <CheckCircle2 size={12} className="text-emerald-500 mt-0.5 shrink-0" />
                    {task}
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-200/50">
                <BookOpen size={14} className="text-blue-500" />
                <span className="text-[10px] font-bold text-slate-500 italic">Recommended: {week.resources}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 p-6 bg-gradient-to-r from-violet-50 to-indigo-50 rounded-3xl border border-violet-100 flex items-center gap-5">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-violet-600 shadow-sm shrink-0">
          <Sparkles size={24} />
        </div>
        <div>
          <p className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-1">Final Goal</p>
          <p className="text-sm font-bold text-slate-700 leading-relaxed">{data.finalGoal}</p>
        </div>
      </div>
    </div>
  );
};

export default AIRoadmap;
