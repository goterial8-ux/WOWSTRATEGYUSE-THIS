import React from 'react';
import { STAGES, StageId, StageStatus } from '../types';
import { CheckCircle2, Circle, AlertCircle, Lock } from 'lucide-react';

interface TopBarProps {
  currentStage: StageId;
  stageStatuses: Record<StageId, StageStatus>;
  onSelectStage: (id: StageId) => void;
}

export function TopBar({ currentStage, stageStatuses, onSelectStage }: TopBarProps) {
  const renderStatusIcon = (status: string) => {
    switch (status) {
      case 'locked':
      case 'approved':
        return <div className="w-3 h-3 bg-emerald-500 rounded-none shrink-0" />;
      case 'needs_repair':
        return <div className="w-3 h-3 bg-amber-500 rounded-none shrink-0" />;
      case 'generated':
        return <div className="w-3 h-3 bg-blue-500 outline-3 outline-blue-500/20 rounded-none shrink-0" />;
      default:
        return <div className="w-3 h-3 bg-slate-300 rounded-none shrink-0" />;
    }
  };

  return (
    <header className="h-[72px] border-b border-slate-200 bg-white flex items-center px-6 shrink-0">
      <div className="flex items-center gap-2 mr-8">
        <div className="w-8 h-8 rounded-none bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
          S
        </div>
        <h1 className="font-bold text-slate-900 hidden md:block">Studio Writer</h1>
      </div>

      <nav className="flex-1 overflow-x-auto min-w-0">
        <ul className="flex flex-nowrap items-center gap-1 md:gap-4">
          {STAGES.map((stage, index) => {
            const status = stageStatuses[stage.id];
            const isActive = currentStage === stage.id;
            
            return (
              <li key={stage.id} className="flex items-center shrink-0">
                <button
                  onClick={() => onSelectStage(stage.id)}
                  className={`flex flex-col items-center gap-1.5 px-3 py-1.5 rounded-none transition-colors ${
                    isActive
                      ? 'text-blue-500'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {renderStatusIcon(status)}
                  <span className={`text-[10px] uppercase font-bold tracking-wider whitespace-nowrap ${isActive ? 'text-blue-500' : 'text-slate-500'}`}>{stage.name}</span>
                </button>
                {index < STAGES.length - 1 && (
                  <div className="w-12 h-px bg-transparent mx-2 hidden sm:block" />
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
