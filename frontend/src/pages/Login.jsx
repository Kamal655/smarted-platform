import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContextValue';
import { toast } from 'react-toastify';
import { Mail, Lock, LogIn, ArrowRight, Loader2, Briefcase, Eye, EyeOff, Sparkles } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success('Access Granted. Redirecting...');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Authorization failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* ── Visual Hero Side (Hidden on Mobile) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden isolate">
        {/* Abstract 3D Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/auth_hero_bg.png"
            alt="Abstract 3D Background"
            className="w-full h-full object-cover opacity-80 mix-blend-screen scale-105 animate-slow-pan transform transition-transform duration-[10000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-transparent to-transparent z-10" />
        </div>

        {/* Content */}
        <div className="relative z-20 flex flex-col justify-end p-16 h-full text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Briefcase className="text-white" size={24} />
            </div>
            <h2 className="text-3xl font-black tracking-tight uppercase text-white">SmartED <span className="text-blue-500">Internships</span></h2>
          </div>
          <h1 className="text-5xl font-black mb-6 leading-[1.1] tracking-tighter max-w-lg text-white">
            Bridging the gap between Education & Employment.
          </h1>
          <p className="text-white/60 text-lg font-medium max-w-md leading-relaxed">
            The official SmartED career portal. Join 5,000+ smart students upskilling for real-world opportunities and global IT journeys.
          </p>
        </div>
      </div>

      {/* ── Interactive Form Side ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-white to-slate-50 relative">
        <div className="w-full max-w-md animate-fade-in relative z-10">
          <div className="text-center lg:text-left mb-10">
            <div className="inline-flex lg:hidden items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl text-white shadow-2xl shadow-blue-500/40 mb-6 group hover:rotate-6 transition-transform">
              <Briefcase size={32} strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Welcome to SmartED</h1>
            <p className="text-slate-500 font-medium text-lg">Sign in to your professional internship portal.</p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl border border-white shadow-2xl shadow-slate-200/50 rounded-3xl p-8 lg:p-10 relative overflow-hidden">
            {/* Subtle glow behind form */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    className="w-full bg-slate-50 border-2 border-slate-100 text-slate-900 rounded-2xl p-4 pl-12 outline-none font-bold placeholder:text-slate-300 focus:border-blue-600 focus:bg-white shadow-inner transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Password</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Lock size={20} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border-2 border-slate-100 text-slate-900 rounded-2xl p-4 pl-12 pr-12 outline-none font-bold placeholder:text-slate-300 focus:border-blue-600 focus:bg-white shadow-inner transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between px-1 pt-2">
                <div className="flex items-center gap-2 cursor-pointer group" onClick={() => document.getElementById('remember').click()}>
                  <div className="relative flex items-center justify-center w-5 h-5">
                    <input type="checkbox" id="remember" className="peer appearance-none w-5 h-5 rounded-md border-2 border-slate-200 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer" />
                    <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                      <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                  </div>
                  <label htmlFor="remember" className="text-sm font-semibold text-slate-600 cursor-pointer group-hover:text-slate-900 transition-colors">Remember me</label>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); toast.info('Password reset is currently disabled in the local development environment.'); }}
                  className="text-sm font-black text-blue-600 hover:text-blue-700 transition-colors underline decoration-2 underline-offset-4 decoration-blue-600/30 hover:decoration-blue-600"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl text-lg font-black shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-2 mt-4"
              >
                {submitting ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center mt-8 text-slate-500 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-black hover:text-blue-700 transition-colors underline decoration-2 underline-offset-4 decoration-transparent hover:decoration-blue-600">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
