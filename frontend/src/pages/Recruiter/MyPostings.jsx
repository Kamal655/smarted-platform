import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import {
  Briefcase,
  Users,
  Calendar,
  MapPin,
  Trash2,
  Edit3,
  ExternalLink,
  Search,
  ChevronRight,
  Loader2,
  Banknote
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const MyPostings = () => {
  const [postings, setPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPostings();
  }, []);

  const fetchPostings = async () => {
    try {
      const { data } = await api.get('/internships/my-postings');
      setPostings(data);
    } catch {
      toast.error('Failed to sync internship records.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this internship posting? This action cannot be undone.')) {
      try {
        await api.delete(`/internships/${id}`);
        setPostings(postings.filter(p => p._id !== id));
        toast.info('Internship posting removed successfully.');
      } catch {
        toast.error('Failed to remove posting.');
      }
    }
  };

  const filteredPostings = postings.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-10 h-10 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading Postings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 leading-tight tracking-tighter uppercase">My Postings</h2>
          <p className="text-slate-500 font-medium">Manage and track your active internship opportunities.</p>
        </div>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 focus-within:text-blue-600 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search postings..."
            className="w-full md:w-80 pl-12 pr-4 py-3 rounded-2xl bg-white border border-slate-100 outline-none text-sm focus:border-blue-600 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-8 py-4">Title</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Stipend</th>
                <th className="px-6 py-4">Posted Date</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPostings.length > 0 ? filteredPostings.map((p) => (
                <tr key={p._id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                        <Briefcase size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{p.title}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <MapPin size={14} className="text-slate-400" />
                      {p.location}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1 text-sm font-bold text-slate-900">
                      ₹{p.stipend?.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-500">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link to={`/internships/${p._id}`} className="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="View">
                        <ExternalLink size={18} />
                      </Link>
                      <button onClick={() => handleDelete(p._id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <p className="text-sm font-medium text-slate-400">No postings found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyPostings;
