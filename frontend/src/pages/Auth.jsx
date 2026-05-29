import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Activity, Sparkles, User, Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export const Auth = () => {
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loadingLocal, setLoadingLocal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password || (!isLogin && !name)) {
      setError('All credential fields are required.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setLoadingLocal(true);
    let result;
    if (isLogin) {
      result = await login(email, password);
    } else {
      result = await signup(name, email, password);
    }
    setLoadingLocal(false);

    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-12">
      {/* Ambient Radial Mesh Background Glows */}
      <div className="ambient-glow glow-blue w-[400px] h-[400px] -top-20 -left-20 bg-blue-500/10 dark:bg-blue-600/15"></div>
      <div className="ambient-glow glow-purple w-[450px] h-[450px] -bottom-20 -right-20 bg-purple-500/10 dark:bg-purple-600/15"></div>
      <div className="ambient-glow glow-indigo w-[300px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500/5 dark:bg-indigo-600/10"></div>

      <div className="w-full max-w-5xl grid md:grid-cols-12 gap-8 items-center z-10">
        
        {/* Left Side Banner (Value Proposition) */}
        <div className="md:col-span-6 space-y-6 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium text-sm border border-indigo-500/20 backdrop-blur-md">
            <Sparkles className="w-4 h-4" />
            <span>Modern Clinical Dermatology Companion</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Advanced Skin <br className="hidden md:inline" />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-300">
              Allergy Detection
            </span>
          </h1>
          
          <p className="text-slate-600 dark:text-slate-300 text-lg max-w-lg">
            Empowering students and medical practitioners with high-fidelity computer vision diagnosis for instant visual allergy tracking and analysis.
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-md pt-2 mx-auto md:mx-0">
            <div className="p-4 rounded-2xl glass-card text-left">
              <ShieldCheck className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-2" />
              <h3 className="font-semibold text-sm">Secure Diagnostics</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Advanced local database record vaults.</p>
            </div>
            <div className="p-4 rounded-2xl glass-card text-left">
              <Activity className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2" />
              <h3 className="font-semibold text-sm">Instant Classification</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">High-fidelity classification pipeline.</p>
            </div>
          </div>
        </div>

        {/* Right Side Card (Auth form) */}
        <div className="md:col-span-6">
          <div className="glass-panel rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-slate-800/50 relative overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {isLogin ? 'Sign in to access your dashboard' : 'Join DermaScan AI clinic network'}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Activity className="w-6 h-6 animate-pulse" />
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-start gap-3 text-sm">
                <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-slate-400" /> Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dr. Jordan Carter"
                    className="input-field"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-slate-400" /> Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="input-field"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-slate-400" /> Password
                  </label>
                  {isLogin && (
                    <button type="button" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                      Forgot Password?
                    </button>
                  )}
                </div>
                
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field pr-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loadingLocal}
                className="w-full btn-primary py-3.5 mt-6 flex items-center justify-center font-bold tracking-wide"
              >
                {loadingLocal ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>{isLogin ? 'Sign In Credentials' : 'Create Free Account'}</span>
                )}
              </button>
            </form>

            <div className="relative my-8 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
              </div>
              <span className="relative px-3 bg-slate-50 dark:bg-[#0f172a] text-xs text-slate-400 uppercase tracking-widest font-semibold rounded-lg">
                Demo Credentials Included
              </span>
            </div>

            <div className="text-center space-y-4">
              {isLogin ? (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  New to DermaScan AI?{' '}
                  <button
                    type="button"
                    onClick={() => { setIsLogin(false); setError(''); }}
                    className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
                  >
                    Create an account
                  </button>
                </p>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setIsLogin(true); setError(''); }}
                    className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </p>
              )}

              {isLogin && (
                <div className="p-3.5 rounded-2xl bg-indigo-500/5 dark:bg-indigo-400/5 text-xs text-indigo-600 dark:text-indigo-300 border border-indigo-500/10 flex flex-col items-center gap-1">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Instant Demo Login:</span>
                  <span>Email: <strong className="select-all">demo@dermascan.ai</strong> & Password: <strong className="select-all">password123</strong></span>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Auth;
