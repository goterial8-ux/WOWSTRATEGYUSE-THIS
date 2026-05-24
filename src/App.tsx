import React, { useState } from 'react';
import { INITIAL_STATE, ProjectState, StageId, StageStatus, SupervisorReport, CleanExportSettings, ScriptPart, STAGES } from './types';
import { TopBar } from './components/TopBar';
import { LeftPanel } from './components/LeftPanel';
import { RightPanel } from './components/RightPanel';
import { SupervisorPanel } from './components/SupervisorPanel';
import { Bug, X } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<ProjectState>(INITIAL_STATE);
  const [currentStageId, setCurrentStageId] = useState<StageId>('raw_idea');
  const [isGenerating, setIsGenerating] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);

  const updateState = (partial: Partial<ProjectState>) => {
    setState(prev => ({ ...prev, ...partial }));
  };

  const updateStageStatus = (stageId: StageId, status: StageStatus) => {
    setState(prev => ({
      ...prev,
      stageStatuses: { ...prev.stageStatuses, [stageId]: status }
    }));
  };

  const updateExportSettings = (partial: Partial<CleanExportSettings>) => {
    setState(prev => ({
      ...prev,
      cleanExportSettings: { ...prev.cleanExportSettings, ...partial }
    }));
  }

  const getStageContent = (stageId: StageId): string => {
    switch(stageId) {
      case 'raw_idea': return state.developedIdea;
      case 'story_dna': return state.storyContract;
      case 'story_plan': return state.storyPlan;
      case 'scene_cards': return state.sceneCards;
      case 'script_writer': return state.fullScript;
      case 'clean_export': return state.finalCleanScript;
      default: return '';
    }
  };

  const setStageContent = (stageId: StageId, content: string) => {
    switch(stageId) {
      case 'raw_idea': updateState({ developedIdea: content }); break;
      case 'story_dna': updateState({ storyContract: content }); break;
      case 'story_plan': updateState({ storyPlan: content }); break;
      case 'scene_cards': updateState({ sceneCards: content }); break;
      case 'script_writer': updateState({ fullScript: content }); break;
      case 'clean_export': updateState({ finalCleanScript: content }); break;
    }
  };

  const canProceedToStage = (stageId: StageId): { allowed: boolean; warning?: string } => {
    if (stageId === 'story_dna' && state.stageStatuses['raw_idea'] !== 'locked') return { allowed: false, warning: 'Stage One (Raw Idea) must be locked before starting Story DNA.' };
    if (stageId === 'story_plan' && state.stageStatuses['story_dna'] !== 'locked') return { allowed: false, warning: 'Story Contract must be locked before starting Story Plan.' };
    if (stageId === 'scene_cards' && state.stageStatuses['story_plan'] !== 'locked') return { allowed: false, warning: 'Story Plan must be locked before generating Scene Cards.' };
    if (stageId === 'script_writer' && state.stageStatuses['scene_cards'] !== 'locked') return { allowed: false, warning: 'Scene Cards must be locked before writing Script.' };
    return { allowed: true };
  };

  const handleGenerate = () => {
    const check = canProceedToStage(currentStageId);
    if (!check.allowed) {
      setWarningMessage(check.warning || 'Check previous stages.');
      setTimeout(() => setWarningMessage(null), 4000);
      return;
    }

    import('./lib/PromptBuilder').then(({ buildPrompt }) => {
      const promptUsed = buildPrompt(currentStageId, state);
      
      setIsGenerating(true);
      fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptUsed, type: 'text', stageId: currentStageId })
      })
      .then(async response => {
        const raw = await response.text();
        try {
          return JSON.parse(raw);
        } catch {
          console.error("Backend returned non-JSON:", raw);
          throw new Error("Backend returned HTML/non-JSON. Check API route.");
        }
      })
      .then(data => {
        if (!data.success) {
          throw new Error(data.error || 'Generation failed');
        }
        const textOutput = data.text;
        setStageContent(currentStageId, textOutput);
        updateStageStatus(currentStageId, 'generated');
        
        const newHistoryEntry = {
          id: Date.now().toString(),
          stageId: currentStageId,
          promptUsed,
          inputDataSummary: `Generated for ${currentStageId}`,
          outputPreview: textOutput.substring(0, 300) + (textOutput.length > 300 ? '...' : ''),
          createdAt: Date.now(),
          supervisorStatus: null,
          repairApplied: false,
          lockedStatus: false
        };

        updateState({
          supervisorReports: {
            ...state.supervisorReports,
            [currentStageId]: null
          },
          promptHistory: [newHistoryEntry, ...state.promptHistory]
        });
      })
      .catch(err => {
        console.error("Generation failed:", err);
        setWarningMessage(err.message || 'Error occurred during generation.');
        setTimeout(() => setWarningMessage(null), 5000);
      })
      .finally(() => {
        setIsGenerating(false);
      });
    });
  };

  const handleApproveAndLock = () => {
    updateStageStatus(currentStageId, 'locked');
    updateState({
      lockedData: { ...state.lockedData, [currentStageId]: true }
    });
  };

  const handleSendToNext = () => {
    const currentIndex = STAGES.findIndex(s => s.id === currentStageId);
    if (currentIndex >= 0 && currentIndex < STAGES.length - 1) {
      const nextStage = STAGES[currentIndex + 1].id;
      setCurrentStageId(nextStage);
    }
  };

  // --- Supervisor --
  const handleAnalyze = () => {
    import('./lib/PromptBuilder').then(({ buildSupervisorPrompt }) => {
      const promptUsed = buildSupervisorPrompt(currentStageId, getStageContent(currentStageId), state);
      
      setIsGenerating(true);
      fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptUsed, type: 'supervisor', stageId: currentStageId })
      })
      .then(async response => {
        const raw = await response.text();
        try {
          return JSON.parse(raw);
        } catch {
          console.error("Backend returned non-JSON:", raw);
          throw new Error("Backend returned HTML/non-JSON. Check API route.");
        }
      })
      .then(data => {
        if (!data.success) {
          throw new Error(data.error || 'Supervisor analysis failed');
        }
        
        const report: SupervisorReport = data.parsed;
        
        const newHistoryEntry = {
            id: Date.now().toString(),
            stageId: currentStageId,
            promptUsed,
            inputDataSummary: `Analyze output for ${currentStageId}`,
            outputPreview: JSON.stringify(report, null, 2),
            createdAt: Date.now(),
            supervisorStatus: report.status,
            repairApplied: false,
            lockedStatus: false
        };

        updateState({
          supervisorReports: { ...state.supervisorReports, [currentStageId]: report },
          promptHistory: [newHistoryEntry, ...state.promptHistory]
        });
        
        if (report.canContinue) {
          updateStageStatus(currentStageId, 'generated');
        } else {
          updateStageStatus(currentStageId, 'needs_repair');
        }
      })
      .catch(err => {
        console.error("Analysis failed:", err);
        setWarningMessage(err.message || 'Error occurred during supervisor analysis.');
        setTimeout(() => setWarningMessage(null), 5000);
      })
      .finally(() => {
        setIsGenerating(false);
      });
    });
  };

  const handleApplyRepair = () => {
    import('./lib/PromptBuilder').then(({ buildRepairPrompt }) => {
      const mockReport = state.supervisorReports[currentStageId];
      const promptUsed = buildRepairPrompt(currentStageId, getStageContent(currentStageId), mockReport, state);
      
      setIsGenerating(true);
      fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptUsed, type: 'text', stageId: currentStageId })
      })
      .then(async response => {
        const raw = await response.text();
        try {
          return JSON.parse(raw);
        } catch {
          console.error("Backend returned non-JSON:", raw);
          throw new Error("Backend returned HTML/non-JSON. Check API route.");
        }
      })
      .then(data => {
        if (!data.success) {
          throw new Error(data.error || 'Repair failed');
        }
        const textOutput = data.text;
        setStageContent(currentStageId, textOutput);
        
        const okReport: SupervisorReport = {
          status: 'ok',
          whatIsGood: 'Content aligns well with requirements.',
          problems: [],
          requiredFixes: [],
          recommendation: 'Safe to proceed.',
          canContinue: true
        };

        const newHistoryEntry = {
            id: Date.now().toString(),
            stageId: currentStageId,
            promptUsed,
            inputDataSummary: `Repair output for ${currentStageId}`,
            outputPreview: textOutput.substring(0, 300) + (textOutput.length > 300 ? '...' : ''),
            createdAt: Date.now(),
            supervisorStatus: 'ok',
            repairApplied: true,
            lockedStatus: false
        };

        updateState({
          supervisorReports: { ...state.supervisorReports, [currentStageId]: okReport },
          promptHistory: [newHistoryEntry, ...state.promptHistory]
        });
        updateStageStatus(currentStageId, 'generated'); // Back to generated (repaired)
      })
      .catch(err => {
        console.error("Repair failed:", err);
        setWarningMessage(err.message || 'Error occurred during repair.');
        setTimeout(() => setWarningMessage(null), 5000);
      })
      .finally(() => {
        setIsGenerating(false);
      });
    });
  };

  const handleApproveAnyway = () => {
    updateStageStatus(currentStageId, 'approved');
  };

  // --- Script Part Actions ---
  const updateScriptPart = (index: number, partial: Partial<ScriptPart>) => {
    const updated = [...state.scriptParts];
    updated[index] = { ...updated[index], ...partial };
    updateState({ scriptParts: updated });
  };
  
  const handleInitScriptParts = () => {
    updateState({
      scriptParts: [
        {
          partNumber: 1,
          partTitle: 'The Setup',
          sourceSceneCards: 'Scene 1-3...',
          draftText: '',
          status: 'not_started',
          supervisorReport: null,
          isComplete: false,
          wordOrCharacterCount: 0,
          hasGenerationResidue: false,
          hasDuplicateBlocks: false,
          avatarCount: 0
        },
        {
          partNumber: 2,
          partTitle: 'The Confrontation',
          sourceSceneCards: 'Scene 4-6...',
          draftText: '',
          status: 'not_started',
          supervisorReport: null,
          isComplete: false,
          wordOrCharacterCount: 0,
          hasGenerationResidue: false,
          hasDuplicateBlocks: false,
          avatarCount: 0
        }
      ]
    });
    updateStageStatus('script_writer', 'generated');
  };

  const handleGeneratePart = (index: number) => {
    import('./lib/PromptBuilder').then(({ buildPartPrompt }) => {
      const partNum = state.scriptParts[index].partNumber;
      const promptUsed = buildPartPrompt(partNum, state);
      
      setIsGenerating(true);
      fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptUsed, type: 'text', stageId: 'script_writer' })
      })
      .then(async response => {
        const raw = await response.text();
        try {
          return JSON.parse(raw);
        } catch {
          console.error("Backend returned non-JSON:", raw);
          throw new Error("Backend returned HTML/non-JSON. Check API route.");
        }
      })
      .then(data => {
        if (!data.success) {
          throw new Error(data.error || 'Part generation failed');
        }
        const textOutput = data.text;
        
        const newHistoryEntry = {
            id: Date.now().toString(),
            stageId: 'script_writer',
            promptUsed,
            inputDataSummary: `Generated for Script Part ${partNum}`,
            outputPreview: textOutput.substring(0, 300) + (textOutput.length > 300 ? '...' : ''),
            createdAt: Date.now(),
            supervisorStatus: null,
            repairApplied: false,
            lockedStatus: false
        };
        
        updateScriptPart(index, { status: 'generated', draftText: textOutput, wordOrCharacterCount: textOutput.length });
        updateState({
            promptHistory: [newHistoryEntry, ...state.promptHistory]
        });
      })
      .catch(err => {
        console.error("Part generation failed:", err);
        setWarningMessage(err.message || 'Error occurred during part generation.');
        setTimeout(() => setWarningMessage(null), 5000);
      })
      .finally(() => {
        setIsGenerating(false);
      });
    });
  };
  
  const handleCheckPart = (index: number) => {
    // mock check
    updateScriptPart(index, { status: 'needs_repair', hasGenerationResidue: true });
    updateState({
      supervisorReports: {
        ...state.supervisorReports,
        script_writer: {
          status: 'do_not_continue',
          whatIsGood: 'Nothing, residue detected.',
          problems: ['Residue detected in output.'],
          requiredFixes: ['Remove generating residue'],
          recommendation: 'Must repair manually.',
          canContinue: false
        }
      }
    });
  };
  
  const handleAssembleScript = () => {
    const assembledContent = state.scriptParts.map(p => `## Part ${p.partNumber}: ${p.partTitle}\n\n${p.draftText}`).join('\n\n');
    updateState({ fullScript: assembledContent });
  };

  const stageStatus = state.stageStatuses[currentStageId];
  const stageName = STAGES.find(s => s.id === currentStageId)?.name || '';
  const currentReport = state.supervisorReports[currentStageId];

  return (
    <div className="h-screen w-full flex flex-col bg-slate-50 text-slate-900 overflow-hidden font-sans relative">
      <TopBar 
        currentStage={currentStageId} 
        stageStatuses={state.stageStatuses} 
        onSelectStage={setCurrentStageId} 
      />
      
      {warningMessage && (
        <div className="bg-amber-100 text-amber-900 px-6 py-3 text-sm font-bold border-b border-amber-200">
          ⚠️ {warningMessage}
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        <LeftPanel 
          state={state} 
          updateState={updateState}
        />
        
        <div className="flex-1 flex flex-col min-w-0">
          <RightPanel 
            currentStageId={currentStageId}
            stageName={stageName}
            stageStatus={stageStatus}
            stageContent={getStageContent(currentStageId)}
            updateStageContent={(content) => setStageContent(currentStageId, content)}
            onGenerate={handleGenerate}
            onApproveAndLock={handleApproveAndLock}
            onSendToNext={handleSendToNext}
            exportSettings={state.cleanExportSettings}
            updateExportSettings={updateExportSettings}
            scriptParts={state.scriptParts}
            updateScriptPart={updateScriptPart}
            onInitScriptParts={handleInitScriptParts}
            onGeneratePart={handleGeneratePart}
            onCheckPart={handleCheckPart}
            onAssembleScript={handleAssembleScript}
          />
          
          <SupervisorPanel 
            report={currentReport}
            isGenerating={isGenerating}
            onAnalyze={handleAnalyze}
            onApplyRepair={handleApplyRepair}
            onApproveAnyway={handleApproveAnyway}
          />
        </div>
      </div>
      
      {/* Dev Bug Tool */}
      <button 
        onClick={() => setShowDebug(true)}
        className="absolute bottom-4 right-4 p-2 bg-slate-900 text-white rounded-full shadow-lg hover:bg-slate-800 transition-colors z-40 opacity-70 hover:opacity-100"
        title="Debug Project State"
      >
        <Bug className="w-4 h-4" />
      </button>

      {/* Debug Modal */}
      {showDebug && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-8">
          <div className="bg-slate-900 text-slate-300 w-full max-w-6xl h-full flex flex-col border border-slate-700 shadow-2xl rounded-sm overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-slate-800 text-white shrink-0">
               <h3 className="font-mono text-sm font-bold flex items-center gap-2"><Bug className="w-4 h-4 text-emerald-500" /> SYSTEM STATE (Developer Mode)</h3>
               <button onClick={() => setShowDebug(false)} className="hover:text-red-400"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="flex-1 flex overflow-hidden">
              <div className="w-1/4 border-r border-slate-800 flex flex-col">
                <div className="p-3 border-b border-slate-800 bg-slate-900/50 font-bold text-xs uppercase tracking-wider text-slate-400">
                  Prompt Registry
                </div>
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                  {Object.entries(state.promptRegistry).map(([key, value]) => (
                    <div key={key} className="flex flex-col gap-1">
                      <label className="text-[10px] font-mono text-slate-400">{key}</label>
                      <textarea
                        className="bg-slate-800 border border-slate-700 text-slate-300 text-xs p-2 rounded-sm focus:border-blue-500 focus:outline-none min-h-[60px]"
                        value={value}
                        onChange={(e) => updateState({ 
                          promptRegistry: { ...state.promptRegistry, [key]: e.target.value } 
                        })}
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex-1 flex flex-col border-r border-slate-800">
                <div className="p-3 border-b border-slate-800 bg-slate-900/50 font-bold text-xs uppercase tracking-wider text-slate-400 flex justify-between items-center">
                  <span>Active Prompts (Phase Four)</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                          import('./lib/PromptBuilder').then(({ buildSupervisorPrompt }) => {
                             const built = buildSupervisorPrompt(currentStageId, "[DRAFT OUTPUT]", state);
                             alert("Built Supervisor Prompt:\n\n" + built);
                          });
                      }}
                      className="px-3 py-1 bg-amber-900/30 text-amber-500 hover:text-amber-400 text-[10px] border border-amber-900/50 rounded-sm hover:-translate-y-px transition-transform"
                    >
                      Test Supervisor Prompt
                    </button>
                    <button 
                      onClick={() => {
                          import('./lib/PromptBuilder').then(({ buildPrompt }) => {
                             const built = buildPrompt(currentStageId, state);
                             alert("Built Prompt Preview:\n\n" + built);
                          });
                      }}
                      className="px-3 py-1 bg-blue-900/30 text-blue-400 hover:text-blue-300 text-[10px] border border-blue-900/50 rounded-sm hover:-translate-y-px transition-transform"
                    >
                      Test Script Prompt
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] leading-relaxed flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-emerald-500">Active Global Rules Prompt</label>
                    <pre className="bg-slate-950 p-2 rounded border border-slate-800 whitespace-pre-wrap">{state.promptRegistry.globalRulesPrompt}</pre>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-emerald-500">Active AI Supervisor Prompt</label>
                    <pre className="bg-slate-950 p-2 rounded border border-slate-800 whitespace-pre-wrap">{state.promptRegistry.aiSupervisorPrompt}</pre>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-blue-400">Last Built Prompt</label>
                    <pre className="bg-slate-950 p-2 rounded border border-slate-800 whitespace-pre-wrap text-blue-300">
                      {state.promptHistory.find(h => h.supervisorStatus === null)?.promptUsed || 'No generated prompts yet.'}
                    </pre>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-amber-500">Last Supervisor Prompt</label>
                    <pre className="bg-slate-950 p-2 rounded border border-slate-800 whitespace-pre-wrap text-amber-300">
                      {state.promptHistory.find(h => h.supervisorStatus !== null)?.promptUsed || 'No supervisor prompts yet.'}
                    </pre>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-amber-500">Last Supervisor Response</label>
                    <pre className="bg-slate-950 p-2 rounded border border-slate-800 whitespace-pre-wrap text-amber-300">
                      {state.promptHistory.find(h => h.supervisorStatus !== null)?.outputPreview || 'No supervisor responses yet.'}
                    </pre>
                  </div>
                </div>
              </div>
              
              <div className="w-1/4 flex flex-col">
                <div className="p-3 border-b border-slate-800 bg-slate-900/50 font-bold text-xs uppercase tracking-wider text-slate-400">
                  State JSON
                </div>
                <div className="flex-2 overflow-y-auto p-4 border-b border-slate-800 font-mono text-[11px] leading-relaxed">
                  <pre>{JSON.stringify(state, null, 2)}</pre>
                </div>
                <div className="flex-1 overflow-y-auto p-4 bg-slate-950 font-mono text-[10px] text-slate-500">
                  <h4 className="text-slate-400 mb-2 uppercase tracking-wide">Prompt History ({state.promptHistory.length})</h4>
                  {state.promptHistory.length === 0 && <p className="opacity-50">No generations yet.</p>}
                  {state.promptHistory.map(h => (
                    <div key={h.id} className="mb-2 p-2 border border-slate-800 rounded-sm">
                      <span className="text-emerald-700 font-bold">{h.stageId}</span> - Date: {new Date(h.createdAt).toLocaleTimeString()}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
