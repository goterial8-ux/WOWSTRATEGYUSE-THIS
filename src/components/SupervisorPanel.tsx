import React from 'react';
import { SupervisorReport, SupervisorStatus } from '../types';
import { ShieldAlert, ShieldCheck, Wrench, AlertTriangle, PlayCircle, Loader2 } from 'lucide-react';

interface SupervisorPanelProps {
  report: SupervisorReport | null;
  isGenerating: boolean;
  onAnalyze: () => void;
  onApplyRepair: () => void;
  onApproveAnyway: () => void;
}

export function SupervisorPanel({ report, isGenerating, onAnalyze, onApplyRepair, onApproveAnyway }: SupervisorPanelProps) {
  
  if (isGenerating) {
    return (
      <div className="h-[200px] border-t border-slate-200 bg-slate-50 p-4 flex flex-col justify-center items-center text-slate-500 shrink-0">
        <Loader2 className="w-6 h-6 animate-spin mb-3 text-blue-500" />
        <p className="text-sm font-bold text-slate-700">AI Supervisor is analyzing...</p>
        <p className="text-xs mt-1">Checking for continuity, drift, and rules.</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="h-[200px] border-t border-slate-200 bg-slate-50 p-4 flex flex-col justify-center items-center text-slate-500 shrink-0">
        <ShieldAlert className="w-8 h-8 opacity-20 mb-3" />
        <p className="text-sm">No analysis for current output.</p>
        <button 
          onClick={onAnalyze}
          className="mt-4 px-5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold transition-all shadow-sm"
        >
          Analyze Current Stage
        </button>
      </div>
    );
  }

  const getStatusInfo = (status: SupervisorStatus) => {
    switch (status) {
      case 'ok': return { icon: ShieldCheck, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-500', label: 'Ready for Next Stage' };
      case 'needs_small_repair': return { icon: Wrench, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-500', label: 'Needs Small Repair' };
      case 'needs_serious_repair': return { icon: AlertTriangle, color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-500', label: 'Needs Serious Repair' };
      case 'do_not_continue': return { icon: ShieldAlert, color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-500', label: 'DO NOT CONTINUE (Severe Issues)' };
      default: return { icon: ShieldCheck, color: 'text-slate-500', bg: 'bg-slate-100', border: 'border-slate-300', label: 'Unknown Status' };
    }
  };

  const info = getStatusInfo(report.status);
  const StatusIcon = info.icon;

  return (
    <div className={`h-[240px] shrink-0 flex flex-col bg-white border-t-2 ${info.border}`}>
      <div className={`px-6 py-3 border-b border-slate-100 ${info.bg} flex justify-between items-center`}>
        <div className="flex items-center gap-2">
          <StatusIcon className={`w-4 h-4 ${info.color}`} />
          <span className={`text-[11px] font-extrabold uppercase tracking-widest ${info.color}`}>AI SUPERVISOR</span>
          <span className="text-[11px] font-bold text-slate-500 ml-2">&bull; {info.label}</span>
        </div>
        <div className="flex gap-3">
           {report.status !== 'ok' && (
             <>
               <button 
                  onClick={onApplyRepair}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold transition-all shadow-sm"
                >
                  Apply Suggested Repair
                </button>
                {report.status !== 'do_not_continue' && (
                  <button 
                    onClick={onApproveAnyway}
                    className="px-4 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-[11px] font-bold transition-all shadow-sm"
                  >
                    Approve Anyway
                  </button>
                )}
             </>
           )}
           {report.status === 'ok' && (
             <button className="px-4 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300 text-[11px] font-bold transition-all flex items-center gap-1.5">
               <PlayCircle className="w-3.5 h-3.5" /> Proceed safely
             </button>
           )}
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto flex gap-8 text-[13px] bg-white">
        <div className="w-1/3 flex flex-col gap-2">
          <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex justify-between items-center">
            Diagnosis
            <span className={`px-2 py-0.5 rounded-sm ${report.canContinue ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
              Can Continue: {report.canContinue ? 'YES' : 'NO'}
            </span>
          </h4>
          <p className="text-slate-700 leading-relaxed font-medium mb-2">{report.whatIsGood}</p>
          {report.recommendation && (
            <p className="text-slate-600 leading-relaxed italic border-l-2 border-slate-200 pl-3">{report.recommendation}</p>
          )}
        </div>
        
        {report.problems.length > 0 && (
          <div className="w-1/3 flex flex-col gap-2">
            <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Detected Problems</h4>
            <ul className="text-rose-700 space-y-1.5 list-disc pl-4 font-medium">
              {report.problems.map((prob, i) => <li key={i}>{prob}</li>)}
            </ul>
          </div>
        )}

        {report.requiredFixes.length > 0 && (
          <div className="w-1/3 flex flex-col gap-2">
            <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Required Fixes</h4>
            <ul className="text-amber-700 space-y-1.5 list-disc pl-4 font-medium">
              {report.requiredFixes.map((fix, i) => <li key={i}>{fix}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
