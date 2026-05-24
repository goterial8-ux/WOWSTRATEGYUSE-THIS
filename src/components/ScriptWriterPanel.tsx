import React from 'react';
import { ScriptPart, StageStatus } from '../types';
import { Check, Edit3, Trash2, RefreshCw, Layers, Play, Square, Eraser, Loader2 } from 'lucide-react';

interface ScriptWriterPanelProps {
  parts: ScriptPart[];
  updatePart: (index: number, partial: Partial<ScriptPart>) => void;
  onGeneratePart: (index: number) => void;
  onGenerateAllParts: () => void;
  onStopBatchGeneration: () => void;
  onClearAllParts: () => void;
  onInitScriptParts: () => void;
  onClearPart: (index: number) => void;
  isBatchGenerating: boolean;
  onCheckPart: (index: number) => void;
  onAssembleScript: () => void;
  stageStatus: StageStatus;
}

export function ScriptWriterPanel({
  parts,
  updatePart,
  onGeneratePart,
  onGenerateAllParts,
  onStopBatchGeneration,
  onClearAllParts,
  onInitScriptParts,
  onClearPart,
  isBatchGenerating,
  onCheckPart,
  onAssembleScript,
  stageStatus
}: ScriptWriterPanelProps) {
  
  if (parts.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 border border-slate-200 mt-4 shadow-sm p-8 text-center flex-col gap-4">
        <Layers className="w-12 h-12 text-slate-300" />
        <p className="text-slate-500 font-medium">No script parts found. Ensure Story Plan is approved.</p>
      </div>
    );
  }

  const completedParts = parts.filter(p => p.draftText && p.draftText.length > 0).length;
  const totalParts = parts.length;
  const progressPercent = (completedParts / totalParts) * 100;

  return (
    <div className="flex-1 overflow-y-auto flex flex-col gap-4 mt-4 relative">
      {/* Script Progress Toolbar */}
      <div className="sticky top-0 z-10 bg-white border border-slate-200 shadow-sm p-4 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Script Progress</span>
            <span className="text-lg font-mono font-bold text-slate-900">{completedParts} <span className="text-slate-300">/</span> {totalParts} <span className="text-xs text-slate-500 font-normal ml-1 tracking-tight">Parts Written</span></span>
          </div>
          <div className="flex items-center gap-2">
            {!isBatchGenerating ? (
              <button 
                onClick={onGenerateAllParts}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold uppercase tracking-wider rounded-sm transition-all shadow-sm"
              >
                <Play className="w-3 h-3 fill-current" /> {completedParts > 0 ? "Resume Batch" : "Generate All"}
              </button>
            ) : (
              <button 
                onClick={onStopBatchGeneration}
                className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold uppercase tracking-wider rounded-sm transition-all shadow-sm"
              >
                <Square className="w-3 h-3 fill-current" /> Stop
              </button>
            )}
            <button 
              onClick={onClearAllParts}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-wider rounded-sm transition-all border border-slate-200"
            >
              <Eraser className="w-3 h-3" /> Clear All
            </button>
            <button 
              onClick={onInitScriptParts}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-wider rounded-sm transition-all border border-slate-200"
              title="Sync parts list with Story Plan"
            >
              <RefreshCw className="w-3 h-3" /> Sync with Plan
            </button>
          </div>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-500" 
            style={{ width: `${progressPercent}%` }} 
          />
        </div>
      </div>

      {parts.map((part, idx) => (
        <div key={idx} className="bg-white border border-slate-200 shadow-sm p-5 flex flex-col gap-3 relative overflow-hidden">
          {/* Active Generation Overlay */}
          {isBatchGenerating && !part.draftText && idx === parts.findIndex(p => !p.draftText) && (
            <div className="absolute inset-x-0 top-0 h-1 bg-blue-500 animate-[shimmer_2s_infinite]" />
          )}

          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Part {part.partNumber}: {part.partTitle}
              <label className="text-[10px] font-normal flex items-center gap-1 text-slate-500 font-sans tracking-normal ml-2">
                <input type="checkbox" checked={part.isComplete} onChange={e => updatePart(idx, { isComplete: e.target.checked })} className="rounded-sm border-slate-300" />
                Complete?
              </label>
            </h3>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border ${
                part.status === 'locked' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                part.status === 'approved' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                part.status === 'needs_repair' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                'bg-slate-50 text-slate-500 border-slate-200'
              }`}>
                {part.status.replace('_', ' ')}
              </span>
              
              <div className="flex items-center gap-1 ml-2">
                {part.status !== 'locked' && (
                  <button 
                    onClick={() => onGeneratePart(idx)}
                    className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                    title="Generate Part"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                )}
                {part.draftText && part.status !== 'locked' && (
                  <button 
                    onClick={() => onClearPart(idx)}
                    className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Clear Part"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="relative group">
            <textarea
              className="w-full min-h-[120px] text-[13px] text-slate-700 leading-relaxed resize-y focus:outline-none focus:border-blue-500 p-2 border border-transparent hover:border-slate-100 bg-slate-50/50 font-serif"
              value={part.draftText}
              onChange={e => updatePart(idx, { draftText: e.target.value })}
              placeholder={`Draft content for Part ${part.partNumber}...`}
              disabled={part.status === 'locked'}
            />
            {isBatchGenerating && !part.draftText && idx === parts.findIndex(p => !p.draftText) && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[1px] z-10">
                <div className="flex items-center gap-3 bg-white px-6 py-3 shadow-xl border border-slate-200 rounded-full">
                  <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">Writing Part {part.partNumber}...</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center pt-2">
            <div className="text-[10px] font-mono text-slate-400">
              {part.wordOrCharacterCount} chars | {part.avatarCount} avatars | 
              {part.hasGenerationResidue ? <span className="text-rose-500 ml-1">Residue Detected</span> : <span className="text-emerald-500 ml-1">No Residue</span>}
            </div>
            {part.draftText && part.status !== 'locked' && (
              <div className="flex gap-2">
                 <button onClick={() => onCheckPart(idx)} className="text-[11px] font-bold text-slate-600 hover:text-blue-600 flex items-center gap-1">
                   Check
                 </button>
                 <button onClick={() => updatePart(idx, { status: 'approved' })} className="text-[11px] font-bold text-slate-600 hover:text-emerald-600 flex items-center gap-1">
                   Approve
                 </button>
              </div>
            )}
          </div>
        </div>
      ))}
      <div className="pt-4 pb-12 flex justify-center">
         <button 
           onClick={onAssembleScript} 
           disabled={completedParts < totalParts}
           className="px-8 py-3 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
         >
           <Layers className="w-4 h-4" /> Assemble Full Script
         </button>
      </div>
    </div>
  );
}
