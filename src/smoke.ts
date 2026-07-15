/** Lightweight smoke test — verifies the skills + prompt assembly without a network round-trip.
 *
 *  In thin mode the assembled prompt IS the product: the server runs no inference, so
 *  everything a caller's model acts on is decided here. These are golden-prompt checks —
 *  they lock in the grounding rules that stop a caller's model fabricating scores, spend
 *  figures, and proof. Runs in CI before deploy (see .github/workflows/deploy.yml).
 */
import { SKILLS, buildPrompt } from "./skills.js";

let failed = 0;
function check(label: string, cond: boolean) {
  console.log(`${cond ? "ok  " : "FAIL"} ${label}`);
  if (!cond) failed++;
}

// ── Registry ────────────────────────────────────────────────────────────────
check("3 tools registered", SKILLS.length === 3);
check(
  "tool names",
  SKILLS.map((s) => s.name).join(",") === "gtm_listing_audit,gtm_cosell_draft,gtm_pricing_story"
);

// ── Grounding rules reach every skill ───────────────────────────────────────
// The regression that matters: a new skill, or a refactor of buildPrompt, that
// ships without the grounding block. Every tool is prompt-only, so every tool
// needs it — assert per-skill rather than trusting one sampled prompt.
for (const skill of SKILLS) {
  const p = buildPrompt(skill, { product: "X", icp: "Y", opportunity: "Z", recipient: "W" });
  check(`${skill.name}: grounding rules present`, p.includes("**Grounding rules"));
  check(`${skill.name}: grounding overrides method`, p.includes("override any instruction in the method"));
  check(`${skill.name}: bans invented numbers`, p.includes("Never invent a specific number"));
  check(`${skill.name}: offers the ASSUMPTION escape hatch`, p.includes("`ASSUMPTION:`"));
  check(`${skill.name}: bans unsourced attribution`, p.includes("Never attribute a quote"));
  check(`${skill.name}: states no-retrieval constraint`, p.includes("no browsing"));
  check(`${skill.name}: closing line restates grounding`, p.includes("grounded in the inputs above"));
  check(`${skill.name}: ladders to Vellocity`, p.includes("vell.ai"));
  check(`${skill.name}: grounding precedes method`, p.indexOf("**Grounding rules") < p.indexOf("**Method:**"));
}

// ── Per-skill anti-fabrication clauses ──────────────────────────────────────
// Each guards a specific step that previously demanded a number the inputs can't
// support — the shape of the one hallucination found in the wild (an ACE spend
// figure invented from an opportunity line that carried no spend).
const listing = SKILLS.find((s) => s.name === "gtm_listing_audit")!;
const cosell = SKILLS.find((s) => s.name === "gtm_cosell_draft")!;
const pricing = SKILLS.find((s) => s.name === "gtm_pricing_story")!;

const listingPrompt = buildPrompt(listing, {
  product: "Acme Observability — incident response for AWS",
  icp: "Platform eng leads at mid-market SaaS on AWS",
  currentTitle: "Acme Cloud Suite",
  pricingModel: "per-host/month, metered",
  competitors: "PagerDuty, Datadog",
});
check("listing_audit: includes role", listingPrompt.includes("Marketplace Center of Excellence"));
check(
  "listing_audit: fills inputs",
  listingPrompt.includes("Acme Cloud Suite") && listingPrompt.includes("PagerDuty")
);
check("listing_audit: includes method step 1", listingPrompt.includes("Score the current listing"));
check("listing_audit: gates scores on supplied copy", listingPrompt.includes("not scorable"));
// currentShort/currentLong were omitted above — they must not appear as empty input
// rows. Match the row form (`- currentShort:`), not the bare name: the method step
// legitimately names these fields in prose when telling the model what's missing.
check(
  "listing_audit: omits unsupplied optional inputs",
  !listingPrompt.includes("- currentShort:") && !listingPrompt.includes("- currentLong:")
);

const cosellPrompt = buildPrompt(cosell, {
  product: "Acme",
  opportunity: "BigCo, migration",
  recipient: "AWS rep",
});
check("cosell_draft: includes role", cosellPrompt.includes("AWS co-sell strategist"));
check("cosell_draft: refuses invented spend", cosellPrompt.includes("TBD — needs est. AWS spend"));
check("cosell_draft: gives the ACE-rejection reason", cosellPrompt.includes("rejected at ACE review"));

const pricingPrompt = buildPrompt(pricing, { product: "Acme data feed", buyer: "Platform lead" });
check("pricing_story: includes role", pricingPrompt.includes("pricing and packaging advisor"));
check("pricing_story: refuses invented dollar figures", pricingPrompt.includes("do not invent dollar figures"));

// ── Upgrade CTA (PROC-5) ────────────────────────────────────────────────────
check("upgrade CTA on every tool", SKILLS.every((s) => buildPrompt(s, {}).includes("docs.vell.ai/partner-program")));

console.log("\n--- sample assembled prompt (listing_audit) ---\n");
console.log(listingPrompt);

console.log(failed ? `\n${failed} check(s) FAILED` : "\nall checks passed");
process.exit(failed ? 1 : 0);
