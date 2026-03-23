import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CheckCircle, XCircle, ArrowLeft, Trophy, Target, Lightbulb, Activity } from 'lucide-react';
import { useAnalysis } from '../context/AnalysisContext';

export default function Dashboard() {
  const { state } = useAnalysis();
  const navigate = useNavigate();
  const result = state.analysisResult;

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Activity className="w-10 h-10 text-slate-300" />
        </div>
        <p className="text-2xl font-medium text-slate-500 font-heading">No analysis results yet.</p>
        <Button onClick={() => navigate('/')} variant="outline" className="flex items-center gap-2 rounded-xl h-12 px-6 hover:bg-violet-50 hover:text-violet-600 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Upload a Resume
        </Button>
      </div>
    );
  }

  const scoreValue = Math.round(result.overall_score);
  const scoreColor = scoreValue >= 80 ? 'text-green-500' : 
                     scoreValue >= 60 ? 'text-amber-500' : 'text-rose-500';

  const progressColor = scoreValue >= 80 ? 'bg-green-500' : 
                        scoreValue >= 60 ? 'bg-amber-500' : 'bg-rose-500';
                        
  const scoreGlow = scoreValue >= 80 ? 'bg-green-400/20' : 
                    scoreValue >= 60 ? 'bg-amber-400/20' : 'bg-rose-400/20';

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 font-heading">Analysis Dashboard</h1>
          <p className="text-slate-500 font-medium text-sm sm:text-base">Your personalized resume assessment and feedback.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-4 py-1.5 text-sm font-semibold text-violet-700 border-violet-200 bg-violet-50/80 backdrop-blur-sm rounded-full flex items-center gap-2">
            <Target className="w-4 h-4" /> 
            {state.selectedRole?.toUpperCase().replace('_', ' ') || 'SDE'}
          </Badge>
          <Button onClick={() => navigate('/')} variant="outline" size="sm" className="rounded-full font-medium shadow-sm hover:shadow transition-shadow h-9">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ATS Score Card */}
        <Card className="md:col-span-1 glass-panel border-white/60 shadow-xl shadow-slate-200/50 overflow-hidden relative transition-transform hover:scale-[1.02] duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none"></div>
          <CardHeader className="pb-2 border-b border-slate-100/50 relative z-10">
            <CardTitle className="text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Trophy className={`w-4 h-4 ${scoreColor}`} />
              Overall ATS Score
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-6 relative z-10">
            <div className="relative">
              {/* Glowing aura behind score */}
              <div className={`absolute inset-0 rounded-full blur-[40px] ${scoreGlow} scale-150`}></div>
              <div className={`text-8xl font-black tracking-tighter ${scoreColor} drop-shadow-sm relative z-10 font-heading`}>
                {scoreValue}
              </div>
            </div>
            <p className="text-slate-500 text-sm xl:text-base text-center font-medium leading-relaxed max-w-[200px]">
              {scoreValue >= 80 ? "Excellent! Highly competitive for this role." : 
               scoreValue >= 60 ? "Good foundation, but needs keyword optimization." : 
               "Needs significant formatting and keyword improvements."}
            </p>
            <div className="w-full bg-slate-100 rounded-full h-4 shadow-inner overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-1000 ease-out ${progressColor}`} style={{ width: `${scoreValue}%` }}></div>
            </div>
          </CardContent>
        </Card>

        {/* Breakdown Chart */}
        <Card className="md:col-span-2 glass-panel shadow-lg shadow-slate-200/50 transition-shadow hover:shadow-xl duration-300">
          <CardHeader className="border-b border-slate-100/50 pb-4">
            <CardTitle className="font-heading text-xl">Score Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-64 pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={result.breakdown} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 500}} width={90} />
                <Tooltip cursor={{fill: 'rgba(0,0,0,0.02)'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={28}>
                  {result.breakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={
                      entry.score >= 80 ? '#10b981' : entry.score >= 60 ? '#f59e0b' : '#f43f5e'
                    } />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills Matched/Missing */}
        <Card className="glass-panel shadow-lg transition-shadow hover:shadow-xl duration-300">
          <CardHeader className="border-b border-slate-100/50">
            <CardTitle className="font-heading text-xl flex items-center gap-2">
              <Activity className="w-5 h-5 text-violet-500" />
              Keyword Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            <div className="p-5 rounded-2xl bg-green-50/50 border border-green-100">
              <h4 className="flex items-center gap-2 text-sm font-bold text-green-800 mb-4 uppercase tracking-wider">
                <CheckCircle className="w-5 h-5 text-green-500" /> Matched Skills ({result.skills.matched.length})
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {result.skills.matched.length > 0 ? result.skills.matched.map(s => (
                  <Badge 
                    key={s} 
                    variant="secondary" 
                    className="bg-green-100 text-green-800 hover:bg-green-200 capitalize font-medium px-3 py-1 text-sm shadow-sm"
                  >
                    {s}
                  </Badge>
                )) : <p className="text-sm text-slate-400 font-medium">No matched skills found</p>}
              </div>
            </div>
            
            <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-200/20 rounded-full blur-2xl -mt-10 -mr-10"></div>
              <h4 className="flex items-center gap-2 text-sm font-bold text-rose-800 mb-4 uppercase tracking-wider">
                <XCircle className="w-5 h-5 text-rose-500" /> Missing Keywords ({result.skills.missing.length})
              </h4>
              <div className="flex flex-wrap gap-2.5 relative z-10">
                {result.skills.missing.length > 0 ? result.skills.missing.map(s => (
                  <Badge 
                    key={s} 
                    variant="outline" 
                    className="border-rose-200 text-rose-600 bg-white/50 backdrop-blur-sm capitalize font-medium px-3 py-1 text-sm shadow-sm"
                  >
                    {s}
                  </Badge>
                )) : <p className="text-sm text-green-600 font-medium">No missing skills — outstanding coverage!</p>}
              </div>
            </div>

            {result.skills.jd_matched?.length > 0 || result.skills.jd_missing?.length > 0 ? (
              <div className="p-5 rounded-2xl bg-violet-50/30 border border-violet-100 border-dashed">
                <h4 className="text-[10px] font-black text-violet-600 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                  <Target size={12} className="text-violet-500" /> Keywords Found in Your JD
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {[...(result.skills.jd_matched || []), ...(result.skills.jd_missing || [])].map(skill => (
                    <span key={skill} className="px-2 py-0.5 rounded-md bg-white border border-violet-100 text-[10px] font-bold text-violet-500 capitalize">{skill}</span>
                  ))}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Suggestions Panel */}
        <Card className="glass-panel shadow-lg border-t-4 border-t-amber-400 transition-shadow hover:shadow-xl duration-300">
          <CardHeader className="border-b border-slate-100/50 pb-4 bg-gradient-to-b from-amber-50/30 to-transparent">
            <CardTitle className="font-heading text-xl flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              Actionable Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-4">
              {result.suggestions && result.suggestions.length > 0 ? result.suggestions.map((sug, i) => (
                <li key={i} className="group flex gap-4 items-start p-4 hover:bg-white/60 bg-slate-50/50 rounded-2xl border border-slate-200/60 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300">
                  <span className="text-2xl mt-0.5 filter drop-shadow-sm group-hover:scale-110 transition-transform">{sug.icon}</span>
                  <div className="flex-1">
                    <p className="text-slate-700 text-[15px] font-medium leading-relaxed">{sug.message}</p>
                    <Badge variant="outline" className={`mt-2.5 font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded-md shadow-sm ${
                      sug.priority === 'high' ? 'border-rose-200 bg-rose-50 text-rose-600' :
                      sug.priority === 'medium' ? 'border-amber-200 bg-amber-50 text-amber-700' :
                      'border-emerald-200 bg-emerald-50 text-emerald-600'
                    }`}>
                      {sug.priority} Priority
                    </Badge>
                  </div>
                </li>
              )) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8 text-green-500" />
                  </div>
                  <p className="text-lg font-medium text-slate-700">Perfect resume!</p>
                  <p className="text-slate-500">We couldn't find any major areas to improve.</p>
                </div>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
