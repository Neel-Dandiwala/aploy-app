const NOW = (/* @__PURE__ */ new Date()).toISOString();
const MOCK_IDS = {
  project: "proj_mock1",
  dataset: "ds_mock1",
  run: "run_mock1",
  deployment: "dep_mock1",
  knowledgeBase: "kb_mock1",
  pipeline: "pipe_mock1",
  trigger: "trig_mock1",
  orgSlug: "acme",
  apiKey: "key_mock1",
  credential: "cred_mock1"
};
let simulateErrorCount = 0;
function setSimulateErrorNext() {
  simulateErrorCount = 1;
}
function maybeSimulateError() {
  if (simulateErrorCount > 0) {
    simulateErrorCount -= 1;
    throw new Error("Simulated error for testing.");
  }
}
async function mockFetch(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  maybeSimulateError();
  const pathOnly = path.replace(/\?.*$/, "");
  const pathParts = pathOnly.replace(/^\/api\/?/, "").split("/").filter(Boolean);
  if (pathParts[0] === "projects" && pathParts.length === 1) {
    if (method === "GET") {
      return {
        projects: [
          { id: MOCK_IDS.project, name: "Support Bot", base_model: "mistralai/Mistral-7B-v0.2", objective: "dpo", created_at: NOW }
        ]
      };
    }
    if (method === "POST") return { id: MOCK_IDS.project };
  }
  if (pathParts[0] === "datasets") {
    if (pathParts.length === 1) {
      if (method === "GET") {
        return { datasets: [{ id: MOCK_IDS.dataset, name: "Support chat v1", status: "ready", row_count: 10200, created_at: NOW }] };
      }
      if (method === "POST") return { id: MOCK_IDS.dataset };
    }
    if (pathParts.length === 2 && pathParts[1] !== "new") {
      const id = pathParts[1];
      if (method === "GET") {
        return {
          id,
          name: "Support chat v1",
          status: "ready",
          source: { type: "upload" },
          row_count: 10200,
          quality: { duplication_pct: 2, pii_flagged: 0, schema_adherence: 98 },
          versions: [{ id: "dsv_1", tag: "v1", status: "ready", row_count: 10200, created_at: NOW }]
        };
      }
      if (pathParts.length === 3 && pathParts[2] === "ingest" && method === "POST") {
        return { status: "ready", row_count: 10200 };
      }
    }
  }
  if (pathParts[0] === "runs" && pathParts.length === 1) {
    if (method === "GET") {
      return {
        runs: [{ id: MOCK_IDS.run, project_id: MOCK_IDS.project, status: "succeeded", duration_sec: 7200, cost_usd: 14.2, created_at: NOW }]
      };
    }
    if (method === "POST") return { id: MOCK_IDS.run };
  }
  if (pathParts[0] === "deploy") {
    if (method === "GET") {
      return {
        deployments: [
          { id: MOCK_IDS.deployment, model_version_id: "mv_1", type: "api", status: "live", endpoint_url: "https://api.aploy.dev/v1/deployments/dep_mock1/invoke", created_at: NOW }
        ]
      };
    }
    if (method === "POST") return void 0;
  }
  if (pathParts[0] === "org") {
    if (pathParts.length === 1 && method === "GET") return { name: "Acme Inc", slug: MOCK_IDS.orgSlug };
    if (pathParts[1] === "api-keys") {
      if (pathParts.length === 2) {
        if (method === "GET") return { api_keys: [{ id: MOCK_IDS.apiKey, name: "Production", key_prefix: "aploy_", last_used_at: null }] };
        if (method === "POST") return { raw_key: "aploy_mock_" + Math.random().toString(36).slice(2) };
      }
      if (pathParts.length === 3 && method === "DELETE") return void 0;
    }
    if (pathParts[1] === "credentials") {
      if (pathParts.length === 2) {
        if (method === "GET") return { credentials: [{ id: MOCK_IDS.credential, name: "AWS prod", type: "s3", status: "ok", last_tested_at: NOW }] };
        if (method === "POST") return void 0;
      }
      if (pathParts.length === 3) {
        if (pathParts[2] === "test" && method === "POST") return { ok: true };
        if (method === "DELETE") return void 0;
      }
    }
  }
  if (pathParts[0] === "knowledge-bases") {
    if (pathParts.length === 1) {
      if (method === "GET") return { knowledge_bases: [{ id: MOCK_IDS.knowledgeBase, name: "Product docs", status: "ready", chunk_count: 1200 }] };
      if (method === "POST") return { id: MOCK_IDS.knowledgeBase };
    }
    if (pathParts.length === 2 && pathParts[1] !== "new") {
      const id = pathParts[1];
      if (method === "GET") {
        return { id, name: "Product docs", status: "ready", chunk_count: 1200, source: { type: "upload" }, embedding_model: "text-embedding-3-small", embedding_dimension: 1536, chunk_config: { size: 512, overlap: 64 } };
      }
      if (pathParts.length === 3 && pathParts[2] === "ingest" && method === "POST") return { status: "ready", chunk_count: 1200 };
    }
  }
  if (pathParts[0] === "pipelines") {
    if (pathParts.length === 1) {
      if (method === "GET") return { pipelines: [{ id: MOCK_IDS.pipeline, name: "Summarize then classify", description: "", steps: [], created_at: NOW }] };
      if (method === "POST") return { id: MOCK_IDS.pipeline };
    }
    if (pathParts.length === 2 && pathParts[1] !== "new") {
      const id = pathParts[1];
      if (method === "GET") return { id, name: "Summarize then classify", description: "", steps: [{ id: "step1", type: "model", name: "step1" }] };
    }
  }
  if (pathParts[0] === "triggers") {
    if (pathParts.length === 1) {
      if (method === "GET") return { triggers: [{ id: MOCK_IDS.trigger, pipeline_id: MOCK_IDS.pipeline, name: "Webhook", type: "webhook", status: "active", webhook_url: "https://api.aploy.dev/webhooks/trig_mock1" }] };
      if (method === "POST") return void 0;
    }
    if (pathParts.length === 2 && method === "DELETE") return void 0;
  }
  if (pathParts[0] === "billing") {
    if (pathParts[1] === "usage" && method === "GET") {
      return { period_start: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), period_end: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), compute_gpu_hours: 24.5, storage_gb_months: 120, total_usd: 42.5, forecast_usd: 55 };
    }
    if (pathParts[1] === "invoices" && method === "GET") return { invoices: [] };
    if (pathParts[1] === "setup-customer" && method === "POST") return { stripe_customer_id: "cus_mock" };
  }
  if (method === "GET") {
    if (pathParts[0] === "projects") return { projects: [] };
    if (pathParts[0] === "datasets") return { datasets: [] };
    if (pathParts[0] === "runs") return { runs: [] };
    if (pathParts[0] === "deploy") return { deployments: [] };
    if (pathParts[0] === "knowledge-bases") return { knowledge_bases: [] };
    if (pathParts[0] === "pipelines") return { pipelines: [] };
    if (pathParts[0] === "triggers") return { triggers: [] };
  }
  return {};
}
function useMockApi() {
  return { mockFetch, MOCK_IDS, setSimulateErrorNext };
}

export { useMockApi as u };
//# sourceMappingURL=useMockApi-CJyUoVJj.mjs.map
