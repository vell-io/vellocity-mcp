# Deploy steps — Tier-0 (free `gtm_*` sample)

Scaffolding is done (`src/lambda.ts` serverless-http adapter, `app` exported, `infra/template.yaml` = esbuild build + optional custom domain). This is now **one command away**.

## Prereqs (one-time)
- **AWS SAM CLI**: `brew install aws-sam-cli` (not currently installed).
- **AWS creds** for account `253265132499`, region `us-east-1` (your SSO role).
- Node deps already installed (`serverless-http`, `esbuild` dev).

## 1. First deploy — NO custom domain (zero DNS/ACM), open free tier
```bash
cd /Users/vell/code/vellocity-mcp
npm run deploy:sample
```
That runs `sam build` (esbuild bundles `src/lambda.ts`) + `sam deploy` with `Mode=thin`, `McpToken=''` (open), no cert → **no domain needed**. Note the stack output **`DefaultApiUrl`**.

## 2. Validate (open, no token)
```bash
API=<DefaultApiUrl from stack outputs>
curl -s $API/health                 # {"ok":true,... tools:[gtm_listing_audit,gtm_cosell_draft,gtm_pricing_story]}
curl -s -X POST $API/mcp -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'   # returns the 3 tools
```

## 3. Add a custom domain (later — recommended: a NEW subdomain, not mcp.vell.ai)
Avoid colliding with the EC2 box that already serves `mcp.vell.ai` (QBO + Kajabi MCPs). Use e.g. `agents.vell.ai`:
1. Request an ACM cert (DNS-validated) for `agents.vell.ai` **in us-east-1** (regional cert for HTTP API custom domain), validate via Route53.
2. Get the Route53 hosted-zone id for `vell.ai`.
3. Redeploy with the domain wired:
```bash
sam deploy --stack-name vellocity-mcp-sample --region us-east-1 --resolve-s3 --capabilities CAPABILITY_IAM \
  --parameter-overrides Mode=thin McpToken='' DomainName=agents.vell.ai \
  CertificateArn=<acm-arn> HostedZoneId=<zone-id>
```
Output `McpUrl` → `https://agents.vell.ai/mcp`.

## 4. Then: AWS Marketplace AI Agents & Tools listing
List the open endpoint (`/mcp`) + the 3 tools. Free tier stays **unauthenticated** (`McpToken=''`) so an evaluator/agent can connect and try it — that's the discovery surface. (See project_aws_mp_track_b_agent_listing.)

## Notes / gotchas
- **Open by design:** the server is open when `GTM_MCP_TOKEN` is empty (src/index.ts). The bearer-gated `mcp.vell.ai/mcp` on the box is a *different* server (QBO/gateway) — not this one.
- **ESM build:** the template uses esbuild `Format: esm` + a require/`__dirname` banner. If the first `sam build` errors on ESM interop, flip `Format: esm` → `cjs` in `infra/template.yaml` (BuildProperties) and rebuild — the app bundles fine either way.
- **Cost:** Lambda arm64 + HTTP API + a PAY_PER_REQUEST DynamoDB table (Tier-1 scaffold, unused by thin) = ~$0 idle, pay-per-call.
