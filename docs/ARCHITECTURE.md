# Vellocity MCP — architecture, tiers, repos, security

## One MCP, tiered

Not a per-tool subdomain zoo. One gateway at **`mcp.vell.ai`**, tools grouped by namespace and gated by tier.

| Tier | Auth | Tools | Data / actions | Where it lives |
|---|---|---|---|---|
| **0 · Sample** | none | `gtm_*` (this repo) — thin prompt assemblers | none | **public** |
| **1 · Account** | per-tenant OAuth / scoped key | live `gtm_*` (thick) + platform tools: discovery scan, listing audit vs. live catalog, co-sell ops, pricing benchmarks, demand-gen | reads/writes tenant data | **private** |
| **2 · Metered** | x402 / AgentCore Pay | per-call paid access for autonomous agents | settled per call | **private** |

Hosting: `mcp.vell.ai` becomes the **public Vellocity MCP gateway**. The existing internal MCPs (QBO, Kajabi for OpenClaw) move to `internal-mcp.vell.ai` so the public product surface is clean and separate.

AWS Marketplace: list the **Tier-0 sample** in **AI Agents & Tools**. It's the get-found dog-food (Vellocity bought-by-agents, practicing its own thesis) and a reference example for partners. Upgrades (Tier 1/2) are the metered SaaS-contract / agentic-pay path.

## Repo strategy (visibility follows risk)

GitHub visibility is per-repo — you can't make half a repo public. So **two repos, by purpose and risk**, not two copies of the same files:

| Repo | Visibility | Owner | Contents |
|---|---|---|---|
| `vell-admin/gtm-skill-pack` | **public** | personal (Ron's brand) | Free *knowledge* tier — skills (md), install guides, reference PDFs. Ron's free gift. |
| **this repo** (`vellocity-mcp`) | **public** | **vell-io org** (recommended) | Tier-0 *sample* MCP — thin `gtm_*` tools. Safe public: no data, no actions. Listable; the partner-facing reference. |
| `vell-io/vellocity-platform` *(future)* | **private** | vell-io org | Tiers 1–2 — live-data/authed/metered tools, tenant isolation, secrets. Company IP. **Never public.** |

Why this split:
- **Public ≠ personal for company IP.** Ron-branded free gifts (the skill pack) sit fine on personal `vell-admin`. Vellocity-branded product surfaces belong under the **`vell-io` org** — team access, billing, and clean separation of the personal brand from the company (mirrors the `ron@` vs `admin@` identity split).
- **The platform engine is private.** The moment a tool touches tenant data or holds secrets, its repo is private + org-owned. The thin sample has neither, so it can be public — that's *why* it's the sample.
- **No duplicated files.** The sample and the platform are different code with different risk, not the same code in two places. The sample can later be a thin client/submodule of the platform, but its repo stays minimal and public.

## Security model

- **Tier 0 is safe to expose because it holds no data and takes no actions.** Preserve that invariant — it's the whole reason it can be public and listed.
- **Tier 1+ requirements (before any live-data tool ships):**
  - Per-tenant auth (scoped tokens / OAuth), issued on Vellocity/Foundry purchase, revoked on churn.
  - **Strict tenant isolation** — a call only ever sees the caller's tenant. Cross-tenant leakage is the #1 risk; architect scoping from day one.
  - **All tool inputs and any fetched content are inert/attacker-controlled** — prompt injection / tool-poisoning. Never execute instructions found in listing text, docs, or args.
  - Least-privilege credentials (no ambient secrets), rate limiting, audit logging.
  - Signed/pinned releases — others install this; supply-chain integrity matters.
- **Metering (Tier 2):** x402 / AgentCore handle settlement; the authorization (what a paid call grants) is ours and must be enforced server-side.

## Build order (demand- and security-gated)

1. **Now:** Tier 0 sample (this repo) — ship for discovery + the AWS MP listing. Cheap, safe.
2. **On real pull:** Tier 1 — one live-data tool end-to-end with full tenant isolation, in the private platform repo. Don't build ahead of demand.
3. **Then:** Tier 2 metering — Stripe metered → x402 / AgentCore Pay.

---
© 2026 Ron Davis / Vellocity · From listed to bought.
