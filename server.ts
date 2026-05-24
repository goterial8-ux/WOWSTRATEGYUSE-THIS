import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 8080);

app.use(express.json({ limit: "10mb" }));

// Initialize GoogleGenAI client for Vertex AI on the server-side, using Cloud Run ADC
const project = process.env.GOOGLE_CLOUD_PROJECT || "project-41ceb22a-f998-416d-98b";
const location = process.env.GOOGLE_CLOUD_LOCATION || "global";

let ai: GoogleGenAI | null = null;
try {
  ai = new GoogleGenAI({
    vertexai: true,
    project: project,
    location: location,
  });
} catch (e: any) {
  console.error("Failed to initialize GoogleGenAI client:", e.message || e);
}

// Robust custom parser for the Supervisor Report format
interface SupervisorReport {
  status: 'ok' | 'needs_small_repair' | 'needs_serious_repair' | 'do_not_continue';
  whatIsGood: string;
  problems: string[];
  requiredFixes: string[];
  recommendation: string;
  canContinue: boolean;
}

function parseSupervisorReport(text: string): SupervisorReport {
  console.log("[Vertex AI] Parsing supervisor response...");
  
  // Try parsing directly as JSON
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.status) {
        return {
          status: parsed.status,
          whatIsGood: parsed.whatIsGood || "Good progress.",
          problems: Array.isArray(parsed.problems) ? parsed.problems : [parsed.problems].filter(Boolean),
          requiredFixes: Array.isArray(parsed.requiredFixes) ? parsed.requiredFixes : [parsed.requiredFixes].filter(Boolean),
          recommendation: parsed.recommendation || "Safe to proceed.",
          canContinue: parsed.canContinue === undefined ? true : !!parsed.canContinue
        };
      }
    }
  } catch (e) {
    console.error("[Vertex AI] JSON.parse failed, fallback to regular expression parser");
  }

  // Fallback regular expression and line-by-line parsing
  const statusMatch = text.match(/status:\s*([^\n\r]+)/i);
  const whatIsGoodMatch = text.match(/whatIsGood:\s*([^\n\r]+)/i);
  const recommendationMatch = text.match(/recommendation:\s*([^\n\r]+)/i);
  const canContinueMatch = text.match(/canContinue:\s*(true|false)/i);

  const problems: string[] = [];
  const requiredFixes: string[] = [];

  const lines = text.split('\n');
  let currentSection = '';
  for (const line of lines) {
    if (/problems:/i.test(line)) {
      currentSection = 'problems';
      continue;
    } else if (/requiredFixes:/i.test(line)) {
      currentSection = 'fixes';
      continue;
    } else if (/status:|whatIsGood:|recommendation:|canContinue:/i.test(line)) {
      currentSection = '';
    }

    if (currentSection === 'problems' && (line.trim().startsWith('*') || line.trim().startsWith('-'))) {
      problems.push(line.replace(/^[\s*-]+/, '').trim());
    } else if (currentSection === 'fixes' && (line.trim().startsWith('*') || line.trim().startsWith('-'))) {
      requiredFixes.push(line.replace(/^[\s*-]+/, '').trim());
    }
  }

  let status: any = statusMatch ? statusMatch[1].trim().toLowerCase() : 'ok';
  if (!['ok', 'needs_small_repair', 'needs_serious_repair', 'do_not_continue'].includes(status)) {
    status = 'needs_small_repair';
  }

  return {
    status: status,
    whatIsGood: whatIsGoodMatch ? whatIsGoodMatch[1].trim() : "Follows general format.",
    problems: problems.length > 0 ? problems : ["Minor alignment issues detected."],
    requiredFixes: requiredFixes.length > 0 ? requiredFixes : ["Enhance emotional subtext."],
    recommendation: recommendationMatch ? recommendationMatch[1].trim() : "Fix pacing and emotion before proceeding.",
    canContinue: canContinueMatch ? canContinueMatch[1].trim().toLowerCase() === 'true' : false
  };
}

// Model generation function with automated fallback based on stage requirements
interface ModelAttempt {
  model: string;
  config?: {
    thinkingConfig?: {
      thinkingLevel: "HIGH" | "LOW" | "MINIMAL";
    };
  };
}

async function generateContent(prompt: string, expectJson: boolean = false, stageId?: string) {
  if (!ai) {
    throw new Error("Missing GOOGLE_CLOUD_PROJECT or GOOGLE_CLOUD_LOCATION for Vertex AI.");
  }

  // Define model and config based on user's specific stage requirements
  let modelName = "gemini-3.5-flash"; // Default
  let thinkingLevel: "HIGH" | "LOW" | "MINIMAL" | undefined = undefined;

  if (stageId === "raw_idea" || stageId === "story_dna") {
    modelName = "gemini-3.5-flash";
  } else if (stageId === "story_plan") {
    modelName = "gemini-3.1-pro-preview";
    thinkingLevel = "HIGH";
  } else if (stageId === "scene_cards") {
    modelName = "gemini-2.5-pro";
  } else if (stageId === "script_writer") {
    modelName = "gemini-3.1-pro-preview";
    thinkingLevel = "HIGH";
  } else if (stageId === "supervisor") {
    modelName = "gemini-3.5-flash";
  }

  try {
    const modeDesc = thinkingLevel ? ` (Thinking: ${thinkingLevel})` : "";
    console.log(`[Vertex AI] Requesting ${modelName}${modeDesc} for stage: ${stageId || "default"}`);
    
    const config: any = {};
    if (expectJson) {
      config.responseMimeType = "application/json";
    }
    if (thinkingLevel) {
      config.thinkingConfig = { thinkingLevel };
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: config
    });

    console.log(`[Vertex AI] Success with ${modelName} for ${stageId || "default"}`);
    return response.text || "";
  } catch (err: any) {
    console.error(`[Vertex AI Error] ${modelName} failed:`, err.message || err);
    throw err;
  }
}

// Unified generate/RPC route
async function handleGenerate(req: express.Request, res: express.Response) {
  console.log("POST /api/generate called");
  const { prompt, type, stageId } = req.body;

  if (!prompt) {
    return res.status(400).json({ success: false, error: "Prompt is required." });
  }

  try {
    const isSupervisor = type === "supervisor";
    const textOutput = await generateContent(prompt, isSupervisor, isSupervisor ? "supervisor" : stageId);

    let parsedResult = null;
    if (isSupervisor) {
      parsedResult = parseSupervisorReport(textOutput);
    }

    return res.json({
      success: true,
      text: textOutput,
      parsed: parsedResult,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "Generation failed"
    });
  }
}

// Endpoint declarations
app.post("/api/generate", handleGenerate);

// Support both /api/generate and /rpc for absolute safety
app.post("/rpc", (req, res) => {
  console.log("POST /rpc called as bridge redirect");
  handleGenerate(req, res);
});

// Vite middleware development / production asset server setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("[Server] Mounted Vite middleware (development mode)");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("[Server] Serving static assets (production mode)");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
