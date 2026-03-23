import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UploadCloud, 
  FileText, 
  Sparkles, 
  Target, 
  ShieldCheck, 
  Zap, 
  ChevronRight, 
  ArrowLeft,
  Briefcase,
  Search,
  AlertCircle,
  FileUp,
  Loader2
} from 'lucide-react';
import { useAnalysis } from '../context/AnalysisContext';
import { uploadResume, analyzeResume, extractText } from '../services/api';

const ROLES = [
  { id: 'sde', name: 'Software Development Engineer' },
  { id: 'frontend', name: 'Frontend Developer' },
  { id: 'backend', name: 'Backend Developer' },
  { id: 'data_engineer', name: 'Data Engineer' },
  { id: 'data_scientist', name: 'Data Scientist' },
  { id: 'product_manager', name: 'Product Manager' }
];

export default function Upload() {
  const [step, setStep] = useState(1); // 1: Upload, 2: Targeting, 3: Loading
  const [file, setFile] = useState(null);
  const [role, setRole] = useState('sde');
  const [jobDescription, setJobDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExtractingJD, setIsExtractingJD] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState(null);
  
  const fileInputRef = useRef(null);
  const jdInputRef = useRef(null);
  const navigate = useNavigate();
  const { dispatch } = useAnalysis();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.size > 10 * 1024 * 1024) {
        setError('File too large (Max 10MB)');
        return;
      }
      setFile(droppedFile);
      setError(null);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File too large (Max 10MB)');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleJDUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        setIsExtractingJD(true);
        setError(null);
        const uploadResult = await uploadResume(file);
        const extracted = await extractText(uploadResult.id);
        setJobDescription(extracted.text);
      } catch (err) {
        setError("Failed to extract text from JD file.");
      } finally {
        setIsExtractingJD(false);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    try {
      setStep(3);
      setIsLoading(true);
      setError(null);

      setLoadingStep('Uploading resume...');
      const uploadResult = await uploadResume(file);

      setLoadingStep('AI Deep Scanning...');
      await new Promise(r => setTimeout(r, 1200)); 
      
      setLoadingStep('Calculating ATS Score...');
      const analysisResult = await analyzeResume(uploadResult.id, role, jobDescription);

      dispatch({ type: 'SET_RESULT', payload: analysisResult });
      dispatch({ type: 'SET_ROLE', payload: role });

      setLoadingStep('Success! Opening Dashboard...');
      await new Promise(r => setTimeout(r, 800)); 

      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
      setStep(2);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-1000">
      {/* Header Section */}
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 border border-violet-200 text-violet-700">
          <Sparkles size={12} className="animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest">Next-Gen AI Analysis</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
          Perfect Your <br />
          <span className="text-gradient">Career Strategy</span>
        </h1>
        <p className="text-slate-500 font-medium max-w-lg mx-auto text-sm md:text-base">
          Our deep-scan AI matches your profile against real industry benchmarks in seconds.
        </p>
      </div>

      {/* Main Interaction Card */}
      <div className="w-full max-w-xl mx-auto">
        <div className="glass-panel rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/50 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-300/40">
          
          {/* Step Indicator */}
          {step < 3 && (
            <div className="grid grid-cols-2 border-b border-slate-100">
              <div className={`py-4 text-center text-[10px] font-black tracking-widest transition-all ${step === 1 ? 'text-violet-600 bg-violet-50/50' : 'text-slate-400'}`}>
                1. UPLOAD
              </div>
              <div className={`py-4 text-center text-[10px] font-black tracking-widest transition-all ${step === 2 ? 'text-violet-600 bg-violet-50/50' : 'text-slate-400'}`}>
                2. TARGETING
              </div>
            </div>
          )}

          <div className="p-8 md:p-10">
            {step === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div 
                  className={`relative aspect-video rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-6 cursor-pointer transition-all duration-300 ${isDragging ? 'border-violet-500 bg-violet-50' : 'border-slate-200 bg-slate-50 hover:border-violet-300 hover:bg-white'}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.docx" onChange={handleFileChange} />
                  
                  {file ? (
                    <div className="flex flex-col items-center gap-4 text-center px-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg -rotate-3 transition-transform hover:rotate-0">
                        <FileText size={32} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1 truncate max-w-[200px]">{file.name}</h3>
                        <p className="text-violet-600 text-[10px] font-black uppercase tracking-widest">{(file.size / 1024 / 1024).toFixed(2)} MB • READY</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4 text-center">
                      <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-300 transition-all hover:scale-110">
                        <UploadCloud size={36} strokeWidth={1.5} />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Drop your resume</h3>
                        <p className="text-slate-400 font-medium text-xs">PDF or DOCX (Max 10MB)</p>
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => setStep(2)}
                  disabled={!file}
                  className={`w-full py-5 rounded-2xl font-black text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all ${!file ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-violet-600 shadow-lg hover:translate-y-[-2px] active:translate-y-0'}`}
                >
                  Continue <ChevronRight size={16} />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <button 
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 text-slate-400 hover:text-violet-600 text-[10px] font-black tracking-widest transition-colors"
                >
                  <ArrowLeft size={14} /> BACK
                </button>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                       Target Role
                    </label>
                    <div className="relative">
                      <select 
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-slate-800 text-sm outline-none focus:border-violet-500 focus:bg-white transition-all appearance-none cursor-pointer shadow-sm"
                      >
                        {ROLES.map(r => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                        <Target size={18} />
                      </div>
                    </div>
                  </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                             Job Description (Optional)
                          </label>
                          <button 
                            onClick={() => jdInputRef.current?.click()}
                            disabled={isExtractingJD}
                            className="text-[10px] font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1 transition-colors disabled:opacity-50"
                          >
                            {isExtractingJD ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <FileUp size={12} />
                            )}
                            UPLOAD FILE
                          </button>
                          <input 
                            type="file" 
                            ref={jdInputRef} 
                            className="hidden" 
                            accept=".pdf,.docx" 
                            onChange={handleJDUpload} 
                          />
                        </div>
                        <div className="relative">
                          <textarea 
                            placeholder="Paste the job description or upload a file for hyper-targeted analysis..."
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-6 font-medium text-slate-800 text-sm outline-none focus:border-violet-500 focus:bg-white transition-all min-h-[140px] resize-none placeholder:text-slate-300 shadow-sm"
                          />
                          {isExtractingJD && (
                            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center rounded-2xl">
                               <div className="flex items-center gap-2 text-violet-600 font-bold text-xs">
                                 <Loader2 size={16} className="animate-spin" /> Extracting details...
                               </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                <button 
                  onClick={handleAnalyze}
                  className="w-full py-5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-3 shadow-xl shadow-violet-200 hover:translate-y-[-2px] active:translate-y-0 active:scale-[0.98] transition-all group"
                >
                  <Zap size={18} className="text-amber-300 group-hover:scale-125 transition-transform" />
                  Run AI Scan
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="py-10 flex flex-col items-center text-center space-y-8 animate-in zoom-in duration-500">
                <div className="relative">
                  <div className="absolute inset-0 bg-violet-400/20 blur-2xl rounded-full scale-150 animate-pulse" />
                  <div className="w-20 h-20 border-[3px] border-slate-100 border-t-violet-600 rounded-full animate-spin relative z-10" />
                  <Search size={28} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-violet-600/30" />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">{loadingStep}</h2>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                    <ShieldCheck size={12} className="text-emerald-500" /> Banking-Grade Security
                  </p>
                </div>

                <div className="w-full max-w-xs bg-slate-100 h-1 rounded-full overflow-hidden">
                   <div className="h-full bg-violet-600 w-1/2 animate-[shimmer-progress_2s_infinite]" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Sub-section */}
        <div className="grid grid-cols-3 gap-4 mt-12">
           {[
             { label: "Deep Scan", icon: <Target size={14} /> },
             { label: "10s Results", icon: <Zap size={14} /> },
             { icon: <ShieldCheck size={14} />, label: "Encrypted" }
           ].map((item, i) => (
             <div key={i} className="flex flex-col items-center gap-2">
               <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm group-hover:text-violet-600 transition-colors">
                 {item.icon}
               </div>
               <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
             </div>
           ))}
        </div>
      </div>

      {error && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-5">
          <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white border border-red-100 text-red-500 shadow-2xl shadow-red-500/10 backdrop-blur-xl">
            <AlertCircle size={20} />
            <span className="font-bold text-sm tracking-tight">{error}</span>
            <button onClick={() => setError(null)} className="ml-4 text-slate-300 hover:text-slate-900">
               <ArrowLeft className="rotate-90" size={16} />
            </button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer-progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}} />
    </div>
  );
}
