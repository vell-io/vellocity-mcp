# Vellocity MCP — Tier-0 (free gtm_* sample) on Lambda via AWS Lambda Web Adapter.
# Runs the Express/MCP server UNCHANGED; LWA (an /opt/extensions extension) bridges
# Lambda invokes → the server on $PORT. RESPONSE_STREAM mode supports the MCP
# StreamableHTTP transport (SSE), which serverless-http/API-Gateway could not.
FROM public.ecr.aws/docker/library/node:22-slim

# The Lambda Web Adapter extension.
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.9.1 /lambda-adapter /opt/extensions/lambda-adapter

ENV PORT=8080 \
    NODE_ENV=production \
    AWS_LWA_INVOKE_MODE=response_stream

WORKDIR /var/task

# Prod deps only (ESM: @modelcontextprotocol/sdk, express, zod resolve natively).
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Compiled ESM output (tsc). `npm run build` must run before `sam build`.
COPY dist ./dist

CMD ["node", "dist/index.js"]
