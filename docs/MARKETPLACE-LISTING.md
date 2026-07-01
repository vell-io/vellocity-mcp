# AWS Marketplace — AI Agents & Tools listing: Vellocity MCP free tier (paste-ready)

> **Canonical source for the free-tier listing copy.** Mirrored (for review/lint) in vell-main
> at `docs/aws/MCP_LISTING_AI_AGENTS_TOOLS.md`, which is excluded from docs.vell.ai in both
> mkdocs configs. Keep the two in sync — this repo's copy is the one you paste from.
> Revised after review against the Agent Mode ranking audit (claim accuracy, use-case query depth),
> the compliance lint rules (off-platform CTAs), and the Agent Buyer Score spec (machine-parseable
> constraint coverage).
>
> `[FILL: …]` markers must be resolved before submission — see the pre-submit checklist at the bottom.

Listing for the **Vellocity MCP — free `gtm_*` sample tier**. Live endpoint: **`https://agents.vell.ai/mcp`** (open, no auth — the trial surface). Structured per the `gtm_listing_audit` rubric (Problem → Outcome → How → Proof → Who → Getting started), for both human buyers and machine/agent parsing.

**Ground truth this listing asserts (keep every field consistent with it):** the free tier is *playbook-only*. Tools return Vellocity's expert rubrics and playbooks as prompts; the caller's own model applies them. No listing content, arguments, or results are sent to or stored by Vellocity in this tier, and no tool takes an action on any external system.

---

## Title

**Vellocity GTM Toolkit (MCP) — Listing Optimization, Co-Sell & Pricing for AWS Marketplace Sellers**

## Short description (≤ 1 sentence)

Three free MCP tools that make your AWS Marketplace listing legible to human buyers *and* AI agents — audit and rewrite your listing, draft ACE-ready co-sell outreach, and build a procurement-defensible pricing story.

## Long description

**The problem.** AWS Marketplace listings are written for humans skimming a page — but the next buyer is an AI agent parsing structured data. In Vellocity's Agent-Ready Index — [FILL: N] AWS Marketplace listings scored on both a human-buyer and a machine-buyer lens — the median machine-buyer score was [FILL: X]/100: unclear capability declarations, buried pricing logic, and metadata an agent can't parse. Sellers lose agent-driven discovery before a human ever sees the page.

**The outcome.** Listings that rank for human search *and* get recommended by procurement agents; co-sell outreach that lands as clean ACE opportunities; pricing narratives that survive a security/procurement review. Faster listed-to-bought.

**How it works.** Add the Vellocity MCP to your model (Claude, ChatGPT, Copilot, or any MCP-capable agent) as one connector URL. It exposes three tools. In this free tier each tool returns an expert-grade playbook — the same rubric Vellocity uses internally — which **your own model executes in your context**. Your listing text, drafts, and pricing never leave your model's session; nothing is sent to or stored by Vellocity.

- **`gtm_listing_audit`** — returns the Vellocity listing scorecard rubric and rewrite playbook (title, short/long description, search terms), tuned for human discovery *and* machine consumption, including checks for claims that stall a procurement or security review. Your model applies it to your listing.
- **`gtm_cosell_draft`** — returns a playbook for an initial + follow-up co-sell outreach sequence and a paste-ready ACE opportunity summary structure.
- **`gtm_pricing_story`** — returns a playbook for choosing a value metric, building a package ladder, and writing a procurement-defensible pricing narrative.

**Use cases.**

- Rewrite an AWS Marketplace listing so procurement AI agents can extract capabilities, pricing logic, and compliance posture before a human ever opens the page.
- Audit a draft listing for claims that will stall a security or procurement review — free-trial claims, pricing mismatches, unverifiable superlatives — before submitting a changeset.
- Turn a partner conversation into a submission-ready ACE opportunity summary and a two-touch co-sell outreach sequence for AWS Partner Central.
- Build a package ladder and pricing narrative for a SaaS contract listing that a buyer's procurement team can defend internally.

**Proof.** These tools are the same rubric behind Vellocity's Agent-Ready Index ("Listed to Bought": [FILL: N] AWS Marketplace listings scored on human *and* machine-buyer lenses; methodology at [FILL: public link]). This listing was written with `gtm_listing_audit` applied to itself: it scores [FILL: H]/100 on the human-buyer lens and [FILL: A]/100 on the agent-buyer lens.

**Who it's for.** AWS Marketplace sellers, ISV GTM and product-marketing teams, and partner/co-sell managers preparing listings, ACE opportunities, or pricing.

**Getting started.** Add `https://agents.vell.ai/mcp` as a remote MCP connector, then call any of the three tools. No account or API key required for this tier. Metered tiers with authenticated live-data analysis are planned for AWS Marketplace.

## Highlights (3–5 bullets)

- **Agent-ready by design** — optimizes listings for the AI buyers already doing procurement, not just human skimmers; built from an index of [FILL: N] scored AWS Marketplace listings.
- **Three GTM jobs, one connector** — listing optimization, co-sell/ACE outreach, and pricing narrative.
- **Private by design** — this tier returns playbooks your own model runs; your listing text never leaves your model's context, and no tool takes actions on external systems.
- **Standards-based** — a remote MCP server (Streamable HTTP); works with any MCP-capable agent. Free, no key.

