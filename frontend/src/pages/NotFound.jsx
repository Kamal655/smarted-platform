import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-fade-in">
      <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center shadow-xl shadow-rose-500/10">
        <AlertTriangle size={48} />
      </div>
      <div className="space-y-2">
        <h2 className="text-4xl font-black text-slate-900">404 - Terminal Failure</h2>
        <p className="text-slate-500 font-medium">The requested node does not exist in our infrastructure.</p>
      </div>
      <Link to="/" className="btn btn-primary px-8 rounded-2xl group">
        <Home size={20} className="group-hover:-translate-y-1 transition-transform" />
        Return to Safe Zone
      </Link>
    </div>
  );
};

export default NotFound;
