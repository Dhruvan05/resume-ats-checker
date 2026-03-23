import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Layout({ children }) {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative overflow-hidden">
      {/* Absolute Background Elements for depth */}
      <div className="absolute inset-0 bg-grid-pattern [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none -z-10" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-200/50 rounded-full blur-3xl pointer-events-none -z-10 animate-float" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-indigo-200/50 rounded-full blur-3xl pointer-events-none -z-10 animate-float" style={{ animationDelay: '2s' }} />

      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full ${
        isScrolled 
          ? 'bg-white/60 backdrop-blur-xl border-b border-slate-200/50 shadow-sm py-3' 
          : 'bg-white border-b border-slate-200 py-4'
      }`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link to="/" className="font-heading font-extrabold text-2xl text-slate-900 flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-3xl filter drop-shadow-md">✨</span> 
            Resume<span className="text-gradient">AI</span>
          </Link>
          <nav className="flex gap-6">
            <Link to="/" className={`font-medium transition-colors ${location.pathname === '/' ? 'text-violet-600' : 'text-slate-500 hover:text-slate-900'}`}>Upload</Link>
            <Link to="/dashboard" className={`font-medium transition-colors ${location.pathname === '/dashboard' ? 'text-violet-600' : 'text-slate-500 hover:text-slate-900'}`}>Dashboard</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-10 pt-24 pb-10 z-0">
        <div>
          {children}
        </div>
      </main>

      <footer className="py-8 text-center text-slate-400 text-sm mt-auto z-0 font-medium tracking-wide">
        &copy; {new Date().getFullYear()} ResumeAI ATS Platform. Designed for excellence.
      </footer>
    </div>
  )
}
