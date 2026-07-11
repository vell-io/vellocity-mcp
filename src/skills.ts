import { z } from "zod";

/**
 * The free `gtm_*` sample tier of the Vellocity MCP. These tools mirror the free
 * skill pack (github.com/vell-admin/gtm-skill-pack) — thin, no data, no side-effects,
 * safe to expose unauthenticated and list in AWS Marketplace AI Agents & Tools.
 * Authenticated (live-data) and metered tiers add more namespaces behind auth.
 */

export interface SkillDef {
  name: string;
  title: string;
  description: string;
  role: string;
  inputs: z.ZodRawShape;
  method: string[];
  output: string;
}

export const SKILLS: SkillDef[] = [
  {
    name: "gtm_listing_audit",
    title: "Listing Optimizer",
    description:
      "Audit and rewrite an AWS Marketplace listing — title, short/long description, search terms — for human discovery and machine/agent consumption.",
    role:
      "Act as an AWS Marketplace listing strategist who has reviewed thousands of listings from inside the Marketplace Center of Excellence.",
    inputs: {
      product: z.string().describe("Product name + one-line description"),
      icp: z.string().describe("Target buyer: role, company type, the job they're hiring you for"),
      currentTitle: z.string().optional().describe("Current listing title"),
      currentShort: z.string().optional().describe("Current short description"),
      currentLong: z.string().optional().describe("Current long description"),
      pricingModel: z.string().optional().describe("e.g. annual contract, usage, free trial, private offer"),
      competitors: z.string().optional().describe("Top 3 competitors or alternatives"),
    },
    method: [
      "Score the current listing 1–10 on each: title clarity, buyer-outcome framing, keyword/discovery coverage, machine-readability (structured, unambiguous), and proof. Give a one-line reason per score.",
      "Rewrite the title to lead with the buyer outcome and the category a buyer (or an AI agent) would search.",
      "Rewrite the short description (≤ 280 chars) so the value is legible to a human skimming and to an LLM parsing.",
      "Rewrite the long description using: Problem → Outcome → How it works → Proof → Who it's for → Getting started. Use plain, unambiguous nouns over cleverness.",
      "List the search terms / categories to claim and why.",
      "Flag anything that would stall a procurement or security review.",
    ],
    output:
      "Return: (1) the scorecard table, (2) rewritten title, short, and long copy ready to paste, (3) a keyword/category list, (4) a short 'fix-first' punch list.",
  },
  {
    name: "gtm_cosell_draft",
    title: "Co-sell Outreach Writer",
    description:
      "Draft ACE-ready co-sell outreach to AWS reps/PDMs plus a paste-ready ACE opportunity summary, framed to the recipient's incentive.",
    role:
      "Act as an AWS co-sell strategist who knows how ACE works and what actually makes an AWS account team engage.",
    inputs: {
      product: z.string().describe("Your product"),
      opportunity: z.string().describe("The specific customer/opportunity: company, use case, est. AWS spend impact"),
      recipient: z.string().describe("Who you're writing to: AWS rep, PDM/PSA, a partner, or the end customer"),
      stage: z.string().optional().describe("no relationship yet / warm intro / active opp"),
      ask: z.string().optional().describe("What you want: intro, ACE registration nudge, joint call, etc."),
    },
    method: [
      "Identify the recipient's incentive (AWS reps care about customer outcomes and committed/consumption revenue — frame to that, not to your features).",
      "Draft a subject line and a ≤120-word message: 1 line of relevant context, the customer outcome, the specific ask, and an easy next step.",
      "Produce a tight ACE opportunity summary (customer, use case, value to the customer, expected AWS consumption impact, stage, next step) the rep can paste.",
      "Add a 2-line follow-up to send if there's no reply in 5 business days.",
    ],
    output:
      "Return: subject line, the outreach message, the ACE summary block, and the follow-up — all paste-ready. No filler, no hype adjectives.",
  },
  {
    name: "gtm_pricing_story",
    title: "Pricing Story Builder",
    description:
      "Build packaging and a defensible pricing narrative for AWS Marketplace products, including data/AI products bought by agents.",
    role:
      "Act as a pricing and packaging advisor for technical products sold on AWS Marketplace, including data and AI products bought by humans and by agents.",
    inputs: {
      product: z.string().describe("What you sell + the unit of value the buyer actually gets"),
      currentPricing: z.string().optional().describe("Current pricing (model + numbers) if any"),
      buyer: z.string().optional().describe("Buyer type and budget owner"),
      meteringBasis: z.string().optional().describe("Whether usage can be metered, and on what (seats, calls, tokens, GB, outcomes)"),
      dealGoals: z.string().optional().describe("Deal sizes / committed-spend goals"),
    },
    method: [
      "Name the value metric — the thing that scales with the buyer's success — and test whether the current price tracks it.",
      "Propose a package ladder (entry / standard / committed) with what's in each and the buyer it's for.",
      "Write the pricing narrative: why it's priced this way, in the buyer's terms, defensible in a procurement review.",
      "Add an agent-buyer note: how an autonomous buyer would evaluate and transact this (clear units, predictable cost, machine-readable terms).",
      "Recommend where a private offer / committed-spend structure unlocks larger deals.",
    ],
    output:
      "Return: the value metric, a 3-tier package table, the pricing narrative paragraph, the agent-buyer note, and a private-offer recommendation.",
  },
];

const OPERATOR =
  "You are Ron Davis's AWS Marketplace GTM operator. Be direct and specific; never pad. Follow the method and output format exactly. If a needed input is missing, note the one assumption you made rather than stalling.";

// PROC-5 — trial→metered handoff. This free tier is prompt-only (your model does
// the work). The metered tier runs the full capability set server-side on live
// data. Appended to every tool response so a converting caller knows where to go.
const UPGRADE_CTA =
  "— This is Vellocity's free sample tier: prompt-only, no live data. For metered, " +
  "live-data access to the full capability set (run by Vellocity's own agents on your " +
  "behalf), subscribe on AWS Marketplace, then connect the authenticated MCP endpoint " +
  "https://vell.ai/api/v1/mcp with your vp3_ partner key. Details: https://docs.vell.ai/partner-program/";

/** Assemble the expert prompt for a skill with the caller's inputs filled in (thin mode). */
export function buildPrompt(skill: SkillDef, inputs: Record<string, unknown>): string {
  const lines: string[] = [];
  lines.push(`# ${skill.title}`);
  lines.push("");
  lines.push(OPERATOR);
  lines.push("");
  lines.push(`**Role.** ${skill.role}`);
  lines.push("");
  lines.push("**Inputs provided:**");
  for (const [k, v] of Object.entries(inputs)) {
    if (v === undefined || v === null || v === "") continue;
    lines.push(`- ${k}: ${String(v)}`);
  }
  lines.push("");
  lines.push("**Method:**");
  skill.method.forEach((m, i) => lines.push(`${i + 1}. ${m}`));
  lines.push("");
  lines.push(`**Output format.** ${skill.output}`);
  lines.push("");
  lines.push("---");
  lines.push("Now produce the output. Source: Ron Davis — AWS Marketplace GTM · the real engine is Vellocity (https://vell.ai).");
  lines.push("");
  lines.push(UPGRADE_CTA);
  return lines.join("\n");
}
