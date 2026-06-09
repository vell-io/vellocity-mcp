# GTM Skill Pack — MCP server (Foundry tier)

The [AWS Marketplace GTM Skill Pack](https://github.com/vell-admin/gtm-skill-pack) as **live MCP tools**. Add one connector URL to Claude, ChatGPT, or Copilot and the skills run as tools — no copy-paste, no Project setup.

This is the **paid Foundry tier**. The free tier ships the *knowledge* (the skills as markdown). This ships the *capability* — and capability is the bridge to the real engine, **[Vellocity](https://vell.ai)**, which runs this GTM motion end-to-end at scale with live data.

> Free = the prompts. Foundry = the tools that run them. **Vellocity = the platform that does it for you.** Charging for capability, not content, is the whole agentic-commerce thesis — dog-fooded.

## Tools (v1)

| Tool | Does |
|---|---|
| `listing_audit` | Score + rewrite an AWS Marketplace listing for humans and agents |
| `cosell_draft` | ACE-ready outreach + a paste-ready ACE opportunity summary |
| `pricing_story` | Value metric, package ladder, and a procurement-defensible pricing narrative |

## Run it

```bash
cp .env.example .env      # set GTM_MCP_TOKEN for prod; leave empty for an open preview
npm install
npm run build
npm start                 # listens on :8787 (or $PORT)
```

- `GET /health` → status + tool list (open).
- `POST /mcp` → the MCP endpoint (Streamable HTTP, stateless). Requires `Authorization: Bearer $GTM_MCP_TOKEN` when a token is set; open when empty (free preview).

## Thin vs. thick

- **thin** (default) — the tool returns the assembled expert prompt for the *caller's* model to execute. Zero inference cost, no model key, runs anywhere. Great free-but-gated preview.
- **thick** — the server runs the skill against Bedrock and returns the finished artifact. Consistent output regardless of caller; this is what justifies metering. Drop-in point is marked in [`src/index.ts`](src/index.ts) `runSkill()` (`GTM_MCP_MODE=thick`).

## Connect from a model

Add the deployed URL (e.g. `https://gtm-mcp.vell.ai/mcp`) as a remote MCP connector:
- **Claude** → Settings → Connectors → Add custom connector → paste the URL + bearer token.
- **ChatGPT** → Custom GPT → Actions / connector → same URL + token.

## Roadmap

Per [the scope doc](https://github.com/vell-admin/gtm-skill-pack/blob/main/docs/MCP-SERVER-SCOPE.md): bearer-key issuance on Foundry purchase, rate-limited free preview, then metering — Stripe metered → **AgentCore Pay / x402** for true pay-per-call when the caller is itself an agent. Host at `gtm-mcp.vell.ai` (DNS-01 cert).

---
© 2026 Ron Davis / Vellocity · From listed to bought. · The real engine: https://vell.ai
