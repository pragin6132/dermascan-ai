import React, { useState } from 'react';
import { ArrowLeft, Calendar, FileDown, ShieldAlert, CheckCircle, HelpCircle, Activity, HeartPulse, User, Clock } from 'lucide-react';

export const ScanResult = ({ scanData, onBack }) => {
  const [activeTab, setActiveTab] = useState('symptoms');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('10:00 AM');
  
  if (!scanData) return null;

  const severityColors = {
    Low: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    Medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    High: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!bookingDate) return;
    setIsBooking(true);
    setTimeout(() => {
      setIsBooking(false);
      setBookingConfirmed(true);
    }, 1200);
  };

  return (
    <div className="space-y-8 py-6 relative">
      
      {/* Printable Clinical Sheet (Strictly hidden on-screen, active during print operations) */}
      <div className="hidden print:block p-8 space-y-6 text-slate-900 bg-white min-h-screen">
        <div className="flex justify-between items-center border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">DermaScan AI</h1>
            <p className="text-xs text-slate-500">Autonomous Clinical Dermatological Report</p>
          </div>
          <div className="text-right text-xs space-y-1">
            <p><strong>Date Audited:</strong> {new Date(scanData.scannedAt).toLocaleDateString()}</p>
            <p><strong>Log ID:</strong> {scanData._id}</p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8 py-6 items-center">
          <div className="col-span-4 border rounded-xl p-2 overflow-hidden h-[180px] flex items-center justify-center">
            <img src={scanData.imageUrl} alt="Rash" className="object-contain max-h-[160px]" />
          </div>
          <div className="col-span-8 space-y-3">
            <div className="inline-block px-3 py-1 text-xs border rounded-full font-bold">
              Severity: {scanData.severity}
            </div>
            <h2 className="text-2xl font-bold">{scanData.conditionName}</h2>
            <p className="text-sm"><strong>Neural Match Probability:</strong> {(scanData.confidence * 100).toFixed(1)}%</p>
          </div>
        </div>

        <hr />

        <div className="space-y-4 pt-4">
          <div>
            <h3 className="font-bold text-sm text-indigo-700 uppercase tracking-wide">1. Audited Symptoms</h3>
            <ul className="list-disc pl-5 text-sm space-y-1 mt-1">
              {scanData.symptoms.map((s, idx) => <li key={idx}>{s}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-sm text-indigo-700 uppercase tracking-wide">2. Potential Biological Causes</h3>
            <ul className="list-disc pl-5 text-sm space-y-1 mt-1">
              {scanData.causes.map((c, idx) => <li key={idx}>{c}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-sm text-indigo-700 uppercase tracking-wide">3. Recommended Clinical Protocols</h3>
            <ul className="list-disc pl-5 text-sm space-y-1 mt-1">
              {scanData.solutions.map((s, idx) => <li key={idx}>{s}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-sm text-indigo-700 uppercase tracking-wide">4. Basic OTC Medicines</h3>
            <ul className="list-disc pl-5 text-sm space-y-1 mt-1">
              {scanData.medicines.map((m, idx) => <li key={idx}>{m}</li>)}
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 text-center text-[10px] text-slate-400 space-y-1">
          <p>This document is an AI-generated clinical presentation report and does not replace certified professional biopsy inspections.</p>
          <p>© 2026 DermaScan AI - Monorepo Student Portfolio Systems.</p>
        </div>
      </div>

      {/* On-Screen Premium Interface */}
      <div className="print:hidden space-y-6">
        
        {/* Navigation Action bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="btn-secondary py-2.5 px-4 flex items-center gap-2 cursor-pointer text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrintReport}
              className="btn-primary bg-indigo-500 hover:bg-indigo-600 text-white shadow-md text-sm font-semibold cursor-pointer py-2.5 px-5"
            >
              <FileDown className="w-4 h-4" />
              <span>Export Health Report</span>
            </button>
          </div>
        </div>

        {/* Results Overview Section */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Image Card & Confidence Dial */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 rounded-3xl space-y-6 border border-white/20 dark:border-slate-800">
              
              {/* Image Frame */}
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 flex items-center justify-center max-h-[300px]">
                <img
                  src={scanData.imageUrl}
                  alt="Scanned rash anomaly"
                  className="object-contain max-h-[300px] w-full"
                />
                <span className={`absolute top-4 right-4 px-3 py-1 rounded-full border text-xs font-extrabold tracking-wider uppercase ${severityColors[scanData.severity]}`}>
                  {scanData.severity} Severity
                </span>
              </div>

              {/* AI Diagnostic Score Ring */}
              <div className="flex items-center gap-6 bg-slate-500/5 dark:bg-slate-400/5 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800">
                <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                  
                  {/* Confidence circular SVG progress meter */}
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="rgba(99, 102, 241, 0.15)"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="url(#indigoGrad)"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 40}
                      strokeDashoffset={2 * Math.PI * 40 * (1 - scanData.confidence)}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="indigoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-xl font-black text-slate-800 dark:text-slate-100">
                      {(scanData.confidence * 100).toFixed(0)}%
                    </span>
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold">Match</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Primary AI Classification</span>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
                    {scanData.conditionName}
                  </h3>
                  <div className="inline-flex items-center gap-1 text-[11px] text-indigo-500 font-semibold mt-1">
                    <Activity className="w-3.5 h-3.5 animate-pulse" />
                    <span>Neural inference completed.</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Tabbed medical report tabs */}
          <div className="lg:col-span-7">
            <div className="glass-panel rounded-3xl overflow-hidden border border-white/20 dark:border-slate-800">
              
              {/* Tab selectors */}
              <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-500/5 overflow-x-auto no-scrollbar">
                {['symptoms', 'causes', 'solutions', 'medicines', 'prevention'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-4 text-xs font-bold uppercase tracking-wider border-b-2 shrink-0 cursor-pointer transition-all duration-200
                      ${activeTab === tab 
                        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-white/40 dark:bg-slate-900/40' 
                        : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}
                    `}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Display Area */}
              <div className="p-6 min-h-[340px]">
                
                {activeTab === 'symptoms' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <HeartPulse className="w-5 h-5 text-red-500" />
                      <span>Associated Symptoms</span>
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Standard clinical indicators recorded for {scanData.conditionName}:
                    </p>
                    <ul className="space-y-3.5 pt-2">
                      {scanData.symptoms.map((symptom, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          <span className="w-5 h-5 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</span>
                          <span>{symptom}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'causes' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-amber-500" />
                      <span>Root Causes & Triggers</span>
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Typical biological or environmental triggers promoting this skin condition:
                    </p>
                    <ul className="space-y-3.5 pt-2">
                      {scanData.causes.map((cause, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">!</span>
                          <span>{cause}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'solutions' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <HeartPulse className="w-5 h-5 text-indigo-500" />
                      <span>Recommended Solutions</span>
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Home care methods, skin hydration practices, and relief procedures:
                    </p>
                    <ul className="space-y-3.5 pt-2">
                      {scanData.solutions.map((sol, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">🩺</span>
                          <span>{sol}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'medicines' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Activity className="w-5 h-5 text-purple-500" />
                      <span>Basic Medicines & Creams</span>
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Typical over-the-counter ointments, tablets, or soothing preparations:
                    </p>
                    <ul className="space-y-3.5 pt-2">
                      {scanData.medicines.map((med, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          <span className="w-5 h-5 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">💊</span>
                          <span>{med}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'prevention' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Prevention Guidelines</span>
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Long-term skincare strategies and dietary habits to prevent allergy recurrences:
                    </p>
                    <ul className="space-y-3.5 pt-2">
                      {scanData.prevention.map((prev, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          <span className="w-5 h-5 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">🛡️</span>
                          <span>{prev}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
              
              <div className="p-4 bg-slate-500/5 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>Disclaimer: Suggested pharmaceuticals represent standard remedies. Consult a medical practitioner before starting any steroids.</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ScanResult;
