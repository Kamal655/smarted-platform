import React, { useState } from 'react';
import api from '../../api/axiosConfig';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  ArrowLeft,
  Building2,
  MapPin,
  Banknote,
  FileText,
  Send,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const PostInternship = () => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    stipend: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/internships', formData);
      toast.success('Internship successfully published to the SmartED Hub!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post opportunity');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-black uppercase tracking-widest text-[10px] transition-colors group">
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>

      <div>
        <h2 className="text-3xl font-black text-slate-900 leading-tight tracking-tighter uppercase">Post an Internship</h2>
        <p className="text-slate-500 font-medium">Reach out to thousands of talented students.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Job Title</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <PlusCircle size={18} />
                </div>
                <input type="text" name="title" placeholder="e.g. Frontend Developer Intern" className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 outline-none text-sm focus:border-blue-600 transition-all" value={formData.title} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Company Name</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Building2 size={18} />
                </div>
                <input type="text" name="company" placeholder="e.g. Acme Corp" className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 outline-none text-sm focus:border-blue-600 transition-all" value={formData.company} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Location</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <MapPin size={18} />
                </div>
                <input type="text" name="location" placeholder="e.g. Remote / City" className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 outline-none text-sm focus:border-blue-600 transition-all" value={formData.location} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Monthly Stipend (₹)</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Banknote size={18} />
                </div>
                <input type="number" name="stipend" placeholder="e.g. 15000" className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 outline-none text-sm focus:border-blue-600 transition-all" value={formData.stipend} onChange={handleChange} required />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Job Description</label>
            <textarea name="description" rows="5" placeholder="Describe the role, responsibilities and requirements..." className="w-full p-5 rounded-2xl bg-slate-50 border border-slate-100 outline-none text-sm focus:border-blue-600 transition-all resize-none" value={formData.description} onChange={handleChange} required></textarea>
          </div>

          <div className="flex justify-end gap-4">
            <button type="submit" disabled={submitting} className="btn btn-primary px-10 flex items-center gap-2 uppercase text-xs font-black tracking-widest">
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <>Post Internship <Send size={16} /></>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default PostInternship;
