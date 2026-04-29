import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, Mail, MapPin, 
  GraduationCap, ExternalLink, ChevronRight,
  TrendingUp, Award, Brain, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';

void motion;

const StudentDirectory = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data } = await api.get('/users');
        // Filter for students only (though backend also does this for recruiters)
        setStudents(data.filter(u => u.role === 'student'));
      } catch (err) {
        console.error('Failed to fetch students', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.collegeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.skills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 size={40} className="text-slate-900 animate-spin mb-4" />
        <Loader2 size={40} className="text-slate-900 animate-spin mb-4" />
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Talent Directory...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-8">
      
      {/* ── HEADER ── */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-3">
             <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-xl">
               <Users size={24} />
             </div>
             Talent Directory
          </h1>
          <p className="text-slate-500 font-bold mt-2 italic">Browse and evaluate top students for your internships.</p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="bg-emerald-50 text-emerald-600 px-6 py-3 rounded-2xl border border-emerald-100 flex items-center gap-2 shadow-sm">
             <TrendingUp size={16} />
             <span className="text-xs font-black uppercase tracking-widest">{students.length} Students</span>
           </div>
        </div>
      </section>

      {/* ── SEARCH & FILTERS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 relative group">
          <Search className="absolute left-5 top-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, college, or skills (e.g. React, Python)..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input !pl-14 !py-5 !bg-white/50 backdrop-blur-sm border-slate-200 !text-sm !font-bold focus:ring-8 focus:ring-slate-900/5 transition-all"
          />
        </div>
        <button className="btn bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-900 hover:text-white !py-4 transition-all flex items-center justify-center gap-3">
          <Filter size={18} />
          <span className="text-xs font-black uppercase tracking-widest">Filters</span>
        </button>
      </div>

      {/* ── TALENT GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredStudents.map((student, index) => (
            <motion.div 
              key={student._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card !p-0 overflow-hidden group hover:shadow-floating transition-all border-none relative"
            >
              {/* Profile Card Header */}
              <div className="h-24 bg-slate-900 relative">
                 <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black text-white uppercase tracking-widest border border-white/20">
                    ID: #{student._id.slice(-4)}
                 </div>
              </div>
              
              <div className="px-8 pb-8 -mt-12 text-center relative z-10">
                <div className="w-24 h-24 mx-auto rounded-[2rem] bg-white p-1.5 shadow-xl group-hover:scale-105 transition-transform overflow-hidden mb-4 border border-slate-100">
                  {student.avatar ? (
                    <img src={student.avatar} className="w-full h-full rounded-[1.8rem] object-cover" />
                  ) : (
                    <div className="w-full h-full rounded-[1.8rem] bg-slate-900 flex items-center justify-center text-3xl font-black text-white uppercase">
                      {student.name.charAt(0)}
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-black text-slate-900 leading-tight mb-1">{student.name}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-4 truncate italic">
                  {student.bio || 'Aspiring Professional'}
                </p>

                <div className="flex flex-col gap-2 mb-6">
                   <div className="flex items-center justify-center gap-2 text-slate-600 text-xs font-bold">
                      <GraduationCap size={14} className="text-blue-600" />
                      <span className="truncate">{student.collegeName || 'Not Specified'}</span>
                   </div>
                   <div className="flex items-center justify-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                      <MapPin size={10} />
                      <span>{student.location || 'Not Specified'}</span>
                   </div>
                </div>

                {/* Skills Preview */}
                <div className="flex flex-wrap justify-center gap-1.5 mb-8 min-h-[50px]">
                   {student.skills?.slice(0, 3).map((skill, i) => (
                     <span key={i} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black text-slate-700 uppercase tracking-tighter">
                       {skill}
                     </span>
                   ))}
                   {student.skills?.length > 3 && (
                     <span className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[8px] font-black text-slate-400 uppercase">
                       +{student.skills.length - 3} More
                     </span>
                   )}
                </div>

                <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                  <div className="text-center border-r border-slate-50">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">CGPA</p>
                    <p className="text-sm font-black text-slate-900">{student.cgpa || '8.5'}</p>
                  </div>
                  <button 
                    onClick={() => navigate(`/profile/${student._id}`)}
                    className="flex items-center justify-center gap-1.5 text-blue-600 hover:text-blue-800 transition-colors group/link"
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest">Profile</span>
                    <ChevronRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
           <Search size={48} className="mx-auto text-slate-200 mb-4" />
           <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">No talent matches your search</p>
        </div>
      )}

    </div>
  );
};

export default StudentDirectory;
