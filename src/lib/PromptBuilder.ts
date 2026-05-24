import { ProjectState, StageId } from '../types';

export function buildPrompt(stageId: StageId, state: ProjectState): string {
  let prompt = '';
  
  if (stageId !== 'raw_idea' && stageId !== 'story_dna' && stageId !== 'story_plan') {
    prompt += `=== GLOBAL RULES ===\n${state.promptRegistry.globalRulesPrompt}\n\n`;
    
    if (state.stageStatuses['story_dna'] === 'locked') {
      prompt += `=== LOCKED STORY CONTRACT ===\n${state.storyContract}\n${state.characterBible}\n\n`;
    }
  
    prompt += `=== PREVIOUS STAGE CONTEXT ===\n`;
  } else {
    // For stages 1-3, previous context is injected into their respective prompt templates directly.
  }
  switch (stageId) {
    case 'raw_idea':
       // Variables injected below
       break;
    case 'story_dna':
       // Variables injected below
       break;
    case 'story_plan':
       // Variables injected below
       break;
    case 'scene_cards':
       prompt += `Story Plan (Stage 3): ${state.storyPlan}\n`;
       break;
    case 'script_writer':
       prompt += `Story Plan (Stage 3): ${state.storyPlan}\nScene Cards (Stage 4): ${state.sceneCards}\n`;
       break;
    case 'clean_export':
       prompt += `Final Script: ${state.fullScript}\nClean Export Mode: ${JSON.stringify(state.cleanExportSettings)}\n`;
       break;
  }
  prompt += `\n`;

  prompt += `=== STAGE TASK ===\n`;
  switch (stageId) {
    case 'raw_idea': 
      let stage1Prompt = state.promptRegistry.stageOneRawIdeaPrompt;
      stage1Prompt = stage1Prompt.replace('{{PROJECT_TITLE}}', state.projectTitle || 'None');
      stage1Prompt = stage1Prompt.replace('{{RAW_IDEA}}', state.rawIdea || 'None');
      stage1Prompt = stage1Prompt.replace('{{GENRE}}', state.genre || 'None');
      stage1Prompt = stage1Prompt.replace('{{OUTPUT_LANGUAGE}}', 'Russian');
      stage1Prompt = stage1Prompt.replace('{{TARGET_LENGTH}}', state.targetLength || 'None');
      stage1Prompt = stage1Prompt.replace('{{STYLE_NOTES}}', state.styleNotes || 'None');
      stage1Prompt = stage1Prompt.replace('{{FORBIDDEN_ELEMENTS}}', state.forbiddenElements || 'None');
      stage1Prompt = stage1Prompt.replace('{{COMPETITOR_STYLE_NOTES}}', state.competitors || 'None');
      stage1Prompt = stage1Prompt.replace('{{GLOBAL_RULES}}', state.promptRegistry.globalRulesPrompt);
      prompt += stage1Prompt + `\n\n` + state.promptRegistry.stageOneExampleResponse; 
      break;
    case 'story_dna': 
      let stage2Prompt = state.promptRegistry.stageTwoStoryDNAPrompt;
      stage2Prompt = stage2Prompt.replace('{{PROJECT_TITLE}}', state.projectTitle || 'None');
      stage2Prompt = stage2Prompt.replace('{{DEVELOPED_IDEA}}', state.developedIdea || 'None');
      stage2Prompt = stage2Prompt.replace('{{STAGE_ONE_HANDOFF}}', 'Refer to the Handoff Summary in the Developed Idea above.');
      stage2Prompt = stage2Prompt.replace('{{GENRE}}', state.genre || 'None');
      stage2Prompt = stage2Prompt.replace('{{OUTPUT_LANGUAGE}}', 'Russian');
      stage2Prompt = stage2Prompt.replace('{{TARGET_LENGTH}}', state.targetLength || 'None');
      stage2Prompt = stage2Prompt.replace('{{STYLE_NOTES}}', state.styleNotes || 'None');
      stage2Prompt = stage2Prompt.replace('{{FORBIDDEN_ELEMENTS}}', state.forbiddenElements || 'None');
      stage2Prompt = stage2Prompt.replace('{{GLOBAL_RULES}}', state.promptRegistry.globalRulesPrompt);
      const stage2SupervisorNotes = state.promptHistory.filter(h => h.stageId === 'story_dna' && h.supervisorStatus).map(h => h.outputPreview).join('\\n') || 'None';
      stage2Prompt = stage2Prompt.replace('{{SUPERVISOR_NOTES}}', stage2SupervisorNotes);
      prompt += stage2Prompt + `\n\n` + state.promptRegistry.stageTwoExampleResponse; 
      break;
    case 'story_plan': 
      let stage3Prompt = state.promptRegistry.stageThreeStoryPlanPrompt;
      stage3Prompt = stage3Prompt.replace('{{PROJECT_TITLE}}', state.projectTitle || 'None');
      stage3Prompt = stage3Prompt.replace('{{DEVELOPED_IDEA}}', state.developedIdea || 'None');
      stage3Prompt = stage3Prompt.replace('{{STORY_CONTRACT}}', state.storyContract || 'None');
      stage3Prompt = stage3Prompt.replace('{{CHARACTER_BIBLE}}', state.characterBible || 'None');
      stage3Prompt = stage3Prompt.replace('{{GENRE}}', state.genre || 'None');
      stage3Prompt = stage3Prompt.replace('{{OUTPUT_LANGUAGE}}', 'Russian');
      stage3Prompt = stage3Prompt.replace('{{TARGET_LENGTH}}', state.targetLength || 'None');
      stage3Prompt = stage3Prompt.replace('{{STYLE_NOTES}}', state.styleNotes || 'None');
      stage3Prompt = stage3Prompt.replace('{{FORBIDDEN_ELEMENTS}}', state.forbiddenElements || 'None');
      stage3Prompt = stage3Prompt.replace('{{COMPETITOR_REFERENCE_EXAMPLES}}', state.competitors || 'None');
      stage3Prompt = stage3Prompt.replace('{{COMPETITOR_STYLE_BLUEPRINT}}', 'None');
      stage3Prompt = stage3Prompt.replace('{{AVATAR_COMMENTARY_SETTING}}', state.useAvatars ? 'Enabled' : 'Disabled');
      stage3Prompt = stage3Prompt.replace('{{GLOBAL_RULES}}', state.promptRegistry.globalRulesPrompt);
      const stage3SupervisorNotes = state.promptHistory.filter(h => h.stageId === 'story_plan' && h.supervisorStatus).map(h => h.outputPreview).join('\\n') || 'None';
      stage3Prompt = stage3Prompt.replace('{{SUPERVISOR_NOTES}}', stage3SupervisorNotes);
      prompt += stage3Prompt + `\n\n` + state.promptRegistry.stageThreeExampleResponse; 
      break;
    case 'scene_cards': 
      let stage4Prompt = state.promptRegistry.stageFourSceneCardsPrompt;
      stage4Prompt = stage4Prompt.replace('{{PROJECT_TITLE}}', state.projectTitle || 'None');
      stage4Prompt = stage4Prompt.replace('{{OUTPUT_LANGUAGE}}', 'Russian');
      stage4Prompt = stage4Prompt.replace('{{GENRE}}', state.genre || 'None');
      stage4Prompt = stage4Prompt.replace('{{TARGET_LENGTH}}', state.targetLength || 'None');
      stage4Prompt = stage4Prompt.replace('{{DEVELOPED_IDEA}}', state.developedIdea || 'None');
      stage4Prompt = stage4Prompt.replace('{{STORY_CONTRACT}}', state.storyContract || 'None');
      stage4Prompt = stage4Prompt.replace('{{CHARACTER_BIBLE}}', state.characterBible || 'None');
      stage4Prompt = stage4Prompt.replace('{{STORY_PLAN}}', state.storyPlan || 'None');
      stage4Prompt = stage4Prompt.replace('{{CURRENT_PART_NUMBER}}', 'None'); // Depending on mode, could be injected later if partial
      stage4Prompt = stage4Prompt.replace('{{CURRENT_PART_PLAN}}', 'None');
      stage4Prompt = stage4Prompt.replace('{{SCRIPT_FORMATTING_CONTRACT}}', 'None'); // Mocked or provided elsewhere
      stage4Prompt = stage4Prompt.replace('{{AVATAR_COMMENTARY_MAP}}', state.useAvatars ? 'Enabled' : 'Disabled');
      stage4Prompt = stage4Prompt.replace('{{COMPETITOR_REFERENCE_EXAMPLES}}', state.competitors || 'None');
      stage4Prompt = stage4Prompt.replace('{{COMPETITOR_STYLE_BLUEPRINT}}', 'None');
      stage4Prompt = stage4Prompt.replace('{{FORBIDDEN_ELEMENTS}}', state.forbiddenElements || 'None');
      stage4Prompt = stage4Prompt.replace('{{GLOBAL_RULES}}', state.promptRegistry.globalRulesPrompt);
      const stage4SupervisorNotes = state.promptHistory.filter(h => h.stageId === 'scene_cards' && h.supervisorStatus).map(h => h.outputPreview).join('\\n') || 'None';
      stage4Prompt = stage4Prompt.replace('{{SUPERVISOR_NOTES}}', stage4SupervisorNotes);
      prompt += stage4Prompt + `\n\n` + state.promptRegistry.stageFourExampleResponse;
      break;
    case 'script_writer': 
      let stage5Prompt = state.promptRegistry.stageFiveScriptWriterPrompt;
      stage5Prompt = stage5Prompt.replace('{{PROJECT_TITLE}}', state.projectTitle || 'None');
      stage5Prompt = stage5Prompt.replace('{{OUTPUT_LANGUAGE}}', 'English');
      stage5Prompt = stage5Prompt.replace('{{GENRE}}', state.genre || 'None');
      stage5Prompt = stage5Prompt.replace('{{TARGET_LENGTH}}', state.targetLength || 'None');
      stage5Prompt = stage5Prompt.replace('{{DEVELOPED_IDEA}}', state.developedIdea || 'None');
      stage5Prompt = stage5Prompt.replace('{{STORY_CONTRACT}}', state.storyContract || 'None');
      stage5Prompt = stage5Prompt.replace('{{CHARACTER_BIBLE}}', state.characterBible || 'None');
      stage5Prompt = stage5Prompt.replace('{{STORY_PLAN}}', state.storyPlan || 'None');
      stage5Prompt = stage5Prompt.replace('{{SCENE_CARDS}}', state.sceneCards || 'None');
      stage5Prompt = stage5Prompt.replace('{{CURRENT_PART_NUMBER}}', 'None'); // Inject via buildPartPrompt
      stage5Prompt = stage5Prompt.replace('{{CURRENT_PART_TITLE}}', 'None');
      stage5Prompt = stage5Prompt.replace('{{CURRENT_PART_SCENE_CARDS}}', 'None');
      stage5Prompt = stage5Prompt.replace('{{PREVIOUS_APPROVED_SCRIPT_PARTS_SUMMARY}}', 'None');
      stage5Prompt = stage5Prompt.replace('{{REMAINING_PARTS_SUMMARY}}', 'None');
      stage5Prompt = stage5Prompt.replace('{{AVATAR_COMMENTARY_SETTING}}', state.useAvatars ? 'Enabled' : 'Disabled');
      stage5Prompt = stage5Prompt.replace('{{AVATAR_SLOT_FOR_CURRENT_PART}}', 'None');
      stage5Prompt = stage5Prompt.replace('{{COMPETITOR_REFERENCE_EXAMPLES}}', state.competitors || 'None');
      stage5Prompt = stage5Prompt.replace('{{COMPETITOR_STYLE_BLUEPRINT}}', 'None');
      stage5Prompt = stage5Prompt.replace('{{SCRIPT_FORMATTING_CONTRACT}}', 'Mock Formatting Contract'); // Mocked for now
      stage5Prompt = stage5Prompt.replace('{{FORBIDDEN_ELEMENTS}}', state.forbiddenElements || 'None');
      stage5Prompt = stage5Prompt.replace('{{GLOBAL_RULES}}', state.promptRegistry.globalRulesPrompt);
      const stage5SupervisorNotes = state.promptHistory.filter(h => h.stageId === 'script_writer' && h.supervisorStatus).map(h => h.outputPreview).join('\\n') || 'None';
      stage5Prompt = stage5Prompt.replace('{{SUPERVISOR_NOTES}}', stage5SupervisorNotes);
      prompt += stage5Prompt; 
      // If we have an example for Stage Five, append it here
      break;
    case 'clean_export': prompt += state.promptRegistry.stageSixCleanExportPrompt; break;
  }

  return prompt;
}

