# Capability spec — `gtm_listing_jsonld` (Listing → JSON-LD)

_Status: proposed (2026-07-01). Owner: Ron Davis / Vellocity GTM._

## Why this, why now
The Agent-Ready Index shows the problem is **structural machine-unreadability**: of 701 AWS
Marketplace listings surveyed, only 301 were even machine-parseable enough to score, and
the median agent-buyer score was 23/100 (vs 76 human). JSON-LD (schema.org) is the *literal
mechanism* a procurement agent parses. It's the concrete fix that turns the audit from advice
into a **deliverable artifact**.

## Funnel placement — the "one step in"
JSON-LD is the **first tangible win**, right after the free diagnosis:

1. Newsletter / the Agent-Ready Gap → awareness
2. **Free Agent-Ready Score** (`itsrondavis.com/second-buyer-score`) → *diagnosis* (your score vs the benchmark)
3. **→ `gtm_listing_jsonld`** ← *the step in.* Score says "you're invisible"; this hands back
   paste-ready schema.org markup that visibly fixes it. Low-friction, copy-paste, **machine-verifiable**.
4. `gtm_listing_audit` → deeper rewrite (title/desc/search terms)
5. **Re-score** → watch the number climb (the loop)
6. Metered live-data tier / GTM Audit / co-sell → monetization

Why JSON-LD is the ideal on-ramp (not a deeper step):
- **Only step that produces a machine-verifiable artifact** — JSON-LD validates against schema.org
  or it doesn't. For a machine-readability brand, "here's markup that provably parses" is the
  strongest trust-builder.
- **Quick win, low friction** → wide top-of-funnel; no account needed for a basic pass.
- Answers "so what do I *do* about my bad score" → converts diagnosis → action → trust.
- **Seeds the re-score loop** ("add this, re-run your score, watch it move") — the sticky part.

## Tool definition (matches the `src/skills.ts` pattern)

- **id:** `gtm_listing_jsonld`
- **title:** "Listing JSON-LD Generator"
- **description:** "Generate validated schema.org JSON-LD (SoftwareApplication + Offer +
  Organization) that makes an AWS Marketplace listing parseable by procurement AI agents."
- **inputs:**
  - `product` (required) — product name + one-line description
  - `category` — AWS Marketplace category / product type
  - `capabilities` — key capabilities the listing declares (freeform or list)
  - `pricing` — pricing model + numbers (contract, usage, free trial…)
  - `vendor` — seller/org name + URL
  - `listingUrl` — the Marketplace listing URL (for `@id`/`url`)
- **execution:** `taskSupport: forbidden` (read-only), same as the other three tools.

## Output — the differentiator
Unlike the other three tools (thin/playbook mode — they return a *prompt* the caller's model
runs), JSON-LD generation is **deterministic**, so this tool can return the **actual artifact**:

1. A ready-to-paste `<script type="application/ld+json">…</script>` block (SoftwareApplication +
   Offer + Organization graph).
2. A one-line "where to place it" note (listing long-description HTML / vendor site).
3. A **validation checklist** (required schema.org fields present; passes Google Rich Results /
   schema.org validator).

This "we actually built the thing for you" moment is stronger than any playbook.

## Privacy posture (keep consistent with the listing)
Same stateless model as the current tier: inputs are used transiently to render the JSON-LD and
are **not stored or logged**; no external actions. If output stays deterministic/templated, it can
run entirely in the Lambda with no inference — preserving the "no server-side inference" claim.

## Moat — read this before over-investing in the generator
JSON-LD *generation* is **commodity** — any LLM emits schema.org. Do **not** bank the moat on it.
The moat is what JSON-LD **feeds**:
- **The Agent-Ready Index** — proprietary, longitudinal benchmark ("you vs 700 peers, over time").
- **The score → fix → re-score loop** + its history (stickiness).
- **The metered live-data tier** (authenticated real analysis) and **AWS co-sell/ACE distribution**.

Ship JSON-LD as the **wedge that makes the loop produce a visible win**; keep the Index + loop as
the defensible core.

## Sources to cite (credibility)
- AWS Marketplace **AI Agents & Tools** launch (2025) — agents are buying; not a Ron assertion.
- **schema.org** + Google structured-data docs — grounds the JSON-LD method in a standard.
- The **Agent-Ready Index** as primary research (rubric version + sample + date) — novelty is the moat.

## Build notes
- Add as a 4th skill in `src/skills.ts`; if returning real JSON-LD, branch the handler to emit
  structured output instead of the `buildPrompt()` playbook path (`src/index.ts`).
- Keep it in the free `gtm-sample` tier (it's the on-ramp), unauthenticated.
- Add a `gtm_listing_jsonld` row to the AWS listing's Tools table + a Highlight once shipped.
