import React from 'react';
import { ScriptPart, StageStatus } from '../types';
import { Check, Edit3, Trash2, RefreshCw, Layers } from 'lucide-react';

interface ScriptWriterPanelProps {
  parts: ScriptPart[];
  updatePart: (index: number, partial: Partial<ScriptPart>) => void;
  onGeneratePart: (index: number) => void;
  onCheckPart: (index: number) => void;
  onAssembleScript: () => void;
  stageStatus: StageStatus;
}

export function ScriptWriterPanel({
  parts,
  updatePart,
  onGeneratePart,
  onCheckPart,
  onAssembleScript,
  stageStatus
}: ScriptWriterPanelProps) {
  
  if (parts.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 border border-slate-200 mt-4 shadow-sm p-8 text-center flex-col gap-4">
        <Layers className="w-12 h-12 text-slate-300" />
        <p className="text-slate-500 font-medium">No script parts found. Ensure Story Plan is approved.</p>
        {stageStatus !== 'locked' && (
          <button className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold rounded-sm shadow-sm transition-all">
            Initialize Script Parts from Plan
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto flex flex-col gap-4 mt-4">
      {parts.map((part, idx) => (
        <div key={idx} className="bg-white border border-slate-200 shadow-sm p-5 flex flex-col gap-3">
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
              {part.status !== 'locked' && (
                <button 
                  onClick={() => onGeneratePart(idx)}
                  className="px-2 py-1 text-[10px] uppercase tracking-wider font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Generate
                </button>
              )}
            </div>
          </div>
          
          <textarea
            className="w-full min-h-[100px] text-[13px] text-slate-700 leading-relaxed resize-y focus:outline-none focus:border-blue-500 p-2 border border-transparent hover:border-slate-100 bg-slate-50/50"
            value={part.draftText}
            onChange={e => updatePart(idx, { draftText: e.target.value })}
            placeholder={`Draft content for Part ${part.partNumber}...`}
            disabled={part.status === 'locked'}
          />
          
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
      <div className="pt-4 pb-8 flex justify-center">
         <button onClick={onAssembleScript} className="px-6 py-2 bg-slate-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition-all shadow-sm">
           Assemble Full Script
         </button>
      </div>
    </div>
  );
}
