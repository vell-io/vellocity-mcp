/**
 * Lambda entrypoint — wraps the Express app (src/index.ts) as an API Gateway
 * HTTP API (payload v2) handler via serverless-http. Buffered responses, which
 * is all Tier-0 (thin) needs — the sample returns assembled JSON, no streaming.
 * Thick/streaming mode later moves to a Function URL (RESPONSE_STREAM).
 *
 * Handler ref in infra/template.yaml: `lambda.handler`.
 */
import serverlessHttp from "serverless-http";
import { app } from "./index.js";

export const handler = serverlessHttp(app);
