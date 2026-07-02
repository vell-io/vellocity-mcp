# AWS Marketplace — AI Agents & Tools listing: Vellocity MCP free tier (paste-ready)

_Last updated: 2026-07-01_

> **Canonical source for the free-tier listing copy.** Mirrored (for review/lint) in vell-main
> at `docs/aws/MCP_LISTING_AI_AGENTS_TOOLS.md`, which is excluded from docs.vell.ai in both
> mkdocs configs. Keep the two in sync — this repo's copy is the one you paste from.
> Values verified 2026-07-01 against the live endpoint (`initialize` → protocol 2025-06-18),
> the real tool schemas, and the deployed infra (CloudFront + Lambda Function URL, us-east-1).

Listing for the **Vellocity MCP — free `gtm_*` sample tier**. Live endpoint: **`https://agents.vell.ai/mcp`** (open, no auth — the trial surface). Structured per the `gtm_listing_audit` rubric (Problem → Outcome → How → Proof → Who → Getting started), for both human buyers and machine/agent parsing.

**Ground truth this listing asserts (keep every field consistent with it):** the free tier is *playbook mode*. You pass inputs (product, ICP, and optionally your current listing text, pricing, and competitors) as tool arguments; the server assembles Vellocity's expert rubric/playbook **from those inputs** and returns it for the caller's own model to execute. The server runs **no inference**, persists **nothing** (no accounts, no content logs), and **no tool takes an action** on any external system.

---

## Title

**Vellocity GTM Toolkit (MCP) — Listing Optimization, Co-Sell & Pricing for AWS Marketplace Sellers**

## Short description (≤ 1 sentence)

Three free MCP tools that make your AWS Marketplace listing legible to human buyers *and* AI agents — audit and rewrite your listing, draft ACE-ready co-sell outreach, and build a procurement-defensible pricing story.

## Long description

**The problem.** AWS Marketplace listings are written for humans skimming a page — but the next buyer is an AI agent parsing structured data. In Vellocity's Agent-Ready Index, of 701 AWS Marketplace listings surveyed, only 301 were machine-parseable enough to score on the agent lens at all — and among those, the median machine-buyer score was just 23/100 versus 76/100 for human browsers. That 53-point gap comes from unclear capability declarations, buried pricing logic, and metadata an agent can't parse. Sellers lose agent-driven discovery before a human ever sees the page.

**The outcome.** Listings that rank for human search *and* get recommended by procurement agents; co-sell outreach that lands as clean ACE opportunities; pricing narratives that survive a security/procurement review. Faster listed-to-bought.

**How it works.** Add the Vellocity MCP to your model (Claude, ChatGPT, Copilot, or any MCP-capable agent) as one connector URL. It exposes three tools. You pass your product and ICP — and, optionally, your current listing text, pricing, and competitors — as tool arguments. The server assembles an expert-grade playbook (the same rubric Vellocity uses internally), tailored to those inputs, and returns it for **your own model to execute in your context**. In this free tier the server runs **no inference** and stores **nothing**: your inputs are used transiently to build the playbook — no account, no API key, no logs of your content.

- **`gtm_listing_audit`** — takes your product, ICP, and current listing (title, short/long description, pricing model, competitors) and returns a tailored audit + rewrite playbook (title, descriptions, search terms), tuned for human discovery *and* machine consumption, including checks for claims that stall a procurement or security review — for your model to apply.
- **`gtm_cosell_draft`** — takes the opportunity, recipient, and ask, and returns a playbook for an initial + follow-up co-sell outreach sequence and a paste-ready ACE opportunity summary structure.
- **`gtm_pricing_story`** — takes your product, current pricing, buyer, and metering basis, and returns a playbook for choosing a value metric, building a package ladder, and writing a procurement-defensible pricing narrative.

**Use cases.**

- Rewrite an AWS Marketplace listing so procurement AI agents can extract capabilities, pricing logic, and compliance posture before a human ever opens the page.
- Audit a draft listing for claims that will stall a security or procurement review — free-trial claims, pricing mismatches, unverifiable superlatives — before submitting a changeset.
- Turn a partner conversation into a submission-ready ACE opportunity summary and a two-touch co-sell outreach sequence for AWS Partner Central.
- Build a package ladder and pricing narrative for a SaaS contract listing that a buyer's procurement team can defend internally.

**Proof.** These tools apply the same rubric behind Vellocity's Agent-Ready Index — the "Listed to Bought" analysis that scores AWS Marketplace listings on both a human-buyer and a machine-buyer lens (latest reading: 701 listings surveyed, 301 scored on the agent lens — median machine-buyer 23/100 vs 76/100 human; run your own at https://www.itsrondavis.com/second-buyer-score). This listing was itself drafted with the `gtm_listing_audit` rubric applied to it.

**Who it's for.** AWS Marketplace sellers, ISV GTM and product-marketing teams, and partner/co-sell managers preparing listings, ACE opportunities, or pricing.

**Getting started.** Add `https://agents.vell.ai/mcp` as a remote MCP connector, then call any of the three tools. No account or API key required for this tier. Metered tiers with authenticated live-data analysis are planned for AWS Marketplace.

