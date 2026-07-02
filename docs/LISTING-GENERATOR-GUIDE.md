# List your AI agent / MCP on AWS Marketplace with Vellocity's generator

_Last updated: 2026-07-01_

A repeatable playbook for generating an **AWS Marketplace "AI Agents & Tools"** listing with Vellocity's **AI Marketplace Listing Generator** (`Dashboard → Marketplace GTM Ops → My Listings → Create`). Written as a worked example on the **Vellocity MCP** itself (dogfood), with a blank template underneath so a partner/customer can run it for their own agent.

> The generator is "powered by your product documentation": you set the catalog type + a few product details, feed it your docs in **Upload & Context**, and it drafts the Title / Short / Long description tuned to that catalog category. Then you refine per-field with AI Assist and export to the AWS seller portal.

---

## The 4 steps

**1 · Setup**
- **Cloud Connection:** the AWS account linked to your Marketplace seller account.
- **Catalog Type:** `SaaS Product` → **SaaS Product Type: `API-Based Agents & Tools`** (for an MCP / API / developer tool). (Other types: AMI, Container, Professional Services.)

**2 · Product Details** — Title, Short description (**≤ 200 chars**), Long description (**≤ 6000 chars**). Seed the Title + Short; let the generator draft the Long (or seed it and refine).

**3 · Upload & Context** — the important step. Give it real source material: your product README, a spec/one-pager, endpoint + protocol facts, and your tool list. Better docs in → better listing out.

**4 · Generate & refine** — generate, then per-field AI Assist. **Compare the output to a hand-written listing** and check the accuracy rules below before exporting to the seller portal (Build → AI agents & tools).

---

## Worked example — Vellocity MCP (dogfood inputs)

- **Catalog Type:** SaaS → API-Based Agents & Tools
- **Title:** `Vellocity GTM Toolkit (MCP) — Listing Optimization, Co-Sell & Pricing for AWS Marketplace Sellers`
- **Short (≤200):** `Three free MCP tools that make your AWS Marketplace listing legible to humans and AI agents — audit/rewrite the listing, draft ACE co-sell outreach, and build a defensible pricing story.`
- **Upload & Context (feed these):** `docs/MARKETPLACE-LISTING.md` (finalized copy) + `README.md`. Make sure these facts are visible:
  - Endpoint `https://agents.vell.ai/mcp` · Health `https://agents.vell.ai/health`
  - Protocol: MCP over Streamable HTTP, spec `2025-06-18` · Auth: none (free tier) · Hosting: AWS Lambda, us-east-1 (CloudFront)
  - Tools: `gtm_listing_audit`, `gtm_cosell_draft`, `gtm_pricing_story`
  - Data handling: tools receive your inputs (product/ICP/current listing/pricing), processed transiently, **not stored**; no server-side inference; no external actions.
- **Validate:** compare generated output vs. `docs/MARKETPLACE-LISTING.md`; confirm `/health` 200 + `POST /mcp` `initialize` handshake before export.

---

## Blank template — run it for your own agent

```
Catalog Type:        SaaS → API-Based Agents & Tools   (or AMI / Container / Professional Services)
Title:               <Product> (MCP/API) — <the 2-3 jobs it does> for <audience>
Short (≤200 chars):  <what it does + who it's for, one sentence, no hype>
Upload & Context:    <README / spec / one-pager> +
  - Endpoint:        <https://…/mcp>   Health: <https://…/health>
  - Protocol/auth:   <MCP Streamable HTTP spec …>, auth: <none | bearer>, hosting: <region>
  - Tools:           <tool_a, tool_b, …> (name + one-line each)
  - Data handling:   <what inputs are sent, what's stored, any server-side inference, any actions>
  - Pricing:         <free | contract | usage>  (keep off-platform purchase CTAs OUT of the pricing field)
```

## Accuracy rules (what makes AWS-agent-friendly listings rank — and pass review)

1. **Describe what the tool actually does.** The #1 relevancy killer is claims that don't match the implementation. If your tool receives content, don't claim "nothing is sent." State inputs, storage, inference, and side effects plainly.
2. **Write for the machine buyer too.** Include an agent-parseable **Technical facts** block (protocol, auth, data handling, side effects, rate limit, hosting) — the constraint vector a buying agent filters on.
3. **Use-case queries, not features.** Most Agent-Mode queries are business needs ("rewrite my listing so procurement agents can parse it"), so lead with those.
4. **No off-platform purchase CTAs in Pricing.** Put the upgrade path in "Getting started" as one sentence, not "buy at …".
5. **Quantify with citable data or cut it.** Ship real numbers with a source, or drop the claim — never approximate.
6. **Website ↔ listing coherence.** Your site's pricing/claims must not contradict the listing (AWS agents cross-check).

---
*Companion: the free GTM skill pack — https://github.com/vell-admin/gtm-skill-pack . Engine: https://vell.ai*
