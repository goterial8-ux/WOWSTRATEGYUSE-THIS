import React from 'react';
import { StageId, StageStatus, CleanExportSettings, ScriptPart } from '../types';
import { Check, Edit3, RefreshCw, Lock, Sparkles, Download } from 'lucide-react';
import { ScriptWriterPanel } from './ScriptWriterPanel';

interface RightPanelProps {
  currentStageId: StageId;
  stageName: string;
  stageStatus: StageStatus;
  stageContent: string;
  updateStageContent: (content: string) => void;
  onGenerate: () => void;
  onApproveAndLock: () => void;
  onUnlockStage: () => void;
  onSendToNext: () => void;
  exportSettings: CleanExportSettings;
  updateExportSettings: (updates: Partial<CleanExportSettings>) => void;
  // Specific to Script Writer
  scriptParts: ScriptPart[];
  updateScriptPart: (index: number, partial: Partial<ScriptPart>) => void;
  onInitScriptParts: () => void;
  onGeneratePart: (index: number) => void;
  onGenerateAllParts: () => void;
  onStopBatchGeneration: () => void;
  onClearAllParts: () => void;
  onClearPart: (index: number) => void;
  isBatchGenerating: boolean;
  onCheckPart: (index: number) => void;
  onAssembleScript: () => void;
}

