import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { UploadCloud, Image as ImageIcon, ShieldAlert, Sparkles, Activity, FileText, CheckCircle, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export const Dashboard = ({ onScanSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // Scanning state
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [scanStatusMsg, setScanStatusMsg] = useState('');
  const [error, setError] = useState('');

  // Local dashboard statistics
  const [stats, setStats] = useState({
    totalScans: 0,
    healthScore: '92%',
    activeCases: 0,
    engineStatus: 'Optimal'
  });

  const fileInputRef = useRef(null);

  // Fetch quick metrics on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/scans/history');
        const activeCount = res.data.filter(s => s.severity === 'High' || s.severity === 'Medium').length;
        setStats({
          totalScans: res.data.length,
          healthScore: `${100 - Math.min(25, res.data.length * 2)}%`,
          activeCases: activeCount,
          engineStatus: 'Optimal'
        });
      } catch (err) {
        console.warn('Could not retrieve statistics for dashboard metrics.');
      }
    };
    fetchStats();
  }, []);

  // Cycle through detailed clinical simulation steps
  useEffect(() => {
    if (!isScanning) return;

    const steps = [
      { percentage: 10, text: "Optimizing tissue sample resolution..." },
      { percentage: 35, text: "Filtering image noise and lighting vectors..." },
      { percentage: 60, text: "Extracting epidermal texture and color profile arrays..." },
      { percentage: 85, text: "Executing classification neural network model..." },
      { percentage: 98, text: "Finalizing diagnostic summary sheets..." }
    ];

    let currentIdx = 0;
    setScanStep(steps[0].percentage);
    setScanStatusMsg(steps[0].text);

    const interval = setInterval(() => {
      currentIdx++;
      if (currentIdx < steps.length) {
        setScanStep(steps[currentIdx].percentage);
        setScanStatusMsg(steps[currentIdx].text);
      } else {
        clearInterval(interval);
      }
    }, 450);

    return () => clearInterval(interval);
  }, [isScanning]);

  // Handle Drag Events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Process selected file
  const processFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Unsupported file type. Please upload a PNG, JPG, or JPEG skin image.');
      return;
    }
    setError('');
    setImageFile(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Drag Drop Event Handler
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Input Field Selection Handler
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Trigger input selection dialog
  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  // Reset file states
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setError('');
  };

  // Upload and analyze image
  const triggerDiagnostics = async () => {
    if (!imageFile) return;

    setIsScanning(true);
    setError('');

    const formData = new FormData();
    formData.append('file', imageFile);

    try {
      const res = await axios.post('http://127.0.0.1:8000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log("FASTAPI RESPONSE:", res.data);

      // Celebrate success!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#8b5cf6', '#a855f7']
      });

      // Pass result up to central page router
      setTimeout(() => {
        setIsScanning(false);
        onScanSuccess({
          ...res.data,
          imageUrl: imagePreview // Keep the uploaded image visible in ScanResult
        });
      }, 500);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.response?.data?.detail || err.response?.data?.message || 'AI engine failed to analyze skin image. Please try again.');
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-8 py-6">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Clinical Diagnostic Console</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Upload high-resolution skin rashes or allergies for real-time diagnostic reporting.
          </p>
        </div>
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl glass-panel text-sm font-semibold border border-indigo-500/10">
          <Activity className="w-5 h-5 text-indigo-500 animate-pulse" />
          <span>AI Engine Status: <strong className="text-green-500 font-bold">{stats.engineStatus}</strong></span>
        </div>
      </div>

      {/* Grid statistics metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Total Audited Scans</p>
            <h4 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">{stats.totalScans}</h4>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden flex items-center gap-4">
          <div className="p-3 bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Active Rashes</p>
            <h4 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">{stats.activeCases}</h4>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden flex items-center gap-4">
          <div className="p-3 bg-green-500/10 text-green-600 dark:text-green-400 rounded-xl">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Diagnostic Confidence</p>
            <h4 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">96.8%</h4>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">AI Database Status</p>
            <h4 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">Preloaded</h4>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Main Drag Drop or Scanning Container */}
      <div className="grid md:grid-cols-12 gap-8">
        
        {/* Left Drag & Drop section */}
        <div className="md:col-span-8">
          <div 
            className={`w-full relative rounded-3xl transition-all duration-300 min-h-[420px] flex flex-col items-center justify-center p-8 text-center border-2 border-dashed overflow-hidden
              ${dragActive ? 'border-indigo-500 bg-indigo-500/5 dark:bg-indigo-500/10' : 'border-slate-300 dark:border-slate-800 bg-white/30 dark:bg-slate-900/20'}
              ${imagePreview ? 'border-solid border-indigo-500/30' : 'hover:border-slate-400 dark:hover:border-slate-700'}
            `}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            {/* Ambient Background Grid for Clinical Look */}
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleChange}
              accept="image/*"
              className="hidden"
            />

            {!imagePreview ? (
              // Empty Upload State
              <div className="space-y-6 z-10 max-w-md">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner">
                  <UploadCloud className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Upload rash or skin allergy image</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    Drag and drop your file here, or click to browse local folders. Supports JPEG, JPG, PNG files.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onButtonClick}
                  className="btn-primary mx-auto"
                >
                  Browse Files
                </button>
              </div>
            ) : (
              // Active Preview & Laser Scanning State
              <div className="w-full h-full flex flex-col items-center justify-center z-10 space-y-6 py-4">
                <div className="relative rounded-2xl overflow-hidden max-h-[320px] max-w-[480px] shadow-2xl border border-white/20 dark:border-slate-800">
                  <img
                    src={imagePreview}
                    alt="Skin Allergy Preview"
                    className="object-contain max-h-[320px] w-full"
                  />

                  {/* Neon Medical Laser Scanning Overlay */}
                  {isScanning && (
                    <>
                      <div className="absolute inset-0 bg-indigo-500/10 backdrop-blur-[1px]"></div>
                      <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_12px_#6366f1] scanner-laser"></div>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(15,23,42,0.4)_100%)]"></div>
                    </>
                  )}
                </div>

                {!isScanning ? (
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={triggerDiagnostics}
                      className="btn-primary"
                    >
                      <Activity className="w-5 h-5" />
                      <span>Start AI Diagnostics</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="btn-secondary text-red-500 border-red-500/20 hover:bg-red-500/5 dark:hover:bg-red-500/10"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  // Diagnostics Processing Loader
                  <div className="w-full max-w-sm space-y-3">
                    <div className="flex justify-between items-center text-sm font-semibold">
                      <span className="text-indigo-500 flex items-center gap-1.5">
                        <Activity className="w-4 h-4 animate-spin" />
                        <span>Running AI Classification...</span>
                      </span>
                      <span>{scanStep}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                        style={{ width: `${scanStep}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-400 animate-pulse italic">{scanStatusMsg}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Instructions / FAQ sidebar */}
        <div className="md:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-indigo-500">
              <Sparkles className="w-5 h-5" />
              <span>Scanning Best Practices</span>
            </h3>
            
            <ul className="space-y-4.5 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                <p>Ensure the skin allergy patch is well-lit (natural lighting or daylight is ideal).</p>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                <p>Focus the camera lens clearly, avoiding blurry, low-resolution, or out-of-focus crops.</p>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
                <p>Capture the rash at a straight angle rather than a sharp perspective slant.</p>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-slate-500/5 dark:bg-slate-400/5 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-3 leading-relaxed">
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-slate-400" /> Medical Disclaimer
            </h4>
            <p>
              This computer vision software is configured for educational research purposes (Final Year College Project portfolio demo).
            </p>
            <p>
              Automated AI assessments do not constitute formal medical evaluations. Always seek the advice of registered dermatologists or medical doctors for professional drug prescriptions or skin cancer biopsies.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
