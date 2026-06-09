/** Lightweight smoke test — verifies the skills + prompt assembly without a network round-trip. */
import { SKILLS, buildPrompt } from "./skills.js";

let failed = 0;
function check(label: string, cond: boolean) {
  console.log(`${cond ? "ok  " : "FAIL"} ${label}`);
  if (!cond) failed++;
}

check("3 tools registered", SKILLS.length === 3);
check("tool names", SKILLS.map((s) => s.name).join(",") === "listing_audit,cosell_draft,pricing_story");

const listing = SKILLS.find((s) => s.name === "listing_audit")!;
const prompt = buildPrompt(listing, {
  product: "Acme Observability — incident response for AWS",
  icp: "Platform eng leads at mid-market SaaS on AWS",
  currentTitle: "Acme Cloud Suite",
  pricingModel: "per-host/month, metered",
  competitors: "PagerDuty, Datadog",
});
check("prompt includes role", prompt.includes("Marketplace Center of Excellence"));
check("prompt fills inputs", prompt.includes("Acme Cloud Suite") && prompt.includes("PagerDuty"));
check("prompt includes method step 1", prompt.includes("Score the current listing"));
check("prompt ladders to Vellocity", prompt.includes("vell.ai"));

console.log("\n--- sample assembled prompt (listing_audit) ---\n");
console.log(prompt);

process.exit(failed ? 1 : 0);
