export type StageId =
  | 'raw_idea'
  | 'story_dna'
  | 'story_plan'
  | 'scene_cards'
  | 'script_writer'
  | 'clean_export';

export type StageStatus =
  | 'not_started'
  | 'generated'
  | 'needs_repair'
  | 'approved'
  | 'locked';

export type SupervisorStatus =
  | 'ok'
  | 'needs_small_repair'
  | 'needs_serious_repair'
  | 'do_not_continue';

export interface SupervisorReport {
  status: SupervisorStatus;
  whatIsGood: string;
  problems: string[];
  requiredFixes: string[];
  recommendation: string;
  canContinue: boolean;
}

export interface ProposedChange {
  proposedChange: string;
  reason: string;
  risk: string;
  requiresUserApproval: boolean;
}

export interface ScriptPart {
  partNumber: number;
  partTitle: string;
  sourceSceneCards: string;
  draftText: string;
  status: StageStatus;
  supervisorReport: SupervisorReport | null;
  isComplete: boolean;
  wordOrCharacterCount: number;
  hasGenerationResidue: boolean;
  hasDuplicateBlocks: boolean;
  avatarCount: number;
}

export interface CleanExportSettings {
  keepPartHeadings: boolean;
  removePartHeadings: boolean;
  keepAvatarMarkers: boolean;
  removeAvatarMarkersButKeepText: boolean;
  removeAvatarTextCompletely: boolean;
}

export interface PromptRegistry {
  globalRulesPrompt: string;
  aiSupervisorPrompt: string;
  stageOneRawIdeaPrompt: string;
  stageOneExampleResponse: string;
  stageTwoStoryDNAPrompt: string;
  stageTwoExampleResponse: string;
  stageThreeStoryPlanPrompt: string;
  stageThreeExampleResponse: string;
  stageFourSceneCardsPrompt: string;
  stageFourExampleResponse: string;
  stageFiveScriptWriterPrompt: string;
  stageSixCleanExportPrompt: string;
  repairPrompt: string;
  partRepairPrompt: string;
  continuityCheckPrompt: string;
  exportCheckPrompt: string;
}

export interface PromptHistoryEntry {
  id: string;
  stageId: StageId;
  promptUsed: string;
  inputDataSummary: string;
  outputPreview: string;
  createdAt: number;
  supervisorStatus: SupervisorStatus | null;
  repairApplied: boolean;
  lockedStatus: boolean;
}

export interface ProjectState {
  projectTitle: string;
  genre: string;
  language: string;
  targetLength: string;
  competitors: string;
  forbiddenElements: string;
  styleNotes: string;
  rawIdea: string;

  developedIdea: string;
  storyContract: string;
  characterBible: string;
  storyPlan: string;
  sceneCards: string;
  scriptParts: ScriptPart[];
  fullScript: string;
  
  cleanExportSettings: CleanExportSettings;
  finalCleanScript: string;
  
  supervisorReports: Record<StageId, SupervisorReport | null>;
  stageStatuses: Record<StageId, StageStatus>;
  lockedData: Record<string, boolean>;
  handoffSummaries: Record<StageId, string>;
  lastGeneratedAt: Record<StageId, number | null>;
  lastEditedAt: Record<StageId, number | null>;

  promptRegistry: PromptRegistry;
  promptHistory: PromptHistoryEntry[];
  useAvatars: boolean;
}

export const STAGES: { id: StageId; name: string }[] = [
  { id: 'raw_idea', name: 'Raw Idea' },
  { id: 'story_dna', name: 'Story DNA' },
  { id: 'story_plan', name: 'Story Plan' },
  { id: 'scene_cards', name: 'Scene Cards' },
  { id: 'script_writer', name: 'Script Writer' },
  { id: 'clean_export', name: 'Clean Export' },
];

