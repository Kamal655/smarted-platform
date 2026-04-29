import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import {
  FileText,
  MapPin,
  Banknote,
  Building2,
  Clock,
  ChevronRight,
  Search,
  AlertCircle,
  Zap,
  Briefcase
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const { data } = await api.get('/applications/my-applications');
        setApplications(data);
      } catch (error) {
        console.error('Failed to fetch applications', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Accepted': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Rejected': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-cyan-50 text-cyan-700 border-cyan-200';
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="w-10 h-10 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Applications...</span>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-fade-in">
        <div>
          <h2 className="text-3xl font-black text-slate-900 leading-tight tracking-tighter uppercase">My Applications</h2>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Track the status of your internship applications.</p>
        </div>
        <div className="bg-white border border-slate-100 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-sm group">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <Briefcase size={16} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total</p>
            <p className="text-lg font-black text-slate-900 leading-none">{applications.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {applications.length > 0 ? (
          applications.map(app => (
            <div key={app._id} className="bg-white p-6 rounded-3xl border border-slate-100 group hover:border-blue-200 transition-all hover:shadow-xl shadow-sm">
              <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                <div className="flex gap-6 items-center">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                    <FileText size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase">{app.internship?.title}</h3>
                    <div className="flex flex-wrap gap-4 mt-2">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                        <Building2 size={14} /> {app.internship?.company}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                        <MapPin size={14} /> {app.internship?.location}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                        <Banknote size={14} /> ₹{app.internship?.stipend?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-8 border-t lg:border-none pt-4 lg:pt-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Applied on</p>
                    <p className="text-sm font-bold text-slate-700">{new Date(app.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className={`px-4 py-1.5 rounded-lg border font-black uppercase tracking-widest text-[10px] ${getStatusStyle(app.status)} shadow-sm`}>
                    {app.status}
                  </div>
                  <Link to={`/internships/${app.internship?._id}`} className="text-slate-400 hover:text-blue-600 transition-colors">
                    <ChevronRight size={24} />
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <AlertCircle size={48} className="mx-auto text-slate-200 mb-6" />
            <h3 className="text-xl font-black text-slate-900 uppercase mb-2">No Applications Found</h3>
            <p className="text-sm text-slate-500 mb-8">
              Explore the SmartED internship network to start your journey.
            </p>
            <Link to="/internships" className="btn btn-primary !py-4 !px-10 rounded-2xl">
               Discover Roles
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