export function buildPartPrompt(partNumber: number, state: ProjectState): string {
  const part = state.scriptParts.find(p => p.partNumber === partNumber);
  
  let stage5Prompt = state.promptRegistry.stageFiveScriptWriterPrompt;
  stage5Prompt = stage5Prompt.replace('{{PROJECT_TITLE}}', state.projectTitle || 'None');
  stage5Prompt = stage5Prompt.replace('{{OUTPUT_LANGUAGE}}', 'English');
  stage5Prompt = stage5Prompt.replace('{{GENRE}}', state.genre || 'None');
  stage5Prompt = stage5Prompt.replace('{{TARGET_LENGTH}}', state.targetLength || 'None');
  stage5Prompt = stage5Prompt.replace('{{DEVELOPED_IDEA}}', state.developedIdea || 'None');
  stage5Prompt = stage5Prompt.replace('{{STORY_CONTRACT}}', state.storyContract || 'None');
  stage5Prompt = stage5Prompt.replace('{{CHARACTER_BIBLE}}', state.characterBible || 'None');
  stage5Prompt = stage5Prompt.replace('{{STORY_PLAN}}', state.storyPlan || 'None');
  stage5Prompt = stage5Prompt.replace('{{SCENE_CARDS}}', state.sceneCards || 'None');
  
  stage5Prompt = stage5Prompt.replace('{{CURRENT_PART_NUMBER}}', partNumber.toString());
  stage5Prompt = stage5Prompt.replace('{{CURRENT_PART_TITLE}}', part?.partTitle || `Part ${partNumber}`);
  stage5Prompt = stage5Prompt.replace('{{CURRENT_PART_SCENE_CARDS}}', part?.sourceSceneCards || 'None');
  
  // Create a summary of previous parts for continuity
  const previousParts = state.scriptParts.filter(p => p.partNumber < partNumber && p.status === 'locked');
  const previousSummary = previousParts.length > 0 
    ? previousParts.map(p => `Part ${p.partNumber}: ${p.partTitle}`).join('\\n') 
    : 'None. This is the first part.';
  stage5Prompt = stage5Prompt.replace('{{PREVIOUS_APPROVED_SCRIPT_PARTS_SUMMARY}}', previousSummary);
  
  const remainingParts = state.scriptParts.filter(p => p.partNumber > partNumber);
  const remainingSummary = remainingParts.length > 0
    ? remainingParts.map(p => `Part ${p.partNumber}: ${p.partTitle}`).join('\\n')
    : 'None. This is the last part.';
  stage5Prompt = stage5Prompt.replace('{{REMAINING_PARTS_SUMMARY}}', remainingSummary);
  
  stage5Prompt = stage5Prompt.replace('{{AVATAR_COMMENTARY_SETTING}}', state.useAvatars ? 'Enabled' : 'Disabled');
  stage5Prompt = stage5Prompt.replace('{{AVATAR_SLOT_FOR_CURRENT_PART}}', 'Unknown/Not specified'); // To be replaced in actual AI logic
  stage5Prompt = stage5Prompt.replace('{{COMPETITOR_REFERENCE_EXAMPLES}}', state.competitors || 'None');
  stage5Prompt = stage5Prompt.replace('{{COMPETITOR_STYLE_BLUEPRINT}}', 'None');
  stage5Prompt = stage5Prompt.replace('{{SCRIPT_FORMATTING_CONTRACT}}', 'Mock Formatting Contract'); 
  stage5Prompt = stage5Prompt.replace('{{FORBIDDEN_ELEMENTS}}', state.forbiddenElements || 'None');
  stage5Prompt = stage5Prompt.replace('{{GLOBAL_RULES}}', state.promptRegistry.globalRulesPrompt);
  
  const stage5SupervisorNotes = state.promptHistory.filter(h => h.stageId === 'script_writer' && h.supervisorStatus).map(h => h.outputPreview).join('\\n') || 'None';
  stage5Prompt = stage5Prompt.replace('{{SUPERVISOR_NOTES}}', stage5SupervisorNotes);
  
  return stage5Prompt;
}

export function buildSupervisorPrompt(stageId: StageId, output: string, state: ProjectState): string {
  return `=== AI SUPERVISOR ===\n${state.promptRegistry.aiSupervisorPrompt}\n\nSTAGE: ${stageId}\n\n=== OUTPUT TO CHECK ===\n${output}\n\nIMPORTANT: Provide your analysis and report in Russian.`;
}

export function buildRepairPrompt(stageId: StageId, brokenOutput: string, report: any, state: ProjectState): string {
  const lang = stageId === 'script_writer' ? 'English' : 'Russian';
  return `=== REPAIR ===\n${state.promptRegistry.repairPrompt}\n\nBROKEN OUTPUT:\n${brokenOutput}\n\nSUPERVISOR REPORT:\n${JSON.stringify(report, null, 2)}\n\nIMPORTANT: Output the repaired version in ${lang}. Ensure all structural rules are preserved.`;
}