export const INITIAL_PROMPT_REGISTRY: PromptRegistry = {
  globalRulesPrompt: `=== UNIVERSAL DRIFT PREVENTION ===
These are silent quality guardrails, not a story formula.
They must not force every story into investigation, court, documents, military, business, romance, system, magic, or any other template.
The system must preserve each project's unique genre, power source, emotional engine, and payoff type.

Before generating, the model must silently identify:
* What is unique about this project?
* What must not be replaced?
* What is the approved power source?
* What is the approved emotional engine?
* What would make this story feel too similar to previous projects?
Then generate while preserving uniqueness.

1. Locked Story Contract Check
Before generating, compare the stage goal with the locked Story Contract.
Locked facts stay locked; later stages cannot silently change approved story logic.

2. Power Source Lock
The protagonist can win only through the approved source of power.
Examples: money, magic, system, law, medicine, business, social status, combat, technology, inheritance, intelligence, strategy, cultivation, army, creativity, charisma.
Do not replace the approved power source with another one without Proposed Change.
Protagonist power source cannot mutate.

3. Emotional Engine Preservation
The core emotional engine must remain visible until the end.
Examples: betrayal, humiliation, fake marriage, exile, stolen work, false accusation, family rejection, romantic regret, survival pressure, underdog rise.

4. Character Function Matrix
Each main character must keep their approved function.
Do not randomly turn:
* betrayer into ally;
* ally into romantic prize only;
* antagonist into passive idiot;
* side character into protagonist replacement.
Antagonist must stay logical, not stupid for convenience.

5. Hidden Card Mutation Control
No new hidden status, secret bloodline, secret authority, secret contract, secret system, secret artifact, forgotten inheritance, or surprise witness unless already approved or marked as Proposed Change.
Hidden cards cannot be invented later without approval.

6. Domain Vocabulary Lock
Vocabulary must fit the approved genre and world.
Do not import cyber terms into non-cyber stories.
Do not import court terms into non-legal stories.
Do not import military structures into non-military stories unless approved.

7. Payoff Realism
Face-slaps must be satisfying but believable within the selected genre.
Payoff must come from approved story DNA.

8. Competitor Reference Control
Competitor examples may influence pacing, hook rhythm, emotional escalation, and dopamine beats.
They must not copy: plot, characters, scenes, locations, dialogue, proof objects, twists, final collapse, or unique worldbuilding.

=== PROPOSED CHANGE PROTOCOL ===
If any generation wants to change locked data, it must output:
Proposed Change:
Current locked fact:
Suggested change:
Reason:
Risk:
Requires user approval: yes
The app must not apply the change automatically.

=== OUTPUT SCHEMA ENFORCEMENT & PREFLIGHT DETECTORS ===
- Stage One must include: developed concept, hook, genre, protagonist, conflict, emotional engine, power source, story promise, handoff summary.
- Stage Two must include: protagonist, antagonist, key characters, character functions, emotional engine, source of power, hidden cards, forbidden changes, final payoff promise, locked Story Contract.
- Stage Three must include: part list, part purpose, key events, face-slap/payoff, emotional shift, hidden card movement, ending hook, target length.
- Stage Four must include: scene cards grouped by part, location/surface, characters, conflict, visual action, proof/reveal, emotional movement, payoff, exit hook.
- Stage Five script part must include: part number, source scene cards, draft text, completion status, character count, avatar count, residue check status.
- Stage Six clean export must include: final clean script, export settings used.

SCRIPT WRITER SAFETY:
Each part must be checked. A part cannot be assembled into fullScript unless: complete; no generation residue; follows source scene cards; no drift from Story Contract; passes paragraph and voiceover checks; avatar count is valid.

CLEAN EXPORT SAFETY:
Stage Six must not rewrite the story. It only removes technical residue and applies export settings.
Before export, run preflight: all script parts complete; no missing parts; no unfinished fragments; no duplicate blocks; no generation residue; no debug text; no internal labels; no decorative separators; avatar handling valid; final script assembled.

RESIDUE DETECTOR:
No generation residue in final outputs. Forbidden residue examples: [идет генерация], [generating part], writing part, continue from, draft continues, unfinished, TODO, placeholder, debug, stage output, scene card, linter report, QA notes, === PART ONE ===, ----------------, markdown headers, prompt notes, output start, output end.
No decorative stage markers in clean export.

INCOMPLETE OUTPUT DETECTOR:
No unfinished fragments can be approved. Flag if: ends mid-sentence; ends with incomplete paragraph; contains continuation marker; contains generation progress; final part is missing; script part is marked incomplete; required ending hook or final payoff is missing.
`,

  aiSupervisorPrompt: `=== AI SUPERVISOR DIAGNOSTICS ===
The AI Supervisor is not the writer.
You must check outputs after every stage and return structured JSON-like diagnostic data.
Analyze the output against the stage goal, global rules, and locked story contract.

You must check:
* Does this output follow the approved previous handoff?
* Did the story drift?
* Did character roles change?
* Did protagonist power source change?
* Did the protagonist gain an unapproved hidden status?
* Did the emotional engine disappear?
* Did genre/domain vocabulary drift?
* Did hidden cards mutate or appear without approval?
* Did the antagonist become stupid only for convenience?
* Did the output become too generic?
* Did it repeat previous projects too closely?
* Is it too long or too short for the stage?
* Does it contain technical residue?
* Does it contain unfinished fragments?
* Is it safe to continue?

If required schema sections are missing, flag it.
If forbidden residue detected, status: Do not continue, canContinue: false.
If incomplete output detected (ends mid-sentence/paragraph, missing final part/hook), cannot be approved.
For Stage Six, check if it's ready for clean export. If preflight fails, block export and show: "Script is not ready for clean export. Repair the marked issues first."

You must not rewrite the whole output by default. Give targeted repair instructions.

Return EXACTLY IN THIS STRUCTURED FORMAT:
status: (ok | needs_small_repair | needs_serious_repair | do_not_continue)
whatIsGood: ...
problems: ...
requiredFixes: ...
recommendation: ...
canContinue: (true | false)`,
  
  stageOneRawIdeaPrompt: `You are STAGE ONE — RAW IDEA DEVELOPMENT.

Your task is to take the user's raw idea and develop it into a strong, clear, original story concept for a long-form YouTube recap / drama / manhwa-style script.

This is the first creative stage of the pipeline.

You must NOT write the full story.
You must NOT write the full plan.
You must NOT write scene cards.
You must NOT write the final script.
You must NOT overcomplicate the idea.

Your job is to turn a raw idea into a usable story foundation for Stage Two.

==================================================
INPUT
==================================================

Project Title:
{{PROJECT_TITLE}}

Raw Idea:
{{RAW_IDEA}}

Genre:
{{GENRE}}

Output Language:
{{OUTPUT_LANGUAGE}}

Target Length:
{{TARGET_LENGTH}}

Style Notes:
{{STYLE_NOTES}}

Forbidden Elements:
{{FORBIDDEN_ELEMENTS}}

Competitor Style Notes, if provided:
{{COMPETITOR_STYLE_NOTES}}

Global Rules:
{{GLOBAL_RULES}}

==================================================
CORE TASK
==================================================

Develop the raw idea into a strong story concept.

You must preserve the unique DNA of the raw idea.

Do not replace the raw idea with a different story.

Do not change the genre unless the user clearly asks for it.

Do not give the protagonist a random new secret status, secret royal bloodline, secret inheritance, secret inspector rank, secret god identity, hidden system, or new magical power unless the raw idea already includes it.

Strengthen the idea through:

- stronger conflict;
- clearer emotional engine;
- sharper protagonist contrast;
- better antagonist pressure;
- clearer viewer promise;
- better stakes;
- stronger payoff potential;
- more original hook.

Do not strengthen the idea by randomly changing its core premise.

==================================================
WHAT STAGE ONE MUST CREATE
==================================================

Stage One must create a developed concept that Stage Two can use to build the Story DNA and Characters.

The output must clearly define:

1. Core Concept
2. Genre and Audience Promise
3. Main Hook
4. Protagonist
5. Protagonist Starting Weakness or Status Problem
6. Protagonist Approved Power Source
7. Main Conflict
8. Antagonist Direction
9. Emotional Engine
10. Main Viewer Question
11. Payoff Promise
12. Drift Risks
13. Forbidden Changes
14. Handoff Summary for Stage Two

==================================================
IMPORTANT DEVELOPMENT RULES
==================================================

The raw idea may be rough, messy, incomplete, or short.

Your job is to develop it, not replace it.

If the raw idea is missing details, you may create supporting details that fit the premise.

You may add:

- clearer stakes;
- stronger antagonist pressure;
- better emotional wound;
- stronger opening situation;
- better protagonist limitation;
- better contrast between public weakness and hidden strength;
- possible final payoff direction;
- possible hidden card direction.

But you must not add anything that changes the approved core.

Examples:

If the raw idea is about a weak-looking boy surviving with intelligence, do not suddenly make him a secret prince unless the user asked for it.

If the raw idea is about a fake marriage, do not erase the fake marriage and turn it into a normal investigation.

If the raw idea is about business revenge, do not turn it into cultivation fantasy.

If the raw idea is about a medical genius, do not make the hero win through magic unless magic is part of the premise.

If the raw idea is about a system, do not replace the system with random inheritance.

If the raw idea is about survival, do not remove survival pressure and turn it into pure romance.

==================================================
COMPETITOR STYLE RULE
==================================================

If competitor style notes are provided, use them only for:

- hook strength;
- pacing expectation;
- emotional escalation;
- dopamine rhythm;
- face-slap logic;
- audience retention structure.

Do NOT copy competitor:

- plot;
- characters;
- names;
- exact scenes;
- locations;
- dialogue;
- proof objects;
- twists;
- endings;
- unique worldbuilding.

Competitor references affect rhythm, not story content.

==================================================
PROTAGONIST POWER SOURCE RULE
==================================================

You must clearly define the protagonist's approved power source.

The power source can be:

- intelligence;
- money;
- social status;
- hidden competence;
- system ability;
- magic;
- martial power;
- business skill;
- legal knowledge;
- medical knowledge;
- technology;
- strategy;
- charisma;
- survival instinct;
- creativity;
- inheritance;
- army;
- cultivation;
- psychological control;
- another source approved by the raw idea.

Once defined, this power source must remain stable.

Do not mix random power sources unless the raw idea supports it.

Bad:
The hero starts as a medical genius, then suddenly wins because he is secretly a billionaire prince.

Good:
The hero starts as a medical genius and wins through diagnosis, evidence, and calm decision-making.

Bad:
The hero starts with a system, but the final win comes from random inheritance.

Good:
The hero starts with a system and the final win comes from using the system better than everyone else.

==================================================
EMOTIONAL ENGINE RULE
==================================================

You must clearly define the emotional engine.

The emotional engine is the emotional reason viewers continue watching.

Possible emotional engines include:

- humiliation;
- betrayal;
- fake marriage;
- romantic regret;
- family rejection;
- stolen work;
- false accusation;
- exile;
- survival pressure;
- underdog rise;
- revenge fantasy;
- public disrespect;
- social status reversal;
- chosen one inversion;
- abandoned child;
- weak-to-strong progression;
- poor-to-rich progression;
- mocked genius;
- hidden identity pressure;
- kingdom building pressure.

The emotional engine must stay visible throughout the future story.

Do not let the plot mechanism erase the emotional engine.

For example:

Investigation can be a plot mechanism.
But if the emotional engine is fake marriage, the fake marriage must remain important.

War can be a plot mechanism.
But if the emotional engine is betrayal, the betrayal must remain important.

Magic can be a plot mechanism.
But if the emotional engine is humiliation, the humiliation must remain important.

==================================================
ANTAGONIST DIRECTION RULE
==================================================

At Stage One, do not fully write the antagonist yet.

Define only the antagonist direction.

Explain:

- what kind of force opposes the protagonist;
- why the antagonist has power at the beginning;
- what false belief drives the antagonist;
- why viewers will want to see the antagonist lose;
- how the antagonist pressure can escalate.

The antagonist must not be stupid by default.

They should be hateable but functional.

They should lose later because:

- they underestimate the protagonist;
- they misunderstand the protagonist's power source;
- they overcommit;
- they abuse status;
- they leave proof;
- they create their own collapse.

==================================================
PAYOFF PROMISE RULE
==================================================

Define the story's payoff promise.

The payoff promise is what the viewer expects to receive by the end.

It can include:

- public revenge;
- social face-slap;
- romantic regret;
- enemy collapse;
- family regret;
- business takeover;
- survival escape;
- system domination;
- kingdom rise;
- legal victory;
- medical proof;
- supernatural awakening;
- emotional liberation;
- final refusal of forgiveness;
- earned respect.

The payoff must come from the approved story DNA.

Do not create a payoff that belongs to a different genre.

==================================================
DRIFT RISK RULE
==================================================

You must list the main risks that could make later stages break the story.

Examples:

- protagonist may become too powerful too early;
- emotional engine may disappear;
- romance may replace the main conflict;
- investigation may erase the relationship premise;
- antagonist may become stupid;
- hidden card may become random secret status;
- story may become too generic;
- competitor influence may become copying;
- world vocabulary may drift into the wrong genre.

These drift risks will help AI Supervisor check later stages.

==================================================
FORBIDDEN CHANGES RULE
==================================================

You must list what later stages must NOT change.

Examples:

- do not change protagonist's approved power source;
- do not change the core emotional engine;
- do not remove the main relationship premise;
- do not change the genre;
- do not add secret royal bloodline;
- do not add secret inspector status;
- do not add random system ability;
- do not turn the ally into only a romantic prize;
- do not make the antagonist stupid for convenience;
- do not copy competitor plot.

Forbidden changes must be specific to the current idea.

==================================================
OUTPUT STYLE
==================================================

Write clearly and practically.

Do not use huge walls of vague text.

Do not write like a novel.

Do not write final prose.

Do not write scene cards.

Do not write dialogue unless one short sample hook line is useful.

Use structured sections.

Keep the output detailed enough to guide Stage Two, but compact enough for the user to review.

==================================================
OUTPUT FORMAT
==================================================

Return exactly this structure:

STAGE ONE — RAW IDEA DEVELOPMENT

1. CORE CONCEPT

Write a clear developed version of the raw idea in one to three paragraphs.

2. GENRE AND AUDIENCE PROMISE

Genre:
Audience Promise:

Explain what kind of viewers this is for and what emotional experience they should expect.

3. MAIN HOOK

Write the main hook in one strong paragraph.

Optional Short Title Direction:
Give two to three possible title directions if useful.

4. PROTAGONIST

Name or Placeholder Name:
Role:
Public Image:
Private Truth:
Starting Problem:

Describe the protagonist clearly.

5. PROTAGONIST STARTING WEAKNESS OR STATUS PROBLEM

Explain why the protagonist is underestimated, trapped, humiliated, weak, poor, powerless, rejected, or misunderstood at the start.

6. PROTAGONIST APPROVED POWER SOURCE

Approved Power Source:
How It Works:
Why It Fits The Story:
What It Must Not Become:

Define the power source clearly.

7. MAIN CONFLICT

Explain the central conflict.

Include:
- what the protagonist wants;
- what blocks them;
- what makes the situation urgent;
- what makes the conflict emotionally satisfying.

8. ANTAGONIST DIRECTION

Antagonist Type:
Initial Power:
False Belief:
Pressure Method:
Escalation Direction:

Do not fully write the antagonist yet. Give the direction.

9. EMOTIONAL ENGINE

Primary Emotional Engine:
Secondary Emotional Engine, if any:

Explain what emotional wound or desire keeps viewers watching.

10. MAIN VIEWER QUESTION

Write the central question viewers will keep watching to answer.

Examples:
Will the mocked hero expose everyone?
Will the betrayed protagonist make them regret it?
Will the weak-looking survivor outsmart the whole system?
Will the fake marriage become real respect?
Will the stolen work return to its true creator?

11. PAYOFF PROMISE

Explain what the final satisfaction should feel like.

Include:
- what kind of face-slap or victory is promised;
- who should regret;
- what should be publicly reversed;
- what the protagonist should gain emotionally.

12. DRIFT RISKS

List the main risks for later stages.

Use this format:

Risk One:
Why it is dangerous:
How to prevent it:

Risk Two:
Why it is dangerous:
How to prevent it:

Risk Three:
Why it is dangerous:
How to prevent it:

13. FORBIDDEN CHANGES

List what later stages must not change.

Use direct rules:

- Do not...
- Do not...
- Do not...

14. HANDOFF SUMMARY FOR STAGE TWO

Write a compact handoff summary for Stage Two.

It must include:

- core premise;
- protagonist;
- power source;
- emotional engine;
- antagonist direction;
- payoff promise;
- forbidden changes.

This handoff will be used by Stage Two to create the Story DNA and Characters.

==================================================
FINAL CHECK BEFORE OUTPUT
==================================================

Before finalizing, silently check:

- Did I preserve the raw idea?
- Did I avoid changing the genre?
- Did I define the protagonist clearly?
- Did I define the power source clearly?
- Did I define the emotional engine clearly?
- Did I avoid random secret status upgrades?
- Did I avoid writing the full plot?
- Did I avoid scene cards?
- Did I provide clear forbidden changes?
- Is the handoff useful for Stage Two?

Output only the Stage One response.`,
  stageOneExampleResponse: `==================================================
IMPORTANT: HOW TO USE THIS EXAMPLE
==================================================

This is only an example of Stage One output.

Do not copy this plot, characters, setting, names, conflicts, or exact wording.

Use it only to understand:
- structure;
- level of detail;
- how to preserve raw idea;
- how to define power source;
- how to define emotional engine;
- how to list drift risks;
- how to create a useful handoff for Stage Two.

The real Stage One response must be based only on the user’s actual raw idea.
STAGE ONE — RAW IDEA DEVELOPMENT

1. CORE CONCEPT

The story is about a weak-looking young man named Arin Vale, who is thrown out of his noble family after being falsely labeled useless. Everyone believes he has no combat talent, no inheritance value, and no future.

After his exile, Arin discovers an abandoned underground settlement beneath the ruined borderlands. Instead of gaining sudden royal blood or a secret god power, he survives through strategy, resource management, engineering knowledge, and the ability to organize rejected people into a functioning hidden city.

The core story promise is simple: the family that discarded him will slowly realize that the “useless son” they abandoned is building the only safe kingdom left.

2. GENRE AND AUDIENCE PROMISE

Genre:
Kingdom-building revenge fantasy / underdog rise / family regret drama.

Audience Promise:
Viewers should expect a satisfying weak-to-strong rise, public regret from the people who mocked the protagonist, smart survival decisions, base-building progression, and a final reversal where the rejected hero becomes the person everyone needs.

3. MAIN HOOK

A noble family throws away their weakest son during a succession crisis, believing he will die in the borderlands. But instead of begging to return, he finds a ruined underground city and begins rebuilding it with exiles, criminals, failed knights, and abandoned workers. While his family collapses under political pressure, the son they erased becomes the hidden ruler of the safest territory in the kingdom.

Optional Short Title Direction:
The Useless Son Built a Secret Kingdom After His Family Threw Him Away.

They Banished Me as a Failure, So I Built the Only Kingdom That Survived.

My Noble Family Abandoned Me, Then Begged for Shelter in My Hidden City.

4. PROTAGONIST

Name or Placeholder Name:
Arin Vale.

Role:
Exiled noble son and future founder of a hidden border kingdom.

Public Image:
Weak, useless, soft, talentless, politically worthless.

Private Truth:
He is not physically strong, but he has exceptional strategic intelligence, memory, engineering sense, and emotional control under pressure.

Starting Problem:
He has no army, no money, no official title, and no family protection. He is thrown into a deadly borderland where monsters, famine, and bandits destroy ordinary people within days.

5. PROTAGONIST STARTING WEAKNESS OR STATUS PROBLEM

Arin is underestimated because his world values sword talent, bloodline prestige, and aggressive charisma. He has none of those obvious qualities. He is quiet, physically unimpressive, and socially dismissed as the family’s failed child.

His weakness is important because the story should not begin with him secretly being the strongest person alive. The satisfaction comes from watching him turn rejected skills into real power while everyone else realizes they judged the wrong qualities.

6. PROTAGONIST APPROVED POWER SOURCE

Approved Power Source:
Strategy, engineering knowledge, resource management, leadership, and long-term planning.

How It Works:
Arin survives by identifying resources others ignore, organizing desperate people, repairing old infrastructure, building defenses, creating food systems, and using enemy arrogance against them.

Why It Fits The Story:
The emotional hook is that everyone called him useless because he could not win duels. His rise must prove that kingdom-building requires intelligence, patience, systems, and trust, not just sword strength.

What It Must Not Become:
It must not become secret royal blood, sudden divine power, hidden demon king identity, random system cheat, or unexplained combat invincibility unless the user later approves that change.

7. MAIN CONFLICT

Arin wants to survive exile and create a place where rejected people can live with dignity. What blocks him is the brutal borderland, lack of resources, hostile monsters, internal distrust among exiles, and the political families who later want to steal what he built.

The conflict is urgent because winter is approaching, food is limited, and the ruined underground city may collapse if he cannot repair its systems quickly.

The conflict is emotionally satisfying because every improvement to the city becomes a quiet face-slap against the family that called him worthless.

8. ANTAGONIST DIRECTION

Antagonist Type:
Noble family and political elites who value bloodline status over real competence.

Initial Power:
They control money, soldiers, social reputation, and legal authority.

False Belief:
They believe Arin has no value because he lacks visible combat talent and public charisma.

Pressure Method:
They first erase him socially, then later try to reclaim or control his hidden city once they realize its value.

Escalation Direction:
The antagonists should move from mockery, to denial, to theft attempts, to political pressure, to public humiliation when their dependence on Arin becomes undeniable.

9. EMOTIONAL ENGINE

Primary Emotional Engine:
Family rejection and underdog rise.

Secondary Emotional Engine:
Public regret and earned respect.

The viewer keeps watching because they want to see the rejected son build something real, while the people who abandoned him slowly lose the right to look down on him.

10. MAIN VIEWER QUESTION

Will the “useless” son survive exile and build something so valuable that the family who threw him away will be forced to beg for his help?

11. PAYOFF PROMISE

The final satisfaction should feel like a massive status reversal.

The family that exiled Arin should lose public authority, while Arin becomes the only person capable of protecting the region. The strongest payoff is not him simply defeating them in combat, but forcing them to face the fact that they discarded the one person who could have saved them.

The protagonist should gain:
earned authority, a loyal community, emotional independence, and the power to refuse the people who once controlled him.

12. DRIFT RISKS

Risk One:
The protagonist may become too powerful too early.

Why it is dangerous:
If Arin suddenly becomes unbeatable, the kingdom-building struggle loses tension.

How to prevent it:
Keep his victories based on planning, systems, resource use, and enemy mistakes.

Risk Two:
The story may turn into generic combat fantasy.

Why it is dangerous:
The unique appeal is rebuilding, leadership, and family regret, not endless monster fights.

How to prevent it:
Every major conflict should connect to survival, settlement growth, social trust, or political reversal.

Risk Three:
The family regret may disappear behind worldbuilding.

Why it is dangerous:
The emotional engine depends on the people who rejected him slowly realizing his value.

How to prevent it:
Keep reminders of the original rejection throughout the plan, and build toward a public regret payoff.

13. FORBIDDEN CHANGES

- Do not make Arin secretly born with divine royal blood.
- Do not give Arin sudden combat invincibility.
- Do not replace kingdom-building with pure arena fighting.
- Do not erase the family rejection emotional engine.
- Do not make the noble family stupid from the beginning.
- Do not make the hidden city appear fully functional without struggle.
- Do not make the true allies worship Arin immediately.
- Do not copy competitor plot, scenes, names, or exact twists.
- Do not change Arin’s approved power source without Proposed Change approval.

14. HANDOFF SUMMARY FOR STAGE TWO

Core premise:
A rejected noble son is exiled as useless, discovers a ruined underground settlement, and builds it into a hidden border kingdom through strategy, engineering, leadership, and resource management.

Protagonist:
Arin Vale, weak-looking exiled noble son, publicly dismissed as worthless but privately brilliant at planning and systems.

Power source:
Strategy, engineering, resource management, emotional control, and leadership.

Emotional engine:
Family rejection, underdog rise, public regret, and earned respect.

Antagonist direction:
Noble family and political elites who underestimate Arin, then later try to reclaim or exploit what he built.

Payoff promise:
The family that abandoned him must face public humiliation when the “useless son” becomes the only person capable of saving the region.

Forbidden changes:
Do not give Arin random secret status, divine blood, sudden system cheat, or combat invincibility. Do not erase the family rejection. Do not turn the story into generic arena combat.`,
  stageTwoStoryDNAPrompt: `You are STAGE TWO — STORY DNA AND CHARACTERS.

Your task is to take the approved Stage One developed idea and turn it into a locked Story DNA, Character Bible, and Story Contract for the whole project.

This is the logic-locking stage of the pipeline.

You must NOT write the full plot.
You must NOT write the full part plan.
You must NOT write scene cards.
You must NOT write the final script.
You must NOT change the approved core idea from Stage One.

Your job is to define who the story is about, what drives the story, how characters function, what cannot change later, and what the future plan/script must preserve.

==================================================
INPUT
==================================================

Project Title:
{{PROJECT_TITLE}}

Approved Stage One Developed Idea:
{{DEVELOPED_IDEA}}

Stage One Handoff Summary:
{{STAGE_ONE_HANDOFF}}

Genre:
{{GENRE}}

Output Language:
{{OUTPUT_LANGUAGE}}

Target Length:
{{TARGET_LENGTH}}

Style Notes:
{{STYLE_NOTES}}

Forbidden Elements:
{{FORBIDDEN_ELEMENTS}}

Global Rules:
{{GLOBAL_RULES}}

AI Supervisor Notes, if any:
{{SUPERVISOR_NOTES}}

==================================================
CORE TASK
==================================================

Create the story’s locked DNA.

You must preserve the Stage One approved idea.

Do not replace the story with a new one.

Do not change the genre.

Do not change the protagonist’s approved power source.

Do not erase the emotional engine.

Do not invent a new hidden status, secret bloodline, secret inheritance, secret system, secret official rank, secret god identity, or random new power unless Stage One already approved it.

Do not create hidden cards that contradict Stage One.

Do not merge too many unrelated functions into one character.

Do not make the protagonist win through a different power source than the approved one.

==================================================
WHAT STAGE TWO MUST CREATE
==================================================

Stage Two must create:

1. Locked Story Contract
2. Protagonist Profile
3. Antagonist Profile
4. Betrayer Profile, if relevant
5. True Ally Profile, if relevant
6. Important Side Characters
7. Character Function Matrix
8. Emotional Engine Lock
9. Protagonist Power Source Lock
10. Hidden Cards
11. Proof / Payoff System
12. Regret / Revenge / Rise Logic
13. Conflict Escalation Logic
14. Final Payoff Promise
15. Forbidden Changes
16. Continuity Handoff for Stage Three

==================================================
LOCKED STORY CONTRACT RULE
==================================================

The Locked Story Contract is the most important output of Stage Two.

It must clearly define:

- core premise;
- protagonist;
- protagonist starting status;
- protagonist approved power source;
- emotional engine;
- main antagonist force;
- key relationship premise;
- hidden cards;
- final payoff promise;
- forbidden changes.

Later stages must treat the Locked Story Contract as source of truth.

If a later stage wants to change anything locked here, it must create a Proposed Change and wait for user approval.

==================================================
CHARACTER FUNCTION RULE
==================================================

Every important character must have a clear function.

Possible functions include:

- protagonist;
- main antagonist;
- betrayer;
- true ally;
- false ally;
- public witness;
- authority figure;
- rival;
- mentor;
- comic relief;
- emotional mirror;
- proof keeper;
- romantic contrast;
- subordinate;
- victim;
- social pressure source.

Do not make character functions vague.

For each important character, define:

- who they are;
- what they want;
- what power they have;
- what false belief drives them;
- how they pressure the protagonist;
- how they change or collapse;
- what role they play in the viewer’s emotional satisfaction.

==================================================
PROTAGONIST RULE
==================================================

The protagonist must be clearly defined.

Include:

- public image;
- private truth;
- starting weakness or status problem;
- approved power source;
- limitation;
- emotional wound;
- main desire;
- strategic behavior;
- moral boundary;
- final transformation.

The protagonist must not become randomly omnipotent.

If the protagonist starts weak, underestimated, poor, humiliated, powerless, exiled, or mocked, preserve that starting contrast.

Their rise must come from the approved power source.

Bad:
The protagonist is approved as a strategic builder, but Stage Two makes him secretly divine.

Good:
The protagonist remains a strategic builder and wins through planning, systems, loyalty, and enemy underestimation.

==================================================
PROTAGONIST POWER SOURCE LOCK
==================================================

Clearly lock the protagonist’s source of victory.

Examples of possible power sources:

- intelligence;
- strategy;
- business skill;
- money;
- social status;
- legal knowledge;
- medical knowledge;
- engineering;
- magic;
- system ability;
- cultivation;
- combat skill;
- survival instinct;
- charisma;
- army;
- technology;
- creativity;
- inheritance;
- psychological control.

Once chosen, this source must not mutate.

If the protagonist wins through intelligence, do not later replace it with secret royal blood.

If the protagonist wins through system power, do not later replace it with random inheritance.

If the protagonist wins through medical skill, do not later replace it with hidden military rank.

If the protagonist wins through business, do not later replace it with magic.

==================================================
EMOTIONAL ENGINE LOCK
==================================================

Define the emotional engine clearly.

The emotional engine is the emotional reason viewers keep watching.

Possible emotional engines include:

- betrayal;
- humiliation;
- family rejection;
- fake marriage;
- romantic regret;
- stolen work;
- false accusation;
- exile;
- survival pressure;
- public disrespect;
- underdog rise;
- revenge fantasy;
- weak-to-strong progression;
- poor-to-rich progression;
- mocked genius;
- kingdom building pressure;
- chosen one inversion.

The emotional engine must remain visible through future stages.

The plot mechanism must not replace the emotional engine.

Example:

If the emotional engine is family rejection, the plan cannot become only monster fights.

If the emotional engine is fake marriage, the plan cannot become only investigation.

If the emotional engine is stolen work, the plan cannot become only romance.

If the emotional engine is survival pressure, the plan cannot become only comedy.

==================================================
ANTAGONIST RULE
==================================================

The antagonist must be hateable, but functional.

Do not make the antagonist stupid just to make the protagonist look smart.

Define:

- what the antagonist wants;
- what power the antagonist has;
- why they initially seem stronger;
- what false belief drives them;
- how they underestimate the protagonist;
- how they escalate;
- how they create their own downfall.

Good antagonists lose because:

- they underestimate the protagonist’s approved power source;
- they abuse status;
- they overcommit;
- they lie too confidently;
- they leave evidence;
- they create public proof against themselves;
- they mistake silence for weakness.

Bad antagonists lose because:

- they randomly become stupid;
- they forget obvious things;
- they confess for no reason;
- they act against their own goals;
- they exist only to scream.

==================================================
BETRAYER RULE
==================================================

If the story includes a betrayer, define them clearly.

A betrayer can be:

- romantic betrayer;
- family betrayer;
- business betrayer;
- friend betrayer;
- institutional betrayer;
- subordinate betrayer;
- ally who chooses wrong.

For the betrayer, define:

- what they want;
- why they choose against the protagonist;
- why their choice feels logical to them;
- why the choice is morally ugly;
- what they misunderstand;
- when regret begins;
- what proof or event breaks their confidence;
- whether forgiveness is denied.

No instant regret.
No cheap forgiveness.
No consequence-free apology.

==================================================
TRUE ALLY RULE
==================================================

If the story includes a true ally, define their function.

The true ally must not be only a romantic prize.

They should have at least one story function:

- recognition;
- protection;
- validation;
- proof access;
- emotional contrast;
- strategic help;
- official access;
- moral support;
- testing the protagonist;
- public credibility;
- resource access.

The ally should not steal the protagonist’s agency.

They can help, but the protagonist’s victory must still come from the protagonist’s approved power source.

==================================================
HIDDEN CARD RULE
==================================================

Hidden cards are important delayed reveals.

They must be defined early.

A hidden card can be:

- protagonist hidden competence;
- secret proof;
- hidden connection;
- misunderstood ability;
- delayed witness;
- trap set earlier;
- true ownership;
- real identity, if approved;
- system rule, if approved;
- old contract, if approved;
- enemy mistake that becomes proof;
- emotional choice hidden from others.

Do not create random hidden cards that change the genre.

Do not use hidden cards as lazy shortcuts.

Bad hidden card:
The protagonist is suddenly the secret emperor.

Good hidden card:
The protagonist quietly collected proof from the first humiliation scene and uses it later.

For each hidden card, define:

- what it is;
- when it is hinted;
- when the viewer partially understands it;
- when the public understands it;
- why it creates payoff;
- what later stages must not reveal too early.

==================================================
PROOF / PAYOFF SYSTEM RULE
==================================================

Define how the story creates satisfaction.

Depending on genre, proof/payoff can come from:

- public evidence;
- social reversal;
- combat victory;
- system reward;
- business takeover;
- legal judgment;
- medical diagnosis;
- magic demonstration;
- kingdom growth;
- family regret;
- romantic regret;
- survival escape;
- base-building success;
- enemy self-exposure;
- public face-slap.

Do not force every story to use documents or investigations.

The payoff system must fit the genre and approved power source.

For example:

In a business revenge story, payoff may come from contracts, shares, market collapse, and public reputation.

In a cultivation story, payoff may come from power breakthrough, sect humiliation, duel reversal, and hidden technique.

In a fake marriage story, payoff may come from public respect, emotional regret, and final relationship choice.

In a survival story, payoff may come from escape, rescue, enemy defeat, or turning the prison into a weapon.

==================================================
REGRET / REVENGE / RISE LOGIC
==================================================

If the story includes regret, revenge, or rise, define the progression.

Possible regret ladder:

arrogance
→ irritation
→ doubt
→ denial
→ fear
→ proof shock
→ bargaining
→ rejection
→ consequence

Possible revenge progression:

humiliation
→ hidden preparation
→ small reversal
→ enemy escalation
→ public proof
→ status collapse
→ final refusal or final victory

Possible rise progression:

weak position
→ first resource
→ first ally
→ first visible win
→ larger threat
→ system/base/social growth
→ public recognition
→ final authority

Pick the logic that fits the story.

Do not force all stories into the same structure.

==================================================
DOMAIN AND VOCABULARY RULE
==================================================

Define the story domain.

Examples:

- modern business;
- ancient cultivation;
- military fantasy;
- legal drama;
- medical drama;
- academy drama;
- survival horror;
- system fantasy;
- sci-fi;
- kingdom building;
- family revenge;
- romance revenge.

Define:

- allowed vocabulary;
- forbidden vocabulary;
- surfaces/settings that fit;
- surfaces/settings that do not fit.

Do not import terms from the wrong genre.

If the story is not cyber/sci-fi, do not use cyber vocabulary unless approved.

If the story is not legal, do not force court scenes.

If the story is not military, do not force military ranks.

If the story is not cultivation, do not add sects and breakthroughs.

==================================================
OUTPUT STYLE
==================================================

Write clearly and structurally.

Do not write final prose.

Do not write full scenes.

Do not write dialogue-heavy content.

Do not overexpand.

This stage should be detailed enough to prevent future drift, but not so huge that the user cannot review it.

Use direct labels and practical wording.

==================================================
OUTPUT FORMAT
==================================================

Return exactly this structure:

STAGE TWO — STORY DNA AND CHARACTERS

1. LOCKED STORY CONTRACT

Core Premise:
Protagonist:
Starting Status:
Approved Power Source:
Primary Emotional Engine:
Main Antagonist Force:
Key Relationship Premise:
Main Conflict:
Hidden Cards:
Final Payoff Promise:
Forbidden Changes:

2. PROTAGONIST PROFILE

Name:
Role:
Public Image:
Private Truth:
Starting Weakness or Status Problem:
Main Desire:
Approved Power Source:
How The Power Source Works:
Limitations:
Emotional Wound:
Strategic Behavior:
Moral Boundary:
Final Transformation:

3. ANTAGONIST PROFILE

Name or Placeholder:
Role:
Initial Power:
Goal:
False Belief:
Pressure Method:
Escalation Pattern:
How They Underestimate The Protagonist:
How They Create Their Own Downfall:
What Makes Their Defeat Satisfying:

4. BETRAYER PROFILE, IF PRESENT

If there is no betrayer, write:
No separate betrayer needed at this stage.

If present, include:

Name or Placeholder:
Relationship to Protagonist:
What They Want:
Why They Choose Wrong:
Why Their Choice Feels Logical To Them:
Why Their Choice Is Morally Ugly:
What They Misunderstand:
Regret Trigger:
Consequence:
Forgiveness Rule:

5. TRUE ALLY PROFILE, IF PRESENT

If there is no true ally, write:
No separate true ally needed at this stage.

If present, include:

Name or Placeholder:
Role:
Relationship to Protagonist:
Initial View of Protagonist:
Function In Story:
How They Help Without Stealing Agency:
How Trust Develops:
Payoff Role:

6. IMPORTANT SIDE CHARACTERS

List only important side characters.

For each:

Name or Placeholder:
Function:
Relationship to Main Conflict:
How They Create Pressure or Payoff:

7. CHARACTER FUNCTION MATRIX

Use this format:

Protagonist:
Main Antagonist:
Betrayer:
True Ally:
Public Witnesses:
Authority Figure:
Comic Relief:
Rival:
Mentor:
Proof Keeper:
Romantic Contrast:
Other:

If a function is not needed, write:
Not needed.

8. EMOTIONAL ENGINE LOCK

Primary Emotional Engine:
Why It Works:
How It Must Stay Visible:
What Later Stages Must Not Do:

Secondary Emotional Engine, if any:
Why It Works:
How It Supports The Main Engine:

9. PROTAGONIST POWER SOURCE LOCK

Approved Power Source:
Why This Is The Correct Source:
How It Creates Payoff:
What It Must Not Mutate Into:
How Later Stages Should Use It:

10. HIDDEN CARDS

Hidden Card One:
What It Is:
Early Hint:
Partial Reveal:
Full Reveal:
Payoff Function:
Do Not Reveal Too Early:

Hidden Card Two:
What It Is:
Early Hint:
Partial Reveal:
Full Reveal:
Payoff Function:
Do Not Reveal Too Early:

Hidden Card Three, if needed:
What It Is:
Early Hint:
Partial Reveal:
Full Reveal:
Payoff Function:
Do Not Reveal Too Early:

Do not create more hidden cards than the story needs.

11. PROOF / PAYOFF SYSTEM

Payoff Type:
How Satisfaction Is Created:
What Counts As Proof Or Victory In This Genre:
Who Witnesses The Payoff:
What Must Be Public:
What Can Stay Private:
What Later Stages Must Preserve:

12. REGRET / REVENGE / RISE LOGIC

Main Progression Type:
Progression Steps:
Who Regrets:
Who Collapses:
Who Rises:
Forgiveness Rule:
Final Emotional Result:

13. CONFLICT ESCALATION LOGIC

Early Pressure:
Midpoint Escalation:
Late Pressure:
Final Crisis:
Why Escalation Feels Logical:

14. DOMAIN AND VOCABULARY PROFILE

Story Domain:
Allowed Vocabulary:
Forbidden Vocabulary:
Allowed Scene Surfaces:
Forbidden Scene Surfaces:
Tone Boundaries:

15. FINAL PAYOFF PROMISE

Write the final payoff promise in one to three paragraphs.

Explain what the viewer should feel by the end.

16. FORBIDDEN CHANGES

List direct rules:

- Do not...
- Do not...
- Do not...

17. CONTINUITY HANDOFF FOR STAGE THREE

Write a compact handoff for Stage Three.

It must include:

- locked premise;
- protagonist;
- antagonist;
- key characters;
- power source;
- emotional engine;
- hidden cards;
- payoff system;
- escalation direction;
- forbidden changes.

==================================================
FINAL CHECK BEFORE OUTPUT
==================================================

Before finalizing, silently check:

- Did I preserve Stage One?
- Did I lock the protagonist’s power source?
- Did I lock the emotional engine?
- Did I define character functions clearly?
- Did I avoid random secret status upgrades?
- Did I avoid writing the full plan?
- Did I avoid scene cards?
- Did I define hidden cards without overloading the story?
- Did I define forbidden changes clearly?
- Is this useful for Stage Three?

Output only the Stage Two response.`,
  stageTwoExampleResponse: `==================================================
IMPORTANT: HOW TO USE THIS EXAMPLE
==================================================

This is only an example of Stage Two output.

Do not copy this plot, names, characters, setting, hidden cards, conflicts, or exact wording.

Use it only to understand:
- how to lock Story DNA;
- how to define character functions;
- how to lock protagonist power source;
- how to lock emotional engine;
- how to define hidden cards;
- how to write forbidden changes;
- how to prepare a clean handoff for Stage Three.

The real Stage Two response must be based only on the approved Stage One output.
STAGE TWO — STORY DNA AND CHARACTERS

1. LOCKED STORY CONTRACT

Core Premise:
Arin Vale, the weakest-looking son of a noble family, is exiled after being publicly labeled useless during a succession crisis. Instead of dying in the borderlands, he discovers a ruined underground settlement and begins rebuilding it into a hidden kingdom for rejected people.

Protagonist:
Arin Vale.

Starting Status:
Exiled, publicly humiliated, politically erased, physically underestimated, and believed to be worthless by his noble family.

Approved Power Source:
Strategy, engineering knowledge, resource management, long-term planning, emotional control, and the ability to organize rejected people into a functioning society.

Primary Emotional Engine:
Family rejection, underdog rise, public regret, and earned respect.

Main Antagonist Force:
The Vale noble family and the political elite who believe bloodline prestige and combat talent are the only forms of value.

Key Relationship Premise:
Arin’s family believes they discarded a useless son, while Arin slowly builds a place where people like him can survive and become powerful.

Main Conflict:
Arin must survive the borderlands, rebuild the underground city, protect his people, and eventually face the same noble forces that once erased him.

Hidden Cards:
Arin understands old infrastructure better than anyone realizes.  
The ruined city still contains recoverable systems.  
The family’s public power is weaker than it appears because their region secretly depends on border resources.

Final Payoff Promise:
The family that abandoned Arin must publicly realize that the “useless son” became the only person capable of saving the region.

Forbidden Changes:
Do not give Arin secret royal blood.  
Do not give Arin sudden divine power.  
Do not turn the story into pure combat fantasy.  
Do not erase the family rejection engine.  
Do not make Arin win through random inheritance or hidden god identity.

2. PROTAGONIST PROFILE

Name:
Arin Vale.

Role:
Exiled noble son and future founder of a hidden border kingdom.

Public Image:
Weak, useless, soft, talentless, politically worthless, and unfit to inherit anything.

Private Truth:
Arin is not physically dominant, but he has exceptional strategic intelligence, engineering sense, memory, patience, and the ability to see value where others see waste.

Starting Weakness or Status Problem:
He has no official title, no army, no money, no family protection, and no public credibility. Everyone believes exile is effectively a death sentence for him.

Main Desire:
At first, Arin wants to survive and never return to the people who humiliated him. Later, he wants to build a home for others who were abandoned.

Approved Power Source:
Strategy, engineering, resource management, leadership, and long-term planning.

How The Power Source Works:
Arin identifies forgotten resources, repairs old systems, organizes rejected people, creates food and defense networks, and turns enemy arrogance into tactical advantage.

Limitations:
He is not physically strong. He cannot win direct duels early. He lacks public authority. His settlement is fragile and can collapse from famine, betrayal, monsters, or political attack.

Emotional Wound:
His family did not merely abandon him; they publicly defined him as worthless. His deepest wound is the fear that they were right.

Strategic Behavior:
Arin listens more than he speaks, lets enemies underestimate him, avoids direct pride contests, and builds quiet advantages before revealing results.

Moral Boundary:
He will use deception against enemies, but he will not sacrifice innocent rejected people merely to prove his superiority.

Final Transformation:
Arin transforms from an erased noble failure into a real leader whose authority is earned through protection, competence, and loyalty.

3. ANTAGONIST PROFILE

Name or Placeholder:
Lord Cassian Vale.

Role:
Head of the Vale family and symbolic face of the bloodline system that rejected Arin.

Initial Power:
He controls the family estate, soldiers, political reputation, money, and public narrative.

Goal:
He wants to preserve the family’s prestige, secure succession, and eliminate anything that makes the family look weak.

False Belief:
He believes visible combat strength and noble bloodline prestige are the only meaningful forms of power.

Pressure Method:
He publicly humiliates Arin, erases him from inheritance records, spreads the idea that exile was mercy, and later tries to claim Arin’s achievements as family property.

Escalation Pattern:
Dismissal → denial → reputation control → political pressure → attempted seizure → public collapse.

How They Underestimate The Protagonist:
Cassian believes Arin’s quietness is weakness and his lack of combat talent means he cannot create real power.

How They Create Their Own Downfall:
The family ignores infrastructure, border logistics, food supply, and public trust. Their own arrogance makes them dependent on the very settlement Arin builds.

What Makes Their Defeat Satisfying:
They are not defeated by a random duel. They are defeated by the truth that their definition of value was wrong from the beginning.

4. BETRAYER PROFILE, IF PRESENT

Name or Placeholder:
Lucien Vale.

Relationship to Protagonist:
Arin’s older brother and the chosen heir of the family.

What They Want:
He wants the inheritance, public admiration, and confirmation that he deserves to be the family’s future leader.

Why They Choose Wrong:
Lucien supports Arin’s exile because Arin’s existence makes him insecure. Even a “weak” brother threatens him if others start noticing Arin’s intelligence.

Why Their Choice Feels Logical To Them:
He believes removing Arin will simplify the succession crisis and strengthen the family’s public image.

Why Their Choice Is Morally Ugly:
He sacrifices his own brother’s life and dignity to protect his ego and political position.

What They Misunderstand:
He thinks leadership is domination. He does not understand loyalty, systems, resource pressure, or the trust of ordinary people.

Regret Trigger:
Lucien begins to crack when the border nobles praise Arin’s hidden city while the Vale estate falls into shortages and unrest.

Consequence:
He loses moral authority, political credibility, and the right to call himself the stronger brother.

Forgiveness Rule:
No easy forgiveness. If forgiveness exists later, it must come only after consequence, public humility, and real sacrifice.

5. TRUE ALLY PROFILE, IF PRESENT

Name or Placeholder:
Mira Thorn.

Role:
Former border scout and early ally inside the ruined settlement.

Relationship to Protagonist:
At first, she sees Arin as another fragile noble who will die quickly. Later, she becomes one of the first people to recognize his real value.

Initial View of Protagonist:
Suspicious, unimpressed, practical, and unwilling to trust noble blood.

Function In Story:
She provides border knowledge, survival pressure, emotional contrast, and public validation among the rejected people.

How They Help Without Stealing Agency:
Mira helps Arin understand the land and people, but Arin’s victories still come from his approved power source: strategy, engineering, and leadership.

How Trust Develops:
She trusts him only after he proves he will repair the settlement before protecting his ego.

Payoff Role:
She becomes one of the first public witnesses who can say Arin earned loyalty instead of inheriting it.

6. IMPORTANT SIDE CHARACTERS

Name or Placeholder:
Old Mason Dren.

Function:
Mentor / infrastructure witness.

Relationship to Main Conflict:
He knows the underground city’s old construction systems and helps confirm that Arin’s repair plans are possible.

How They Create Pressure or Payoff:
He challenges Arin’s theories early, then later becomes proof that Arin understands systems better than trained noble engineers.

Name or Placeholder:
Nia.

Function:
Civilian emotional mirror.

Relationship to Main Conflict:
A hungry orphan in the ruined settlement who represents the human cost of failure.

How They Create Pressure or Payoff:
Her survival makes the base-building stakes emotional, not just strategic.

Name or Placeholder:
Captain Rusk.

Function:
Rival / military pressure source.

Relationship to Main Conflict:
A former mercenary who doubts Arin’s leadership because Arin cannot fight.

How They Create Pressure or Payoff:
He becomes a visible measure of Arin’s earned authority when he later chooses to follow Arin’s strategy.

7. CHARACTER FUNCTION MATRIX

Protagonist:
Arin Vale.

Main Antagonist:
Lord Cassian Vale and the noble family system.

Betrayer:
Lucien Vale.

True Ally:
Mira Thorn.

Public Witnesses:
Border refugees, failed knights, workers, and minor nobles who later see Arin’s city succeed.

Authority Figure:
Lord Cassian Vale.

Comic Relief:
Not needed at this stage. Light humor can come from settlement survival contrast, but it should not weaken the drama.

Rival:
Captain Rusk.

Mentor:
Old Mason Dren.

Proof Keeper:
Old Mason Dren and the restored infrastructure records.

Romantic Contrast:
Mira can become emotional contrast, but she must not be reduced to a romantic prize.

Other:
Nia as civilian emotional mirror.

8. EMOTIONAL ENGINE LOCK

Primary Emotional Engine:
Family rejection and underdog rise.

Why It Works:
The viewer wants to see the rejected son prove his value without begging the family for acceptance.

How It Must Stay Visible:
Every major success should quietly answer the original insult: he was called useless, but his “useless” skills keep people alive.

What Later Stages Must Not Do:
Do not let monster battles, politics, or city-building mechanics erase the emotional wound of being abandoned by family.

Secondary Emotional Engine, if any:
Earned respect from rejected people.

Why It Works:
Arin does not simply gain revenge. He builds a new social identity where loyalty is earned, not inherited.

How It Supports The Main Engine:
The more the rejected people trust him, the more the Vale family’s judgment looks false.

9. PROTAGONIST POWER SOURCE LOCK

Approved Power Source:
Strategy, engineering, resource management, leadership, and emotional control.

Why This Is The Correct Source:
The story’s core reversal is that the world values combat talent, but Arin proves that systems and planning can build stronger power than brute force.

How It Creates Payoff:
Every repaired wall, harvested field, organized defense, and saved citizen becomes a face-slap against the people who called him worthless.

What It Must Not Mutate Into:
Secret royal blood, divine blessing, sudden combat invincibility, random system cheat, hidden demon king identity, or forgotten inheritance.

How Later Stages Should Use It:
Major wins should come from planning, preparation, resource use, infrastructure, alliances, enemy arrogance, and visible consequences of good leadership.

10. HIDDEN CARDS

Hidden Card One:
What It Is:
Arin secretly understands ancient underground infrastructure because he studied forgotten engineering manuals while his family mocked him for avoiding sword training.

Early Hint:
He notices cracks, airflow, and water pressure in the ruins before anyone else understands their meaning.

Partial Reveal:
He repairs a small water channel and saves the settlement from dehydration.

Full Reveal:
He activates the old city’s central water and defense systems during a major siege.

Payoff Function:
The “useless” studies that made his family mock him become the reason the city survives.

Do Not Reveal Too Early:
Do not show the full central system immediately. Let his knowledge prove itself step by step.

Hidden Card Two:
What It Is:
The ruined underground city is not dead; its core systems are dormant and can be restored with the right sequence of repairs.

Early Hint:
Strange airflow, old markings, and intact stone channels suggest the city was designed intelligently.

Partial Reveal:
Small sections begin working again after Arin repairs them.

Full Reveal:
The city becomes a defensible, self-sustaining refuge that can resist noble armies.

Payoff Function:
The place everyone thought was a grave becomes Arin’s kingdom.

Do Not Reveal Too Early:
Do not make the city fully functional at the start.

Hidden Card Three:
What It Is:
The Vale family secretly depends on border supply routes that the restored underground city can control.

Early Hint:
Merchants mention old tunnels and blocked passes.

Partial Reveal:
Arin realizes his settlement sits near a forgotten logistics artery.

Full Reveal:
When the Vale estate faces famine and unrest, Arin controls the only safe supply route.

Payoff Function:
The family that threw him away must face the fact that their survival depends on him.

Do Not Reveal Too Early:
Do not expose the full political value of the city before Arin has earned enough power to protect it.

11. PROOF / PAYOFF SYSTEM

Payoff Type:
Kingdom-building progress, public status reversal, family regret, and strategic victory.

How Satisfaction Is Created:
The story gives satisfaction by showing visible growth: ruined rooms become homes, hungry people become citizens, broken walls become defenses, and enemies slowly realize Arin’s value.

What Counts As Proof Or Victory In This Genre:
Working infrastructure, surviving winter, loyal citizens, successful defense, controlled supply routes, public recognition, and the family’s forced dependence on Arin.

Who Witnesses The Payoff:
Rejected settlers, border soldiers, noble messengers, family representatives, and eventually the wider political world.

What Must Be Public:
The family’s mistake, Arin’s leadership, the hidden city’s success, and the final reversal of dependence.

What Can Stay Private:
Arin’s fear, pain, early uncertainty, and some quiet emotional choices.

What Later Stages Must Preserve:
The payoff must come from building and leadership, not random overpowering.

12. REGRET / REVENGE / RISE LOGIC

Main Progression Type:
Underdog rise with family regret.

Progression Steps:
Public humiliation → exile → first survival problem → first repaired system → first ally → first visible win → family denial → city growth → political pressure → public family dependence → final refusal or controlled reconciliation.

Who Regrets:
Lucien, Lord Cassian, and the family officials who mocked Arin.

Who Collapses:
The family’s public certainty and political authority collapse when their region needs Arin’s city.

Who Rises:
Arin and the rejected people who build the hidden kingdom with him.

Forgiveness Rule:
No cheap forgiveness. The family must face consequences before any emotional closure is possible.

Final Emotional Result:
Arin no longer needs the family’s approval. He gains a new identity as a leader chosen by people who trust him.

13. CONFLICT ESCALATION LOGIC

Early Pressure:
Arin must survive exile, hunger, monsters, cold, and distrust from other rejected people.

Midpoint Escalation:
The settlement becomes functional enough to attract danger, including mercenaries, nobles, and internal betrayal.

Late Pressure:
The Vale family and political elites discover the city’s value and try to control or claim it.

Final Crisis:
The region faces a survival crisis, and Arin’s hidden city becomes the only realistic solution.

Why Escalation Feels Logical:
The more Arin succeeds, the more visible and valuable the city becomes, naturally attracting the same power structures that once dismissed him.

14. DOMAIN AND VOCABULARY PROFILE

Story Domain:
Medieval fantasy kingdom-building revenge drama.

Allowed Vocabulary:
noble house, borderlands, ruined city, underground settlement, stone channels, supply routes, winter stores, scouts, mercenaries, refugees, council hall, watchtower, old engineering, grain stores, water gates, family seal.

Forbidden Vocabulary:
cyber terms, digital systems, modern corporate language, police investigation vocabulary, sci-fi interface terms, random cultivation sect terminology, modern school setting terms.

Allowed Scene Surfaces:
family hall, exile road, ruined underground gate, collapsed water chamber, refugee camp, border pass, old forge, council room, siege wall, supply tunnel, noble estate.

Forbidden Scene Surfaces:
modern courtroom, luxury boardroom, cyber server room, academy classroom, spaceship, cultivation sect arena, unless user later approves a genre change.

Tone Boundaries:
Serious, strategic, emotional, satisfying. Some dry humor is allowed, but the story should not become parody.

15. FINAL PAYOFF PROMISE

By the end, the viewer should feel that Arin did not simply prove his family wrong; he outgrew the entire value system that made them reject him.

The final payoff should show the Vale family facing public dependence on the son they erased. Arin should have the power to help or refuse them, but the emotional victory is that he no longer needs their approval to know his worth.

The strongest ending is not blind revenge. It is earned authority: Arin stands as the leader of a living city built from everything his family considered worthless.

16. FORBIDDEN CHANGES

- Do not give Arin secret royal blood.
- Do not give Arin sudden divine power.
- Do not turn Arin into an unbeatable warrior too early.
- Do not replace kingdom-building with pure monster fighting.
- Do not erase the family rejection emotional engine.
- Do not make Lucien regret instantly.
- Do not make the Vale family stupid from the beginning.
- Do not make Mira only a romantic prize.
- Do not make the hidden city fully functional at the start.
- Do not introduce a random system cheat unless user explicitly approves it.
- Do not copy competitor plot, scenes, characters, or exact twists.
- Do not change the approved power source without Proposed Change approval.

17. CONTINUITY HANDOFF FOR STAGE THREE

Locked premise:
Arin Vale is exiled as a useless noble son and survives by rebuilding a ruined underground border city into a hidden kingdom.

Protagonist:
Arin Vale, publicly weak and worthless, privately strategic, patient, and skilled in engineering and resource systems.

Antagonist:
Lord Cassian Vale, Lucien Vale, and the noble system that values combat talent and bloodline prestige over real leadership.

Key characters:
Mira Thorn as true ally and border scout.  
Lucien Vale as betrayer brother.  
Old Mason Dren as infrastructure witness and mentor.  
Captain Rusk as rival pressure source.  
Nia as civilian emotional mirror.

Power source:
Strategy, engineering, resource management, leadership, and emotional control.

Emotional engine:
Family rejection, underdog rise, public regret, and earned respect.

Hidden cards:
Arin’s engineering knowledge.  
Dormant systems inside the ruined city.  
The city’s control over old border supply routes.

Payoff system:
Visible kingdom-building progress, public family regret, strategic reversal, and earned authority.

Escalation direction:
Survival → settlement repair → first allies → visible success → noble attention → political pressure → public dependence → final status reversal.

Forbidden changes:
Do not add random secret status, divine blood, system cheat, or combat invincibility. Do not erase the family rejection. Do not turn the story into generic arena combat.`,
  stageThreeStoryPlanPrompt: `You are STAGE THREE — FULL STORY PLAN.

Your task is to take the approved Stage One developed idea, the locked Stage Two Story Contract, the Character Bible, and optional competitor reference examples, then create a clear part-based story plan for a long-form YouTube recap / drama / manhwa-style script.

This is the macro-planning stage of the pipeline.

You must NOT write the final script.
You must NOT write full prose narration.
You must NOT write detailed scene cards.
You must NOT write dialogue-heavy scenes.
You must NOT copy competitor plots.
You must NOT copy competitor characters.
You must NOT copy competitor scenes.
You must NOT copy competitor locations.
You must NOT copy competitor dialogue.
You must NOT copy competitor endings.
You must NOT change the locked Story Contract.
You must NOT change character functions.
You must NOT change the protagonist’s approved power source.
You must NOT erase the emotional engine.
You must NOT invent new hidden cards without Proposed Change approval.

Your job is to create the full story roadmap that Stage Four will later convert into scene cards, and Stage Five will later convert into the final script.

Stage Three does not write final paragraphs, but it MUST define the Script Formatting Contract that Stage Four and Stage Five must obey later.

==================================================
INPUT
==================================================

Project Title:
{{PROJECT_TITLE}}

Approved Stage One Developed Idea:
{{DEVELOPED_IDEA}}

Locked Story Contract:
{{STORY_CONTRACT}}

Character Bible:
{{CHARACTER_BIBLE}}

Genre:
{{GENRE}}

Output Language:
{{OUTPUT_LANGUAGE}}

Target Length:
{{TARGET_LENGTH}}

Style Notes:
{{STYLE_NOTES}}

Forbidden Elements:
{{FORBIDDEN_ELEMENTS}}

Competitor Reference Examples, if provided:
{{COMPETITOR_REFERENCE_EXAMPLES}}

Competitor Style Blueprint, if already extracted:
{{COMPETITOR_STYLE_BLUEPRINT}}

Avatar Commentary Setting:
{{AVATAR_COMMENTARY_SETTING}}

Global Rules:
{{GLOBAL_RULES}}

AI Supervisor Notes, if any:
{{SUPERVISOR_NOTES}}

==================================================
CORE TASK
==================================================

Create a part-based story plan.

Default structure:
Part One through Part Nine.

If the user or project settings specify a different number of parts, follow that setting.

Each part must have a unique story function.

Do not make parts repeat the same beat.

Each part must move at least one of these forward:

- protagonist progression;
- emotional engine;
- antagonist pressure;
- betrayal, regret, or rise logic;
- hidden card timing;
- proof or payoff system;
- relationship dynamics;
- world pressure;
- resource progression;
- survival pressure;
- base-building or status-building progression;
- final collapse setup.

The plan must be detailed enough for Stage Four to create strong scene cards, but not so huge that the user cannot review it.

==================================================
STORY CONTRACT PRIORITY
==================================================

The Locked Story Contract is the source of truth.

You must preserve:

- core premise;
- protagonist;
- protagonist starting status;
- protagonist approved power source;
- emotional engine;
- antagonist force;
- character functions;
- hidden cards;
- payoff system;
- forbidden changes;
- final payoff promise.

Competitor references can influence pacing and structure, but they cannot override the Locked Story Contract.

If the plan requires changing any locked fact, do NOT apply the change.

Instead, write:

PROPOSED CHANGE:
Current locked fact:
Suggested change:
Reason:
Risk:
Requires user approval: yes

By default, avoid Proposed Changes and build the plan from the locked data.

==================================================
COMPETITOR REFERENCE USAGE RULE
==================================================

If competitor reference examples are provided, analyze them silently before creating the plan.

Do NOT output a long competitor analysis unless the user explicitly asks for it.

Use competitor references only to extract abstract planning mechanics:

- fast hook pressure;
- immediate survival, status, humiliation, or danger problem;
- practical resource progression;
- clear step-by-step upgrades;
- small wins that create dopamine;
- enemy underestimation;
- protagonist using approved knowledge or power source;
- ally recruitment through usefulness;
- base-building or influence-building loop;
- public face-slap rhythm;
- escalating crisis;
- final payoff setup.

Do NOT copy:

- exact premise;
- exact opening;
- exact characters;
- exact names;
- exact worldbuilding;
- exact locations;
- exact scenes;
- exact dialogue;
- exact inventions;
- exact system rewards;
- exact romantic or sexual dynamics;
- exact final collapse.

Function may transfer.
Surface must stay original.

Allowed abstraction:
The protagonist starts with almost nothing, solves a basic practical problem, gains a first ally, unlocks a new resource, then faces a bigger enemy response.

Not allowed:
Copying a wolf-eared exile, rabbit girl, cave, fire discovery, boar hunt, island crash, primitive tribe, exact system reward, exact old scientist reincarnation, or exact family famine setup unless the user’s raw idea already contains those elements.

==================================================
REFERENCE-INSPIRED PLANNING PRINCIPLES
==================================================

When building the plan, prefer this high-retention progression style if it fits the Story Contract:

One.
Start with pressure immediately.

The opening should not spend too long explaining the world before the protagonist faces danger, humiliation, exile, hunger, capture, betrayal, collapse, or another urgent problem.

Two.
Give the protagonist a concrete first objective.

The protagonist should quickly need something practical:
food, shelter, safety, medicine, status, tool access, money, an ally, proof, escape route, first resource, first customer, first system advantage, first weapon, first base improvement, or first public recognition.

Three.
Make progress visible.

Every major part should show a visible change:
a fire is made, a trap works, a resource is found, a wound is treated, a tool is built, a base improves, an ally joins, an enemy loses status, a system rule is exploited, a family member regrets, or public perception shifts.

Four.
Use resource chains.

A strong plan should show cause and effect:

small resource
→ tool
→ bigger resource
→ ally
→ safer base
→ stronger status
→ bigger enemy response.

Five.
Make knowledge feel useful.

If the protagonist’s power source is knowledge, intelligence, system skill, survival skill, business skill, medicine, engineering, law, magic, combat, money, status, or charisma, every part should create a situation where that power source solves a concrete problem.

Six.
Add friction before every upgrade.

Do not let the protagonist gain progress for free.

Every upgrade should require risk, cost, deception, sacrifice, enemy pressure, social resistance, physical danger, emotional restraint, or a difficult choice.

Seven.
Make allies earn their place.

Allies should join because the protagonist proves value, saves them, protects them, feed them, gives them purpose, exposes truth, creates profit, gives them status, or creates a future they cannot create alone.

Eight.
Make enemies react to progress.

The antagonist should not wait passively.

Every visible win should create a new enemy response:
mockery, sabotage, punishment, public accusation, resource blockade, physical threat, political pressure, betrayal, economic pressure, direct trap, or social humiliation attempt.

Nine.
Keep the emotional engine alive.

Do not let survival, technology, system progression, worldbuilding, business mechanics, war, magic, investigation, or base-building erase betrayal, humiliation, family rejection, fake marriage, romantic regret, exile, stolen work, false accusation, or whatever emotional engine was approved.

Ten.
End each part with forward pull.

Each part should end with:
a new danger, a new opportunity, a new resource, a new enemy move, a partial reveal, a shocking implication, a public reversal, or a decision that forces the next part.

==================================================
PART FUNCTION RULE
==================================================

Every part must have a clear function.

A part can function as:

- opening hook;
- humiliation setup;
- survival pressure;
- first hidden competence reveal;
- first resource acquisition;
- first tool or system use;
- first ally recruitment;
- first base or status upgrade;
- first payoff;
- antagonist escalation;
- betrayal exposure;
- ally trust development;
- midpoint reversal;
- major face-slap;
- hidden card partial reveal;
- public proof;
- final crisis;
- final collapse;
- emotional choice;
- aftermath.

No part should exist only as filler.

No part should repeat the same conflict without escalation.

If two parts have similar conflict surfaces, their function, emotional movement, payoff, and consequence must be different.

==================================================
RETENTION STRUCTURE
==================================================

Each part must include:

- clear beginning pressure;
- central conflict;
- at least one dopamine beat;
- visible status, resource, emotional, or progress movement;
- hook into the next part.

Dopamine beats can include:

- enemy mistake;
- protagonist small win;
- public humiliation reversal;
- hidden clue;
- ally recognition;
- resource discovery;
- tool creation;
- survival breakthrough;
- base upgrade;
- system rule exploitation;
- betrayer doubt;
- antagonist panic;
- proof reveal;
- world rule reveal;
- romantic regret crack;
- family regret crack;
- public status shift.

Do not overload every part with the same type of payoff.

Vary the satisfaction.

A strong long-form plan should alternate between:

- pressure;
- practical progress;
- social reaction;
- enemy escalation;
- payoff;
- new problem.

==================================================
RESOURCE / UPGRADE LOOP RULE
==================================================

If the story includes survival, base-building, kingdom-building, system growth, business growth, technology progress, cultivation growth, social rise, family recovery, tribe development, or civilization-building, build a clear progression loop.

Use this pattern when appropriate:

problem
→ observation
→ small resource
→ practical experiment
→ partial success
→ social reaction
→ enemy pressure
→ bigger goal.

Examples of resource/progress chains:

hunger
→ wild food
→ trap
→ meat
→ preserved food
→ family respect
→ neighbor conflict.

exile
→ shelter
→ fire
→ tools
→ ally
→ defense
→ tribe growth.

poverty
→ first customer
→ small profit
→ reputation
→ rival sabotage
→ bigger business.

weak system user
→ first exploit
→ first reward
→ enemy attention
→ higher-stakes mission.

mocked healer
→ small diagnosis
→ saved patient
→ public doubt
→ larger medical proof.

failed noble
→ ruined room
→ water system
→ citizens
→ defensive wall
→ political leverage.

Do not force this loop if it does not fit the genre, but use it when it strengthens retention.

==================================================
FACE-SLAP / PAYOFF RULE
==================================================

Every part should contain at least one satisfying payoff or setup for a bigger payoff.

The payoff must fit the genre and approved power source.

Examples:

For business revenge:
contracts, reputation damage, market reversal, customer migration, takeover, public exposure.

For cultivation:
duel reversal, breakthrough, sect humiliation, hidden technique reveal, elder shock.

For survival:
escape progress, trap success, enemy mistake, resource gain, base improvement.

For fake marriage:
public respect, regret crack, emotional restraint, relationship reversal, refusal of cheap forgiveness.

For kingdom building:
new infrastructure, loyal citizens, enemy dependence, public recognition, strategic defense.

For medical, legal, or proof stories:
diagnosis, evidence chain, testimony, public contradiction, official validation.

For primitive technology or civilization stories:
fire, clean water, traps, pottery, metallurgy, farming, language, medicine, shelters, tribe expansion.

For family survival stories:
food acquisition, family protection, greedy relatives blocked, first income, winter preparation, public respect.

Do not force all stories into documents, courts, investigations, or hearings.

Use the payoff style approved in Stage Two.

==================================================
HIDDEN CARD TIMING RULE
==================================================

Use hidden cards from Stage Two.

For each hidden card, plan:

- early hint;
- partial reveal;
- stronger reveal;
- public or full reveal;
- payoff use.

Do not reveal hidden cards too early.

Do not invent new hidden cards unless absolutely necessary.

If a new hidden card is needed, mark it as Proposed Change.

Hidden cards must create satisfaction later.

They must not be random shortcuts.

Bad hidden card:
The protagonist suddenly becomes a secret emperor with no setup.

Good hidden card:
The protagonist quietly collected a resource, clue, witness, skill, ally, or proof from an early humiliation scene and uses it later.

==================================================
EMOTIONAL ENGINE RULE
==================================================

The emotional engine must appear across the entire plan.

If the emotional engine is betrayal, betrayal consequences must keep influencing the story.

If the emotional engine is fake marriage, the relationship premise must stay visible.

If the emotional engine is family rejection, family regret and status reversal must build over time.

If the emotional engine is survival pressure, the threat of death, starvation, captivity, or escape must remain visible.

If the emotional engine is stolen work, ownership and recognition must stay central.

If the emotional engine is exile, the protagonist must continue proving value outside the system that rejected them.

If the emotional engine is poverty or family protection, food, shelter, safety, and dignity must keep mattering.

The plan must not let plot mechanics erase emotional motivation.

==================================================
PROTAGONIST PROGRESSION RULE
==================================================

The protagonist must grow step by step.

Do not make the protagonist fully powerful too early.

Each part should show one of these:

- new resource;
- new ally;
- new proof;
- new tool;
- new skill application;
- new social status shift;
- new emotional boundary;
- new enemy misunderstanding;
- new strategic advantage;
- new limitation;
- new cost.

The protagonist’s wins must come from the approved power source.

If the protagonist has old-world knowledge, system knowledge, survival knowledge, scientific knowledge, business knowledge, medical knowledge, law knowledge, magic knowledge, combat skill, social skill, or strategy, turn it into concrete actions, not vague genius.

Bad:
The protagonist used knowledge and became respected.

Good:
The protagonist uses smoke preservation to stop meat from rotting, which gives the starving group three extra days of food and forces doubters to admit he solved a real problem.

==================================================
ANTAGONIST ESCALATION RULE
==================================================

The antagonist must escalate logically.

They should not become stupid just to lose.

Their escalation can include:

- mockery;
- denial;
- social pressure;
- sabotage;
- false accusation;
- public challenge;
- reputation attack;
- resource blockade;
- direct trap;
- legal or political pressure;
- economic pressure;
- emotional manipulation;
- violent pressure;
- final overcommitment.

The antagonist should create their own downfall through:

- arrogance;
- false belief;
- underestimation;
- overconfidence;
- abusing status;
- leaving proof;
- attacking the wrong weakness;
- misunderstanding the protagonist’s approved power source.

==================================================
BETRAYER / REGRET RULE
==================================================

If the story includes a betrayer, plan their regret gradually.

No instant regret.

Possible ladder:

arrogance
→ irritation
→ doubt
→ denial
→ fear
→ proof shock
→ bargaining
→ rejection
→ consequence.

Regret must be triggered by visible results, not by random emotional change.

If forgiveness is forbidden or delayed, preserve that.

==================================================
TRUE ALLY RULE
==================================================

If the story includes a true ally, plan trust development.

The true ally must not become only a romantic prize.

They should contribute through:

- recognition;
- access;
- protection;
- validation;
- resources;
- emotional contrast;
- public credibility;
- testing the protagonist;
- strategic help.

But the protagonist must keep agency.

The true ally should not solve the core problem instead of the protagonist.

==================================================
PART LENGTH AND TOTAL LENGTH RULE
==================================================

Use the project target length.

If target length is around one hundred twenty thousand to one hundred thirty thousand characters, create a plan that can support that length.

Recommended default:
Nine parts.

Recommended part length:
twelve thousand to fifteen thousand characters per part.

High-drama parts may be longer.
Transition parts may be shorter.

Do not create too few events for a long script.

Each part must contain enough material for Stage Four to create multiple scene cards.

For a nine-part structure, recommend total scene count later:
thirty six to fifty scenes.

Do not write scene cards here, but plan enough event density to support them.

==================================================
SCRIPT FORMATTING CONTRACT FOR LATER STAGES
==================================================

Stage Three does not write the final script.

However, Stage Three must define the formatting rules that Stage Four and Stage Five must follow later.

These rules are mandatory for the final script.

Normal narration and dialogue paragraphs:

- Every non-avatar paragraph in the final script must be strictly between one hundred twenty and two hundred twenty characters including spaces.
- No normal paragraph may be shorter than one hundred twenty characters.
- No normal paragraph may be longer than two hundred twenty characters.
- If a sentence is too short, Stage Five must merge it naturally with nearby action, context, reaction, or emotional movement.
- If a paragraph is too long, Stage Five must split it naturally without damaging rhythm.
- This applies to narration and dialogue paragraphs unless the user explicitly changes the rule.

Avatar commentary:

- If avatar commentary is enabled, the full script must contain exactly three avatar commentary blocks total.
- Not two.
- Not four.
- Not more than three.
- Exactly three.
- Each avatar commentary body must be around three hundred to four hundred characters excluding the [AVATAR] tag.
- The [AVATAR] tag itself does not count toward the avatar body length.
- Avatar commentary must explain psychology, strategy, social pressure, survival logic, betrayal logic, enemy ego, audience interpretation, emotional mechanism, or resource logic.
- Avatar commentary must not merely summarize the plot.
- Avatar commentary must not spoil future hidden cards too early.
- Avatar commentary must be placed only at high-value retention moments.

Avatar placement:

- Stage Three must plan exactly three avatar slots if avatars are enabled.
- Stage Four must assign scene-level placement for these slots.
- Stage Five must write exactly these three avatar blocks and no additional avatar blocks.
- Stage Six / Clean Export must follow export settings for keeping or removing avatar tags.

Voiceover normalization:

- In the final script, digits must be written as words.
- Percent signs must be written as words.
- Currency symbols must be written as words.
- Technical markers must not appear in final narration.
- Decorative separators must not appear in final narration.
- Internal labels must not appear in clean export.
- No generation notes, progress notes, TODOs, placeholders, debug text, or unfinished markers are allowed.

Part headings:

- Internal part titles may be used during generation.
- Clean Export must remove part headings if the user chooses no headings.
- If headings are kept, they must use the approved output language and clean format only.
- No decorative formats such as === PART ONE === are allowed.

Script Writer enforcement:

- Stage Five must actively enforce the paragraph character rule.
- Stage Five must count or estimate paragraph length before approving a part.
- Stage Five must not mark a script part complete if normal paragraphs violate the one hundred twenty to two hundred twenty character rule.
- Stage Five must not mark a script part complete if avatar count or avatar length is invalid.

AI Supervisor enforcement:

- AI Supervisor must check paragraph length compliance.
- AI Supervisor must check avatar count.
- AI Supervisor must check avatar length.
- AI Supervisor must check whether avatar commentary is functional or just plot summary.
- AI Supervisor must return Needs serious repair if these rules are violated.
- AI Supervisor must return Do not continue if the final script contains unfinished markers, generation residue, missing parts, or corrupted export text.

==================================================
AVATAR / COMMENTARY PLANNING RULE
==================================================

If avatar commentary is enabled, plan exactly three avatar commentary slots across the full story.

Do not write full avatar text here.

Only define:

- which part;
- after which kind of moment;
- what the avatar explains;
- why the avatar appears there.

Avatar commentary should explain psychology, strategy, social behavior, status pressure, betrayal logic, survival logic, resource logic, or enemy ego.

It should not merely summarize plot.

If avatar commentary is disabled, write:
Avatar commentary disabled.

==================================================
DOMAIN AND VOCABULARY RULE
==================================================

Respect the Domain and Vocabulary Profile from Stage Two.

Do not import wrong-domain mechanics.

If the story is not cyber, do not use cyber vocabulary.

If the story is not legal, do not force court scenes.

If the story is not military, do not force ranks and command hearings.

If the story is not cultivation, do not force sect trials or breakthroughs.

If competitor references exist, use them only for pacing, not content.

==================================================
OUTPUT STYLE
==================================================

Write structurally.

Do not write final script prose.

Do not write scene cards.

Do not write long dialogue.

Do not output markdown tables.

Be clear, practical, and specific.

The plan must be detailed enough for Stage Four to create scene cards, but not so huge that the user cannot review it.

Each part should be concise but meaningful.

Use practical events, not vague labels.

Bad:
The hero gains influence.

Good:
The hero repairs the broken water channel, gives the hungry families clean water, and earns the first public defense from a former skeptic.

==================================================
OUTPUT FORMAT
==================================================

Return exactly this structure:

STAGE THREE — FULL STORY PLAN

One. PLAN OVERVIEW

Write a compact overview of the entire story progression.

Include:
- beginning state;
- midpoint shift;
- final direction;
- emotional engine;
- payoff promise.

Two. COMPETITOR RHYTHM APPLICATION

If competitor references were provided, briefly state the abstract rhythm being applied.

Do not summarize competitor plots.

Include only:
- hook style;
- progression style;
- resource/payoff rhythm;
- escalation style;
- anti-copy reminder.

If no competitor references are provided, write:
No competitor references provided. Using internal high-retention recap structure.

Three. PART STRUCTURE SUMMARY

Number of Parts:
Target Total Length:
Approximate Length Per Part:
Expected Scene Card Count Later:
Avatar Commentary Plan:
Final Script Paragraph Rule:
Final Script Avatar Rule:
Voiceover Normalization Rule:

Four. PART ONE — TITLE

Part Function:
Approximate Target Length:
Beginning Pressure:
Main Events:
Central Conflict:
Concrete Resource / Progress Movement:
Protagonist Movement:
Antagonist Pressure:
Emotional Engine Movement:
Hidden Card Movement:
Face-Slap / Payoff:
Ending Hook:
Stage Four Needs To Show:

Five. PART TWO — TITLE

Part Function:
Approximate Target Length:
Beginning Pressure:
Main Events:
Central Conflict:
Concrete Resource / Progress Movement:
Protagonist Movement:
Antagonist Pressure:
Emotional Engine Movement:
Hidden Card Movement:
Face-Slap / Payoff:
Ending Hook:
Stage Four Needs To Show:

Six. PART THREE — TITLE

Part Function:
Approximate Target Length:
Beginning Pressure:
Main Events:
Central Conflict:
Concrete Resource / Progress Movement:
Protagonist Movement:
Antagonist Pressure:
Emotional Engine Movement:
Hidden Card Movement:
Face-Slap / Payoff:
Ending Hook:
Stage Four Needs To Show:

Seven. PART FOUR — TITLE

Part Function:
Approximate Target Length:
Beginning Pressure:
Main Events:
Central Conflict:
Concrete Resource / Progress Movement:
Protagonist Movement:
Antagonist Pressure:
Emotional Engine Movement:
Hidden Card Movement:
Face-Slap / Payoff:
Ending Hook:
Stage Four Needs To Show:

Eight. PART FIVE — TITLE

Part Function:
Approximate Target Length:
Beginning Pressure:
Main Events:
Central Conflict:
Concrete Resource / Progress Movement:
Protagonist Movement:
Antagonist Pressure:
Emotional Engine Movement:
Hidden Card Movement:
Face-Slap / Payoff:
Ending Hook:
Stage Four Needs To Show:

Nine. PART SIX — TITLE

Part Function:
Approximate Target Length:
Beginning Pressure:
Main Events:
Central Conflict:
Concrete Resource / Progress Movement:
Protagonist Movement:
Antagonist Pressure:
Emotional Engine Movement:
Hidden Card Movement:
Face-Slap / Payoff:
Ending Hook:
Stage Four Needs To Show:

Ten. PART SEVEN — TITLE

Part Function:
Approximate Target Length:
Beginning Pressure:
Main Events:
Central Conflict:
Concrete Resource / Progress Movement:
Protagonist Movement:
Antagonist Pressure:
Emotional Engine Movement:
Hidden Card Movement:
Face-Slap / Payoff:
Ending Hook:
Stage Four Needs To Show:

Eleven. PART EIGHT — TITLE

Part Function:
Approximate Target Length:
Beginning Pressure:
Main Events:
Central Conflict:
Concrete Resource / Progress Movement:
Protagonist Movement:
Antagonist Pressure:
Emotional Engine Movement:
Hidden Card Movement:
Face-Slap / Payoff:
Ending Hook:
Stage Four Needs To Show:

Twelve. PART NINE — TITLE

Part Function:
Approximate Target Length:
Beginning Pressure:
Main Events:
Central Conflict:
Concrete Resource / Progress Movement:
Protagonist Movement:
Antagonist Pressure:
Emotional Engine Movement:
Hidden Card Movement:
Face-Slap / Payoff:
Ending Hook:
Stage Four Needs To Show:

Thirteen. HIDDEN CARD TIMING MAP

Hidden Card One:
Early Hint:
Partial Reveal:
Major Reveal:
Full Payoff:
Do Not Reveal Too Early:

Hidden Card Two:
Early Hint:
Partial Reveal:
Major Reveal:
Full Payoff:
Do Not Reveal Too Early:

Hidden Card Three, if present:
Early Hint:
Partial Reveal:
Major Reveal:
Full Payoff:
Do Not Reveal Too Early:

Fourteen. CHARACTER ARC MAP

Protagonist Arc:
Antagonist Arc:
Betrayer Arc, if present:
True Ally Arc, if present:
Important Side Character Arcs:

Fifteen. RESOURCE / PROGRESS LADDER

List the practical progression across the story.

Use this format:

Step One:
Problem:
Resource / Action:
Result:
New Pressure:

Step Two:
Problem:
Resource / Action:
Result:
New Pressure:

Continue only as much as needed.

This section is especially important for survival, civilization-building, system, business, kingdom-building, family survival, or weak-to-strong stories.

Sixteen. FACE-SLAP / PAYOFF MAP

List the major payoff beats across the story.

For each:

Part:
Payoff Type:
Who Is Hit:
Who Witnesses:
Why It Feels Satisfying:
What It Sets Up:

Seventeen. AVATAR COMMENTARY MAP

If enabled, define exactly three slots.

Avatar One:
Part:
Placement:
Topic:
Purpose:
Expected Body Length Later:
Around three hundred to four hundred characters excluding the [AVATAR] tag.

Avatar Two:
Part:
Placement:
Topic:
Purpose:
Expected Body Length Later:
Around three hundred to four hundred characters excluding the [AVATAR] tag.

Avatar Three:
Part:
Placement:
Topic:
Purpose:
Expected Body Length Later:
Around three hundred to four hundred characters excluding the [AVATAR] tag.

If disabled, write:
Avatar commentary disabled.

Eighteen. ESCALATION MAP

Early Pressure:
Midpoint Pressure:
Late Pressure:
Final Crisis:
Why Escalation Is Logical:

Nineteen. SCRIPT FORMATTING CONTRACT FOR STAGE FOUR AND STAGE FIVE

Normal Paragraph Rule:
Every non-avatar final script paragraph must be strictly between one hundred twenty and two hundred twenty characters including spaces.

Avatar Rule:
If enabled, the final script must contain exactly three avatar commentary blocks total. Each avatar body must be around three hundred to four hundred characters excluding the [AVATAR] tag.

Avatar Slot Plan:
Avatar One:
Part:
Placement:
Purpose:
Expected Topic:

Avatar Two:
Part:
Placement:
Purpose:
Expected Topic:

Avatar Three:
Part:
Placement:
Purpose:
Expected Topic:

Voiceover Rule:
Numbers, percentages, currency signs, and technical symbols must be written as words in the final script. No decorative separators, internal labels, generation notes, unfinished markers, or debug text are allowed in clean export.

Stage Five Enforcement:
Stage Five must write by these formatting rules and cannot mark parts complete if these rules fail.

Stage Six Export Enforcement:
Clean Export must remove technical residue and follow export settings.

Twenty. STAGE FOUR HANDOFF

Write a compact handoff for Stage Four.

It must include:

- approved part structure;
- key events per part;
- concrete resource/progress ladder;
- hidden card timing;
- character arc movements;
- face-slap/payoff map;
- avatar slots;
- paragraph rules;
- avatar count and length rules;
- voiceover normalization rules;
- forbidden changes;
- scene card density recommendation.

==================================================
FINAL CHECK BEFORE OUTPUT
==================================================

Before finalizing, silently check:

- Did I preserve the Locked Story Contract?
- Did I preserve protagonist power source?
- Did I preserve emotional engine?
- Did I use competitor references only for rhythm, not content?
- Did I avoid copying competitor scenes, characters, settings, and twists?
- Did I avoid new hidden cards without approval?
- Did I avoid writing final script prose?
- Did I avoid writing scene cards?
- Did I create enough event density for a long script?
- Does every part have a unique function?
- Does every part move the story forward?
- Does the plan include concrete progress, not vague labels?
- Are avatar slots controlled?
- Did I include exactly three avatar slots if avatars are enabled?
- Did I include avatar body length requirement for later stages?
- Did I include final paragraph length requirement for later stages?
- Did I include voiceover normalization rules for later stages?
- Is the handoff useful for Stage Four?

Output only the Stage Three response.`,
  stageThreeExampleResponse: `==================================================
IMPORTANT: HOW TO USE THIS EXAMPLE
==================================================

This is only an example of Stage Three output.

Do not copy this plot, names, characters, setting, hidden cards, conflicts, part titles, or exact wording.

Use it only to understand:
- how to structure a part-based plan;
- how to keep every part functional;
- how to include concrete resource/progress movement;
- how to map hidden cards;
- how to map face-slaps;
- how to plan avatar slots;
- how to pass paragraph and avatar formatting rules to later stages.

The real Stage Three response must be based only on the approved Stage One and locked Stage Two outputs.
STAGE THREE — FULL STORY PLAN

One. PLAN OVERVIEW

The story follows Arin Vale after his noble family exiles him as a useless son during a succession crisis. Instead of dying in the borderlands, he discovers a ruined underground settlement and begins turning it into a hidden refuge for rejected people.

The beginning focuses on humiliation, hunger, cold, and survival. The midpoint shifts from simple survival into visible settlement growth, loyal allies, and political danger. The final direction is a public status reversal where Arin’s family realizes the useless son they erased controls the only safe border route.

The emotional engine is family rejection, underdog rise, public regret, and earned respect. The payoff promise is not random combat dominance, but a slow proof that strategy, engineering, resource management, and leadership are stronger than inherited status.

Two. COMPETITOR RHYTHM APPLICATION

Hook style:
Use immediate pressure. Arin should be exiled quickly, face physical danger early, and need a practical first solution instead of long exposition.

Progression style:
Use step-by-step progress. Each part should show a concrete upgrade: shelter, water, food, first ally, first defense, first public recognition, political leverage, and final authority.

Resource/payoff rhythm:
Use a problem-to-resource loop. Arin sees something others ignore, turns it into a working solution, gets mocked first, then earns a small but visible payoff.

Escalation style:
Every improvement attracts new pressure. Survival creates attention, attention creates threats, threats create political conflict, and political conflict creates final public reversal.

Anti-copy reminder:
Competitor references influence rhythm only. Do not copy competitor characters, settings, cave scenes, primitive tribe scenes, system rewards, island crash openings, or exact survival events.

Three. PART STRUCTURE SUMMARY

Number of Parts:
Nine parts.

Target Total Length:
Around one hundred twenty thousand to one hundred thirty thousand characters.

Approximate Length Per Part:
Around twelve thousand to fifteen thousand characters per part.

Expected Scene Card Count Later:
Around forty to forty six scene cards.

Avatar Commentary Plan:
Enabled. Exactly three avatar commentary slots total.

Final Script Paragraph Rule:
Every non-avatar final script paragraph must be strictly between one hundred twenty and two hundred twenty characters including spaces.

Final Script Avatar Rule:
Exactly three avatar blocks total. Each avatar body must be around three hundred to four hundred characters excluding the [AVATAR] tag.

Voiceover Normalization Rule:
Numbers, percentages, currency signs, and technical symbols must be written as words in the final script. No decorative separators or internal labels in clean export.

Four. PART ONE — THE SON THEY THREW AWAY

Part Function:
Opening hook, family humiliation, exile, first survival pressure.

Approximate Target Length:
Around fourteen thousand characters.

Beginning Pressure:
Arin is publicly stripped of his family status in the noble hall while his brother Lucien watches without defending him.

Main Events:
Arin is declared useless because he cannot fight. Lord Cassian removes him from inheritance records. Lucien supports the decision to secure his own position. Arin is sent toward the borderlands with almost nothing.

Central Conflict:
Arin must survive the first night outside the family system that erased him.

Concrete Resource / Progress Movement:
He finds a collapsed stone drainage passage near the ruined border road and realizes the underground structure may lead to shelter.

Protagonist Movement:
Arin moves from public humiliation to cold survival logic. He does not beg to return.

Antagonist Pressure:
The family frames exile as mercy and spreads the narrative that Arin was too weak to stay.

Emotional Engine Movement:
The rejection wound is established clearly. The viewer understands why Arin must rise without asking for family approval.

Hidden Card Movement:
Early hint of Hidden Card One: Arin notices stone pressure marks, airflow, and old water channels that trained knights ignore.

Face-Slap / Payoff:
Small payoff: Arin survives the first night using the same engineering knowledge his family mocked.

Ending Hook:
Inside the drainage passage, Arin sees old carved symbols that suggest the ruin is not just a tunnel but the entrance to a buried city.

Stage Four Needs To Show:
The family hall humiliation, the exile road, the first survival problem, and Arin reading the ruined structure better than warriors.

Five. PART TWO — THE DEAD CITY BREATHES

Part Function:
First shelter, first practical discovery, first proof that Arin’s useless knowledge matters.

Approximate Target Length:
Around thirteen thousand five hundred characters.

Beginning Pressure:
Arin wakes cold, hungry, and trapped near the underground entrance while border scavengers move nearby.

Main Events:
He enters the ruined settlement, maps the first chamber, finds a blocked water channel, and uses basic leverage to clear a small flow of water.

Central Conflict:
The ruin can save him, but it is unstable, dark, and dangerous.

Concrete Resource / Progress Movement:
Broken tunnel becomes shelter. Blocked channel becomes clean water. Old storage chamber becomes a possible base.

Protagonist Movement:
Arin stops thinking only about escape and begins thinking like a builder.

Antagonist Pressure:
No direct family pressure yet, but the border environment itself acts as an enemy through hunger, cold, and collapse risk.

Emotional Engine Movement:
Every repair quietly contradicts the family’s insult that Arin had no value.

Hidden Card Movement:
Partial reveal of Hidden Card Two: the city is not fully dead. Some systems can still work.

Face-Slap / Payoff:
The first big practical payoff is clean water. Arin survives because of knowledge, not strength.

Ending Hook:
A wounded border scout finds the water channel and realizes someone has awakened the old ruin.

Stage Four Needs To Show:
Dark underground surfaces, practical repair logic, physical limitation, and the first outsider discovering Arin’s work.

Six. PART THREE — THE FIRST ALLY DOES NOT TRUST HIM

Part Function:
Ally introduction, trust test, social friction, first resource-sharing decision.

Approximate Target Length:
Around thirteen thousand characters.

Beginning Pressure:
Mira Thorn, a wounded scout, threatens Arin because she assumes he is another noble trying to claim border resources.

Main Events:
Arin treats her wound with clean water and old cloth, but refuses to waste all his supplies. Mira tests him by giving false advice about the ruin. Arin catches the lie through structural logic.

Central Conflict:
Arin needs local knowledge, but Mira does not trust noble blood.

Concrete Resource / Progress Movement:
Arin gains a wounded but useful ally. Mira gains water, shelter, and proof that Arin is not a typical noble.

Protagonist Movement:
Arin learns that leadership requires trust, not only correct answers.

Antagonist Pressure:
Mira reveals that border raiders and mercenaries search abandoned ruins for food and iron.

Emotional Engine Movement:
Arin’s rejected status begins to mirror Mira’s distrust of nobles. He must earn respect without his family name.

Hidden Card Movement:
Hidden Card One grows stronger: Arin uses old engineering knowledge to predict a weak ceiling section before it collapses.

Face-Slap / Payoff:
Mira watches Arin save them from a collapse using observation, not sword skill.

Ending Hook:
Mira reveals there are other rejected people hiding in the borderlands, but they will not follow a noble unless he proves he can feed them.

Stage Four Needs To Show:
Mira’s suspicion, Arin’s restraint, the ceiling-collapse payoff, and the first chance to build a group.

Seven. PART FOUR — FOOD FOR THE PEOPLE WHO EXPECTED DEATH

Part Function:
First community pressure, first base-building upgrade, first public respect.

Approximate Target Length:
Around fourteen thousand characters.

Beginning Pressure:
Mira brings Arin to starving refugees who expect him to exploit them or abandon them.

Main Events:
Arin identifies old root cellars, repairs a smoke vent, organizes safe rationing, and creates a basic food preservation system from what the group already has.

Central Conflict:
The refugees are too hungry and distrustful to follow plans unless they see immediate results.

Concrete Resource / Progress Movement:
Scattered refugees become a small working group. Spoiling food becomes preserved food. Shelter becomes a shared base.

Protagonist Movement:
Arin takes the first real step from survivor to leader.

Antagonist Pressure:
Captain Rusk, a mercenary among the refugees, challenges Arin’s authority because he cannot fight.

Emotional Engine Movement:
Arin is again called useless, but this time he has a practical answer instead of silence.

Hidden Card Movement:
Hidden Card Two advances: more dormant rooms can be restored if the people cooperate.

Face-Slap / Payoff:
The refugees eat preserved food that would have rotted. Rusk cannot deny that Arin solved a real problem.

Ending Hook:
Smoke from the restored vent reveals activity in the ruin, attracting the attention of border raiders.

Stage Four Needs To Show:
Hunger pressure, resource chain, skeptical refugees, Rusk’s challenge, and the first public respect shift.

Eight. PART FIVE — THE RAIDERS COME FOR A WEAK LEADER

Part Function:
First external attack, first defense system, midpoint status shift.

Approximate Target Length:
Around fifteen thousand characters.

Beginning Pressure:
Border raiders attack because they think the underground group is led by a weak noble who cannot defend anything.

Main Events:
Arin refuses direct combat. He uses narrow tunnels, water pressure, smoke vents, false paths, and Mira’s scouting to turn the ruin into a trap.

Central Conflict:
Arin must defend the settlement without becoming a warrior.

Concrete Resource / Progress Movement:
The ruin becomes a defensive structure. The refugees become organized defenders. Mira becomes a public believer.

Protagonist Movement:
Arin proves that leadership can defeat brute force.

Antagonist Pressure:
Raiders act as the first physical enemy. Their defeat will later spread rumors to the noble world.

Emotional Engine Movement:
The insult of weakness is publicly reversed. People begin to understand that Arin’s mind is dangerous.

Hidden Card Movement:
Major reveal of Hidden Card Two: the underground city’s layout can become a weapon.

Face-Slap / Payoff:
The raider chief mocks Arin as a soft noble, then loses his men to traps designed from old infrastructure.

Ending Hook:
One captured raider recognizes Arin’s family seal and realizes the exiled son of House Vale is alive.

Stage Four Needs To Show:
Tunnel defense, trap logic, Rusk forced to follow Arin’s plan, and the first rumor that Arin survived exile.

Nine. PART SIX — THE FAMILY HEARS THE WRONG RUMOR

Part Function:
Family denial, political attention, betrayal pressure, first regret crack.

Approximate Target Length:
Around thirteen thousand five hundred characters.

Beginning Pressure:
News reaches House Vale that a hidden settlement is growing in the borderlands under the name of a dead son.

Main Events:
Lord Cassian dismisses the rumor. Lucien sends agents to confirm it. Meanwhile, Arin repairs a grain chamber and creates a winter storage plan.

Central Conflict:
Arin must prepare for winter while his family begins looking toward the settlement as a possible asset.

Concrete Resource / Progress Movement:
The base gains winter storage, organized labor, and stronger internal rules.

Protagonist Movement:
Arin starts making decisions for a community, not just survival.

Antagonist Pressure:
Lucien wants proof that Arin is alive, but also wants to control the story before it damages his inheritance.

Emotional Engine Movement:
Family rejection re-enters directly. The people who erased Arin now want information about what he built.

Hidden Card Movement:
Early hint of Hidden Card Three: merchants mention that old border supply routes connect near the underground city.

Face-Slap / Payoff:
Lucien’s agent expects starving refugees, but finds organized storage, clean water, and guards who respect Arin.

Ending Hook:
The agent returns to House Vale with a report that makes Lucien afraid for the first time.

Stage Four Needs To Show:
Contrast between Vale arrogance and settlement progress, the first family fear crack, and the winter-storage upgrade.

Ten. PART SEVEN — THEY TRY TO CLAIM WHAT THEY THREW AWAY

Part Function:
Political pressure, family confrontation, betrayal escalation, public ownership conflict.

Approximate Target Length:
Around fourteen thousand characters.

Beginning Pressure:
House Vale sends an official demand claiming the settlement as family property because Arin is still blood of their house.

Main Events:
Lucien arrives with guards and documents. He tries to present Arin’s work as a family recovery operation. Arin refuses without shouting and forces Lucien to speak in front of the settlers.

Central Conflict:
Arin must protect the settlement from being socially and politically stolen.

Concrete Resource / Progress Movement:
The community moves from survival group to self-defined civic body with rules, witnesses, and shared loyalty.

Protagonist Movement:
Arin draws a clear emotional boundary. He no longer argues for his worth; he protects what he built.

Antagonist Pressure:
Lucien uses family authority, public shame, and legal inheritance pressure.

Emotional Engine Movement:
The original rejection becomes a public contradiction. The family that erased him now wants ownership.

Hidden Card Movement:
Partial reveal of Hidden Card Three: Arin reveals that the settlement controls access to old supply tunnels.

Face-Slap / Payoff:
Lucien demands obedience, but the settlers publicly refuse him and stand behind Arin.

Ending Hook:
Lucien returns humiliated and convinces Lord Cassian to use military force before Arin becomes politically untouchable.

Stage Four Needs To Show:
The demand scene, Arin’s calm refusal, settler loyalty, Lucien’s humiliation, and the threat of stronger family retaliation.

Eleven. PART EIGHT — THE BORDER CHOOSES THE USELESS SON

Part Function:
Late crisis, public recognition, supply-route reveal, antagonist overcommitment.

Approximate Target Length:
Around fifteen thousand characters.

Beginning Pressure:
Winter storms and monster pressure cut off the main border roads. House Vale faces shortage while Arin’s city remains functional.

Main Events:
Arin activates the old supply route, saves nearby villages, and forces minor nobles to choose between Vale pride and survival.

Central Conflict:
Arin must decide whether to help people connected to the system that rejected him.

Concrete Resource / Progress Movement:
The hidden city becomes a regional lifeline. Arin gains public legitimacy beyond his own settlement.

Protagonist Movement:
Arin becomes a leader with moral authority, not just practical intelligence.

Antagonist Pressure:
Lord Cassian tries to declare Arin a rebel and sends forces to seize the route.

Emotional Engine Movement:
The family’s judgment collapses socially. They need the person they called useless.

Hidden Card Movement:
Major reveal of Hidden Card Three: the city controls the only safe supply route during winter crisis.

Face-Slap / Payoff:
Minor nobles publicly ask Arin for help while refusing to wait for House Vale.

Ending Hook:
Lord Cassian arrives personally, planning to break Arin in front of everyone and reclaim the family narrative.

Stage Four Needs To Show:
Winter pressure, supply-route activation, public choice, noble dependence, and Cassian’s final overcommitment.

Twelve. PART NINE — THE KINGDOM BUILT FROM WORTHLESS THINGS

Part Function:
Final confrontation, public family regret, final status reversal, emotional closure.

Approximate Target Length:
Around fifteen thousand characters.

Beginning Pressure:
Lord Cassian confronts Arin before settlers, minor nobles, and border witnesses, demanding he return as a subordinate son.

Main Events:
Cassian claims Arin’s achievements belong to House Vale. Arin reveals the old records, the settlers’ signed laws, the restored route maps, and the public witness chain showing the city was rebuilt after his exile.

Central Conflict:
The final battle is over identity, ownership, and authority.

Concrete Resource / Progress Movement:
The settlement becomes formally recognized as an independent border power.

Protagonist Movement:
Arin completes his transformation from erased son to chosen leader.

Antagonist Pressure:
Cassian uses bloodline, shame, and political threat, but every tool fails because Arin’s authority is earned.

Emotional Engine Movement:
Family rejection reaches final payoff. Arin no longer needs approval from the people who discarded him.

Hidden Card Movement:
Full payoff of all hidden cards: engineering knowledge, dormant city systems, and supply-route control.

Face-Slap / Payoff:
Cassian must watch public witnesses recognize Arin’s authority while Lucien realizes the inheritance he protected is worth less than the city Arin built.

Ending Hook:
No sequel bait required. End with Arin closing the old family seal box and opening the city gates to the people who chose him.

Stage Four Needs To Show:
Public confrontation, earned authority, no cheap forgiveness, final refusal of family ownership, and restrained emotional victory.

Thirteen. HIDDEN CARD TIMING MAP

Hidden Card One:
Arin’s mocked engineering knowledge is real and useful.

Early Hint:
Part One, when he reads airflow and stone pressure on the exile road.

Partial Reveal:
Part Two and Three, when he restores water and predicts structural collapse.

Major Reveal:
Part Five, when he uses tunnel systems to defeat raiders.

Full Payoff:
Part Nine, when his knowledge proves he rebuilt the city legitimately.

Do Not Reveal Too Early:
Do not show him controlling the whole city system in the early parts.

Hidden Card Two:
The underground city is dormant, not dead.

Early Hint:
Part Two, through old channels, carved marks, and hidden chambers.

Partial Reveal:
Part Four, when storage and shelter systems begin working.

Major Reveal:
Part Five, when the city layout becomes a defensive weapon.

Full Payoff:
Part Nine, when the city is recognized as a living settlement.

Do Not Reveal Too Early:
Do not make the city fully functional from the start.

Hidden Card Three:
The city controls old border supply routes.

Early Hint:
Part Six, through merchant comments and old tunnel references.

Partial Reveal:
Part Seven, when Arin shows Lucien the route exists.

Major Reveal:
Part Eight, when the route saves nearby villages during winter.

Full Payoff:
Part Nine, when House Vale’s dependence becomes public.

Do Not Reveal Too Early:
Do not reveal the full political value of the route before Arin can defend it.

Fourteen. CHARACTER ARC MAP

Protagonist Arc:
Arin moves from publicly erased son to practical survivor, then settlement organizer, then respected leader, then independent border authority.

Antagonist Arc:
Lord Cassian moves from certainty to denial, then political pressure, then public overcommitment, then collapse of authority.

Betrayer Arc, if present:
Lucien moves from smug heir to irritated investigator, then threatened rival, then humiliated claimant, then regretful but not forgiven brother.

True Ally Arc, if present:
Mira moves from suspicious scout to practical ally, then public defender, then one of the first witnesses of Arin’s earned leadership.

Important Side Character Arcs:
Rusk moves from physical-power rival to disciplined defender who accepts Arin’s strategy.
Old Mason Dren moves from skeptical witness to proof keeper.
Nia moves from starving child to emotional proof that the city protects real people.

Fifteen. RESOURCE / PROGRESS LADDER

Step One:
Problem:
Arin is exiled with no shelter.

Resource / Action:
He finds airflow and a collapsed drainage passage.

Result:
He survives the first night.

New Pressure:
The ruin may collapse and contains unknown dangers.

Step Two:
Problem:
He has no clean water.

Resource / Action:
He clears a blocked stone channel.

Result:
The first chamber becomes livable.

New Pressure:
The water attracts outsiders.

Step Three:
Problem:
He cannot survive alone.

Resource / Action:
He helps Mira and proves practical value.

Result:
He gains the first ally and local knowledge.

New Pressure:
Mira brings social distrust and border threats.

Step Four:
Problem:
Refugees are hungry and distrustful.

Resource / Action:
Arin repairs storage and preservation systems.

Result:
Food lasts longer and the group begins to organize.

New Pressure:
Smoke and activity reveal the settlement.

Step Five:
Problem:
Raiders attack the weak-looking leader.

Resource / Action:
Arin weaponizes tunnels, water, smoke, and false paths.

Result:
The settlement survives its first attack.

New Pressure:
Rumors reach House Vale.

Step Six:
Problem:
The family wants to control the narrative.

Resource / Action:
Arin creates civic rules and visible loyalty.

Result:
The settlement becomes harder to claim.

New Pressure:
Lucien brings political pressure.

Step Seven:
Problem:
Winter cuts off border roads.

Resource / Action:
Arin activates the old supply route.

Result:
The city becomes a regional lifeline.

New Pressure:
Lord Cassian tries to seize it.

Step Eight:
Problem:
Cassian claims Arin’s work belongs to House Vale.

Resource / Action:
Arin uses witnesses, restored systems, and public loyalty.

Result:
His authority is recognized.

New Pressure:
Emotional closure requires refusing the old family identity.

Sixteen. FACE-SLAP / PAYOFF MAP

Part:
Part One.

Payoff Type:
Survival reversal.

Who Is Hit:
The family’s belief that Arin cannot survive.

Who Witnesses:
Only the viewer at first.

Why It Feels Satisfying:
The first night proves his mocked knowledge has value.

What It Sets Up:
The ruin as future base.

Part:
Part Four.

Payoff Type:
Resource payoff.

Who Is Hit:
Refugees and Rusk who doubt a weak noble.

Who Witnesses:
The starving group.

Why It Feels Satisfying:
Food preservation solves a real problem.

What It Sets Up:
First social trust.

Part:
Part Five.

Payoff Type:
Strategic defense face-slap.

Who Is Hit:
Raiders and Rusk’s brute-force worldview.

Who Witnesses:
The settlement.

Why It Feels Satisfying:
Arin wins without becoming a warrior.

What It Sets Up:
Rumors reaching House Vale.

Part:
Part Seven.

Payoff Type:
Public loyalty reversal.

Who Is Hit:
Lucien.

Who Witnesses:
Settlers, guards, and family agents.

Why It Feels Satisfying:
The people Lucien expected to command choose Arin.

What It Sets Up:
Final family escalation.

Part:
Part Nine.

Payoff Type:
Final public status reversal.

Who Is Hit:
Lord Cassian, Lucien, and the noble value system.

Who Witnesses:
Settlers, minor nobles, border witnesses, and family representatives.

Why It Feels Satisfying:
The useless son becomes the only legitimate leader in the room.

What It Sets Up:
Final emotional independence.

Seventeen. AVATAR COMMENTARY MAP

Avatar One:
Part:
Part Four.

Placement:
After Arin’s food preservation system works and Rusk cannot deny its value.

Topic:
Why practical competence can defeat social contempt better than arguments.

Purpose:
Explain that Arin does not need to convince people through speeches. He changes status by solving hunger, which is stronger than defending his pride.

Expected Body Length Later:
Around three hundred to four hundred characters excluding the [AVATAR] tag.

Avatar Two:
Part:
Part Seven.

Placement:
After the settlers refuse Lucien’s claim and stand behind Arin.

Topic:
Why earned loyalty is stronger than inherited authority.

Purpose:
Explain the psychology of Lucien’s humiliation: he expected bloodline obedience, but Arin built trust through survival, work, and shared risk.

Expected Body Length Later:
Around three hundred to four hundred characters excluding the [AVATAR] tag.

Avatar Three:
Part:
Part Nine.

Placement:
During the final public confrontation, after Cassian realizes the city’s authority cannot be reclaimed by family status.

Topic:
Why the final face-slap is not revenge alone, but the collapse of the old value system.

Purpose:
Explain that Arin wins because the world publicly sees the difference between inherited control and earned leadership.

Expected Body Length Later:
Around three hundred to four hundred characters excluding the [AVATAR] tag.

Eighteen. ESCALATION MAP

Early Pressure:
Exile, hunger, cold, ruin instability, and social distrust.

Midpoint Pressure:
Raiders attack, settlement visibility increases, and rumors reach House Vale.

Late Pressure:
Lucien tries to reclaim the settlement through family authority and political pressure.

Final Crisis:
Lord Cassian attempts to publicly reclaim Arin and the city during a regional survival crisis.

Why Escalation Is Logical:
Every practical success makes the settlement more visible, valuable, and threatening to the people who dismissed Arin.

Nineteen. SCRIPT FORMATTING CONTRACT FOR STAGE FOUR AND STAGE FIVE

Normal Paragraph Rule:
Every non-avatar final script paragraph must be strictly between one hundred twenty and two hundred twenty characters including spaces.

Avatar Rule:
If enabled, the final script must contain exactly three avatar commentary blocks total. Each avatar body must be around three hundred to four hundred characters excluding the [AVATAR] tag.

Avatar Slot Plan:

Avatar One:
Part:
Part Four.

Placement:
After the first food preservation payoff.

Purpose:
Explain practical competence and status reversal.

Expected Topic:
Solving hunger as stronger proof than arguing against mockery.

Avatar Two:
Part:
Part Seven.

Placement:
After settlers reject Lucien’s claim.

Purpose:
Explain earned loyalty versus inherited authority.

Expected Topic:
Why Lucien loses social power when people choose the person who protected them.

Avatar Three:
Part:
Part Nine.

Placement:
During final public status reversal.

Purpose:
Explain collapse of old value system.

Expected Topic:
Earned leadership defeating family prestige.

Voiceover Rule:
Numbers, percentages, currency signs, and technical symbols must be written as words in the final script. No decorative separators, internal labels, generation notes, unfinished markers, or debug text are allowed in clean export.

Stage Five Enforcement:
Stage Five must write by these formatting rules and cannot mark parts complete if these rules fail.

Stage Six Export Enforcement:
Clean Export must remove technical residue and follow export settings.

Twenty. STAGE FOUR HANDOFF

Approved part structure:
Nine parts moving from exile, survival, first shelter, first ally, first community, first defense, family pressure, regional dependence, and final public status reversal.

Key events per part:
Part One establishes exile and first survival.  
Part Two awakens the dead city through water.  
Part Three builds trust with Mira.  
Part Four organizes refugees through food preservation.  
Part Five defends the settlement against raiders.  
Part Six brings House Vale attention.  
Part Seven turns family claim into public loyalty reversal.  
Part Eight reveals the city as regional lifeline.  
Part Nine delivers final family collapse and earned authority.

Concrete resource/progress ladder:
Shelter, clean water, ally, preserved food, defensive tunnels, civic loyalty, supply route, public legitimacy, independent authority.

Hidden card timing:
Engineering knowledge begins as small observation and pays off in final legitimacy.  
Dormant city begins as shelter and becomes a recognized settlement.  
Supply route begins as rumor and becomes final leverage.

Character arc movements:
Arin rises through competence.  
Cassian collapses through arrogance.  
Lucien moves from betrayal to humiliation.  
Mira becomes true ally and witness.  
Rusk shifts from rival to follower.

Face-slap/payoff map:
Use practical, social, strategic, and final public reversals. Do not rely on random combat dominance.

Avatar slots:
Exactly three: Part Four, Part Seven, Part Nine.

Paragraph rules:
Final script non-avatar paragraphs must be strictly between one hundred twenty and two hundred twenty characters including spaces.

Avatar count and length rules:
Exactly three avatar blocks. Each avatar body around three hundred to four hundred characters excluding the [AVATAR] tag.

Voiceover normalization rules:
Write digits, percentages, currency signs, and symbols as words. Remove decorative separators, internal labels, generation notes, and unfinished markers from clean export.

Forbidden changes:
Do not give Arin secret royal blood, divine power, random system cheat, combat invincibility, or a new hidden status. Do not erase family rejection. Do not turn the story into pure monster fighting.

Scene card density recommendation:
Create around forty to forty six scene cards total. High-density parts should be Part Five, Part Seven, Part Eight, and Part Nine`,
  stageFourSceneCardsPrompt: `You are STAGE FOUR — SCENE CARDS.

Your task is to take the approved Stage Three Full Story Plan and turn it into concrete scene cards for Stage Five Script Writer.

This is the scene-mapping stage of the pipeline.

You must NOT write the final script.
You must NOT write full narration.
You must NOT write prose paragraphs.
You must NOT write the story in final first-person form.
You must NOT change the locked Story Contract.
You must NOT change character functions.
You must NOT change the protagonist’s approved power source.
You must NOT erase the emotional engine.
You must NOT invent new hidden cards without Proposed Change approval.
You must NOT copy competitor scenes, characters, locations, openings, dialogue, or endings.

Your job is to create a clear scene-by-scene writing map so Stage Five can write the final script in first person.

==================================================
INPUT
==================================================

Project Title:
{{PROJECT_TITLE}}

Output Language:
{{OUTPUT_LANGUAGE}}

Genre:
{{GENRE}}

Target Length:
{{TARGET_LENGTH}}

Approved Stage One Developed Idea:
{{DEVELOPED_IDEA}}

Locked Story Contract:
{{STORY_CONTRACT}}

Character Bible:
{{CHARACTER_BIBLE}}

Approved Stage Three Story Plan:
{{STORY_PLAN}}

Current Part Number, if generating one part:
{{CURRENT_PART_NUMBER}}

Current Part Plan, if generating one part:
{{CURRENT_PART_PLAN}}

Script Formatting Contract:
{{SCRIPT_FORMATTING_CONTRACT}}

Avatar Commentary Map:
{{AVATAR_COMMENTARY_MAP}}

Competitor Reference Examples, if provided:
{{COMPETITOR_REFERENCE_EXAMPLES}}

Competitor Style Blueprint, if already extracted:
{{COMPETITOR_STYLE_BLUEPRINT}}

Forbidden Elements:
{{FORBIDDEN_ELEMENTS}}

Global Rules:
{{GLOBAL_RULES}}

AI Supervisor Notes, if any:
{{SUPERVISOR_NOTES}}

==================================================
CORE TASK
==================================================

Create scene cards from the approved Story Plan.

Scene cards are not the final script.

Scene cards are instructions for Stage Five.

Each scene card must tell the Script Writer:

- where the scene happens;
- who appears;
- what pressure starts the scene;
- what the protagonist notices;
- what the protagonist decides;
- what action happens;
- what conflict happens;
- what resource, proof, status, emotional, or survival movement happens;
- what hidden card hint or reveal appears;
- what face-slap or payoff appears;
- what the scene must feel like in first-person narration;
- how the scene exits into the next scene.

The scene cards must make the final script easier to write in first person.

==================================================
GENERATION MODE
==================================================

The app may generate scene cards in two modes.

Mode One:
Generate all scene cards for the full story.

Mode Two:
Generate scene cards only for the selected current part.

If Current Part Number and Current Part Plan are provided, generate only that part’s scene cards.

If no current part is provided, generate scene cards for all parts.

Do not overload the output with unnecessary prose.

If the story target is around one hundred twenty thousand to one hundred thirty thousand characters, recommend around thirty six to fifty scene cards total.

For nine parts, this usually means:

- around four to six scene cards per part;
- high-drama parts may have six or seven scene cards;
- transition parts may have three or four scene cards;
- final part should have enough scene cards to complete the emotional and plot payoff.

Do not create too few scene cards for a long script.

Do not create filler scene cards.

==================================================
STORY CONTRACT PRIORITY
==================================================

The Locked Story Contract is the source of truth.

Preserve:

- core premise;
- protagonist;
- protagonist starting status;
- protagonist approved power source;
- emotional engine;
- antagonist force;
- character functions;
- hidden cards;
- payoff system;
- forbidden changes;
- final payoff promise.

If a scene idea requires changing locked data, do NOT apply it.

Instead, write:

PROPOSED CHANGE:
Current locked fact:
Suggested change:
Reason:
Risk:
Requires user approval: yes

By default, avoid Proposed Changes and build from approved data.

==================================================
STAGE THREE PLAN PRIORITY
==================================================

The Stage Three Story Plan controls:

- part structure;
- major events;
- resource/progress ladder;
- hidden card timing;
- character arcs;
- face-slap/payoff map;
- avatar commentary slots;
- escalation map;
- script formatting contract;
- forbidden changes.

Do not skip important Part Plan beats.

Do not move hidden card reveals too early.

Do not move avatar slots without reason.

Do not change the final payoff.

If a plan beat is vague, make it concrete through scene design, not by changing the story.

==================================================
FIRST-PERSON PREPARATION RULE
==================================================

Stage Five will write the final script in first person.

Therefore, each scene card must include a FIRST-PERSON POV INTENTION.

This does not mean Stage Four writes final first-person prose.

It means each scene card must tell Stage Five what the protagonist should personally experience, notice, fear, calculate, decide, or misunderstand.

For each scene, define:

- what I notice;
- what I feel physically;
- what I calculate;
- what I want in this scene;
- what I decide;
- what I hide from others;
- what changes because of my action.

This helps Stage Five write in first person without sounding like an outside summary.

Bad scene card:
The protagonist repairs the water channel and earns respect.

Good scene card:
First-person POV intention: I notice the cold airflow and wet stone before anyone else. I realize the blocked channel still carries pressure. I do not explain everything. I clear only enough stone to prove water can return.

==================================================
COMPETITOR RHYTHM RULE
==================================================

If competitor references are provided, analyze them silently before creating scene cards.

Use them only for abstract scene rhythm:

- immediate first-person pressure;
- practical problem;
- observation;
- experiment;
- failure or friction;
- adjustment;
- small win;
- social reaction;
- bigger threat.

Do NOT copy competitor:

- exact opening;
- exact scene surfaces;
- exact cave, island, village, tribe, plane, boar, rabbit, system, shaman, priestess, or famine setup;
- exact dialogue;
- exact resource chain;
- exact romantic or sexual dynamics;
- exact system rewards;
- exact final payoff.

Function may transfer.
Surface must stay original.

Allowed abstraction:
A scene begins with hunger, danger, or humiliation, then the protagonist uses approved knowledge to solve a concrete problem and triggers social reaction.

Not allowed:
Copying a competitor’s specific cave-fire-rabbit sequence, plane crash island sequence, baby scientist sequence, game orphan grind sequence, primitive tribe conquest sequence, or family boar-hunt sequence unless the approved project already contains those elements.

==================================================
SCENE FUNCTION RULE
==================================================

Every scene card must have a clear function.

A scene can function as:

- hook scene;
- humiliation scene;
- survival scene;
- resource discovery scene;
- practical experiment scene;
- first ally scene;
- trust test scene;
- base-building scene;
- enemy reaction scene;
- face-slap scene;
- hidden card hint scene;
- hidden card partial reveal scene;
- antagonist escalation scene;
- betrayal pressure scene;
- public witness scene;
- emotional boundary scene;
- final collapse setup scene;
- final payoff scene;
- aftermath scene.

No scene should exist only to fill space.

Every scene must move story, resource, emotion, status, conflict, hidden card, or payoff forward.

==================================================
SCENE CARD DENSITY RULE
==================================================

For each part, create enough scene cards to support the target part length.

If a part is expected to be around twelve thousand to fifteen thousand characters, it usually needs four to six strong scene cards.

A scene card should have enough detail for Stage Five to write approximately two thousand to four thousand characters if needed.

Do not make one scene card cover too many different events.

If a part contains:

- arrival;
- conflict;
- resource discovery;
- practical attempt;
- enemy reaction;
- payoff;
- hook;

split these into multiple scene cards.

Do not merge everything into one vague card.

==================================================
RESOURCE / PROGRESS SCENE RULE
==================================================

If the story includes survival, base-building, kingdom-building, system growth, business growth, medical growth, legal strategy, cultivation growth, social rise, family protection, primitive technology, or weak-to-strong progression, each relevant scene should show a concrete progress movement.

Use this rhythm where appropriate:

problem
→ observation
→ resource
→ attempt
→ friction
→ adjustment
→ result
→ reaction
→ new pressure.

Examples:

hunger
→ injured animal
→ rope and tree
→ risky trap
→ struggle
→ meat acquired
→ family reaction
→ greedy relatives appear.

exile
→ broken passage
→ airflow clue
→ stone clearing
→ collapse risk
→ shelter gained
→ hidden ruin hinted.

mockery
→ protagonist observes detail
→ uses approved skill
→ visible result
→ rival stops laughing
→ antagonist escalates.

Do not write vague progress.

Bad:
The protagonist improves the settlement.

Good:
The protagonist clears the blocked channel, proves water can flow again, and forces the starving group to admit the dead ruin can support life.

==================================================
FACE-SLAP / PAYOFF SCENE RULE
==================================================

Every part should have at least one scene card with a face-slap or payoff.

A face-slap should attack a false belief.

False belief examples:

- the protagonist is useless;
- the protagonist cannot survive;
- the protagonist is only lucky;
- the protagonist needs the enemy;
- the ally should not trust the protagonist;
- the antagonist’s status cannot be challenged;
- the old system is always right.

The payoff must fit the approved power source and genre.

Do not make reactions cartoonish.

Prefer restrained, satisfying reactions:

- silence;
- someone stops laughing;
- enemy loses words;
- ally watches differently;
- public witness confirms the result;
- rival copies the method;
- antagonist escalates because denial becomes harder.

==================================================
HIDDEN CARD SCENE RULE
==================================================

Use only approved hidden cards from Stage Two and Stage Three.

For hidden cards, mark each scene as:

- no hidden card movement;
- early hint;
- partial reveal;
- major reveal;
- full payoff.

Do not reveal major hidden cards too early.

Do not invent new hidden cards.

If a new hidden card seems necessary, use Proposed Change protocol.

Hidden cards must feel planted, not random.

==================================================
EMOTIONAL ENGINE SCENE RULE
==================================================

Each part must keep the emotional engine alive.

Some scene cards should explicitly show how the emotional engine appears.

Examples:

If family rejection is the engine:
A scene should remind the viewer of the original rejection, public shame, or the protagonist’s refusal to beg for approval.

If fake marriage is the engine:
A scene should keep the relationship premise visible through public gossip, legal burden, emotional restraint, or choice.

If betrayal is the engine:
A scene should show consequence, regret delay, or the betrayer’s false confidence.

If survival pressure is the engine:
A scene should keep hunger, danger, shelter, wounds, escape, or death risk visible.

If stolen work is the engine:
A scene should keep ownership, recognition, proof, or public theft central.

==================================================
ANTAGONIST PRESSURE SCENE RULE
==================================================

Antagonist pressure must escalate logically.

Every major protagonist success should trigger some kind of enemy reaction.

Enemy reactions can be:

- mockery;
- denial;
- spying;
- sabotage;
- accusation;
- resource blockade;
- social pressure;
- public challenge;
- political pressure;
- direct attack;
- emotional manipulation;
- final overcommitment.

Do not make enemies passive.

Do not make enemies stupid for convenience.

Do not make enemies confess without reason.

==================================================
TRUE ALLY SCENE RULE
==================================================

If the story has a true ally, scene cards must show gradual trust development.

The ally must not become only a romantic prize.

The ally can contribute:

- access;
- protection;
- local knowledge;
- emotional contrast;
- public validation;
- resources;
- strategic help;
- witness role;
- trust test.

But the protagonist must keep agency.

The ally should not solve the protagonist’s core problem instead of them.

==================================================
BETRAYER / REGRET SCENE RULE
==================================================

If the story has a betrayer, scene cards must plan regret gradually.

No instant regret.

Use visible triggers:

- protagonist survives;
- protagonist gains ally;
- protagonist gains public proof;
- protagonist gains resource;
- protagonist refuses to beg;
- betrayer loses status;
- betrayer realizes enemy lied;
- public witnesses choose protagonist.

Regret should move step by step.

Do not grant cheap forgiveness.

==================================================
AVATAR PLACEMENT RULE
==================================================

If avatar commentary is enabled, Stage Three already planned exactly three avatar commentary slots.

Stage Four must assign exact scene-level placement for these slots.

Do not add extra avatar slots.

Do not remove avatar slots without Proposed Change approval.

For each avatar slot, identify:

- part number;
- scene card number;
- placement moment;
- topic;
- purpose;
- what the avatar should explain later;
- what the avatar must not spoil.

Avatar commentary should explain:

- psychology;
- strategy;
- social pressure;
- survival logic;
- betrayal logic;
- enemy ego;
- resource logic;
- emotional mechanism;
- audience interpretation.

Avatar commentary must not merely summarize plot.

Avatar body length for Stage Five:
around three hundred to four hundred characters excluding the [AVATAR] tag.

==================================================
SCRIPT FORMATTING CONTRACT PASS-THROUGH
==================================================

Stage Four must pass the Script Formatting Contract forward to Stage Five.

The final script rules are:

Normal paragraph rule:
Every non-avatar final script paragraph must be strictly between one hundred twenty and two hundred twenty characters including spaces.

Avatar rule:
If enabled, the final full script must contain exactly three avatar commentary blocks total.
Each avatar body must be around three hundred to four hundred characters excluding the [AVATAR] tag.

Voiceover normalization:
Digits, percentages, currency signs, and technical symbols must be written as words in the final script.

Cleanliness:
No decorative separators, internal labels, stage labels, scene labels, generation notes, unfinished markers, debug text, TODOs, or markdown artifacts are allowed in clean export.

Stage Four must include these rules in its handoff.

==================================================
DOMAIN AND VOCABULARY RULE
==================================================

Respect the Domain and Vocabulary Profile from Stage Two.

Do not import wrong-domain scene surfaces.

If the story is not cyber, do not use cyber scene mechanics.

If the story is not legal, do not force court scenes.

If the story is not military, do not force command hearings.

If the story is not cultivation, do not force sect trials or breakthroughs.

If competitor references exist, use them only for rhythm, not content.

Scene surfaces must fit the approved world.

==================================================
OUTPUT STYLE
==================================================

Write structurally.

Do not write final narration.

Do not write dialogue-heavy content.

Do not output markdown tables.

Use clear labels.

Be specific enough for Stage Five to write the scene.

Do not make each card enormous.

Each card should be practical, readable, and directly useful.

==================================================
OUTPUT FORMAT
==================================================

Return exactly this structure:

STAGE FOUR — SCENE CARDS

One. SCENE CARD OVERVIEW

Generation Mode:
Full story or selected part.

Total Parts Covered:
Total Scene Cards:
Expected Final Script Length:
Scene Density Logic:
First-Person Writing Note:
Avatar Slot Summary:
Formatting Contract Reminder:

Two. PART ONE — TITLE

Part Function:
Approximate Target Length:
Recommended Scene Count:

Scene Card One:
Scene Function:
Scene Surface / Location:
Characters Present:
Opening Pressure:
What Happens:
Central Conflict:
First-Person POV Intention:
What I Notice:
What I Feel Physically:
What I Calculate:
What I Decide:
Visual Action:
Resource / Progress Movement:
Emotional Engine Movement:
Antagonist Pressure:
Hidden Card Movement:
Face-Slap / Payoff:
Dialogue Pressure:
Avatar Placement:
Exit Hook:
Stage Five Must Write This Scene As:

Scene Card Two:
Scene Function:
Scene Surface / Location:
Characters Present:
Opening Pressure:
What Happens:
Central Conflict:
First-Person POV Intention:
What I Notice:
What I Feel Physically:
What I Calculate:
What I Decide:
Visual Action:
Resource / Progress Movement:
Emotional Engine Movement:
Antagonist Pressure:
Hidden Card Movement:
Face-Slap / Payoff:
Dialogue Pressure:
Avatar Placement:
Exit Hook:
Stage Five Must Write This Scene As:

Continue for all needed scene cards in Part One.

Three. PART TWO — TITLE

Use the same scene card format.

Four. PART THREE — TITLE

Use the same scene card format.

Five. PART FOUR — TITLE

Use the same scene card format.

Six. PART FIVE — TITLE

Use the same scene card format.

Seven. PART SIX — TITLE

Use the same scene card format.

Eight. PART SEVEN — TITLE

Use the same scene card format.

Nine. PART EIGHT — TITLE

Use the same scene card format.

Ten. PART NINE — TITLE

Use the same scene card format.

If generating only one selected part, output only the selected part using the same format.

Eleven. AVATAR SCENE PLACEMENT MAP

If avatar commentary is enabled, define exactly three placements across the full story or the relevant placement if generating one part.

Avatar One:
Part:
Scene Card:
Placement Moment:
Topic:
Purpose:
Must Explain:
Must Not Spoil:
Expected Body Length Later:
Around three hundred to four hundred characters excluding the [AVATAR] tag.

Avatar Two:
Part:
Scene Card:
Placement Moment:
Topic:
Purpose:
Must Explain:
Must Not Spoil:
Expected Body Length Later:
Around three hundred to four hundred characters excluding the [AVATAR] tag.

Avatar Three:
Part:
Scene Card:
Placement Moment:
Topic:
Purpose:
Must Explain:
Must Not Spoil:
Expected Body Length Later:
Around three hundred to four hundred characters excluding the [AVATAR] tag.

If disabled, write:
Avatar commentary disabled.

Twelve. HIDDEN CARD SCENE MAP

Hidden Card One:
Scene Hints:
Partial Reveal Scenes:
Major Reveal Scene:
Full Payoff Scene:
Do Not Reveal Too Early:

Hidden Card Two:
Scene Hints:
Partial Reveal Scenes:
Major Reveal Scene:
Full Payoff Scene:
Do Not Reveal Too Early:

Hidden Card Three, if present:
Scene Hints:
Partial Reveal Scenes:
Major Reveal Scene:
Full Payoff Scene:
Do Not Reveal Too Early:

Thirteen. RESOURCE / PROGRESS SCENE MAP

List the main scene-level progression.

Use this format:

Progress Step One:
Scene:
Problem:
Resource / Action:
Result:
New Pressure:

Progress Step Two:
Scene:
Problem:
Resource / Action:
Result:
New Pressure:

Continue only as needed.

Fourteen. FACE-SLAP / PAYOFF SCENE MAP

List the main payoff scenes.

For each:

Part:
Scene Card:
Payoff Type:
False Belief Attacked:
Who Is Hit:
Who Witnesses:
Why It Feels Satisfying:
What It Sets Up:

Fifteen. STAGE FIVE HANDOFF

Write a compact handoff for Stage Five.

It must include:

- scene cards covered;
- current part or full story scope;
- first-person POV instruction;
- protagonist power source reminder;
- emotional engine reminder;
- hidden card timing;
- resource/progress movement;
- face-slap/payoff beats;
- avatar placements;
- paragraph length rule;
- avatar count and length rule;
- voiceover normalization rule;
- forbidden changes;
- continuity warnings.

==================================================
FINAL CHECK BEFORE OUTPUT
==================================================

Before finalizing, silently check:

- Did I preserve the Locked Story Contract?
- Did I preserve the Stage Three Story Plan?
- Did I preserve protagonist power source?
- Did I preserve emotional engine?
- Did I avoid writing final script prose?
- Did I avoid copying competitor scenes?
- Did every scene card have a clear function?
- Did every scene card include first-person POV intention?
- Did I include concrete resource/progress movement where relevant?
- Did I control hidden card timing?
- Did I assign avatar placements correctly?
- Did I include exactly three avatar placements if avatars are enabled and full story is generated?
- Did I pass paragraph and avatar formatting rules to Stage Five?
- Is this useful for Stage Five?

Output only the Stage Four response.`,
  stageFourExampleResponse: `==================================================
IMPORTANT: HOW TO USE THIS EXAMPLE
==================================================

This is only an example of Stage Four output.

Do not copy this plot, names, characters, scene surfaces, hidden cards, conflicts, or exact wording.

Use it only to understand:
- how to convert a part plan into scene cards;
- how to prepare first-person POV for Stage Five;
- how to make every scene practical and visual;
- how to include resource/progress movement;
- how to place hidden card hints;
- how to pass avatar and paragraph rules to Stage Five.

This example shows selected part mode for Part One only.

If Stage Four is generating the full story, it must repeat this same scene card structure for every part.
STAGE FOUR — SCENE CARDS

One. SCENE CARD OVERVIEW

Generation Mode:
Selected part only.

Total Parts Covered:
Part One.

Total Scene Cards:
Five scene cards.

Expected Final Script Length:
Around fourteen thousand characters for this part.

Scene Density Logic:
Part One needs five scene cards because it must show public humiliation, exile, first survival pressure, first practical observation, and the hook into the ruined underground city.

First-Person Writing Note:
Stage Five must write this part in first person. Arin should personally feel the shame of exile, the cold road, the weakness of his body, and the shift from emotional pain into practical survival thinking.

Avatar Slot Summary:
No avatar commentary in Part One. The first avatar is planned later, after the first practical public payoff.

Formatting Contract Reminder:
Every normal final script paragraph must be strictly between one hundred twenty and two hundred twenty characters including spaces. Avatar bodies must be around three hundred to four hundred characters if used.

Two. PART ONE — THE SON THEY THREW AWAY

Part Function:
Opening hook, public humiliation, family rejection, exile, first survival pressure, and first hidden competence hint.

Approximate Target Length:
Around fourteen thousand characters.

Recommended Scene Count:
Five scene cards.

Scene Card One:

Scene Function:
Opening hook and public humiliation.

Scene Surface / Location:
The main hall of House Vale, with cold stone floors, family banners, armed retainers, and inheritance tablets on a raised table.

Characters Present:
Arin Vale, Lord Cassian Vale, Lucien Vale, family elders, retainers, minor relatives, public witnesses.

Opening Pressure:
Arin stands in front of the family while Lord Cassian announces that he is being removed from the succession records.

What Happens:
Lord Cassian declares that Arin is useless because he cannot fight, cannot command soldiers, and has no visible noble value. Lucien stays silent, then supports the decision.

Central Conflict:
Arin is publicly erased by the people whose approval once defined his entire life.

First-Person POV Intention:
I should feel the cold floor under my knees, hear the scratching of my name being removed, and understand that nobody in the hall plans to save me.

What I Notice:
I notice that Lucien does not look angry or sad. He looks relieved, which tells me the decision was not sudden.

What I Feel Physically:
My throat is dry, my knees ache from the stone, and my hands are cold even though the hall is full of people.

What I Calculate:
Begging will only confirm their judgment. If I speak too much, they will turn my pain into entertainment.

What I Decide:
I decide not to beg. I let them finish the ceremony and keep my face calm enough to deny them the pleasure of seeing me break.

Visual Action:
The elder scrapes Arin’s name from the inheritance tablet while servants avoid looking directly at him.

Resource / Progress Movement:
No physical resource yet. The first resource is emotional control.

Emotional Engine Movement:
Family rejection is established. Arin is not simply disliked; he is publicly defined as worthless.

Antagonist Pressure:
Lord Cassian controls the room, the record, the guards, and the family narrative.

Hidden Card Movement:
Early hint. Arin notices the old stone weight under the inheritance table is misaligned, showing his habit of seeing structural details others ignore.

Face-Slap / Payoff:
No full payoff yet. The scene plants the future reversal: the family values combat and status, while Arin notices systems and weak points.

Dialogue Pressure:
Cassian says Arin was born into a noble house but never became a noble son. Lucien says exile is kinder than letting weakness rot inside the family.

Avatar Placement:
No avatar.

Exit Hook:
Arin is ordered to leave before sunset with only a travel cloak, a dull knife, and a small food pouch.

Stage Five Must Write This Scene As:
A first-person humiliation scene with restrained pain. Do not make Arin scream or beg. Make his silence feel like the first act of control.

Scene Card Two:

Scene Function:
Exile road and first survival problem.

Scene Surface / Location:
The road outside the estate, moving from guarded noble walls into abandoned borderland paths.

Characters Present:
Arin, two retainers escorting him, distant servants watching from the gate.

Opening Pressure:
The estate gate closes behind Arin before sunset, and the retainers make it clear he cannot turn back.

What Happens:
The retainers push him beyond the family boundary marker. One of them throws his food pouch into the mud as a final insult. Arin picks it up without answering.

Central Conflict:
Arin must shift from social humiliation to immediate survival.

First-Person POV Intention:
I should feel the moment the family gate shuts behind me and understand that my old identity is gone before I have even found shelter.

What I Notice:
I notice the wind direction, the muddy slope, the tree line, and the fact that the road bends toward lower ground where cold air will gather at night.

What I Feel Physically:
My stomach is tight, my legs are weak from standing in the hall, and the cloak is too thin for the border wind.

What I Calculate:
If I stay on the open road, I will freeze or be found by scavengers. I need stone, cover, and water before darkness fully falls.

What I Decide:
I leave the main road and follow the slope toward the broken drainage stones near the old border path.

Visual Action:
Arin picks up the muddy pouch, wipes it once, and walks away while the retainers laugh behind him.

Resource / Progress Movement:
He still has a cloak, dull knife, and damaged food pouch. He gains the first environmental clue: lower stone channels near the old road.

Emotional Engine Movement:
The family’s rejection becomes physical. Arin is not only disowned; he is pushed into a place meant to kill him.

Antagonist Pressure:
The family’s pressure continues through the exile order and the public certainty that he will not survive.

Hidden Card Movement:
Early hint. Arin reads terrain and stonework more carefully than a normal exiled noble would.

Face-Slap / Payoff:
Small internal payoff. Arin refuses to waste energy on pride and starts thinking like a survivor.

Dialogue Pressure:
One retainer says he should thank the lord for giving him a chance to die outside instead of inside the family walls.

Avatar Placement:
No avatar.

Exit Hook:
Arin sees a collapsed stone drainage mouth half-hidden under frozen grass and realizes it may lead somewhere deeper.

Stage Five Must Write This Scene As:
A first-person transition from humiliation into survival logic. The scene should make the viewer feel that Arin’s mind is still working under pressure.

Scene Card Three:

Scene Function:
First hidden competence hint and shelter discovery.

Scene Surface / Location:
Collapsed drainage mouth beside the old border road, with broken stones, frozen grass, and a narrow dark opening below.

Characters Present:
Arin only.

Opening Pressure:
Night is approaching, and Arin has no safe shelter.

What Happens:
Arin studies the drainage mouth instead of rushing inside. He tests airflow, loose stone, moisture, and slope direction before crawling in.

Central Conflict:
The opening could save him or collapse on him.

First-Person POV Intention:
I should feel the fear of entering darkness, but also the calm of checking each detail because panic will not keep stone from falling.

What I Notice:
I notice cold air moving from inside the opening, which means the passage connects to a larger hollow space.

What I Feel Physically:
My fingers are numb, my shoulders scrape the stone, and every breath tastes like dust and old water.

What I Calculate:
If air moves, there is space beyond. If moisture gathers on the lower stone, water once passed through here. This is not a dead ditch.

What I Decide:
I clear only the smallest safe gap instead of forcing the entrance open and risking a collapse.

Visual Action:
Arin uses the dull knife and a flat stone to loosen mud around the drainage mouth, then pulls himself into the dark passage.

Resource / Progress Movement:
He gains temporary shelter and the first sign of a larger underground structure.

Emotional Engine Movement:
The knowledge his family mocked becomes the reason he has a chance to survive the night.

Antagonist Pressure:
No direct antagonist in scene. Environmental danger replaces family pressure.

Hidden Card Movement:
Early hint of Hidden Card One and Hidden Card Two. Arin’s engineering observation matters, and the structure may be part of a dormant underground city.

Face-Slap / Payoff:
Private payoff. The useless son survives because he understands stone, air, and water better than the warriors who dismissed him.

Dialogue Pressure:
No dialogue needed.

Avatar Placement:
No avatar.

Exit Hook:
The passage opens into a chamber with carved markings that do not belong to a simple drainage system.

Stage Five Must Write This Scene As:
A tense first-person survival scene. Do not overexplain engineering. Show Arin testing, noticing, and acting through physical details.

Scene Card Four:

Scene Function:
First night survival and emotional boundary.

Scene Surface / Location:
Small underground chamber connected to the drainage passage.

Characters Present:
Arin only.

Opening Pressure:
The chamber is dark, cold, and unsafe, but better than the open road.

What Happens:
Arin blocks part of the entrance with loose stone, checks the chamber floor, divides his food, and forces himself not to eat everything at once.

Central Conflict:
His body wants comfort and food, but survival requires restraint.

First-Person POV Intention:
I should feel hunger, humiliation, and exhaustion, but I should choose rationing because the future matters more than pain.

What I Notice:
I notice old tool marks on the wall, dust lines near the floor, and a carved channel that suggests water once moved through the chamber.

What I Feel Physically:
My stomach hurts from hunger, my back aches against the stone, and the cold keeps crawling under the cloak.

What I Calculate:
If I eat everything tonight, I die slower tomorrow. If I ration, I have one more day to understand this place.

What I Decide:
I eat only a small piece, save the rest, and make a rule for myself: I will not die just because they expected me to.

Visual Action:
Arin breaks the hard travel bread into pieces and hides most of it under a flat stone.

Resource / Progress Movement:
Food becomes rationed supply. The chamber becomes first base point.

Emotional Engine Movement:
Arin draws the first emotional boundary. He will survive without begging the family to take him back.

Antagonist Pressure:
The family’s voice remains in his memory as psychological pressure.

Hidden Card Movement:
Early hint of dormant city systems through carved channel and tool marks.

Face-Slap / Payoff:
Small emotional payoff. Arin turns humiliation into a survival rule.

Dialogue Pressure:
No external dialogue. Internal thought should carry the emotional restraint.

Avatar Placement:
No avatar.

Exit Hook:
Before sleeping, Arin hears faint water movement somewhere behind the wall, even though the chamber looks dry.

Stage Five Must Write This Scene As:
A first-person quiet survival scene. The emotional point is not despair; it is the first decision to live on his own terms.

Scene Card Five:

Scene Function:
Part ending hook and discovery of the buried city entrance.

Scene Surface / Location:
Deeper crack behind the chamber wall, leading toward an old stone stairway.

Characters Present:
Arin only.

Opening Pressure:
Arin wakes before dawn to the sound of faint water and shifting stone.

What Happens:
He follows the sound, finds a blocked side crack, clears loose debris, and discovers the top of an ancient stairway beneath the chamber.

Central Conflict:
Going deeper could kill him, but staying near the entrance gives him no future.

First-Person POV Intention:
I should feel the choice between a bad safety and a dangerous possibility. I do not go deeper because I am brave. I go because the surface has already rejected me.

What I Notice:
I notice that the stair edges are worn evenly, which means people once used this passage regularly.

What I Feel Physically:
My hands shake from cold and hunger, but the discovery wakes me more sharply than food could.

What I Calculate:
A built stairway means rooms, storage, water routes, maybe old tools. It also means collapse, animals, or traps.

What I Decide:
I mark the entrance with a scratch, take the knife, and go down slowly instead of waiting for death near the surface.

Visual Action:
Arin scrapes a line into the wall, pulls the cloak tight, and lowers one foot onto the first buried step.

Resource / Progress Movement:
Shelter expands into possible base. The story moves from survival to discovery.

Emotional Engine Movement:
The rejected son finds a place the family never valued, creating the first true path toward independent identity.

Antagonist Pressure:
No direct antagonist, but the family’s expectation of his death hangs over the scene.

Hidden Card Movement:
Strong early hint of Hidden Card Two. The dead ruin may actually be a buried settlement.

Face-Slap / Payoff:
The viewer gets the first major hook payoff: exile did not lead to death, but to the entrance of something powerful.

Dialogue Pressure:
No dialogue needed.

Avatar Placement:
No avatar.

Exit Hook:
At the bottom of the first steps, Arin sees a dry fountain carved into the shape of a sleeping city gate.

Stage Five Must Write This Scene As:
A first-person discovery hook. End the part with wonder, danger, and the promise that the place meant to bury Arin may become his foundation.

Eleven. AVATAR SCENE PLACEMENT MAP

Avatar commentary is enabled, but Part One has no avatar placement.

Avatar One:
Part:
Part Four.

Scene Card:
To be assigned in Part Four scene cards.

Placement Moment:
After the first food preservation payoff.

Topic:
Practical competence versus social contempt.

Purpose:
Explain why solving hunger changes status more effectively than arguing against mockery.

Must Explain:
Arin’s first real public respect comes from a result people can physically use.

Must Not Spoil:
Do not reveal the supply route hidden card or final family collapse.

Expected Body Length Later:
Around three hundred to four hundred characters excluding the [AVATAR] tag.

Avatar Two:
Part:
Part Seven.

Scene Card:
To be assigned in Part Seven scene cards.

Placement Moment:
After settlers reject Lucien’s claim.

Topic:
Earned loyalty versus inherited authority.

Purpose:
Explain why Lucien loses social power when people choose the person who protected them.

Must Explain:
Bloodline authority fails when people have survived through someone else’s competence.

Must Not Spoil:
Do not spoil the final public recognition scene.

Expected Body Length Later:
Around three hundred to four hundred characters excluding the [AVATAR] tag.

Avatar Three:
Part:
Part Nine.

Scene Card:
To be assigned in Part Nine scene cards.

Placement Moment:
During final public status reversal.

Topic:
Collapse of the old value system.

Purpose:
Explain why Arin’s victory is stronger than revenge because he no longer needs the family’s approval.

Must Explain:
Earned leadership defeats inherited prestige.

Must Not Spoil:
This is the final avatar and can speak directly about the completed reversal.

Expected Body Length Later:
Around three hundred to four hundred characters excluding the [AVATAR] tag.

Twelve. HIDDEN CARD SCENE MAP

Hidden Card One:
Arin’s mocked engineering knowledge is real and useful.

Scene Hints:
Scene Card One, where he notices the misaligned stone weight under the inheritance table.  
Scene Card Two, where he reads slope and air direction on the exile road.  
Scene Card Three, where he tests airflow and moisture before entering.

Partial Reveal Scenes:
Later in Part Two and Part Three when he restores water and prevents collapse.

Major Reveal Scene:
Later in Part Five when the city layout becomes defensive advantage.

Full Payoff Scene:
Part Nine when his rebuilding work becomes public proof of authority.

Do Not Reveal Too Early:
Do not make Arin fully understand the entire city in Part One.

Hidden Card Two:
The underground city is dormant, not dead.

Scene Hints:
Scene Card Three, where the drainage mouth connects to a larger hollow space.  
Scene Card Four, where carved channels and tool marks appear.  
Scene Card Five, where the buried stairway and dry fountain are revealed.

Partial Reveal Scenes:
Part Two when the first water channel works.

Major Reveal Scene:
Part Five when old tunnel systems become defense.

Full Payoff Scene:
Part Nine when the settlement is recognized as a living city.

Do Not Reveal Too Early:
Do not activate major systems in Part One.

Hidden Card Three:
The city controls old border supply routes.

Scene Hints:
No direct hint in Part One.

Partial Reveal Scenes:
Part Six and Part Seven.

Major Reveal Scene:
Part Eight.

Full Payoff Scene:
Part Nine.

Do Not Reveal Too Early:
Do not mention the full political value of the route during Part One.

Thirteen. RESOURCE / PROGRESS SCENE MAP

Progress Step One:
Scene:
Scene Card Two.

Problem:
Arin is exiled with no safe place to sleep.

Resource / Action:
He reads the terrain and follows old drainage stones instead of staying on the road.

Result:
He finds the first possible shelter.

New Pressure:
The passage may collapse or lead to something dangerous.

Progress Step Two:
Scene:
Scene Card Three.

Problem:
The entrance is blocked and unstable.

Resource / Action:
He tests airflow, moisture, and loose stone before clearing a small gap.

Result:
He enters without causing a collapse.

New Pressure:
The chamber is still cold, dark, and unsafe.

Progress Step Three:
Scene:
Scene Card Four.

Problem:
He has almost no food and no idea how long he must survive alone.

Resource / Action:
He rations the food and studies the chamber instead of collapsing emotionally.

Result:
He turns the chamber into a temporary base.

New Pressure:
The faint water sound suggests a deeper unknown structure.

Progress Step Four:
Scene:
Scene Card Five.

Problem:
Staying near the entrance gives him no future.

Resource / Action:
He follows the water sound and uncovers the buried stairway.

Result:
He discovers the entrance to something larger than shelter.

New Pressure:
The deeper ruin may contain danger, but it is also his only chance.

Fourteen. FACE-SLAP / PAYOFF SCENE MAP

Part:
Part One.

Scene Card:
Scene Card One.

Payoff Type:
Setup payoff.

False Belief Attacked:
Arin is useless because he cannot fight.

Who Is Hit:
The family’s worldview, but not publicly yet.

Who Witnesses:
The viewer.

Why It Feels Satisfying:
Arin notices structural details while the family only sees combat value.

What It Sets Up:
His future victories through observation and systems.

Part:
Part One.

Scene Card:
Scene Card Three.

Payoff Type:
Private survival payoff.

False Belief Attacked:
Arin will die immediately outside the estate.

Who Is Hit:
The family’s expectation, privately.

Who Witnesses:
The viewer.

Why It Feels Satisfying:
He survives by using knowledge they dismissed.

What It Sets Up:
The ruin as his future foundation.

Part:
Part One.

Scene Card:
Scene Card Five.

Payoff Type:
Discovery hook payoff.

False Belief Attacked:
Exile is only punishment.

Who Is Hit:
The entire premise of the family’s judgment.

Who Witnesses:
The viewer.

Why It Feels Satisfying:
The place meant to kill Arin becomes the entrance to his rise.

What It Sets Up:
Part Two and the awakening of the dead city.

Fifteen. STAGE FIVE HANDOFF

Scene cards covered:
Part One only, five scene cards.

Current part scope:
Public humiliation, exile, first survival problem, shelter discovery, and buried city hook.

First-person POV instruction:
Write everything as Arin’s personal narration. Use “I” as the default narrator. Show what I notice, what I calculate, what I feel physically, and what I decide under pressure.

Protagonist power source reminder:
Arin wins through strategy, engineering observation, resource management, restraint, and long-term thinking. Do not make him win through combat power or secret royal status.

Emotional engine reminder:
Family rejection must stay visible. Arin should feel the wound, but he must not beg for approval.

Hidden card timing:
Only hint at engineering knowledge and dormant city systems. Do not fully reveal the city’s power or supply route.

Resource/progress movement:
Public identity lost. Road survival begins. Drainage clue appears. Temporary shelter gained. Buried stairway discovered.

Face-slap/payoff beats:
The face-slaps are private in Part One. The viewer sees that the family is wrong before the family does.

Avatar placements:
No avatar in Part One. Do not write any [AVATAR] block in this part.

Paragraph length rule:
Every non-avatar paragraph in the final script must be strictly between one hundred twenty and two hundred twenty characters including spaces.

Avatar count and length rule:
Full script must contain exactly three avatar blocks if enabled. Each avatar body must be around three hundred to four hundred characters excluding the [AVATAR] tag.

Voiceover normalization rule:
Write all numbers, percentages, currency signs, and technical symbols as words in the final script. No decorative separators, internal labels, generation notes, or unfinished markers.

Forbidden changes:
Do not add secret bloodline, sudden combat power, divine status, system cheat, or hidden royal identity. Do not erase the family rejection engine.

Continuity warnings:
Do not let Arin understand the full underground city too early. Do not make the family regret yet. Do not make Lucien emotional too soon.
`,
  stageFiveScriptWriterPrompt: `You are STAGE FIVE — SCRIPT WRITER.

CRITICAL: LENGTH REQUIREMENT
Each part MUST BE strictly between 10,000 and 14,000 characters including spaces.
- This is a hard requirement. If you run out of plot, expand on:
  * External settings (weather, sounds, smell, atmosphere).
  * Internal character state (thoughts, doubts, calculations, fears).
  * Visual impact (how exactly does a face look, how does the light hit).
  * Emotional weight (the consequences of the betrayal, the sting of the humiliation).
- DO NOT summarize.
- DO NOT hurry.
- Immerse the viewer in the scene.

CRITICAL: FAST HOOK REQUIREMENT
If this is PART ONE, you must start with a "HARD HOOK". 
The first 10 seconds of the script MUST grab the audience by the throat.
- Jump directly into the center of the conflict or the highest point of mystery.
- Do not start with "Once upon a time" or slow worldbuilding.
- Force the viewer to ask a question they must stay to answer.

Your task is write the final long-form YouTube recap / drama / manhwa-style script from the approved Story Contract, approved Story Plan, and approved Scene Cards.

This is the main writing stage.

You must write in FIRST PERSON POV by default.

The protagonist must narrate the story as “I”.

The script must feel like the protagonist is personally telling the viewer what happened, what they noticed, what they feared, what they calculated, what they wanted, and why each action mattered.

==================================================
INPUT
==================================================

Project Title:
{{PROJECT_TITLE}}

Output Language:
{{OUTPUT_LANGUAGE}}

Genre:
{{GENRE}}

Target Length:
{{TARGET_LENGTH}}

Approved Stage One Developed Idea:
{{DEVELOPED_IDEA}}

Locked Story Contract:
{{STORY_CONTRACT}}

Character Bible:
{{CHARACTER_BIBLE}}

Approved Story Plan:
{{STORY_PLAN}}

Approved Scene Cards:
{{SCENE_CARDS}}

Current Part Number:
{{CURRENT_PART_NUMBER}}

Current Part Title:
{{CURRENT_PART_TITLE}}

Scene Cards For Current Part:
{{CURRENT_PART_SCENE_CARDS}}

Previous Approved Script Parts Summary:
{{PREVIOUS_APPROVED_SCRIPT_PARTS_SUMMARY}}

Remaining Parts Summary:
{{REMAINING_PARTS_SUMMARY}}

Avatar Commentary Setting:
{{AVATAR_COMMENTARY_SETTING}}

Avatar Slot For Current Part:
{{AVATAR_SLOT_FOR_CURRENT_PART}}

Competitor Reference Examples, if provided:
{{COMPETITOR_REFERENCE_EXAMPLES}}

Competitor Style Blueprint, if already extracted:
{{COMPETITOR_STYLE_BLUEPRINT}}

Script Formatting Contract:
{{SCRIPT_FORMATTING_CONTRACT}}

Forbidden Elements:
{{FORBIDDEN_ELEMENTS}}

Global Rules:
{{GLOBAL_RULES}}

AI Supervisor Notes, if any:
{{SUPERVISOR_NOTES}}

==================================================
CORE TASK
==================================================

Write the final script text for the selected part.

If the app is generating one part at a time, write ONLY the current part.

If the app is generating all parts through internal automation, write one part at a time and save it as a separate scriptPart.

Do not write the whole script as one uncontrolled massive response unless the software explicitly requests full-script assembly.

The script must be based on:

- locked Story Contract;
- approved Character Bible;
- approved Story Plan;
- approved Scene Cards for the current part;
- previous approved script part continuity summary;
- Script Formatting Contract.

Scene Cards control what happens.

Competitor references control rhythm only.

Do not invent a new plot.

Do not change locked facts.

Do not change character functions.

Do not change protagonist power source.

Do not erase emotional engine.

Do not invent new hidden cards.

Do not add unapproved secret status, secret bloodline, secret authority, forgotten inheritance, random system power, or sudden power upgrade.

==================================================
FIRST PERSON POV RULE
==================================================

The script must be written in first person.

Use:

I woke up.
I looked around.
I realized.
I thought.
I knew.
I did not understand.
I had no choice.
I needed shelter.
I counted what I had.
I made a plan.
I did not panic.
I watched them.
I let them underestimate me.
I moved before they understood.

Do not write the protagonist as “he” unless the user explicitly chooses third-person mode.

Bad:
Arin woke up in the ruined tunnel and realized he had been abandoned.

Good:
I woke up in the ruined tunnel with stone dust in my mouth and my family’s verdict still burning in my ears. They had thrown me away, but I was still breathing.

The first-person voice must include:

- immediate physical sensation;
- personal thought;
- practical observation;
- emotional restraint;
- internal calculation;
- decision;
- consequence.

The narrator should not sound detached from the story.

The narrator should not sound like an outside summary bot.

==================================================
COMPETITOR RHYTHM RULE
==================================================

If competitor examples are provided, silently extract their abstract writing rhythm before writing.

Use competitor examples only for:

- first-person immediacy;
- fast opening pressure;
- practical survival or status problem;
- sensory detail;
- internal calculation;
- concrete action chain;
- small dopamine wins;
- resource progression;
- enemy underestimation;
- protagonist calm under pressure;
- visible payoff after effort;
- hook at the end of each part.

Do NOT copy competitor:

- plot;
- characters;
- names;
- openings;
- locations;
- scenes;
- dialogue;
- inventions;
- system rewards;
- sexual dynamics;
- endings;
- unique worldbuilding.

Function may transfer.
Surface must stay original.

Good rhythm:
I wake up in pressure.
I identify the problem.
I check what I have.
I make a practical plan.
I fail or face resistance.
I adjust.
I gain a small win.
Others react.
A bigger problem appears.

Bad copying:
Using the same wolf exile, same rabbit girl, same cave, same fire discovery, same plane crash, same primitive tribe, same child scientist setup, same game orphan setup, or same family famine setup unless the approved project already contains those elements.

==================================================
SCRIPT STYLE TARGET
==================================================

The script should feel like a high-retention YouTube recap narration.

It must be:

- direct;
- vivid;
- emotionally clear;
- practical;
- fast-moving;
- easy to voice;
- first-person;
- concrete;
- satisfying;
- not literary for the sake of being literary.

Avoid:

- vague poetic metaphors;
- empty motivational speeches;
- AI-sounding smoothness;
- repetitive sentence structures;
- generic “he felt a strange feeling” phrasing;
- long exposition dumps;
- overexplaining the plan before action;
- sudden omnipotence;
- too much passive summary.

Prefer:

- action before explanation;
- sensory detail before lore;
- practical problem before worldbuilding;
- visible consequence after every decision;
- small wins before big wins;
- internal calculation during danger;
- emotional restraint instead of melodrama.

==================================================
OPENING STYLE RULE
==================================================

For Part One, start with immediate first-person pressure.

The opening should quickly answer:

- Who am I?
- What is wrong right now?
- What danger, humiliation, hunger, exile, betrayal, confusion, or pressure am I facing?
- What do I immediately need?
- Why can I not solve it easily?
- What is my first decision?

Strong opening patterns:

My name is...
I woke up...
I died...
I used to be...
The first thing I noticed was...
I had exactly...
I was not supposed to survive...
The problem was...

Do not spend the opening on abstract lore.

Do not begin with a long history of the world.

Worldbuilding should appear only when the protagonist experiences it or needs it to solve a problem.

==================================================
PART CONTINUITY RULE
==================================================

For every part after Part One, begin with a clean continuation from the previous approved part.

Do not restart the story.

Do not repeat the same exposition.

Do not reintroduce the protagonist as if the viewer forgot everything.

Do not contradict previous events.

Each new part should quickly establish:

- current pressure;
- current goal;
- consequence from the previous part;
- new obstacle;
- forward movement.

Use Previous Approved Script Parts Summary only for continuity, not for repeating old scenes.

==================================================
SCENE CARD OBEDIENCE RULE
==================================================

Write from the approved Scene Cards for the current part.

Each scene card should become final narration.

Do not skip required scene cards.

Do not add major unplanned scenes.

Do not change the order unless absolutely necessary for clarity.

If a scene card is weak, write it better through execution, not by changing the plot.

Every scene must contain at least one of:

- action;
- conflict;
- decision;
- discovery;
- emotional movement;
- resource movement;
- status shift;
- proof/payoff movement;
- hidden card movement;
- antagonist pressure.

No filler scenes.

==================================================
PROTAGONIST AGENCY RULE
==================================================

The protagonist must drive the story.

The protagonist should not simply watch other people solve problems.

The protagonist’s wins must come from the approved power source.

If the approved power source is intelligence, write observation, calculation, preparation, and strategic action.

If it is survival skill, write practical tools, food, shelter, risk assessment, and trial-and-error.

If it is system ability, write system rules, costs, limitations, exploitation, and consequences.

If it is business skill, write negotiation, leverage, market movement, money flow, and reputation.

If it is medical skill, write symptoms, diagnosis, treatment, and consequence.

If it is magic or cultivation, write training, rules, cost, breakthrough, and status reaction.

If it is social status or charisma, write perception, manipulation, public reaction, and loyalty shift.

Do not replace the approved power source with a different one.

==================================================
EMOTIONAL ENGINE PRESERVATION RULE
==================================================

The approved emotional engine must stay visible in every part.

If the emotional engine is family rejection, keep the wound of rejection and the desire for earned respect alive.

If the emotional engine is fake marriage, keep the relationship premise visible.

If the emotional engine is betrayal, keep the betrayal consequences active.

If the emotional engine is survival pressure, keep danger, hunger, escape, or death risk visible.

If the emotional engine is stolen work, keep ownership and recognition central.

If the emotional engine is poverty or family protection, keep food, shelter, money, dignity, and protection visible.

The plot mechanism must not erase emotional motivation.

==================================================
RESOURCE / PROGRESS WRITING RULE
==================================================

When writing survival, kingdom-building, system, business, cultivation, family survival, primitive technology, or weak-to-strong stories, use concrete progress chains.

The reader should feel the protagonist building something step by step.

Use this rhythm when appropriate:

problem
→ observation
→ small resource
→ practical attempt
→ resistance or failure
→ adjustment
→ partial success
→ social reaction
→ new pressure.

Do not write vague progress.

Bad:
I used my knowledge to improve the tribe.

Good:
I used wet clay to seal the gaps between the stones, then fed the fire slowly until the smoke stopped leaking into the cave. It was not a real stove yet, but it held heat.

Bad:
I became respected by the villagers.

Good:
The old hunter stopped laughing when the preserved meat lasted three days longer than his dried strips. He did not praise me, but he took the next piece exactly the way I showed him.

==================================================
FACE-SLAP AND PAYOFF WRITING RULE
==================================================

Each part must contain at least one satisfying payoff or strong setup for a bigger payoff.

Face-slaps must come from the approved story logic.

A good face-slap attacks a false belief.

Examples:

They think I am weak.
I solve a problem strength cannot solve.

They think I am useless.
I create food, shelter, money, proof, medicine, defense, or status.

They think I am lying.
I reveal a visible result they cannot deny.

They think I need them.
I show I survived without them.

They think their rank protects them.
Their own mistake becomes public.

Face-slaps must be satisfying but believable.

Do not make everyone worship the protagonist instantly.

Use restrained public reactions:

- silence;
- lowered eyes;
- someone stops laughing;
- a rival copies the protagonist’s method;
- an enemy loses words;
- a witness confirms the result;
- an ally changes how they address the protagonist;
- the crowd shifts from mockery to uncertainty.

==================================================
ANTAGONIST WRITING RULE
==================================================

Antagonists must be hateable but functional.

Do not make them stupid only so the protagonist can win.

They should escalate because they believe their worldview is correct.

They should lose because:

- they underestimate the protagonist’s approved power source;
- they abuse status;
- they overcommit;
- they leave a trace;
- they attack the wrong weakness;
- they mistake silence for fear;
- they create public proof against themselves.

Do not make antagonists confess randomly.

Do not make them forget obvious facts.

Do not make them scream in every scene.

==================================================
DIALOGUE RULE
==================================================

Dialogue must be short, sharp, and functional.

Dialogue should do at least one of these:

- reveal status;
- create pressure;
- show contempt;
- expose fear;
- force a decision;
- trigger a payoff;
- show a relationship shift;
- make the protagonist’s restraint visible.

Avoid long exposition speeches.

Avoid dialogue that sounds like characters explaining the plot to the audience.

Use dialogue as pressure, not decoration.

==================================================
INTERNAL MONOLOGUE RULE
==================================================

Internal monologue must be useful.

It should show:

- calculation;
- fear under control;
- practical reasoning;
- emotional restraint;
- strategy;
- comparison between old knowledge and current world;
- why a decision matters;
- what danger the viewer should understand.

Do not overuse internal monologue to repeat obvious events.

Good:
I did not need to beat him. I needed him to swing first, miss in front of everyone, and show the room exactly how desperate he was.

Bad:
I was very determined and knew I had to keep going because my future depended on it.

==================================================
PARAGRAPH LENGTH RULE
==================================================

Every normal non-avatar paragraph must be strictly between one hundred twenty and two hundred twenty characters including spaces.

This rule applies to narration and dialogue paragraphs.

No normal paragraph may be shorter than one hundred twenty characters.

No normal paragraph may be longer than two hundred twenty characters.

If a sentence is too short, merge it naturally with action, reaction, sensory detail, or internal thought.

If a paragraph is too long, split it naturally into two paragraphs that both obey the character range.

Do not create one-line punch paragraphs shorter than one hundred twenty characters.

Do not create huge paragraphs.

Do not use bullet points in the final script.

Do not use tables in the final script.

==================================================
AVATAR COMMENTARY RULE
==================================================

If avatar commentary is enabled, the full script must contain exactly three avatar commentary blocks total.

Not two.
Not four.
Not more than three.
Exactly three.

Use only the avatar slots approved in Stage Three and Stage Four.

Do not invent additional avatar commentary.

Each avatar commentary body must be around three hundred to four hundred characters excluding the [AVATAR] tag.

Avatar format:

[AVATAR] Avatar commentary text here.

Avatar commentary must explain:

- psychology;
- strategy;
- social pressure;
- survival logic;
- betrayal logic;
- enemy ego;
- audience interpretation;
- emotional mechanism;
- resource logic;
- why the scene matters.

Avatar commentary must not merely summarize the plot.

Bad avatar:
[AVATAR] Arin found food and everyone respected him more. This will help him later.

Good avatar:
[AVATAR] This is the first real status reversal. Arin does not argue with people who call him useless. He gives them a result they can touch, eat, and survive with. That kind of proof is stronger than pride, because hunger does not care about noble blood or old insults.

Avatar commentary must not spoil future hidden cards too early.

If avatar commentary is disabled, write no avatar blocks.

==================================================
NUMBER AND SYMBOL NORMALIZATION RULE
==================================================

In the final script, write digits as words.

Do not write:
1, 2, 3, 10, 100, 50%, $5000, km, m, LV20.

Write instead:
one, two, three, ten, one hundred, fifty percent, five thousand dollars, kilometers, meters, level twenty.

If the output language is Russian, write numbers and symbols in Russian words.

Do not use percent signs, currency symbols, or technical numeric abbreviations in final narration unless the user explicitly allows them.

==================================================
VOICEOVER CLEANLINESS RULE
==================================================

The script must be ready for voiceover.

Do not include:

- stage labels;
- scene labels;
- scene card labels;
- internal notes;
- planning notes;
- markdown tables;
- bullet lists;
- decorative separators;
- generation progress notes;
- debug text;
- TODO;
- placeholders;
- unfinished markers;
- output start;
- output end;
- linter report;
- QA notes.

Do not output:

=== PART ONE ===
--- 
***
### 
SCENE ONE
STAGE FIVE
CONTINUITY CHECK
LINTER REPORT
[generating]
[continue]
[unfinished]

Part headings may be used only if the app requests headings for internal generation.

Clean Export may remove headings later.

The script text itself must never contain technical residue.

==================================================
INCOMPLETE OUTPUT RULE
==================================================

Never mark a script part complete if it ends mid-sentence, mid-scene, mid-dialogue, or with a continuation marker.

If the response cannot finish the part, return:

STATUS: INCOMPLETE
CONTINUE FROM: exact last complete sentence

But do not pretend the part is complete.

The app must not assemble incomplete parts into the full script.

==================================================
PART ENDING HOOK RULE
==================================================

Each part must end with a forward pull.

The ending should create one of:

- new danger;
- new resource;
- new enemy move;
- new social reversal;
- partial hidden card reveal;
- new question;
- emotional decision;
- public contradiction;
- escalation into next part.

Do not end a part with flat summary.

Do not end a part with technical notes.

==================================================
ANTI-AI WRITING RULE
==================================================

Avoid phrases that sound generic or artificial.

Avoid overusing:

- little did I know;
- everything changed forever;
- destiny had other plans;
- I could never have imagined;
- a strange feeling rose in my chest;
- it was only the beginning;
- my journey had just begun;
- fate was cruel;
- the real battle was ahead.

Use concrete pressure instead.

Bad:
Little did I know, this was only the beginning of my journey.

Good:
Then I saw the second set of footprints near the water channel. Someone had found the entrance before me.

==================================================
REPETITION CONTROL RULE
==================================================

Do not repeat the same sentence structure too often.

Do not repeat the same internal thought too often.

Do not repeat the same face-slap mechanism too often.

Do not repeat the same explanation of the protagonist’s power source.

Vary:

- sensory detail;
- action;
- reaction;
- internal calculation;
- dialogue pressure;
- social consequence;
- enemy response;
- resource movement.

==================================================
SAFE ORIGINALITY RULE
==================================================

Do not copy competitor text.

Do not paraphrase competitor scenes too closely.

Do not reuse competitor-specific surfaces unless the approved Story Contract requires them.

If competitor examples include survival, primitive technology, island crash, system grind, tribe building, family famine, or civilization-building, use only the abstract rhythm.

Do not copy the exact setup.

==================================================
OUTPUT MODE
==================================================

If writing current part only, output only the script text for the current part.

If the app requires metadata, store metadata separately in project state, not inside the script body.

The script body must not contain analysis.

The script body must not contain checklists.

The script body must not contain comments about what the writer is doing.

==================================================
OUTPUT FORMAT
==================================================

Return only the final script text for the current part.

Do not include explanations before the script.

Do not include explanations after the script.

Do not include a linter report.

Do not include a summary.

Do not include markdown tables.

Do not include bullet points.

Do not include internal stage labels.

If a part heading is required by the app for internal display, use only the approved clean heading format from project settings.

Otherwise, start directly with narration.

==================================================
FINAL SELF-CHECK BEFORE OUTPUT
==================================================

Before finalizing, silently check:

- Is this written in first person?
- Did I use “I” as the protagonist’s narration?
- Did I preserve the locked Story Contract?
- Did I follow current part scene cards?
- Did I avoid inventing new hidden cards?
- Did I preserve protagonist power source?
- Did I preserve emotional engine?
- Did I use competitor references only for rhythm?
- Did I avoid copying competitor scenes?
- Are all normal paragraphs between one hundred twenty and two hundred twenty characters?
- Did I write exactly the approved avatar blocks for this part?
- Is avatar body length around three hundred to four hundred characters if used?
- Are all numbers and symbols written as words?
- Is there no technical residue?
- Is the part complete?
- Does the part end with a forward hook?
- Is the text ready for voiceover?

Output only the script text.`,
  stageSixCleanExportPrompt: "Clean the assembled script for voiceover export without changing story content. Schema: final clean script, export settings used.",
  repairPrompt: "Fix the broken parts according to the supervisor report. Do not change approved logic.",
  partRepairPrompt: "Fix the specific script part according to the supervisor report.",
  continuityCheckPrompt: "Check if the newly generated part aligns with the previous text.",
  exportCheckPrompt: "Verify all parts are complete, no residue, no duplicates."
};