## Highlights (3–5 bullets)

- **Agent-ready by design** — optimizes listings for the AI buyers already doing procurement, not just human skimmers; built from an index of 701 surveyed AWS Marketplace listings.
- **Three GTM jobs, one connector** — listing optimization, co-sell/ACE outreach, and pricing narrative.
- **Lightweight & transient** — the free tier runs no server-side inference and stores nothing: your inputs assemble a playbook your own model runs — no account, no API key, no content logs — and no tool takes an action on any external system.
- **Standards-based** — a remote MCP server (Streamable HTTP); works with any MCP-capable agent. Free, no key.

## Technical facts (agent-parseable)

| Fact | Value |
|---|---|
| Protocol | MCP over Streamable HTTP, spec revision 2025-06-18 |
| Endpoint | `https://agents.vell.ai/mcp` |
| Health check | `https://agents.vell.ai/health` |
| Authentication | None (free tier) |
| Tool side effects | None — all three tools only return a playbook |
| Data received by Vellocity | Your tool arguments (product, ICP, and any current listing text/pricing/competitors you choose to pass) — used transiently to assemble the playbook |
| Server-side inference | None (thin/playbook mode — the playbook runs in your model) |
| Data stored by Vellocity | None (no accounts, no logs of content) |
| Rate limit | None enforced today (best-effort free tier) |
| Hosting | AWS Lambda (us-east-1), fronted by CloudFront |
| Uptime / SLA | Best-effort (free tier); no SLA |

## Categories / search terms

AWS Marketplace GTM · listing optimization · co-sell · ACE (AWS Partner Central) · pricing strategy · go-to-market · seller enablement · agent-ready / machine-readable listings · MCP · AI agents & tools · partner marketing

## Tools (for the "tools" section)

| Tool id | Name | One-liner |
|---|---|---|
| `gtm_listing_audit` | Listing Optimizer | Takes your listing + ICP; returns a tailored audit + rewrite playbook (title, descriptions, search terms) for your model to apply. |
| `gtm_cosell_draft` | Co-sell Outreach Writer | Takes the opportunity + recipient; returns a playbook for an ACE-ready outreach sequence and a paste-ready ACE opportunity summary. |
| `gtm_pricing_story` | Pricing Story Builder | Takes your product + pricing basis; returns a playbook for a value metric, package ladder, and procurement-defensible pricing narrative. |

## Pricing

**Free.**

## Endpoint & connect

- **MCP endpoint:** `https://agents.vell.ai/mcp` (Streamable HTTP, open)
- **Health:** `https://agents.vell.ai/health`
- **Claude:** Settings → Connectors → Add custom connector → paste the URL.
- **ChatGPT / Copilot:** add as an Action / MCP connector.

## Support / links

- Engine: https://vell.ai · Author: Ron Davis — AWS Marketplace GTM
- Free skill pack (companion): https://github.com/vell-admin/gtm-skill-pack (public, verified 2026-07-01)

---

## Pre-submit checklist

- [x] **Resolved every `[FILL: …]`** — protocol `2025-06-18` (live `initialize`), hosting `us-east-1` (Lambda+CloudFront), rate limit `none enforced` (no WAF on dist E1QSPD2PYSB2TO), Agent-Ready Index `701 surveyed / 301 agent-scored / median 23 agent vs 76 human` (corpus vs agent-scored denominators — NOT a typo; bands + medians cover the 301 machine-parseable subset).
- [x] **Ground truth corrected** — the real tool schemas DO take content args (`currentTitle/currentShort/currentLong`, `pricingModel`, `competitors`, `opportunity`, `currentPricing`). Rewrote "How it works", the "Lightweight & transient" highlight, the Technical-facts rows, and the tool one-liners so the listing no longer claims "nothing is sent to Vellocity." Accurate framing: inputs ARE sent, processed transiently, not stored; no server inference; no external actions.
- [x] **Endpoints verified live** — `/health` 200; `POST /mcp` completes an `initialize` handshake (protocol 2025-06-18, server vellocity-mcp 0.1.0, 3 tools).
- [x] **Rate limit confirmed** — none enforced (no WebACL on the CloudFront dist); stated as best-effort.
- [x] **Companion link verified public** — `github.com/vell-admin/gtm-skill-pack` → 200.
- [~] **Self-audit score CUT** — did not fabricate specific human/agent scores; a self-assigned dual score isn't independently verifiable. Proof now says the listing was "drafted with the `gtm_listing_audit` rubric" without a made-up number. (Restore real scores only if produced by an actual scoring run.)
- [ ] **RON TO CONFIRM before submit:** (a) Numbers now read `701 surveyed / 301 agent-scored / median 23 agent vs 76 human`, framed as "latest reading" (they drift as the index updates); proof links to the public `itsrondavis.com/second-buyer-score` so a reader can reproduce a score. (b) Cross-check vell.ai + itsrondavis.com pricing/claims don't contradict this listing (website ↔ listing coherence is scored by AWS agents). (c) Consider a real WAF rate-limit on the open Function URL before this listing drives traffic.
