import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContextValue';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, MapPin, GraduationCap, Award, Briefcase, Globe,
  Github, Linkedin, Edit3, CheckCircle2, Brain, Upload, X, Loader2, Phone, Calendar, Heart, Languages, BookOpen, Search, Zap
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../api/axiosConfig';

void motion;

// ── KEYWORD DICTIONARIES ──
const KEYWORDS = {
  skills: [
    'React', 'JavaScript', 'Node.js', 'Python', 'Java', 'HTML', 'CSS', 'Tailwind CSS', 'TypeScript', 'Next.js',
    'Express.js', 'MongoDB', 'PostgreSQL', 'MySQL', 'Docker', 'Kubernetes', 'AWS', 'Google Cloud', 'Azure',
    'Redux', 'GraphQL', 'Firebase', 'Data Science', 'Machine Learning', 'Artificial Intelligence', 'Cyber Security',
    'Blockchain', 'Flutter', 'React Native', 'Swift', 'Kotlin', 'Go', 'PHP', 'Laravel', 'Django', 'Flask',
    'C++', 'C#', 'UI/UX Design', 'Figma', 'System Design', 'Agile', 'Git', 'GitHub', 'Jenkins', 'Terraform'
  ],
  degree: [
    'B.Tech', 'B.E', 'M.Tech', 'BCA', 'MCA', 'B.Sc', 'M.Sc', 'PhD', 'MBA', 'Diploma'
  ],
  branch: [
    'Computer Science & Engineering', 'Information Technology', 'Electronics & Communication', 'Electrical Engineering',
    'Mechanical Engineering', 'Civil Engineering', 'Data Science', 'Artificial Intelligence'
  ],
  languages: [
    'English', 'Hindi', 'Telugu', 'Tamil', 'Spanish', 'French', 'German'
  ]
};

