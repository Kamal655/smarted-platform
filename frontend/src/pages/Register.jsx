import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContextValue';
import { toast } from 'react-toastify';
import { User, Mail, Lock, UserPlus, ArrowRight, Loader2, Briefcase, GraduationCap, Building2, Eye, EyeOff, Sparkles } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { registerUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await registerUser(formData);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 flex-row-reverse">
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
            Empowering the next generation of talent.
          </h1>
          <p className="text-white/60 text-lg font-medium max-w-md leading-relaxed">
            Join thousands of students and recruiters on the official SmartED career portal. Your professional journey starts here.
          </p>
        </div>
      </div>

      {/* ── Interactive Form Side ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-50/50 via-white to-slate-50 relative">
        <div className="w-full max-w-xl animate-fade-in relative z-10">
          <div className="text-center lg:text-left mb-8">
            <div className="inline-flex lg:hidden items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl text-white shadow-2xl shadow-blue-500/40 mb-6 transition-transform hover:scale-110">
              <UserPlus size={32} strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Create Account</h1>
            <p className="text-slate-500 font-medium text-lg">Sign up to access exclusive internship opportunities.</p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl border border-white shadow-2xl shadow-slate-200/50 rounded-3xl p-8 relative overflow-hidden">
            {/* Subtle glow behind form */}
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                      <User size={20} />
                    </div>
                    <input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      className="w-full bg-slate-50 border-2 border-slate-100 text-slate-900 rounded-2xl p-4 pl-12 outline-none font-bold placeholder:text-slate-300 focus:border-blue-600 focus:bg-white shadow-inner transition-all"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                      <Mail size={20} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      className="w-full bg-slate-50 border-2 border-slate-100 text-slate-900 rounded-2xl p-4 pl-12 outline-none font-bold placeholder:text-slate-300 focus:border-blue-600 focus:bg-white shadow-inner transition-all"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">I want to</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-300 ${formData.role === 'student'
                        ? 'border-blue-600 bg-blue-50/80 shadow-lg shadow-blue-500/10'
                        : 'border-slate-100 bg-slate-50 hover:border-slate-300'
                      }`}
                    onClick={() => setFormData({ ...formData, role: 'student' })}
                  >
                    <div className={`p-3 rounded-xl transition-colors ${formData.role === 'student' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                      <GraduationCap size={24} />
                    </div>
                    <div className="text-center">
                      <p className={`font-black text-sm ${formData.role === 'student' ? 'text-blue-700' : 'text-slate-500'}`}>Find Jobs</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-300 ${formData.role === 'recruiter'
                        ? 'border-indigo-600 bg-indigo-50/80 shadow-lg shadow-indigo-500/10'
                        : 'border-slate-100 bg-slate-50 hover:border-slate-300'
                      }`}
                    onClick={() => setFormData({ ...formData, role: 'recruiter' })}
                  >
                    <div className={`p-3 rounded-xl transition-colors ${formData.role === 'recruiter' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                      <Building2 size={24} />
                    </div>
                    <div className="text-center">
                      <p className={`font-black text-sm ${formData.role === 'recruiter' ? 'text-indigo-700' : 'text-slate-500'}`}>Hire Talent</p>
                    </div>
                  </button>
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
                    name="password"
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border-2 border-slate-100 text-slate-900 rounded-2xl p-4 pl-12 pr-12 outline-none font-bold placeholder:text-slate-300 focus:border-blue-600 focus:bg-white shadow-inner transition-all"
                    value={formData.password}
                    onChange={handleChange}
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

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl text-lg font-black shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-2 mt-6"
              >
                {submitting ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center mt-8 text-slate-500 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-black hover:text-blue-700 transition-colors underline decoration-2 underline-offset-4 decoration-transparent hover:decoration-blue-600">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
