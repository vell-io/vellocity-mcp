# Vellocity MCP — deployment spec (serverless, COGS-aligned)

**Status:** plan + IaC sketch. No infra deployed yet.
**Principle:** make cost *per-call* (COGS that scales with revenue), not fixed servers (opex). Own as little always-on infra as possible; lean on Bedrock + AgentCore for the heavy parts.

---

## 1. Tier-0 (free sample) — the first deploy

The sample server (`src/index.ts`) is a stateless Streamable-HTTP MCP. It runs on Lambda unchanged.

**Recommended:** **Lambda (container) + [Lambda Web Adapter](https://github.com/awslabs/aws-lambda-web-adapter)** behind a **Function URL (RESPONSE_STREAM)**, fronted by **CloudFront + ACM** for `mcp.vell.ai`. Pure per-request cost, no idle charge, and response-streaming is ready for thick mode later.

| Option | Custom domain | Idle cost | Streaming | Notes |
|---|---|---|---|---|
| **Lambda container + LWA + Function URL + CloudFront** ✅ | CloudFront + ACM | $0 | yes | Express app runs as-is; future-proof |
| Lambda zip + `serverless-http` + API Gateway HTTP API | API GW custom domain + ACM | $0 | buffered only | Simplest; fine for thin (JSON/buffered SSE) |
| Lambda + **ALB** + ACM | ALB | ~$16/mo | yes | Only if consolidating with existing ALB infra |

We tested the server returning buffered SSE (`event: message\ndata: …`) — that works on any of these. Streaming only matters once thick-mode inference streams tokens.

### Adapter

- **Container + LWA (recommended):** no code change. `Dockerfile` runs `node dist/index.js`; the LWA extension translates the Function URL event to HTTP on `127.0.0.1:$PORT`.
- **Zip + serverless-http (simplest):** add one file, `src/lambda.ts`:
  ```ts
  import serverless from "serverless-http";
  import { app } from "./index.js";   // export `app` from index.ts
  export const handler = serverless(app);
  ```
  (requires `npm i serverless-http`; export the Express `app` from `index.ts`.)

### IaC

See [`infra/template.yaml`](../infra/template.yaml) (AWS SAM — CFN-native, matches the org's CloudFormation stacks).

```bash
sam build && sam deploy --guided      # first time
# params: DomainName=mcp.vell.ai, CertificateArn=<ACM arn in us-east-1 for CloudFront>, Mode=thin
```

### Domain + cert
`mcp.vell.ai` → Route53 A/AAAA alias → CloudFront (or API GW). **ACM cert DNS-validated** (no :80 / HTTP-01 — this avoids the LE lock-out that bit the current EC2/nginx setup). For CloudFront the cert must be in **us-east-1**.

---

## 2. Tier-1 (account / thick) — Bedrock + AgentCore

Thick mode replaces the `runSkill()` thin return with a real inference call.

### Bedrock (the COGS line)
- Wire `runSkill()` thick branch to the **Bedrock Converse API** (Claude on Bedrock — aligns with the OpenAI→Bedrock migration). Per-token cost = your COGS; no GPUs, scales to zero.
- IAM: `bedrock:InvokeModel` / `bedrock:Converse` on the specific model ARNs only (least privilege).

### AgentCore — what to lean on (verify GA before committing)
- **AgentCore Gateway** — can *be* the managed MCP gateway: expose Lambdas/APIs as MCP tools with managed auth. Could replace hand-rolled gateway code.
- **AgentCore Identity** — per-tenant OAuth/scoping → satisfies Tier-1 isolation without building an auth service.
- **AgentCore Runtime / Memory** — managed serverless agent execution + memory, if a tool grows from one inference call into a multi-step agent.
- **AgentCore Pay / x402** — Tier-2 metering / agent-pays-per-call (Pay is released; confirm the rest are GA, not preview, and fit MCP Streamable HTTP).

**Decision gate:** evaluate AgentCore Gateway/Identity GA + MCP fit *before* architecting Tier-1 on it. If not ready, fall back to: API Gateway authorizer + Cognito (or a bearer-key table) for auth, and our own thin metering — but prefer AgentCore to avoid building plumbing.

### Tenant state
**DynamoDB** (PAY_PER_REQUEST): tenant → API key (hashed), tier, rate-limit counters, spend-to-date. No always-on RDS for the MCP layer. Tenant *business* data (their listing, catalog) is pulled live from Vellocity's existing app APIs at call time — the MCP holds none at rest.

---

## 3. Cost model / unit economics

Per thick call: `Lambda ms + Bedrock input/output tokens + (CloudFront/API req) + payment fee`. All variable.

```
margin_per_call = price − (bedrock_tokens·rate + lambda_gb_s·rate + req_fee + pay_fee)
```

Tier-0 (thin) ≈ Lambda ms only → effectively free. You can price each tool call against its measured token COGS and set tiers/caps accordingly.

---

## 4. Guardrails — cost IS security here

Bedrock per-token means an unthrottled thick tool is an **unbounded bill** (a runaway or hostile agent hammering it). Mandatory before Tier-1 ships:
- **Per-tenant rate limit** (token bucket in DynamoDB) + **hard daily/monthly spend cap** per tenant.
- **Global circuit breaker** (CloudWatch alarm on Bedrock spend → disable thick).
- **Inputs and any fetched content treated as inert** (prompt injection / tool-poisoning).
- **Least-privilege IAM**, no ambient creds; per-tool model allow-list.
- Tier-0 stays open *only because* it has no inference, no data, no actions — keep that invariant.

---

## 5. Internal MCP migration (separate, low effort)
The internal QBO/Kajabi MCPs (OpenClaw) stay on their current EC2 — they're internal opex and fine. Just repoint DNS to `internal-mcp.vell.ai` so `mcp.vell.ai` is the clean public product surface. No rearchitecture.

---

## 6. Phased rollout
1. **Tier-0 live:** SAM deploy → `mcp.vell.ai` (CloudFront+ACM), list in AWS MP AI Agents & Tools. Cheap, real connector URL.
2. **Tier-1 (on demand):** one thick tool end-to-end on Bedrock, with tenant isolation + rate limit + spend cap, in the private `vellocity-platform` repo. Don't build ahead of pull.
3. **Tier-2:** metering — Stripe metered → x402 / AgentCore Pay.

## Open decisions
- Front door: CloudFront+Function URL (rec.) vs API Gateway HTTP API vs existing ALB.
- AgentCore Gateway/Identity: GA + MCP fit? (verify) → gateway/auth build-vs-buy.
- Container (LWA) vs zip (serverless-http) for the Lambda.
- Where Tier-1 reads tenant data: direct Vellocity app API vs a dedicated read model.

---
© 2026 Ron Davis / Vellocity · From listed to bought.
