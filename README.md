# Vellocity MCP

The agent/tool interface to the **[Vellocity](https://vell.ai)** GTM platform — one MCP, tiered by capability and auth.

This repo is the **free `gtm_*` sample tier**: thin tools that hold no data and take no actions, safe to expose unauthenticated and to list in **AWS Marketplace AI Agents & Tools**. It's the get-found surface *and* a reference example partners can point their own agents at. The authenticated (live-data) and metered tiers are the real engine — see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

> **The ladder:** free skills (knowledge, [gtm-skill-pack](https://github.com/vell-admin/gtm-skill-pack)) → this MCP's `gtm_*` sample (tools you run) → authenticated Vellocity tools (live data) → metered / agentic-pay (x402, AgentCore Pay). Vellocity is the engine; this is a working teaser of it.

## Free sample tools (`gtm_*`)

| Tool | Does |
|---|---|
| `gtm_listing_audit` | Score + rewrite an AWS Marketplace listing for humans and agents |
| `gtm_cosell_draft` | ACE-ready outreach + a paste-ready ACE opportunity summary |
| `gtm_pricing_story` | Value metric, package ladder, and a procurement-defensible pricing narrative |

These mirror the free [skill pack](https://github.com/vell-admin/gtm-skill-pack) — thin mode just runs them instead of you pasting them.

## Run it

```bash
cp .env.example .env      # GTM_MCP_TOKEN optional for the open sample tier
npm install && npm run build && npm start   # :8787
```

- `GET /health` → status + tool list (open).
- `POST /mcp` → MCP endpoint (Streamable HTTP, stateless). Bearer-gated when `GTM_MCP_TOKEN` is set; open for the free sample.

## Deploy

Serverless, COGS-aligned (Lambda + Bedrock/AgentCore, pay-per-call). Plan + SAM sketch: [docs/DEPLOY.md](docs/DEPLOY.md) · [infra/template.yaml](infra/template.yaml).

## Connect from a model

Add the deployed URL (e.g. `https://mcp.vell.ai/mcp`) as a remote MCP connector:
- **Claude** → Settings → Connectors → Add custom connector.
- **ChatGPT** → Custom GPT → Actions / connector.

## Thin vs. thick

- **thin** (default) — returns the assembled expert prompt for the caller's model to run. Zero inference, no data, safe to expose.
- **thick** — runs server-side (Bedrock); drop-in point marked in [`src/index.ts`](src/index.ts) `runSkill()`.

## Security posture

The sample tier is safe to expose **because it holds no data and takes no actions**. Anything that touches tenant data or takes actions lives behind auth in the platform tiers, with strict tenant isolation, inputs-treated-as-inert, least-privilege, and rate limits — see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---
© 2026 Ron Davis / Vellocity · From listed to bought. · The engine: https://vell.ai