const Profile = () => {
  const { user, updateUserContext } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);

  // Edit Modal States
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef(null);

  // Autocomplete state
  const [activeSuggestions, setActiveSuggestions] = useState({ field: null, list: [] });

  // Form State
  const [formData, setFormData] = useState({
    name: '', bio: '', location: '', github: '', linkedin: '', portfolio: '', avatar: '',
    education: '', phone: '', collegeName: '', degree: '', branch: '', graduationYear: '',
    cgpa: '', dob: '', gender: '', address: '', hobbies: '', languages: '', certifications: '', skills: '',
    experience: []
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/resume/profile');
        setProfileData(data);
      } catch {
        // ignore: profile page can work from Auth user
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '', bio: user.bio || '', location: user.location || '',
        github: user.github || '', linkedin: user.linkedin || '', portfolio: user.portfolio || '',
        avatar: user.avatar || '', education: user.education || profileData?.education || '',
        phone: user.phone || '', collegeName: user.collegeName || '', degree: user.degree || '',
        branch: user.branch || '', graduationYear: user.graduationYear || '', cgpa: user.cgpa || '',
        dob: user.dob || '', gender: user.gender || '', address: user.address || '',
        hobbies: Array.isArray(user.hobbies) ? user.hobbies.join(', ') : '',
        languages: Array.isArray(user.languages) ? user.languages.join(', ') : '',
        certifications: Array.isArray(user.certifications) ? user.certifications.join(', ') : '',
        skills: Array.isArray(user.skills) ? user.skills.join(', ') : '',
        experience: Array.isArray(user.experience) ? user.experience : []
      });
    }
  }, [user, profileData, isEditing]);

  if (!user) return null;

  // ── AUTOCOMPLETE LOGIC ──
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });

    if (!KEYWORDS[field]) {
      setActiveSuggestions({ field: null, list: [] });
      return;
    }

    let searchPart = value;
    if (field === 'skills' || field === 'languages') {
      const parts = value.split(',');
      searchPart = parts[parts.length - 1].trim();
    }

    if (searchPart.length >= 1) {
      const matches = KEYWORDS[field].filter(k =>
        k.toLowerCase().includes(searchPart.toLowerCase()) &&
        !value.toLowerCase().includes(k.toLowerCase().trim() + ',')
      ).slice(0, 6);
      setActiveSuggestions({ field, list: matches });
    } else {
      setActiveSuggestions({ field: null, list: [] });
    }
  };

  const selectSuggestion = (field, suggestion) => {
    let newValue = suggestion;
    if (field === 'skills' || field === 'languages') {
      const parts = formData[field].split(',');
      parts[parts.length - 1] = ' ' + suggestion;
      newValue = parts.join(',') + ', ';
    }
    setFormData({ ...formData, [field]: newValue });
    setActiveSuggestions({ field: null, list: [] });
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [...formData.experience, { role: '', company: '', duration: '', description: '' }]
    });
  };

  const removeExperience = (index) => {
    const newExp = [...formData.experience];
    newExp.splice(index, 1);
    setFormData({ ...formData, experience: newExp });
  };

  const handleExperienceChange = (index, field, value) => {
    const newExp = [...formData.experience];
    newExp[index][field] = value;
    setFormData({ ...formData, experience: newExp });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Avatar image must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, avatar: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleAutofillUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      toast.error('Please upload a PDF resume.');
      return;
    }
    setIsParsing(true);
    const data = new FormData();
    data.append('resume', file);
    try {
      const response = await api.post('/resume/parse-only', data);
      const {
        name, phone, bio, location, collegeName, degree, branch,
        graduationYear, skills, links, experience
      } = response.data;

      setFormData(prev => ({
        ...prev,
        name: name || prev.name,
        phone: phone || prev.phone,
        bio: bio || prev.bio,
        location: location || prev.location,
        collegeName: collegeName || prev.collegeName,
        degree: degree || prev.degree,
        branch: branch || prev.branch,
        graduationYear: graduationYear || prev.graduationYear,
        github: links?.github || prev.github,
        linkedin: links?.linkedin || prev.linkedin,
        skills: skills && skills.length > 0 ? skills.join(', ') : prev.skills,
        experience: experience && experience.length > 0 ? experience : prev.experience
      }));
      toast.success('All information auto-filled from resume!');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to parse resume. Make sure it is a text-based PDF.';
      toast.error(errorMsg);
    } finally {
      setIsParsing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const processedData = {
      ...formData,
      hobbies: formData.hobbies.split(',').map(s => s.trim()).filter(s => s !== ''),
      languages: formData.languages.split(',').map(s => s.trim()).filter(s => s !== ''),
      certifications: formData.certifications.split(',').map(s => s.trim()).filter(s => s !== ''),
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s !== '')
    };
    try {
      const { data } = await api.put('/users/profile', processedData);
      updateUserContext(data);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch {
      toast.error('Update failed');
    } finally { setIsSaving(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto pb-20 space-y-10">

      {/* ── HEADER ── */}
      <section className="glass-card !p-0 overflow-hidden relative shadow-2xl border-none">
        <div className="h-48 bg-blue-600 bg-opacity-90" />
        <div className="px-10 pb-10 -mt-16 relative z-10 flex flex-col md:flex-row items-end gap-10">
          <div className="w-40 h-40 rounded-[2.5rem] bg-white p-2 shadow-floating relative group overflow-hidden border-2 border-slate-100">
            {user.avatar ? <img src={user.avatar} className="w-full h-full rounded-[2.2rem] object-cover" /> : <div className="w-full h-full rounded-[2.2rem] bg-blue-50 flex items-center justify-center text-6xl font-black text-blue-200 uppercase">{user.name?.charAt(0)}</div>}
            <button onClick={() => setIsEditing(true)} className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity backdrop-blur-sm"><Upload size={24} /></button>
          </div>
          <div className="flex-1 pb-2">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">{user.name}</h1>
              <span className="badge badge-accepted !text-[10px] shadow-sm">{user.role}</span>
            </div>
            <p className="text-slate-500 font-bold italic mt-2 text-base">{user.bio || 'Aspiring Professional'}</p>
          </div>
          <button onClick={() => setIsEditing(true)} className="btn btn-secondary !py-3.5 !px-8 mb-2 shadow-lg active:scale-95"><Edit3 size={16} /> <span>Edit Profile</span></button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* ── LEFT COLUMN ── */}
        <div className="space-y-10">
          <motion.div className="glass-card space-y-8 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-4">Personal Details</h3>
            <div className="space-y-6">
              {[
                { icon: Mail, label: 'Email Address', value: user.email },
                { icon: Phone, label: 'Phone Number', value: user.phone },
                { icon: Calendar, label: 'Date of Birth', value: user.dob },
                { icon: User, label: 'Gender', value: user.gender },
                { icon: MapPin, label: 'Full Address', value: user.address || user.location }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm shrink-0"><item.icon size={18} /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1.5">{item.label}</p>
                    <p className="text-sm font-bold text-slate-700 leading-tight">{item.value || 'Not Specified'}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div className="glass-card space-y-8 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-4">Social Links</h3>
            <div className="space-y-5">
              {[{ id: 'github', icon: Github, label: 'GitHub Profile' }, { id: 'linkedin', icon: Linkedin, label: 'LinkedIn Profile' }, { id: 'portfolio', icon: Globe, label: 'Personal Portfolio' }].map(net => (
                <div key={net.id} className="flex items-center gap-4 group">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${user[net.id] ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-100' : 'bg-slate-50 text-slate-300'}`}><net.icon size={18} /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">{net.label}</p>
                    {user[net.id] ? (
                      <a href={user[net.id].startsWith('http') ? user[net.id] : `https://${user[net.id]}`} target="_blank" rel="noopener noreferrer" className="text-xs font-black text-slate-700 hover:text-blue-600 truncate block">
                        {user[net.id].replace(/(^\w+:|^)\/\//, '')}
                      </a>
                    ) : (
                      <span className="text-xs font-medium text-slate-400 italic">Not Linked</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div className="glass-card space-y-6 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-4">Hobbies & Interests</h3>
            <div className="flex flex-wrap gap-2">
              {user.hobbies?.length > 0 ? user.hobbies.map((hobby, i) => (
                <span key={i} className="px-4 py-1.5 bg-rose-50 border border-rose-100 rounded-full text-[10px] font-black text-rose-600 uppercase tracking-tight shadow-sm">{hobby}</span>
              )) : <p className="text-xs text-slate-400 italic">No hobbies added yet</p>}
            </div>
          </motion.div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="lg:col-span-2 space-y-10">
          {user.role === 'student' && (
            <motion.div className="glass-card space-y-10 shadow-sm">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2"><GraduationCap className="text-blue-600" size={24} /> Academic Details</h3>
                <CheckCircle2 size={24} className="text-emerald-500" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[{ l: 'College Name', v: user.collegeName }, { l: 'Degree', v: user.degree }, { l: 'Branch', v: user.branch }, { l: 'Graduation Year', v: user.graduationYear }, { l: 'CGPA / Percentage', v: user.cgpa }].map((acc, i) => (
                  <div key={i} className="space-y-1.5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{acc.l}</p>
                    <p className="font-bold text-slate-800 text-sm">{acc.v || 'Not Specified'}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div className="glass-card space-y-12 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter border-b border-slate-100 pb-5 flex items-center gap-3"><Briefcase className="text-indigo-600" size={24} /> Professional Skills</h3>
            <div className="space-y-12">

              {/* Skills Area */}
              <div className="flex gap-8">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 shadow-sm shadow-blue-500/10"><Brain size={24} /></div>
                <div className="flex-1">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-5">Technical Skills</h4>
                  <div className="flex flex-wrap gap-2.5">
                    {user.skills?.length > 0 ? user.skills.map((v, j) => <span key={j} className="px-5 py-2.5 bg-white border border-slate-100 rounded-2xl text-[10px] font-black text-slate-700 uppercase tracking-widest hover:border-slate-900 transition-all shadow-sm cursor-default">{v}</span>) : <p className="text-xs text-slate-400 italic">No skills added</p>}
                  </div>
                </div>
              </div>

              {/* Certs Area */}
              <div className="flex gap-8">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 shadow-sm shadow-amber-500/10"><Award size={24} /></div>
                <div className="flex-1">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-5">Certifications</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {user.certifications?.length > 0 ? user.certifications.map((cert, j) => (
                      <div key={j} className="flex items-center gap-3 p-4 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-white transition-all shadow-sm">
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                        <span className="text-xs font-bold text-slate-700">{cert}</span>
                      </div>
                    )) : <p className="text-xs text-slate-400 italic">No certifications added</p>}
                  </div>
                </div>
              </div>

              {/* Languages Area */}
              <div className="flex gap-8">
                <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600 shrink-0 shadow-sm shadow-violet-500/10"><Languages size={24} /></div>
                <div className="flex-1">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-5">Languages Known</h4>
                  <div className="flex flex-wrap gap-3">
                    {user.languages?.length > 0 ? user.languages.map((lang, i) => (
                      <div key={i} className="px-5 py-2.5 bg-violet-50/50 border border-violet-100 rounded-2xl text-[10px] font-black text-violet-700 uppercase tracking-widest shadow-sm">{lang}</div>
                    )) : <p className="text-xs text-slate-400 italic">No languages added</p>}
                  </div>
                </div>
              </div>

              {/* Dynamic Experience Area */}
              <div className="flex gap-8">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 shadow-sm shadow-emerald-500/10"><Briefcase size={24} /></div>
                <div className="flex-1">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-5">Work & Internship Experience</h4>
                  <div className="space-y-4">
                    {user.experience?.length > 0 ? user.experience.map((exp, i) => (
                      <div key={i} className="p-6 border border-slate-100 rounded-[2rem] bg-slate-50/50 hover:bg-white hover:shadow-floating transition-all group">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-black text-slate-900 uppercase">{exp.role}</p>
                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{exp.company} • {exp.duration}</p>
                          </div>
                          <CheckCircle2 size={16} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        {exp.description && <p className="mt-3 text-[11px] text-slate-500 font-medium leading-relaxed">{exp.description}</p>}
                      </div>
                    )) : (
                      <div className="p-8 border-2 border-dashed border-slate-200 rounded-[2rem] text-center">
                        <p className="text-xs font-bold text-slate-400">No experience history added yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── EDIT MODAL ── */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditing(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">

              <div className="px-10 py-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><Edit3 size={22} /></div>
                  <div><h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Edit Your Profile</h2><p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{user.role === 'student' ? 'Update your details and academic records' : 'Update your professional identity and contact info'}</p></div>
                </div>
                <button onClick={() => setIsEditing(false)} className="w-10 h-10 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all"><X size={20} /></button>
              </div>

              <div className="flex-1 overflow-y-auto px-10 py-10 custom-scrollbar space-y-12">

                {/* Resume Upload Section */}
                {user.role === 'student' && (
                  <div className="bg-blue-600 rounded-[1.5rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-600/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white"><Zap size={24} /></div>
                      <div><p className="text-white font-black text-lg">Auto-Fill from Resume</p><p className="text-white/60 text-[9px] font-black uppercase tracking-widest mt-0.5">Sync your profile data from a PDF</p></div>
                    </div>
                    <button type="button" disabled={isParsing} onClick={() => fileInputRef.current.click()} className="btn bg-white text-slate-900 !py-3 !px-10 shadow-lg relative z-10 hover:scale-[1.02] active:scale-95 transition-all">
                      {isParsing ? <Loader2 size={18} className="animate-spin mr-2" /> : <Upload size={18} className="mr-2" />}
                      {isParsing ? 'Processing...' : 'Upload PDF'}
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handleAutofillUpload} />
                  </div>
                )}

                <form id="profileForm" onSubmit={handleSaveProfile} className="space-y-12 pb-6">

                  {/* Step 1: Personal Information */}
                  <section className="space-y-8">
                    <h4 className="flex items-center gap-3 text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] border-l-4 border-blue-600 pl-3">01 Personal Information</h4>
                    <div className="flex flex-col md:flex-row gap-10 items-start p-8 bg-slate-50 rounded-[2rem] border border-slate-200/50">
                      <div className="flex flex-col items-center gap-4 shrink-0">
                        <div className="w-32 h-32 rounded-3xl bg-white border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative group shadow-inner">
                          {formData.avatar ? <img src={formData.avatar} className="w-full h-full object-cover" /> : <User size={40} className="text-slate-200" />}
                          <input type="file" onChange={handleAvatarChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"><Edit3 size={24} /></div>
                        </div>
                        {formData.avatar && <button type="button" onClick={() => setFormData({ ...formData, avatar: '' })} className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline">Remove Photo</button>}
                      </div>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        <div className="md:col-span-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Your Full Name</label>
                          <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="form-input !font-black !text-lg" required />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Date of Birth</label>
                          <input type="date" value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} className="form-input" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Gender</label>
                          <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })} className="form-input">
                            <option value="">Select Gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option><option value="Prefer not to say">Prefer not to say</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Short Bio / Tagline</label>
                          <input type="text" value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} className="form-input" placeholder="e.g. Web Developer / CSE Student" />
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Step 2: Contact Details */}
                  <section className="space-y-6">
                    <h4 className="flex items-center gap-3 text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] border-l-4 border-blue-600 pl-3">02 Contact & Address</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Phone Number</label><input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="form-input" placeholder="+91 ..." /></div>
                      <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Current City</label><input type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="form-input" placeholder="e.g. Hyderabad" /></div>
                      <div className="md:col-span-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Full Residential Address</label><textarea value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="form-input !h-32 resize-none" placeholder="Enter your full address here..." /></div>
                    </div>
                  </section>

                  {/* Step 3: Education */}
                  {user.role === 'student' && (
                    <section className="space-y-6">
                      <h4 className="flex items-center gap-3 text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] border-l-4 border-blue-600 pl-3">03 Educational Details</h4>
                      <div className="p-8 bg-slate-50 rounded-[2rem] space-y-8 border border-slate-200/50">
                        <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">College or University Name</label><input type="text" value={formData.collegeName} onChange={e => setFormData({ ...formData, collegeName: e.target.value })} className="form-input" placeholder="Enter your college name" /></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="relative">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Degree</label>
                            <input type="text" value={formData.degree} onChange={e => handleInputChange('degree', e.target.value)} className="form-input" placeholder="e.g. B.Tech" />
                            {activeSuggestions.field === 'degree' && activeSuggestions.list.length > 0 && <div className="absolute top-full left-0 right-0 z-20 bg-white border-2 border-slate-900 rounded-2xl shadow-2xl mt-2 overflow-hidden">{activeSuggestions.list.map(s => <button key={s} type="button" onClick={() => selectSuggestion('degree', s)} className="w-full text-left px-5 py-3 hover:bg-slate-900 hover:text-white font-black text-[10px] transition-colors uppercase">{s}</button>)}</div>}
                          </div>
                          <div className="relative">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Branch / Specialization</label>
                            <input type="text" value={formData.branch} onChange={e => handleInputChange('branch', e.target.value)} className="form-input" placeholder="e.g. Computer Science" />
                            {activeSuggestions.field === 'branch' && activeSuggestions.list.length > 0 && <div className="absolute top-full left-0 right-0 z-20 bg-white border-2 border-slate-900 rounded-2xl shadow-2xl mt-2 overflow-hidden">{activeSuggestions.list.map(s => <button key={s} type="button" onClick={() => selectSuggestion('branch', s)} className="w-full text-left px-5 py-3 hover:bg-slate-900 hover:text-white font-black text-[10px] transition-colors uppercase">{s}</button>)}</div>}
                          </div>
                          <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Graduation Year</label><input type="text" value={formData.graduationYear} onChange={e => setFormData({ ...formData, graduationYear: e.target.value })} className="form-input" placeholder="e.g. 2026" /></div>
                          <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">CGPA / Percentage</label><input type="text" value={formData.cgpa} onChange={e => setFormData({ ...formData, cgpa: e.target.value })} className="form-input" placeholder="e.g. 9.0" /></div>
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Step 4: Skills & Other */}
                  <section className="space-y-8">
                    <h4 className="flex items-center gap-3 text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] border-l-4 border-blue-600 pl-3">{user.role === 'student' ? '04' : '03'} Technical Skills & Interests</h4>
                    <div className="space-y-8">
                      <div className="relative">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-1 flex items-center gap-2"><Brain size={12} className="text-blue-500" /> My Skills <span className="text-[8px] italic opacity-60">(Type to see suggestions)</span></label>
                        <textarea value={formData.skills} onChange={e => handleInputChange('skills', e.target.value)} className={`form-input !h-40 !font-mono text-sm ${activeSuggestions.field === 'skills' && activeSuggestions.list.length > 0 ? 'border-blue-600 ring-8 ring-blue-500/5 shadow-blue-500/10' : ''}`} placeholder="React, Node.js, Python..." />
                        {activeSuggestions.field === 'skills' && activeSuggestions.list.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4 p-5 bg-blue-50/50 rounded-3xl border-2 border-blue-100 shadow-inner">
                            <p className="w-full text-[9px] font-black text-blue-400 uppercase mb-2 flex items-center gap-2"><Search size={10} /> Suggested Skills:</p>
                            {activeSuggestions.list.map(s => <button key={s} type="button" onClick={() => selectSuggestion('skills', s)} className="px-4 py-2 bg-white border-2 border-blue-200 rounded-xl text-[10px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm">+{s}</button>)}
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1 flex items-center gap-2"><Award size={12} className="text-amber-500" /> My Certifications</label><textarea value={formData.certifications} onChange={e => setFormData({ ...formData, certifications: e.target.value })} className="form-input !h-32" placeholder="List your certifications here..." /></div>
                        <div className="relative">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1 flex items-center gap-2"><Languages size={12} className="text-violet-500" /> Languages Known</label>
                          <textarea value={formData.languages} onChange={e => handleInputChange('languages', e.target.value)} className="form-input !h-32" placeholder="e.g. English, Hindi, Telugu" />
                          {activeSuggestions.field === 'languages' && activeSuggestions.list.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4 p-5 bg-violet-50/50 rounded-3xl border-2 border-violet-100 shadow-inner">
                              {activeSuggestions.list.map(s => <button key={s} type="button" onClick={() => selectSuggestion('languages', s)} className="px-4 py-2 bg-white border-2 border-violet-200 rounded-xl text-[10px] font-black text-violet-600 uppercase tracking-widest hover:bg-violet-600 hover:text-white transition-all shadow-sm">+{s}</button>)}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="pt-4 border-t border-slate-100">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1 flex items-center gap-2"><Heart size={12} className="text-rose-500" /> My Hobbies & Interests</label>
                        <input type="text" value={formData.hobbies} onChange={e => setFormData({ ...formData, hobbies: e.target.value })} className="form-input" placeholder="e.g. Cricket, Photography, Music" />
                      </div>
                    </div>
                  </section>

                  {/* Step 5: Social Profiles */}
                  <section className="space-y-6 pt-6 border-t border-slate-100">
                    <h4 className="flex items-center gap-3 text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] border-l-4 border-blue-600 pl-3">{user.role === 'student' ? '05' : '04'} Social Links</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative group">
                        <Github className="absolute left-4 top-4 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={18} />
                        <input type="url" placeholder="Your GitHub URL" value={formData.github} onChange={e => setFormData({ ...formData, github: e.target.value })} className="form-input !pl-12 !font-bold" />
                      </div>
                      <div className="relative group">
                        <Linkedin className="absolute left-4 top-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                        <input type="url" placeholder="Your LinkedIn URL" value={formData.linkedin} onChange={e => setFormData({ ...formData, linkedin: e.target.value })} className="form-input !pl-12 !font-bold" />
                      </div>
                      <div className="md:col-span-2 relative group">
                        <Globe className="absolute left-4 top-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                        <input type="url" placeholder="Your Personal Website URL" value={formData.portfolio} onChange={e => setFormData({ ...formData, portfolio: e.target.value })} className="form-input !pl-12 !font-bold" />
                      </div>
                    </div>
                  </section>

                  {/* Step 6: Work Experience Management */}
                  <section className="space-y-6 pt-6 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <h4 className="flex items-center gap-3 text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] border-l-4 border-blue-600 pl-3">{user.role === 'student' ? '06' : '05'} Work Experience History</h4>
                      <button type="button" onClick={addExperience} className="btn bg-blue-600 text-white !py-2 !px-4 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20">Add New Position</button>
                    </div>

                    <div className="space-y-6">
                      {formData.experience.map((exp, i) => (
                        <div key={i} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-200/50 space-y-6 relative group/exp">
                          <button type="button" onClick={() => removeExperience(i)} className="absolute top-6 right-6 w-8 h-8 rounded-full bg-rose-50 text-rose-500 opacity-0 group-hover/exp:opacity-100 flex items-center justify-center transition-all hover:bg-rose-500 hover:text-white"><X size={14} /></button>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Job Title / Role</label><input type="text" value={exp.role} onChange={e => handleExperienceChange(i, 'role', e.target.value)} className="form-input" placeholder="e.g. Frontend Intern" /></div>
                            <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Company Name</label><input type="text" value={exp.company} onChange={e => handleExperienceChange(i, 'company', e.target.value)} className="form-input" placeholder="Company Name" /></div>
                            <div className="md:col-span-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Duration & Period</label><input type="text" value={exp.duration} onChange={e => handleExperienceChange(i, 'duration', e.target.value)} className="form-input" placeholder="e.g. Jan 2026 - Present" /></div>
                            <div className="md:col-span-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Brief Description of Responsibilities</label><textarea value={exp.description} onChange={e => handleExperienceChange(i, 'description', e.target.value)} className="form-input !h-24" placeholder="Briefly describe what you did..." /></div>
                          </div>
                        </div>
                      ))}
                      {formData.experience.length === 0 && (
                        <div className="p-12 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-center">
                          <Briefcase className="mx-auto text-slate-200 mb-4" size={32} />
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No work experience entries added yet</p>
                        </div>
                      )}
                    </div>
                  </section>

                </form>
              </div>

              <div className="px-10 py-8 border-t border-slate-100 bg-slate-50 flex justify-end gap-5 rounded-b-[2.5rem] shrink-0">
                <button type="button" onClick={() => setIsEditing(false)} className="btn bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-100 !px-12 font-black uppercase text-[11px] tracking-widest active:scale-95 transition-all">Cancel</button>
                <button type="submit" form="profileForm" disabled={isSaving} className="btn btn-primary !px-18 shadow-xl text-[11px] font-black uppercase tracking-widest min-w-[200px]">
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : 'Save Profile Changes'}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Profile;
