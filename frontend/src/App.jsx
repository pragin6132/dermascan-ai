import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import ScanResult from './pages/ScanResult';
import History from './pages/History';
import { Activity, LogOut, Sun, Moon, Sparkles, FolderHeart, LayoutDashboard, ShieldCheck } from 'lucide-react';

const AppContent = () => {
  const { user, loading, darkMode, toggleTheme, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedScan, setSelectedScan] = useState(null);

  // 1. Loading Pulse Screen
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 dark:border-indigo-400/20 scale-100 animate-ping"></div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-xl z-10 animate-pulse">
            <Activity className="w-6 h-6 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
        </div>
        <p className="mt-6 text-sm text-slate-400 dark:text-slate-500 uppercase tracking-widest font-extrabold animate-pulse">
          Initializing DermaScan AI...
        </p>
      </div>
    );
  }

  // 2. Unauthenticated Login/Signup Card View
  if (!user) {
    return <Auth />;
  }

  // 3. Authenticated Layout and Router
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300">
      
      {/* Sticky Premium Navbar */}
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/60 print:hidden transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16.5 items-center">
            
            {/* Logo Group */}
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => { setCurrentPage('dashboard'); setSelectedScan(null); }}>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 active:scale-95 transition-transform duration-150">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  DermaScan
                </span>
                <span className="ml-1 text-xs px-1.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-extrabold tracking-wider uppercase">
                  AI
                </span>
              </div>
            </div>

            {/* Navigation Page triggers */}
            <nav className="hidden md:flex items-center gap-2">
              <button
                onClick={() => { setCurrentPage('dashboard'); setSelectedScan(null); }}
                className={`px-4 py-2 text-sm font-bold rounded-xl flex items-center gap-2 cursor-pointer transition-all duration-200
                  ${currentPage === 'dashboard' || currentPage === 'result'
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/5 dark:bg-indigo-400/5' 
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'}
                `}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Console</span>
              </button>
              
              <button
                onClick={() => { setCurrentPage('history'); setSelectedScan(null); }}
                className={`px-4 py-2 text-sm font-bold rounded-xl flex items-center gap-2 cursor-pointer transition-all duration-200
                  ${currentPage === 'history'
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/5 dark:bg-indigo-400/5' 
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'}
                `}
              >
                <FolderHeart className="w-4 h-4" />
                <span>Audit History</span>
              </button>
            </nav>

            {/* Right Action panel */}
            <div className="flex items-center gap-3">
              
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 active:scale-95 transition-all duration-150 cursor-pointer"
                title="Toggle Theme"
              >
                {darkMode ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-slate-600" />}
              </button>

              {/* User Name Tag */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-500/5 border border-slate-200/50 dark:border-slate-800">
                <div className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 max-w-[100px] truncate">
                  {user.name}
                </span>
              </div>

              {/* Logout button */}
              <button
                onClick={logout}
                className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-500/5 rounded-xl active:scale-95 transition-all duration-150 cursor-pointer flex items-center gap-1.5"
                title="Sign Out"
              >
                <LogOut className="w-4.5 h-4.5" />
                <span className="text-xs font-bold hidden md:inline">Sign Out</span>
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* Main Content Dashboard Wrapper */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10 relative">
        {/* Decorative Grid Bubbles */}
        <div className="ambient-glow glow-blue w-[300px] h-[300px] top-40 left-10 bg-blue-500/5 dark:bg-blue-600/10 print:hidden"></div>
        <div className="ambient-glow glow-purple w-[300px] h-[300px] bottom-10 right-10 bg-purple-500/5 dark:bg-purple-600/10 print:hidden"></div>

        {/* Dynamic Page Switcher */}
        {currentPage === 'dashboard' && (
          <Dashboard 
            onScanSuccess={(data) => {
              setSelectedScan(data);
              setCurrentPage('result');
            }} 
          />
        )}
        
        {currentPage === 'history' && (
          <History 
            onViewDetails={(scan) => {
              setSelectedScan(scan);
              setCurrentPage('result');
            }}
            onNavigateScan={() => setCurrentPage('dashboard')}
          />
        )}

        {currentPage === 'result' && (
          <ScanResult 
            scanData={selectedScan} 
            onBack={() => {
              setCurrentPage('dashboard');
              setSelectedScan(null);
            }} 
          />
        )}
      </main>

      {/* College presentation footer */}
      <footer className="py-6 border-t border-slate-200/50 dark:border-slate-800/60 print:hidden transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
            <span>DermaScan AI Clinical Assessment Systems</span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-slate-500 dark:text-slate-400">
            <span>Portfolio Project</span>
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            <span>Academic Monorepo Presentation</span>
          </div>
          <div>
            <span>© 2026 Developed with ❤️ for final presentation.</span>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Navigation drawer (Visible strictly on small Viewports) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 py-2.5 px-6 print:hidden flex justify-around items-center transition-colors duration-300">
        <button
          onClick={() => { setCurrentPage('dashboard'); setSelectedScan(null); }}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors duration-200
            ${currentPage === 'dashboard' || currentPage === 'result' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}
          `}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-bold">Console</span>
        </button>
        
        <button
          onClick={() => { setCurrentPage('history'); setSelectedScan(null); }}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors duration-200
            ${currentPage === 'history' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}
          `}
        >
          <FolderHeart className="w-5 h-5" />
          <span className="text-[10px] font-bold">Audit History</span>
        </button>
      </div>

    </div>
  );
};

export const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
