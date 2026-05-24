import React from 'react';
import { ProjectState } from '../types';
import { Settings, FileText, Anchor, Save, Download, Upload, Server, RefreshCw } from 'lucide-react';

interface LeftPanelProps {
  state: ProjectState;
  updateState: (partial: Partial<ProjectState>) => void;
  onResetProject: () => void;
  saveStatus?: 'saved' | 'saving' | 'idle';
}

export function LeftPanel({ state, updateState, onResetProject, saveStatus }: LeftPanelProps) {
  
  return (
    <aside className="w-[280px] h-full border-r border-slate-200 bg-white flex flex-col pt-4 overflow-hidden shrink-0">
      <div className="px-4 pb-4 border-b border-slate-200 flex justify-between items-center">
        <h2 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          Project Control
        </h2>
        <div className="flex items-center gap-2">
          {saveStatus && saveStatus !== 'idle' && (
            <span className={`text-[9px] font-bold uppercase transition-all duration-300 ${saveStatus === 'saving' ? 'text-blue-500 animate-pulse' : 'text-emerald-500 opacity-60'}`}>
              {saveStatus === 'saving' ? 'Saving...' : 'Saved'}
            </span>
          )}
          <button className="p-1 rounded-none text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors" title="Save Project Settings">
            <Save className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-slate-600">Project Title</label>
          <input
            className="bg-white border border-slate-200 rounded-[2px] px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
            value={state.projectTitle}
            onChange={e => updateState({ projectTitle: e.target.value })}
            placeholder="Untitled Drama..."
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-slate-600">Raw Idea</label>
          <textarea
            className="bg-white border border-slate-200 rounded-[2px] px-3 py-2 text-[13px] text-slate-900 focus:outline-none focus:border-blue-500 min-h-24 resize-y leading-relaxed"
            value={state.rawIdea}
            onChange={e => updateState({ rawIdea: e.target.value })}
            placeholder="A billionaire CEO goes undercover as a janitor, gets mistreated by a rival manager, but eventually faces them down with his black card..."
          />
        </div>
        
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-slate-600">Genre / Style</label>
          <input
            className="bg-white border border-slate-200 rounded-[2px] px-3 py-1.5 text-[12px] text-slate-900 focus:outline-none focus:border-blue-500"
            value={state.genre}
            onChange={e => updateState({ genre: e.target.value })}
            placeholder="Drama / Revenge"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-slate-600">Language</label>
            <select
              className="bg-white border border-slate-200 rounded-[2px] px-3 py-1.5 text-[12px] text-slate-900 focus:outline-none focus:border-blue-500"
              value={state.language}
              onChange={e => updateState({ language: e.target.value })}
            >
              <option>English</option>
              <option>Korean</option>
              <option>Spanish</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-slate-600">Target Length</label>
            <select
              className="bg-white border border-slate-200 rounded-[2px] px-3 py-1.5 text-[12px] text-slate-900 focus:outline-none focus:border-blue-500"
              value={state.targetLength}
              onChange={e => updateState({ targetLength: e.target.value })}
            >
              <option>10-15 minutes</option>
              <option>15-20 minutes</option>
              <option>20-30 minutes</option>
              <option>30+ minutes</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-slate-600 flex items-center justify-between">
            Forbidden Elements
            <span className="text-[10px] text-slate-400 font-normal">Optional</span>
          </label>
          <input
            className="bg-white border border-slate-200 rounded-[2px] px-3 py-1.5 text-[12px] text-slate-900 focus:outline-none focus:border-blue-500"
            value={state.forbiddenElements}
            onChange={e => updateState({ forbiddenElements: e.target.value })}
            placeholder="No magic, no time travel..."
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-slate-600 flex items-center justify-between">
            Competitor Style References
            <span className="text-[10px] text-slate-400 font-normal">Optional</span>
          </label>
          <textarea
            className="bg-white border border-slate-200 rounded-[2px] px-3 py-1.5 text-[12px] text-slate-900 focus:outline-none focus:border-blue-500 h-24 resize-y"
            value={state.competitors}
            onChange={e => updateState({ competitors: e.target.value })}
            placeholder="Paste competitor scripts here for style reference (do not copy meaning)..."
          />
        </div>

        {state.stageStatuses['story_dna'] === 'locked' && (
          <div className="mt-4 pt-4 border-t border-slate-100">
             <h3 className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-2">
               Locked Story Contract
             </h3>
             <div className="text-[11px] text-slate-500 bg-slate-50 border border-slate-200 border-dashed rounded-[2px] p-4 leading-relaxed">
               <strong>Protagonist power source</strong> and <strong>emotional engine</strong> are locked. AI is restricted from drifting.
             </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col gap-2 shrink-0">
        <div className="grid grid-cols-2 gap-2">
           <button className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-[10px] font-bold uppercase tracking-wider transition-all">
             <Save className="w-3 h-3" /> Save Draft
           </button>
           <button className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-[10px] font-bold uppercase tracking-wider transition-all">
             <Server className="w-3 h-3" /> Load Draft
           </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
           <button className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-[10px] font-bold uppercase tracking-wider transition-all">
             <Upload className="w-3 h-3" /> Import
           </button>
           <button className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-[10px] font-bold uppercase tracking-wider transition-all">
             <Download className="w-3 h-3" /> Export
           </button>
        </div>
        <button 
          onClick={onResetProject}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 text-[11px] font-black uppercase tracking-widest transition-all mt-2"
        >
          <RefreshCw className="w-4 h-4" /> Reset Project
        </button>
      </div>
    </aside>
  );
}