export function RightPanel({ 
  currentStageId, 
  stageName,
  stageStatus,
  stageContent,
  updateStageContent,
  onGenerate, 
  onApproveAndLock, 
  onUnlockStage,
  onSendToNext,
  exportSettings,
  updateExportSettings,
  scriptParts,
  updateScriptPart,
  onInitScriptParts,
  onGeneratePart,
  onGenerateAllParts,
  onStopBatchGeneration,
  onClearAllParts,
  onClearPart,
  isBatchGenerating,
  onCheckPart,
  onAssembleScript
}: RightPanelProps) {
  
  const isExportStage = currentStageId === 'clean_export';
  const isScriptStage = currentStageId === 'script_writer';

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-slate-100">
      {/* Header */}
      <div className="px-6 py-4 flex justify-between items-center bg-slate-100 shrink-0">
        <div>
          <h2 className="text-[18px] font-bold text-slate-900 flex items-center gap-2 m-0">
            {stageName}
            {stageStatus === 'locked' && <Lock className="w-4 h-4 text-emerald-500" />}
          </h2>
          <p className="text-[10px] uppercase font-bold text-slate-500 mt-1 tracking-widest">
            {stageStatus === 'not_started' && 'No content generated yet'}
            {stageStatus === 'generated' && 'Content generated / pending review'}
            {stageStatus === 'needs_repair' && 'Content needs repair'}
            {stageStatus === 'approved' && 'Content approved / ready to lock'}
            {stageStatus === 'locked' && 'Content locked / structure safe'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {!isExportStage && !isScriptStage && (
            <>
              <button 
                onClick={onGenerate}
                disabled={stageStatus === 'locked'}
                className="px-4 py-2 bg-white text-slate-900 hover:bg-slate-50 border border-slate-200 text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                Regenerate Stage
              </button>
              
              {stageContent && stageStatus !== 'locked' && (
                <button 
                  onClick={onApproveAndLock}
                  className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 border-none text-xs font-semibold transition-all shadow-sm"
                >
                  Approve & Lock
                </button>
              )}

              {stageStatus === 'locked' && (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={onUnlockStage}
                    className="px-4 py-2 bg-white text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                  >
                    Unlock to edit
                  </button>
                  <button 
                    onClick={onSendToNext}
                    className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 border-none text-xs font-semibold transition-all shadow-sm flex items-center gap-2"
                  >
                    Next Stage &rarr;
                  </button>
                </div>
              )}
            </>
          )}

          {isScriptStage && (
            <>
              {scriptParts.length === 0 ? (
                 <button 
                   onClick={onInitScriptParts}
                   className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 border-none text-xs font-semibold transition-all shadow-sm"
                 >
                   Initialize Script Parts
                 </button>
              ) : (
                <>
                  {stageStatus !== 'locked' && (
                    <button 
                      onClick={onApproveAndLock}
                      className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 border-none text-xs font-semibold transition-all shadow-sm"
                    >
                      Approve & Lock Full Script
                    </button>
                  )}
                  {stageStatus === 'locked' && (
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={onUnlockStage}
                        className="px-4 py-2 bg-white text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                      >
                        Unlock script
                      </button>
                      <button 
                        onClick={onSendToNext}
                        className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 border-none text-xs font-semibold transition-all shadow-sm flex items-center gap-2"
                      >
                        Next Stage &rarr;
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {isExportStage && (
            <button 
                onClick={() => alert("Downloading clean script...")}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white shadow-sm text-xs font-semibold transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Download Clean Script
              </button>
          )}
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-hidden flex flex-col px-6 pb-6">
        {isExportStage ? (
          <div className="max-w-2xl mx-auto w-full flex flex-col gap-6 mt-4">
            <div className="bg-white border border-slate-200 p-8 shadow-sm">
               <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 border-b-2 border-slate-900 pb-2 flex items-center gap-2">
                 Export Configuration
               </h3>
               <div className="flex flex-col gap-4">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" checked={exportSettings.keepPartHeadings} onChange={e => updateExportSettings({ keepPartHeadings: e.target.checked })} className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm font-semibold text-slate-700">Include part headings</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" checked={exportSettings.keepAvatarMarkers} onChange={e => updateExportSettings({ keepAvatarMarkers: e.target.checked })} className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm font-semibold text-slate-700">Keep avatar markers</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" checked={exportSettings.removeAvatarMarkersButKeepText} onChange={e => updateExportSettings({ removeAvatarMarkersButKeepText: e.target.checked })} className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm font-semibold text-slate-700">Remove avatar markers but keep text</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" checked={exportSettings.removeAvatarTextCompletely} onChange={e => updateExportSettings({ removeAvatarTextCompletely: e.target.checked })} className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm font-semibold text-slate-700">Remove avatar text completely</span>
                  </label>
               </div>
            </div>
            
            <div className="text-slate-500 text-xs bg-slate-50 p-4 border border-slate-200">
               <p className="font-bold mb-2">Clean export automatically removes:</p>
               <ul className="list-disc pl-4 grid grid-cols-2 gap-1.5 gap-x-8">
                 <li>QA & Planning Notes</li>
                 <li>Technical Residue</li>
                 <li>Unfinished fragments</li>
                 <li>Decorative separators</li>
                 <li>Debug texts</li>
               </ul>
            </div>
          </div>
        ) : isScriptStage ? (
          <ScriptWriterPanel 
             parts={scriptParts}
             updatePart={updateScriptPart}
             onGeneratePart={onGeneratePart}
             onGenerateAllParts={onGenerateAllParts}
             onStopBatchGeneration={onStopBatchGeneration}
             onClearAllParts={onClearAllParts}
             onInitScriptParts={onInitScriptParts}
             onClearPart={onClearPart}
             isBatchGenerating={isBatchGenerating}
             onCheckPart={onCheckPart}
             onAssembleScript={onAssembleScript}
             stageStatus={stageStatus}
          />
        ) : (
          <div className="flex-1 relative border border-slate-200 bg-white overflow-hidden group shadow-sm mt-4 flex flex-col">
            <textarea
              disabled={stageStatus === 'locked'}
              className="w-full h-full bg-transparent p-8 text-[14px] text-slate-700 leading-[1.6] font-sans resize-none focus:outline-none disabled:bg-slate-50 disabled:text-slate-500"
              value={stageContent}
              onChange={e => updateStageContent(e.target.value)}
              placeholder={stageStatus === 'not_started' ? `Click "Regenerate Stage" to create ${stageName.toLowerCase()}...` : "Edit content directly here..."}
            />
            {stageStatus !== 'locked' && stageStatus !== 'not_started' && (
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="bg-slate-100/90 text-[10px] uppercase font-bold tracking-widest px-2 py-1 text-slate-500 border border-slate-200">
                  Manual edit active
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
