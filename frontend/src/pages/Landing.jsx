import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Briefcase,
  Map as MapIcon, 
  ShieldCheck, 
  ArrowRight,
  ChevronRight,
  Zap,
  CheckCircle2,
  ScanSearch,
  Wand2,
  Rocket,
  Globe,
  Cpu,
  Trophy
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

const Landing = () => {
  const navigate = useNavigate();

  const engineModules = [
    {
      icon: <Zap size={22} />,
      title: "Neural Matchmaking",
      desc: "Our proprietary AI analyzes 50+ data points to ensure every internship application is a high-probability fit.",
      accent: "from-blue-500/20 to-transparent",
      glow: "group-hover:shadow-[0_0_50px_-16px_rgba(59,130,246,0.5)]"
    },
    {
      icon: <Cpu size={22} />,
      title: "Simulation Engine",
      desc: "Real-time mock interviews powered by advanced LLMs that adapt to your performance and industry standards.",
      accent: "from-purple-500/20 to-transparent",
      glow: "group-hover:shadow-[0_0_50px_-16px_rgba(168,85,247,0.5)]"
    },
    {
      icon: <Trophy size={22} />,
      title: "Career Architect",
      desc: "Dynamic roadmaps that evolve with your skills, mapping out the shortest path to your dream IT role.",
      accent: "from-emerald-500/20 to-transparent",
      glow: "group-hover:shadow-[0_0_50px_-16px_rgba(16,185,129,0.5)]"
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30 selection:text-white overflow-x-hidden font-sans">
      <a href="#main" className="skip-link">Skip to content</a>
      
      {/* ── Atmospheric Background ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[44%] h-[44%] rounded-full bg-blue-600/[0.05] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[44%] h-[44%] rounded-full bg-indigo-600/[0.05] blur-[120px]" />
        <div className="absolute top-[20%] right-[-20%] w-[52%] h-[52%] rounded-full bg-blue-500/[0.03] blur-[140px]" />
      </div>
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMSIvPjwvc3ZnPg==')] pointer-events-none z-0" />

      {/* ── Navigation ── */}
      <nav aria-label="Primary" className="fixed top-0 w-full z-50 bg-[#020617]/80 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-3 group cursor-pointer text-left"
            aria-label="Go to SmartED Innovations home"
          >
            <div aria-hidden="true" className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)] group-hover:scale-110 transition-transform">
               <Cpu size={20} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter text-white uppercase leading-none">
                SmartED <span className="text-blue-500">Innovations</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-1">Pioneering Careers</span>
            </div>
          </button>
          <div className="flex items-center gap-8">
            <Link to="/login" className="text-xs font-black text-slate-400 hover:text-white uppercase tracking-widest transition-colors hidden sm:block">
              Portal Access
            </Link>
            <Link to="/register" className="relative group px-6 py-2.5 rounded-full overflow-hidden">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 bg-[length:200%_auto] animate-gradient opacity-90 group-hover:opacity-100 transition-opacity" />
              <span className="relative text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                Join Network <ArrowRight size={14} />
              </span>
            </Link>
          </div>
        </div>
      </nav>

      <main id="main" className="relative z-10 pt-20">
        {/* ── Hero Section ── */}
        <header className="relative pt-16 md:pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-xl mb-8 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
          >
            <Sparkles size={14} className="text-blue-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">The Future of Talent Acquisition</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-8xl lg:text-[7rem] font-black tracking-tighter leading-[0.9] mb-8 max-w-6xl text-white"
          >
            Elevating the <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Next Generation</span> <br className="hidden md:block" />
            of IT Leaders.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto font-medium mb-12 leading-relaxed"
          >
            SmartED Innovations is more than a platform—it's a launchpad. We combine AI-driven preparation with premium internship opportunities to bridge the gap between academic theory and industry reality.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full"
          >
            <Link to="/register" className="h-16 px-12 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest text-xs flex items-center justify-center hover:bg-blue-500 transition-all shadow-[0_0_30px_rgba(37,99,235,0.2)] hover:scale-105 w-full sm:w-auto">
              Start Your Journey <ArrowRight size={18} className="ml-2" />
            </Link>
            <Link to="/internships" className="h-16 px-12 rounded-2xl border border-slate-800 bg-slate-900/50 text-white font-black uppercase tracking-widest text-xs flex items-center justify-center hover:bg-slate-800 transition-all backdrop-blur-sm w-full sm:w-auto group">
              Explore Opportunities <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Quick Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl"
          >
            {[
              { label: "Partner Companies", val: "500+" },
              { label: "Successful Placements", val: "12k+" },
              { label: "AI Interview Hours", val: "45k+" },
              { label: "Student Success Rate", val: "94%" }
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
                <p className="text-3xl font-black text-white mb-1">{stat.val}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </header>

        {/* ── SmartED Core Innovation ── */}
        <section className="py-24 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-blue-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4">Why SmartED Innovations?</p>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-8">
                  Where Education Meets <span className="text-blue-500">Intelligent</span> Career Growth.
                </h2>
                <div className="space-y-6">
                  {[
                    { title: "Personalized Skill Roadmaps", desc: "Our AI maps your current skills against industry requirements to build a custom learning path." },
                    { title: "Direct Industry Pipeline", desc: "Gain exclusive access to internships at top-tier tech firms that value verified talent." },
                    { title: "Real-world Project Exposure", desc: "Don't just learn—do. Our partners provide tasks that mirror actual workplace challenges." }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="mt-1">
                        <CheckCircle2 size={24} className="text-blue-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                        <p className="text-slate-400 font-medium">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600/10 blur-[100px] rounded-full" />
                <div className="relative bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-12 overflow-hidden backdrop-blur-xl">
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                        <Globe size={24} />
                      </div>
                      <div>
                        <p className="text-white font-black uppercase tracking-widest text-sm">Innovation Network</p>
                        <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Connecting globally, impacting locally.</p>
                      </div>
                    </div>
                    <p className="text-slate-300 font-medium leading-relaxed italic">
                      "SmartED Innovations has fundamentally changed how we identify early-career talent. The students are better prepared, more aligned, and ready to contribute from day one."
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10" />
                      <div>
                        <p className="text-white font-bold text-sm uppercase">Tech Lead @ Elite Systems</p>
                        <p className="text-white/30 text-[10px] tracking-widest uppercase font-black">Global Hiring Partner</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── AI Engine Matrix ── */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-blue-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4">Core Technology</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white">Driven by Intelligent Innovation.</h2>
            </div>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {engineModules.map((feature, i) => (
                <motion.div 
                  key={i}
                  variants={itemVariants}
                  className={`relative bg-white/5 border border-white/10 p-10 rounded-[2.5rem] overflow-hidden group transition-all duration-500 hover:bg-white/10 hover:-translate-y-1 ${feature.glow}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 mb-8 group-hover:scale-110 transition-transform duration-500">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-black mb-4 tracking-tight text-white">{feature.title}</h3>
                  <p className="text-slate-400 font-medium leading-relaxed group-hover:text-slate-300 transition-colors">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Final Call to Action ── */}
        <section className="py-24 px-6 flex justify-center">
          <div className="max-w-6xl w-full bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 border-none rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-blue-600/30">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiIvPjwvc3ZnPg==')] opacity-30" />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-8 text-white">Join the SmartED <br /> Innovations Ecosystem.</h2>
              <p className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto font-medium">
                Whether you're a student looking to skyrocket your career or a recruiter seeking elite talent, your future starts here.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/register" className="h-16 px-12 rounded-2xl bg-white text-blue-600 font-black uppercase tracking-widest text-xs flex items-center justify-center hover:bg-slate-50 transition-all shadow-xl hover:scale-105">
                  Create account <ArrowRight size={18} className="ml-2" />
                </Link>
                <Link to="/login" className="h-16 px-12 rounded-2xl border-2 border-white/30 bg-white/10 text-white font-black uppercase tracking-widest text-xs flex items-center justify-center hover:bg-white/20 transition-all backdrop-blur-md">
                  Platform Login
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="py-20 border-t border-white/5 bg-[#020617] relative z-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-12">
              <div className="flex flex-col items-center md:items-start gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                    <Cpu size={20} className="text-white" />
                  </div>
                  <span className="text-lg font-black text-white uppercase tracking-tighter">
                    SmartED <span className="text-blue-600">Innovations</span>
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] text-center md:text-left">
                  Pioneering the Next Generation of IT Careers
                </p>
              </div>
              <div className="flex flex-col items-center md:items-end gap-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-1">
                  Status: <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm" /> Global Network Operational
                </p>
                <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em]">
                  © 2026 SmartED Innovations • All Systems Secured
                </p>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Landing;
