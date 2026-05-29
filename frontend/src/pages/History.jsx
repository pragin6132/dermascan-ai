import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Trash2, Calendar, FileText, ChevronRight, ShieldAlert, Sparkles, Activity } from 'lucide-react';

export const History = ({ onViewDetails, onNavigateScan }) => {
  const [historyLogs, setHistoryLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [error, setError] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://dermascan-ai-a2k5.onrender.com/api/scans/history');
      setHistoryLogs(res.data);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve audit history logs from the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // prevent triggering click event on parent card
    if (!window.confirm('Are you sure you want to permanently delete this diagnostic record from history?')) return;
    
    try {
      await axios.delete(`/api/scans/${id}`);
      // Fade out and remove from local array
      setHistoryLogs(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete scan record.');
    }
  };

  const filteredLogs = historyLogs.filter(log => {
    const matchesSearch = log.conditionName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'All' || log.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  const severityColors = {
    Low: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    Medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    High: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
  };

  return (
    <div className="space-y-8 py-6">
      
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Audit Logs & History</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Review, export, and manage your complete historical repository of skin classifications.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Visual search and filtering bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/30 dark:bg-slate-900/20 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 glass-panel">
        
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by condition name (e.g. Eczema)..."
            className="w-full pl-11 pr-4 py-2.5 bg-white/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-900/50 dark:border-slate-800 transition-all duration-200 text-sm"
          />
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">Severity:</label>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="w-full sm:w-auto text-xs p-2.5 bg-white/50 border border-slate-200 dark:bg-slate-900/50 dark:border-slate-800 rounded-2xl focus:outline-indigo-500 text-slate-800 dark:text-white font-semibold"
          >
            <option value="All">All Severities</option>
            <option value="Low">Low Severity</option>
            <option value="Medium">Medium Severity</option>
            <option value="High">High Severity</option>
          </select>
        </div>

      </div>

      {/* Grid listing container */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Activity className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-sm text-slate-400">Loading audit repository...</p>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="glass-panel rounded-3xl p-16 text-center space-y-6 max-w-xl mx-auto border border-white/20 dark:border-slate-800">
          <div className="w-16 h-16 rounded-full bg-slate-500/10 dark:bg-slate-400/10 flex items-center justify-center mx-auto text-slate-400">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold">No diagnostic logs found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {historyLogs.length === 0 
                ? "You haven't conducted any skin analysis audits yet."
                : "No logs matching your current search parameters were found."}
            </p>
          </div>
          <button
            onClick={onNavigateScan}
            className="btn-primary mx-auto"
          >
            Conduct New Scan
          </button>
        </div>
      ) : (
        <div className="grid gap-4.5">
          {filteredLogs.map((log) => (
            <div
              key={log._id}
              onClick={() => onViewDetails(log)}
              className="glass-panel p-4 sm:p-5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-5 border border-white/20 dark:border-slate-800 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <div className="flex flex-col sm:flex-row items-center gap-4.5 w-full sm:w-auto text-center sm:text-left">
                
                {/* Image Thumbnail */}
                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shrink-0 flex items-center justify-center">
                  <img
                    src={log.imageUrl}
                    alt="Rash thumbnail"
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h3 className="text-lg font-bold group-hover:text-indigo-500 transition-colors duration-150">
                      {log.conditionName}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full border text-[10px] font-extrabold uppercase ${severityColors[log.severity]}`}>
                      {log.severity}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(log.scannedAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-indigo-500">
                      <Activity className="w-3.5 h-3.5" />
                      {(log.confidence * 100).toFixed(0)}% Probability Match
                    </span>
                  </div>
                </div>

              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-center gap-3 w-full sm:w-auto shrink-0 border-t sm:border-t-0 pt-4 sm:pt-0">
                <button
                  onClick={(e) => handleDelete(e, log._id)}
                  className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-2xl active:scale-95 transition-all duration-150 cursor-pointer"
                  title="Delete Record"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
                <div className="hidden sm:flex p-2 bg-indigo-500/10 text-indigo-500 rounded-xl group-hover:translate-x-1 transition-transform duration-200">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default History;