export const INITIAL_STATE: ProjectState = {
  projectTitle: 'Untitled Recap',
  genre: 'Drama / Revenge',
  language: 'English',
  targetLength: '15-20 minutes',
  competitors: '',
  forbiddenElements: '',
  styleNotes: '',
  rawIdea: '',

  developedIdea: '',
  storyContract: '',
  characterBible: '',
  storyPlan: '',
  sceneCards: '',
  scriptParts: [],
  fullScript: '',
  
  cleanExportSettings: {
    keepPartHeadings: false,
    removePartHeadings: true,
    keepAvatarMarkers: false,
    removeAvatarMarkersButKeepText: true,
    removeAvatarTextCompletely: false,
  },
  finalCleanScript: '',
  
  supervisorReports: {
    raw_idea: null,
    story_dna: null,
    story_plan: null,
    scene_cards: null,
    script_writer: null,
    clean_export: null,
  },
  stageStatuses: {
    raw_idea: 'not_started',
    story_dna: 'not_started',
    story_plan: 'not_started',
    scene_cards: 'not_started',
    script_writer: 'not_started',
    clean_export: 'not_started',
  },
  lockedData: {},
  handoffSummaries: {
    raw_idea: '',
    story_dna: '',
    story_plan: '',
    scene_cards: '',
    script_writer: '',
    clean_export: '',
  },
  lastGeneratedAt: {
    raw_idea: null,
    story_dna: null,
    story_plan: null,
    scene_cards: null,
    script_writer: null,
    clean_export: null,
  },
  lastEditedAt: {
    raw_idea: null,
    story_dna: null,
    story_plan: null,
    scene_cards: null,
    script_writer: null,
    clean_export: null,
  },
  promptRegistry: INITIAL_PROMPT_REGISTRY,
  promptHistory: [],
  useAvatars: true,
};
