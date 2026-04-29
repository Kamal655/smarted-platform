import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import {
  Bell, CheckCircle2, AlertCircle, Info,
  Trash2, ExternalLink, Loader2, Sparkles
} from 'lucide-react';

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/api/notifications');
      setNotifications(data);
    } catch {
      console.error('Failed to fetch notifications');
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Polling every 30s
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id, link) => {
    try {
      await api.put(`/api/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
      if (link) navigate(link);
      setIsOpen(false);
    } catch {
      console.error('Failed to mark as read');
    }
  };

  const handleMarkAllRead = async () => {
    setLoading(true);
    try {
      await api.put('/api/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch {
      console.error('Failed to mark all as read');
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0"><CheckCircle2 size={16} /></div>;
      case 'error': return <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0"><AlertCircle size={16} /></div>;
      case 'warning': return <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0"><Info size={16} /></div>;
      default: return <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0"><Bell size={16} /></div>;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 rounded-xl transition-all duration-300 group shadow-sm hover:shadow-md border active:scale-95
          ${isOpen ? 'bg-blue-600 text-white border-blue-600 shadow-blue-500/30' : 'bg-white text-slate-500 border-slate-100 hover:text-blue-600'}`}
      >
        <Bell size={20} className={unreadCount > 0 ? 'animate-swing' : ''} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white animate-bounce-slow">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-5 duration-300">
          <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex justify-between items-center">
            <div>
              <h3 className="text-sm font-black flex items-center gap-2">
                Notifications
                {unreadCount > 0 && <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">{unreadCount} new</span>}
              </h3>
            </div>
            <button
              onClick={handleMarkAllRead}
              disabled={loading || unreadCount === 0}
              className="text-[10px] font-bold uppercase tracking-wider bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg disabled:opacity-50 transition-colors"
            >
              {loading ? <Loader2 size={12} className="animate-spin" /> : 'Mark All Read'}
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
            {notifications.length === 0 ? (
              <div className="p-10 text-center text-slate-400">
                <Sparkles size={32} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm font-bold">All caught up!</p>
                <p className="text-xs mt-1">Check back later for updates.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleMarkAsRead(n._id, n.link)}
                  className={`p-4 border-b border-slate-50 flex gap-3 cursor-pointer transition-colors group
                    ${!n.isRead ? 'bg-blue-50/50 hover:bg-blue-50' : 'hover:bg-slate-50'}`}
                >
                  {getIcon(n.type)}
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs leading-relaxed transition-colors ${!n.isRead ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                      {n.message}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] font-medium text-slate-400">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                    </div>
                  </div>
                  {n.link && (
                    <ExternalLink size={12} className="text-slate-200 group-hover:text-blue-500 mt-1 transition-colors" />
                  )}
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">
                Real-time updates enabled
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
