/**
 * Frontend-only mock API for when backend is not deployed.
 * Returns realistic, consistent data so the full user journey works.
 */

const NOW = new Date().toISOString()

export const MOCK_IDS = {
  project: 'proj_mock1',
  dataset: 'ds_mock1',
  run: 'run_mock1',
  deployment: 'dep_mock1',
  knowledgeBase: 'kb_mock1',
  pipeline: 'pipe_mock1',
  trigger: 'trig_mock1',
  orgSlug: 'acme',
  apiKey: 'key_mock1',
  credential: 'cred_mock1',
  modelVersion: 'mv_mock1',
  evaluation: 'eval_mock1',
} as const

let simulateErrorCount = 0
export function setSimulateErrorNext() {
  simulateErrorCount = 1
}

function maybeSimulateError(): void {
  if (simulateErrorCount > 0) {
    simulateErrorCount -= 1
    throw new Error('Simulated error for testing.')
  }
}

function parseQuery(path: string): Record<string, string> {
  const i = path.indexOf('?')
  if (i < 0) return {}
  const params = new URLSearchParams(path.slice(i + 1))
  const out: Record<string, string> = {}
  params.forEach((v, k) => { out[k] = v })
  return out
}

export async function mockFetch<T = unknown>(
  path: string,
  options: { method?: string; body?: unknown; query?: Record<string, string> } = {}
): Promise<T> {
  const method = (options.method || 'GET').toUpperCase()
  maybeSimulateError()
  const pathOnly = path.replace(/\?.*$/, '')
  const pathParts = pathOnly.replace(/^\/api\/?/, '').split('/').filter(Boolean)
  const query = parseQuery(path)

  if (pathParts[0] === 'projects' && pathParts.length === 1) {
    if (method === 'GET') {
      return {
        projects: [
          { id: MOCK_IDS.project, name: 'Support Bot', base_model: 'mistralai/Mistral-7B-v0.2', objective: 'dpo', status: 'ready_to_train', status_badge: 'Ready to Train', created_at: NOW },
        ],
      } as T
    }
    if (method === 'POST') return { id: MOCK_IDS.project } as T
  }

  if (pathParts[0] === 'datasets') {
    if (pathParts.length === 1) {
      if (method === 'GET') {
        return { datasets: [{ id: MOCK_IDS.dataset, name: 'Support chat v1', status: 'ready', row_count: 10200, created_at: NOW }] } as T
      }
      if (method === 'POST') return { id: MOCK_IDS.dataset } as T
    }
    if (pathParts.length === 2 && pathParts[1] !== 'new') {
      const id = pathParts[1]
      if (method === 'GET') {
        return {
          id,
          name: 'Support chat v1',
          status: 'ready',
          source: { type: 'upload' },
          row_count: 10200,
          quality: { duplication_pct: 2, pii_flagged: 0, schema_adherence: 98 },
          versions: [{ id: 'dsv_1', tag: 'v1', status: 'ready', row_count: 10200, created_at: NOW }],
        } as T
      }
      if (pathParts.length === 3 && pathParts[2] === 'ingest' && method === 'POST') {
        return { status: 'ready', row_count: 10200 } as T
      }
    }
  }

  if (pathParts[0] === 'runs') {
    if (pathParts[1] === 'test' && pathParts.length === 2 && method === 'POST') {
      return {
        id: 'run_test_' + Date.now(),
        type: 'safeguard',
        status: 'queued',
        test_passed: null,
        created_at: NOW,
      } as T
    }
    if (pathParts.length === 1) {
      if (method === 'GET') {
        const runs = [
          { id: MOCK_IDS.run, project_id: MOCK_IDS.project, script_version_id: 'sv_mock1', type: 'safeguard', status: 'succeeded', test_passed: true, status_color: 'green', duration_sec: 10, created_at: NOW },
          { id: 'run_mock2', project_id: MOCK_IDS.project, script_version_id: 'sv_mock1', type: 'training', status: 'succeeded', status_color: 'green', duration_sec: 7200, cost_usd: 14.2, created_at: NOW },
        ]
        return { runs } as T
      }
      if (method === 'POST') return { id: MOCK_IDS.run } as T
    }
    if (pathParts.length === 2 && pathParts[1] !== 'new') {
      const id = pathParts[1]
      if (method === 'GET') {
        const isTest = String(id).startsWith('run_test_')
        return {
          id,
          project_id: MOCK_IDS.project,
          script_version_id: 'sv_mock1',
          dataset_version_id: 'dsv_1',
          type: isTest ? 'safeguard' : 'training',
          status: isTest ? 'succeeded' : 'succeeded',
          test_passed: isTest ? true : undefined,
          status_color: 'green',
          config: { epochs: 3, lora_rank: 16 },
          metrics: { loss: 0.42, throughput_tokens_per_sec: 1200 },
          duration_sec: isTest ? 10 : 7200,
          cost_usd: isTest ? undefined : 14.2,
          log_tail: ['Training started', 'Step 1 completed', 'Checkpoint saved'],
          attempts: [],
          created_at: NOW,
        } as T
      }
    }
  }

  if (pathParts[0] === 'projects' && pathParts.length >= 2 && pathParts[1] !== 'new') {
    const id = pathParts[1]
    if (pathParts[2] === 'chats') {
      if (method === 'GET') {
        if (query.chat_id) {
          return { messages: [{ id: 'm1', role: 'assistant', content: 'Describe your dataset and goals. I\'ll help generate a training script.', created_at: NOW }] } as T
        }
        return {
          chats: [{ id: 'chat_mock1', title: 'New chat', created_at: NOW, last_message_preview: null }],
          guided_prompts: [
            { label: 'Attach dataset', prompt: 'I want to use a dataset for this project. How do I attach one?' },
            { label: 'Define goal', prompt: 'Help me define what I want to achieve with this model.' },
            { label: 'Pick evaluation metric', prompt: 'What evaluation metrics should I use for my training?' },
            { label: 'Generate script', prompt: 'Generate a training script based on my linked datasets and goals.' },
          ],
        } as T
      }
      if (method === 'POST') {
        const body = (options.body || {}) as { content?: string; chat_id?: string }
        return {
          chat: { id: body.chat_id || 'chat_mock1', title: 'New chat', created_at: NOW },
          user_message: { id: 'm1', role: 'user', content: body.content || '', created_at: NOW },
          assistant_message: { id: 'm2', role: 'assistant', content: 'In mock mode I would suggest a training script. Link a dataset and describe your goals.', created_at: NOW },
        } as T
      }
    }
    if (pathParts[2] === 'scripts') {
      if (pathParts.length === 3) {
        if (method === 'GET') {
          return {
            scripts: [{ id: 'sv_mock1', version: 1, code: '# Training script', config: { epochs: 3, lora_rank: 16 }, change_summary: 'Generated initial script', created_at: NOW }],
          } as T
        }
        if (method === 'POST') {
          const body = (options.body || {}) as { code?: string; config?: object; change_summary?: string }
          return { id: 'sv_' + Date.now(), version: 1, code: body.code || '# New script', config: body.config || { epochs: 3, lora_rank: 16 }, change_summary: body.change_summary, created_at: NOW } as T
        }
      }
      if (pathParts.length === 4 && method === 'GET') {
        return { id: pathParts[3], version: 1, code: '# Training script', config: { epochs: 3, lora_rank: 16 }, change_summary: 'Generated initial script', created_at: NOW } as T
      }
    }
    if (pathParts[2] === 'datasets') {
      if (pathParts.length === 3) {
        if (method === 'GET') {
          return {
            datasets: [{ id: MOCK_IDS.dataset, name: 'Support chat v1', status: 'ready', row_count: 10200, versions: [{ id: 'dsv_1', tag: 'v1', status: 'ready' }] }],
          } as T
        }
        if (method === 'POST') return { id: 'pd_1', project_id: id, dataset_id: (options.body as { dataset_id?: string })?.dataset_id || MOCK_IDS.dataset } as T
        if (method === 'DELETE') return undefined as T
      }
    }
    if (pathParts[2] === 'deployments' && pathParts.length === 3 && method === 'GET') {
      return {
        deployments: [{ id: MOCK_IDS.deployment, model_version_id: 'mv_1', status: 'ready', endpoint_url: 'https://api.aploy.dev/v1/deployments/dep_mock1/invoke', created_at: NOW }],
      } as T
    }
    if (pathParts.length === 2 && method === 'GET') {
      return {
        id,
        name: 'Support Bot',
        description: 'DPO tuning for support chat',
        base_model: 'mistralai/Mistral-7B-v0.2',
        objective: 'dpo',
        visibility: 'private',
        status: 'ready_to_train',
        status_badge: 'Ready to Train',
        runs: [{ id: MOCK_IDS.run, status: 'succeeded', created_at: NOW }],
        created_at: NOW,
      } as T
    }
  }

  if (pathParts[0] === 'registry') {
    if (pathParts.length === 1 && method === 'GET') {
      return {
        models: [{ id: MOCK_IDS.modelVersion, project_id: MOCK_IDS.project, run_id: MOCK_IDS.run, created_at: NOW }],
      } as T
    }
  }

  if (pathParts[0] === 'evaluate') {
    if (pathParts.length === 1 && method === 'GET') {
      return {
        evaluations: [{ id: MOCK_IDS.evaluation, run_id: MOCK_IDS.run, status: 'completed', created_at: NOW }],
      } as T
    }
    if (pathParts.length === 2 && method === 'GET') {
      return {
        id: pathParts[1],
        run_id: MOCK_IDS.run,
        status: 'completed',
        metrics: {
          perplexity: { baseline: 12.4, tuned: 10.1, delta_pct: -18.5 },
          support_accuracy: { baseline: 0.72, tuned: 0.84, delta_pct: 16.7 },
          safety_score: { baseline: 0.95, tuned: 0.94, delta_pct: -1.1 },
        },
        created_at: NOW,
      } as T
    }
    if (pathParts.length === 1 && method === 'POST') return { id: MOCK_IDS.evaluation } as T
  }

  if (pathParts[0] === 'deploy') {
    if (method === 'GET') {
      return {
        deployments: [
          { id: MOCK_IDS.deployment, model_version_id: 'mv_1', type: 'api', status: 'live', endpoint_url: 'https://api.aploy.dev/v1/deployments/dep_mock1/invoke', created_at: NOW },
        ],
      } as T
    }
    if (method === 'POST') return undefined as T
  }

  if (pathParts[0] === 'org') {
    if (pathParts.length === 1 && method === 'GET') return { name: 'Acme Inc', slug: MOCK_IDS.orgSlug } as T
    if (pathParts[1] === 'api-keys') {
      if (pathParts.length === 2) {
        if (method === 'GET') return { api_keys: [{ id: MOCK_IDS.apiKey, name: 'Production', key_prefix: 'aploy_', last_used_at: null }] } as T
        if (method === 'POST') return { raw_key: 'aploy_mock_' + Math.random().toString(36).slice(2) } as T
      }
      if (pathParts.length === 3 && method === 'DELETE') return undefined as T
    }
    if (pathParts[1] === 'credentials') {
      if (pathParts.length === 2) {
        if (method === 'GET') return { credentials: [{ id: MOCK_IDS.credential, name: 'AWS prod', type: 's3', status: 'ok', last_tested_at: NOW }] } as T
        if (method === 'POST') return undefined as T
      }
      if (pathParts.length === 3) {
        if (pathParts[2] === 'test' && method === 'POST') return { ok: true } as T
        if (method === 'DELETE') return undefined as T
      }
    }
  }

  if (pathParts[0] === 'knowledge-bases') {
    if (pathParts.length === 1) {
      if (method === 'GET') return { knowledge_bases: [{ id: MOCK_IDS.knowledgeBase, name: 'Product docs', status: 'ready', chunk_count: 1200 }] } as T
      if (method === 'POST') return { id: MOCK_IDS.knowledgeBase } as T
    }
    if (pathParts.length === 2 && pathParts[1] !== 'new') {
      const id = pathParts[1]
      if (method === 'GET') {
        return { id, name: 'Product docs', status: 'ready', chunk_count: 1200, source: { type: 'upload' }, embedding_model: 'text-embedding-3-small', embedding_dimension: 1536, chunk_config: { size: 512, overlap: 64 } } as T
      }
      if (pathParts.length === 3 && pathParts[2] === 'ingest' && method === 'POST') return { status: 'ready', chunk_count: 1200 } as T
    }
  }

  if (pathParts[0] === 'pipelines') {
    if (pathParts.length === 1) {
      if (method === 'GET') return { pipelines: [{ id: MOCK_IDS.pipeline, name: 'Summarize then classify', description: '', steps: [], created_at: NOW }] } as T
      if (method === 'POST') return { id: MOCK_IDS.pipeline } as T
    }
    if (pathParts.length === 2 && pathParts[1] !== 'new') {
      const id = pathParts[1]
      if (method === 'GET') return { id, name: 'Summarize then classify', description: '', steps: [{ id: 'step1', type: 'model', name: 'step1' }] } as T
    }
  }

  if (pathParts[0] === 'triggers') {
    if (pathParts.length === 1) {
      if (method === 'GET') return { triggers: [{ id: MOCK_IDS.trigger, pipeline_id: MOCK_IDS.pipeline, name: 'Webhook', type: 'webhook', status: 'active', webhook_url: 'https://api.aploy.dev/webhooks/trig_mock1' }] } as T
      if (method === 'POST') return undefined as T
    }
    if (pathParts.length === 2 && method === 'DELETE') return undefined as T
  }

  if (pathParts[0] === 'billing') {
    if (pathParts[1] === 'usage' && method === 'GET') {
      return { period_start: new Date().toISOString().slice(0, 10), period_end: new Date().toISOString().slice(0, 10), compute_gpu_hours: 24.5, storage_gb_months: 120, total_usd: 42.5, forecast_usd: 55 } as T
    }
    if (pathParts[1] === 'invoices' && method === 'GET') return { invoices: [] } as T
    if (pathParts[1] === 'setup-customer' && method === 'POST') return { stripe_customer_id: 'cus_mock' } as T
  }

  if (method === 'GET') {
    if (pathParts[0] === 'projects') return { projects: [] } as T
    if (pathParts[0] === 'datasets') return { datasets: [] } as T
    if (pathParts[0] === 'runs') return { runs: [] } as T
    if (pathParts[0] === 'deploy') return { deployments: [] } as T
    if (pathParts[0] === 'knowledge-bases') return { knowledge_bases: [] } as T
    if (pathParts[0] === 'pipelines') return { pipelines: [] } as T
    if (pathParts[0] === 'triggers') return { triggers: [] } as T
  }
  return {} as T
}

export function useMockApi() {
  return { mockFetch, MOCK_IDS, setSimulateErrorNext }
}
