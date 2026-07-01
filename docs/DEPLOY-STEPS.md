# Deploy steps — Tier-0 (free `gtm_*` sample)

**Model:** Lambda **container image** + **AWS Lambda Web Adapter** + **Function URL (RESPONSE_STREAM)**. Runs the Express/MCP server unchanged; streaming supports the MCP StreamableHTTP transport. (serverless-http + API Gateway was tried and abandoned — it can't host the streaming transport: `/mcp` returned 400.)

## Prereqs
- **AWS SAM CLI** (`brew install aws-sam-cli`) and **Docker running** (Docker Desktop).
- AWS creds for account `253265132499`, region `us-east-1`.

## Deploy / redeploy — one command
```bash
cd /Users/vell/code/vellocity-mcp
npm run deploy:sample
```
Runs `tsc` → `sam build` (docker build, arm64) → `sam deploy` (pushes image to ECR via `--resolve-image-repos`, creates/updates the stack). `Mode=thin`, `McpToken` defaults `""` → **open free tier**. Note the **`FunctionUrl`** output.

## Live now
- Stack: `vellocity-mcp-sample` (us-east-1)
- Function URL: `https://ui2rwjwy7mbawwxqx2f6osca5q0coert.lambda-url.us-east-1.on.aws/`
- Validate: `GET /health`, `POST /mcp` (`tools/list`, `tools/call`) — all 200, open.

## Connect a model
Add `<FunctionUrl>/mcp` as a remote MCP connector (Claude → Settings → Connectors → custom).

## Next: custom domain (optional)
Function URLs don't take a custom domain directly — front with **CloudFront + ACM** (us-east-1 cert) for e.g. `agents.vell.ai` (a NEW subdomain — do NOT reuse `mcp.vell.ai`, which the EC2 box serves for QBO/Kajabi). Add a CloudFront distribution (origin = the Function URL) + a Route53 alias.

## Then: AWS Marketplace AI Agents & Tools listing
List `<url>/mcp` + the 3 tools. Free tier stays **unauthenticated** (`McpToken=''`) as the discovery/trial surface. (Ties into project_aws_mp_track_b_agent_listing.)

## Notes
- **Open by design:** open when `GTM_MCP_TOKEN` is empty (src/index.ts). Paid tiers set the token later.
- **Cost:** Lambda arm64 (container) + Function URL + a PAY_PER_REQUEST DynamoDB table (Tier-1 scaffold, unused by thin) = ~$0 idle, pay-per-call. Cold start ~4s (container), warm ~0.3s.
- **Streaming:** `AWS_LWA_INVOKE_MODE=response_stream` (Dockerfile) + `InvokeMode: RESPONSE_STREAM` (Function URL).
