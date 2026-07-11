# Vellocity MCP — Deployments & Runtime Service Map

> **Why this file exists.** [`ARCHITECTURE.md`](./ARCHITECTURE.md) describes the
> *intended* tier strategy ("one gateway at `mcp.vell.ai`, tiered"). This file
> describes what is *actually running right now* — which is **two separate
> services on different infra**. They are easy to confuse (they were). Read this
> before touching either. Verified by live probe **2026-07-10**.

## ⚠ Strategy vs. reality drift
`ARCHITECTURE.md` says the Tier-0 sample lives under the single `mcp.vell.ai`
gateway. In practice the Tier-0 sample is deployed **separately to
`agents.vell.ai`** (Lambda), while `mcp.vell.ai` runs the **paid** server on EC2.
Naming is in flux (dropping the `/mcp` path segment was floated). Reconcile the
strategy doc with this once the hosting/naming settles.

---

## The two live services

| | **Free sample** | **Paid** |
|---|---|---|
| Host | `agents.vell.ai` | `mcp.vell.ai` |
| Edge → runtime | CloudFront → Lambda **Function URL** | nginx (Ubuntu) → Express on **EC2** |
| Codebase | **this repo** (`vellocity-mcp`), stateless | **separate** codebase, stateful (sessions) |
| Mode | `thin` — returns a prompt, **no inference** | live / metered (Tier 1–2) |
| Auth | **open** (safe — see below) | **Bearer required** (`/mcp` → 401 without it) ✅ |
| Cost per call | ~0 (string assembly) | real (inference / metered) |
| Deployed from this repo? | ✅ `infra/template.yaml` | ❌ no |

**Editing `vellocity-mcp` = working on the FREE `agents.vell.ai` Lambda.** The
paid `mcp.vell.ai` is a different codebase on a different box.

---

## Service A — `agents.vell.ai` (free sample = this repo)

- CloudFront → Lambda Function URL (`RESPONSE_STREAM`, `AuthType: NONE`) → Lambda
  Web Adapter → Express/MCP (`src/index.ts`).
- `GET /health` (open) → `{ok, server, tier:"gtm-sample", mode, tools[]}`.
- `POST /mcp` → MCP StreamableHTTP. In `thin` mode, `runSkill()` returns the
  **assembled prompt**; the *caller's* model runs it — **no Bedrock call here**.
- **Why open is safe:** thin mode has no per-call cost, so anonymous access can't
  run up a bill. That invariant is the whole reason Tier 0 can be public
  (see `ARCHITECTURE.md` §Security model).
- Deploy: `npm run deploy:sample` (SAM, `Mode=thin`, us-east-1).

### Abuse controls (free tier)
| Control | Where | Status |
|---|---|---|
| No per-call inference cost | `thin` mode, `src/index.ts` | ✅ live |
| `ReservedConcurrency` ceiling (50) | `infra/template.yaml` | ✅ live |
| Fail-closed on `thick` + empty token | `src/index.ts` `50a97e2` | ✅ in code |
| `x-powered-by` disabled | `src/index.ts` `50a97e2` | ✅ in code (on next deploy) |
| CloudFront front | edge (distribution not in this repo) | ✅ live |
| 1 MB body cap, 30s timeout | `src/index.ts` / `template.yaml` | ✅ live |
| CloudFront WAF (per-IP rate limits) | `infra/waf.yaml` | ⚠ **drafted, not deployed** |
| Function-URL lock (OAC) so WAF can't be bypassed | — | ❌ **not done** |

> ⚠ **Bypass gap.** The WAF (`infra/waf.yaml`) only sees traffic through
> CloudFront. The raw `*.lambda-url.us-east-1.on.aws` host is directly invocable
> (`AuthType: NONE`), so the WAF is **bypassable until the Function URL is locked
> to CloudFront** (`AuthType: AWS_IAM` + Origin Access Control + resource policy).
> Exact steps are in the `infra/waf.yaml` header.

---

## Service B — `mcp.vell.ai` (paid, separate codebase)

- nginx (`nginx/1.18.0`, Ubuntu) → Express (Node) on a long-running **EC2** host.
  Not behind CloudFront. **Stateful** — `/health` reports live `sessions` + uptime.
- `GET /health` → `{status:"ok", sessions, uptime}`.
- `POST /mcp` → **requires** `Authorization: Bearer <token>`; `401` without it. ✅
- **Not deployed from this repo.**

### Incidental hardening notes (paid server — track separately)
- Leaks `x-powered-by: Express` **and** `server: nginx/1.18.0 (Ubuntu)` (stack +
  version disclosure). Fix on that host: `app.disable('x-powered-by')` + nginx
  `server_tokens off;`. Low, but free.
- `/health` exposes `sessions` + uptime — minor usage/scale disclosure. Low.
- These are in the **paid** codebase, not `vellocity-mcp`.

---

## Environments = stacks-by-param (NOT branches)
This is a stateless Lambda, so it does **not** use the Laravel side's
dev/demo/prod branch + CodeDeploy pipelines. Environments are separate SAM
**stacks** built from the same code with different **parameters**:

| Env | Stack | Params | npm script |
|---|---|---|---|
| Prod (free) | `vellocity-mcp-sample` | `Mode=thin`, token empty, concurrency 50 → agents.vell.ai | `deploy:sample` |
| Sandbox | `vellocity-mcp-sandbox` | `Mode=thick`, token **set**, concurrency 5 | `deploy:sandbox` |

`deploy:sandbox` fails fast if `GTM_MCP_SANDBOX_TOKEN` is unset (thick requires a
token — the `src/index.ts` fail-closed guard would otherwise crash-loop the boot).

## CI/CD — `.github/workflows/deploy.yml`
One workflow, two environments (no per-env pipeline sprawl):
- **merge to `main`** → deploy the **sandbox** stack automatically.
- **tag `v*`** or **manual dispatch** → deploy **prod** (`agents.vell.ai`), gated by
  the GitHub `production` environment's **Required reviewers** (the approval step).

One-time setup before it runs (documented in the workflow header):
1. GitHub **OIDC → AWS IAM role** (no long-lived keys); ARN → secret `AWS_DEPLOY_ROLE_ARN`.
2. Secret `GTM_MCP_SANDBOX_TOKEN` (sandbox bearer).
3. GitHub Environments `sandbox` (no gate) and `production` (Required reviewers).

Bedrock drop-in for the paid path is still stubbed: wire it in `runSkill()`
(`src/index.ts` ~line 15) with a **pinned model ARN** + least-privilege
`bedrock:InvokeModel` (scaffolded, commented, in `infra/template.yaml`) before
the sandbox exercises real inference.

---

## Open items
- [ ] Deploy `infra/waf.yaml` + attach to the `agents.vell.ai` distribution.
- [ ] Lock the Lambda Function URL to CloudFront (OAC) — makes the WAF real.
- [ ] CI/CD: create the OIDC role + set the 3 secrets/environments (workflow header).
- [ ] Reconcile `ARCHITECTURE.md` naming (`agents.vell.ai` vs `mcp.vell.ai`; drop `/mcp`?).
- [ ] Harden the paid server headers (`x-powered-by`, `server_tokens off`).
- [ ] Wire the Bedrock drop-in in `runSkill()` before the sandbox runs live inference.

_CI/CD + sandbox stack scaffolded 2026-07-10 (`deploy:sandbox` + deploy.yml)._

_Last verified: 2026-07-10 (live probe of both endpoints)._
