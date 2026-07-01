import express, { type Request, type Response } from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { SKILLS, buildPrompt, type SkillDef } from "./skills.js";

const PORT = Number(process.env.PORT ?? 8787);
const TOKEN = process.env.GTM_MCP_TOKEN ?? ""; // set in prod; empty = open (dev/preview)
const MODE = (process.env.GTM_MCP_MODE ?? "thin") as "thin" | "thick";

/** Thin mode: return the assembled expert prompt for the caller's model to execute.
 *  Thick mode: run it server-side (Bedrock) and return the finished artifact. */
async function runSkill(skill: SkillDef, inputs: Record<string, unknown>): Promise<string> {
  const prompt = buildPrompt(skill, inputs);
  if (MODE === "thin") return prompt;
  // --- thick-mode drop-in point ---
  // const out = await invokeBedrock(prompt);  // add @aws-sdk/client-bedrock-runtime
  // return out;
  return (
    "[thick mode requested but no inference backend is configured]\n\n" +
    "Run this prompt against your model, or configure Bedrock in runSkill():\n\n" +
    prompt
  );
}

function makeServer(): McpServer {
  const server = new McpServer({ name: "vellocity-mcp", version: "0.1.0" });
  for (const skill of SKILLS) {
    server.registerTool(
      skill.name,
      { title: skill.title, description: skill.description, inputSchema: skill.inputs },
      async (args: Record<string, unknown>) => {
        const text = await runSkill(skill, args);
        return { content: [{ type: "text" as const, text }] };
      }
    );
  }
  return server;
}

const app = express();
app.use(express.json({ limit: "1mb" }));

// Health check (open) — for smoke tests and uptime monitoring.
app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true, server: "vellocity-mcp", tier: "gtm-sample", mode: MODE, tools: SKILLS.map((s) => s.name) });
});

// Bearer auth for the MCP endpoint. Empty TOKEN = open (free preview / dev).
function authed(req: Request): boolean {
  if (!TOKEN) return true;
  const h = req.header("authorization") ?? "";
  return h === `Bearer ${TOKEN}`;
}

// Stateless Streamable HTTP: a fresh server + transport per request.
app.post("/mcp", async (req: Request, res: Response) => {
  if (!authed(req)) {
    res.status(401).json({ jsonrpc: "2.0", error: { code: -32001, message: "Unauthorized — Foundry access required" }, id: null });
    return;
  }
  const server = makeServer();
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  res.on("close", () => { transport.close(); server.close(); });
  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ jsonrpc: "2.0", error: { code: -32603, message: "Internal server error" }, id: null });
    }
  }
});

// Stateless mode does not support server-initiated streams.
const methodNotAllowed = (_req: Request, res: Response) =>
  res.status(405).json({ jsonrpc: "2.0", error: { code: -32000, message: "Method not allowed." }, id: null });
app.get("/mcp", methodNotAllowed);
app.delete("/mcp", methodNotAllowed);

// Always bind a port: local dev, EC2, and Lambda-via-Web-Adapter all run the
// server as a normal listening process (the LWA extension proxies Lambda
// invokes → this port). PORT defaults to 8787 local; the container sets 8080.
app.listen(PORT, () => {
  console.error(`vellocity-mcp [gtm-sample] listening on :${PORT} (mode=${MODE}, auth=${TOKEN ? "on" : "open"})`);
});

export { app };
