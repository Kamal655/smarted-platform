import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, Mail, MapPin, GraduationCap, Award, Briefcase, Globe,
  Github, Linkedin, CheckCircle2, Brain,
  Phone, Calendar, Heart, Languages, Loader2, ArrowLeft, TrendingUp
} from 'lucide-react';
import api from '../api/axiosConfig';

void motion;

const PublicProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get(`/users/${id}`);
        setProfileData(data);
      } catch (err) {
        console.error('Failed to fetch detailed profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 size={40} className="text-slate-900 animate-spin mb-4" />
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Profile...</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="text-center py-20">
        <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Profile Not Found</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 font-bold uppercase text-[10px]">Go Back</button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto pb-20 space-y-10">

      {/* ── BACK ACTION ── */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-widest">Back to Directory</span>
      </button>

      {/* ── HEADER ── */}
      <section className="glass-card !p-0 overflow-hidden relative shadow-2xl border-none">
        <div className="h-48 bg-blue-600 bg-opacity-90" />
        <div className="px-10 pb-10 -mt-16 relative z-10 flex flex-col md:flex-row items-end gap-10">
          <div className="w-40 h-40 rounded-[2.5rem] bg-white p-2 shadow-floating relative overflow-hidden border-2 border-slate-100">
            {profileData.avatar ? (
              <img src={profileData.avatar} className="w-full h-full rounded-[2.2rem] object-cover" />
            ) : (
              <div className="w-full h-full rounded-[2.2rem] bg-blue-50 flex items-center justify-center text-6xl font-black text-blue-200 uppercase">
                {profileData.name?.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1 pb-2">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">{profileData.name}</h1>
              <span className="badge badge-accepted !text-[10px] shadow-sm uppercase">{profileData.role}</span>
            </div>
            <p className="text-slate-500 font-bold italic mt-2 text-base">{profileData.bio || 'Professional Candidate'}</p>
          </div>
          <div className="flex gap-3 mb-2">
            <div className="px-6 py-3 bg-blue-50 border border-blue-100 rounded-2xl text-blue-600 flex items-center gap-2 shadow-sm">
              <TrendingUp size={16} />
              <span className="text-[10px] font-black uppercase tracking-tighter">Verified</span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* ── LEFT COLUMN ── */}
        <div className="space-y-10">
          <motion.div className="glass-card space-y-8 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-4">Personal Details</h3>
            <div className="space-y-6">
              {[
                { icon: Mail, label: 'Email Address', value: profileData.email },
                { icon: Phone, label: 'Phone Number', value: profileData.phone },
                { icon: Calendar, label: 'Date of Birth', value: profileData.dob },
                { icon: User, label: 'Gender', value: profileData.gender },
                { icon: MapPin, label: 'Location', value: profileData.location }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm shrink-0"><item.icon size={18} /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1.5">{item.label}</p>
                    <p className="text-sm font-bold text-slate-700">{item.value || 'Not Specified'}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div className="glass-card space-y-8 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-4">Social Links</h3>
            <div className="space-y-5">
              {[{ id: 'github', icon: Github, label: 'GitHub' }, { id: 'linkedin', icon: Linkedin, label: 'LinkedIn' }, { id: 'portfolio', icon: Globe, label: 'Portfolio' }].map(net => (
                <div key={net.id} className="flex items-center gap-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${profileData[net.id] ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-slate-50 text-slate-300'}`}><net.icon size={18} /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">{net.label}</p>
                    {profileData[net.id] ? (
                      <span className="text-xs font-black text-slate-700 truncate block">{profileData[net.id].replace(/(^\w+:|^)\/\//, '')}</span>
                    ) : (
                      <span className="text-xs font-medium text-slate-400 italic">Not Specified</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="lg:col-span-2 space-y-10">

          {/* Academic Details - Crucial for exploring role suitability */}
          <motion.div className="glass-card space-y-10 shadow-sm">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2"><GraduationCap className="text-blue-600" size={24} /> Academic History</h3>
              <CheckCircle2 size={24} className="text-emerald-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[{ l: 'College Name', v: profileData.collegeName }, { l: 'Degree', v: profileData.degree }, { l: 'Branch', v: profileData.branch }, { l: 'Graduation Year', v: profileData.graduationYear }, { l: 'CGPA / Status', v: profileData.cgpa }].map((acc, i) => (
                <div key={i} className="space-y-1.5">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{acc.l}</p>
                  <p className="font-bold text-slate-800 text-sm">{acc.v || 'Not Specified'}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div className="glass-card space-y-12 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter border-b border-slate-100 pb-5 flex items-center gap-3"><Brain className="text-indigo-600" size={24} /> Technical Capability</h3>
            <div className="space-y-12">

              {/* Skills Area */}
              <div className="flex gap-8">
                <div className="flex-1">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-5">Primary Tech Stack</h4>
                  <div className="flex flex-wrap gap-2.5">
                    {profileData.skills?.length > 0 ? profileData.skills.map((v, j) => <span key={j} className="px-5 py-2.5 bg-white border border-slate-100 rounded-2xl text-[10px] font-black text-slate-700 uppercase tracking-widest shadow-sm">{v}</span>) : <p className="text-xs text-slate-400 italic">No skills documented</p>}
                  </div>
                </div>
              </div>

              {/* Experience Area */}
              <div className="flex gap-8 pt-8 border-t border-slate-50">
                <div className="flex-1">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-5">Professional Background</h4>
                  <div className="space-y-4">
                    {profileData.experience?.length > 0 ? profileData.experience.map((exp, i) => (
                      <div key={i} className="p-6 border border-slate-100 rounded-[2rem] bg-white hover:bg-blue-50 transition-colors shadow-sm">
                        <p className="text-sm font-black text-slate-900 uppercase">{exp.role}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{exp.company} • {exp.duration}</p>
                        {exp.description && <p className="mt-3 text-[11px] text-slate-500 font-medium leading-relaxed">{exp.description}</p>}
                      </div>
                    )) : (
                      <p className="text-xs text-slate-400 italic">No professional history documented yet</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default PublicProfile;
