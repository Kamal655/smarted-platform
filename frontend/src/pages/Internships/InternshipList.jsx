import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { 
  Search, 
  MapPin, 
  Banknote, 
  Filter, 
  ChevronRight, 
  Loader2,
  Building2,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

const InternshipList = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/internships?keyword=${keyword}&location=${location}`);
      setInternships(data);
    } catch (error) {
      console.error('Failed to fetch internships', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchInternships();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <header className="text-center space-y-2 mb-12">
        <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
          Explore <span className="text-blue-600">Internships</span>
        </h2>
        <p className="text-slate-500 font-medium">
          Access exclusive opportunities at top-tier tech firms.
        </p>
      </header>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="bg-white p-4 rounded-3xl border border-slate-100 flex flex-col md:flex-row gap-4 shadow-xl shadow-slate-200/50">
        <div className="flex-[2] relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by title, role, or keywords..." 
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-500 transition-all"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <div className="flex-1 relative group">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Location (City, Remote...)" 
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-500 transition-all"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <button type="submit" className="h-14 px-10 rounded-2xl bg-blue-600 text-white font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 active:scale-95">
          Search
        </button>
      </form>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-3xl h-64 animate-pulse border border-slate-100 shadow-sm"></div>
          ))
        ) : internships.length > 0 ? (
          internships.map(job => (
            <div key={job._id} className="bg-white rounded-3xl p-6 border border-slate-100 hover:border-blue-200 transition-all shadow-sm hover:shadow-xl flex flex-col h-full group">
               <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <Building2 size={24} />
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-600 font-black text-xl">
                      ₹{job.stipend.toLocaleString()}
                    </div>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-0.5">Monthly</p>
                  </div>
               </div>
               
               <div className="flex-1">
                  <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                  <p className="text-sm font-bold text-slate-500 mb-4">{job.company}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                     <span className="px-3 py-1 bg-slate-50 rounded-lg text-xs font-bold text-slate-500 flex items-center gap-1.5">
                       <MapPin size={14} className="text-blue-500" /> {job.location}
                     </span>
                  </div>
               </div>

               <Link to={`/internships/${job._id}`} className="h-12 rounded-xl bg-slate-900 hover:bg-black text-white font-black uppercase text-xs tracking-widest flex items-center justify-center transition-all group-hover:shadow-lg">
                  View Details <ChevronRight size={16} className="ml-1" />
               </Link>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <AlertCircle size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-black text-slate-900">No Internships Found</h3>
            <p className="text-slate-400 font-medium">Try adjusting your search filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternshipList;