## Technical facts (agent-parseable)

| Fact | Value |
|---|---|
| Protocol | MCP over Streamable HTTP, spec revision [FILL: e.g. 2025-06-18] |
| Endpoint | `https://agents.vell.ai/mcp` |
| Health check | `https://agents.vell.ai/health` |
| Authentication | None (free tier) |
| Tool side effects | None — all three tools are read-only playbook returns |
| Data received by Vellocity | None in this tier — tools take no content arguments |
| Data stored by Vellocity | None (no accounts, no logs of listing content) |
| Rate limit | [FILL: e.g. 60 requests/min per IP], enforced at the gateway |
| Hosting | AWS, [FILL: region] |
| Uptime / SLA | Best-effort (free tier); no SLA |

## Categories / search terms

AWS Marketplace GTM · listing optimization · co-sell · ACE (AWS Partner Central) · pricing strategy · go-to-market · seller enablement · agent-ready / machine-readable listings · MCP · AI agents & tools · partner marketing

## Tools (for the "tools" section)

| Tool id | Name | One-liner |
|---|---|---|
| `gtm_listing_audit` | Listing Optimizer | Returns the Vellocity listing-audit rubric + rewrite playbook; your model applies it to your listing — nothing is sent to Vellocity. |
| `gtm_cosell_draft` | Co-sell Outreach Writer | Returns a playbook for an ACE-ready outreach sequence and a paste-ready ACE opportunity summary. |
| `gtm_pricing_story` | Pricing Story Builder | Returns a playbook for a value metric, package ladder, and procurement-defensible pricing narrative. |

## Pricing

**Free.**

## Endpoint & connect

- **MCP endpoint:** `https://agents.vell.ai/mcp` (Streamable HTTP, open)
- **Health:** `https://agents.vell.ai/health`
- **Claude:** Settings → Connectors → Add custom connector → paste the URL.
- **ChatGPT / Copilot:** add as an Action / MCP connector.

## Support / links

- Engine: https://vell.ai · Author: Ron Davis — AWS Marketplace GTM
- Free skill pack (companion): https://github.com/vell-admin/gtm-skill-pack

---

## Pre-submit checklist (do not submit with any box unchecked)

- [ ] **Resolve every `[FILL: …]`** — Agent-Ready Index N and median score, self-audit H/A scores, MCP spec revision, rate limit, hosting region. If the Agent-Ready Index numbers aren't publishable yet, cut the sentences that cite them entirely — do not ship approximations (claim accuracy is AWS's #1 stated relevancy factor).
- [ ] **Verify the ground truth** — confirm the deployed free tier actually takes no content arguments and sends nothing server-side. If any tool *does* receive listing text, rewrite the "Private by design" highlight, the Technical facts rows, and the tool one-liners before submitting; the listing must not contradict the implementation.
- [ ] **Run `gtm_listing_audit` on this listing** and paste the real scores into the Proof section.
- [ ] **Verify endpoints live**: `https://agents.vell.ai/health` returns 200 and `POST /mcp` completes an MCP `initialize` handshake (blocked from the drafting environment's proxy — must be checked manually).
- [ ] **Confirm a gateway rate limit actually exists** and matches the stated number.
- [ ] **Verify** `https://github.com/vell-admin/gtm-skill-pack` is public and current (dead companion links are a website-coherence penalty).
- [ ] **Cross-check vell.ai** — pricing/claims on the website must not contradict this listing (website ↔ listing coherence is scored by AWS agents).

### Changes vs. the prior draft (review rationale)

1. **Resolved the self-contradiction** between "no data leaves to us" / "holds no data" and the tool table's "Score + rewrite a listing": all fields now consistently describe the playbook-only reality. Inaccurate/inconsistent claims are the #1 cause of poor Agent Mode relevancy per AWS (see the Agent Mode ranking audit §1).
2. **Replaced unverifiable superlatives** ("most listings score near-zero") with quantified, citable Agent-Ready Index claims (placeholders until the numbers are final).
3. **Removed the off-Marketplace purchase CTA from the Pricing field** ("paid tiers via vell.ai") — off-platform CTAs in pricing are a compliance-lint red flag; the upgrade path is now one roadmap sentence in Getting started. The "working teaser / upgrade path" highlight was cut for the same reason.
4. **Added a Use cases block** written as query-matchable business-need statements (70%+ of Agent Mode queries are medium-to-long business needs — ranking audit GAP 6).
5. **Added an agent-parseable Technical facts table** (protocol, auth, data handling, side effects, rate limit, hosting) — the constraint vector a buying agent filters on (ABS spec, Buyer Fit dimension). A listing that preaches machine-readability must model it.
6. **Retitled** so "AWS Marketplace" reads as the audience, not part of the product name, avoiding an AWS-branding review flag.
7. **Proof section now has proof** — index numbers plus the meta-move: the listing's own dual score from `gtm_listing_audit`.
