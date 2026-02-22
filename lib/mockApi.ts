/**
 * Frontend-only mock API for when backend is not deployed.
 * Returns realistic, consistent data so the full user journey works.
 */

const NOW = new Date().toISOString()

// Stable IDs used across list/detail so navigation works
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
} as const

// Optional: increment to simulate one failure on next request (for testing error UI)
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

export async function mockFetch<T = unknown>(
  path: string,
  options: { method?: string; body?: unknown; query?: Record<string, string> } = {}
): Promise<T> {
  const method = (options.method || 'GET').toUpperCase()

  maybeSimulateError()

  // Normalize path: strip query string for matching
  const pathOnly = path.replace(/\?.*$/, '')
  const pathParts = pathOnly.replace(/^\/api\/?/, '').split('/').filter(Boolean)

  // --- Projects ---
  if (pathParts[0] === 'projects' && pathParts.length === 1) {
    if (method === 'GET') {
      return {
        projects: [
          {
            id: MOCK_IDS.project,
            name: 'Support Bot',
            base_model: 'mistralai/Mistral-7B-v0.2',
            objective: 'dpo',
            created_at: NOW,
          },
        ],
      } as T
    }
    if (method === 'POST') {
      const body = options.body as { name?: string; base_model?: string; objective?: string }
      return {
        id: MOCK_IDS.project,
      } as T
    }
  }

  // --- Datasets ---
  if (pathParts[0] === 'datasets') {
    if (pathParts.length === 1) {
      if (method === 'GET') {
        return {
          datasets: [
            {
              id: MOCK_IDS.dataset,
              name: 'Support chat v1',
              status: 'ready',
              row_count: 10200,
              created_at: NOW,
            },
          ],
        } as T
      }
      if (method === 'POST') {
        return { id: MOCK_IDS.dataset } as T
      }
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

  // --- Runs ---
  if (pathParts[0] === 'runs') {
    if (pathParts.length === 1) {
      if (method === 'GET') {
        return {
          runs: [
            {
              id: MOCK_IDS.run,
              project_id: MOCK_IDS.project,
              status: 'succeeded',
              duration_sec: 7200,
              cost_usd: 14.2,
              created_at: NOW,
            },
          ],
        } as T
      }
      if (method === 'POST') {
        return { id: MOCK_IDS.run } as T
      }
    }
  }

  // --- Deploy (list/create) ---
  if (pathParts[0] === 'deploy') {
    if (method === 'GET') {
      return {
        deployments: [
          {
            id: MOCK_IDS.deployment,
            model_version_id: 'mv_1',
            type: 'api',
            status: 'live',
            endpoint_url: 'https://api.aploy.dev/v1/deployments/dep_mock1/invoke',
            created_at: NOW,
          },
        ],
      } as T
    }
    if (method === 'POST') {
      return undefined as T
    }
  }

  // --- Org ---
  if (pathParts[0] === 'org') {
    if (pathParts.length === 1 && method === 'GET') {
      return { name: 'Acme Inc', slug: MOCK_IDS.orgSlug } as T
    }
    if (pathParts[1] === 'api-keys') {
      if (pathParts.length === 2) {
        if (method === 'GET') {
          return {
            api_keys: [
              {
                id: MOCK_IDS.apiKey,
                name: 'Production',
                key_prefix: 'aploy_',
                last_used_at: null,
              },
            ],
          } as T
        }
        if (method === 'POST') {
          return { raw_key: 'aploy_mock_' + Math.random().toString(36).slice(2) } as T
        }
      }
      if (pathParts.length === 3 && method === 'DELETE') {
        return undefined as T
      }
    }
    if (pathParts[1] === 'credentials') {
      if (pathParts.length === 2) {
        if (method === 'GET') {
          return {
            credentials: [
              { id: MOCK_IDS.credential, name: 'AWS prod', type: 's3', status: 'ok', last_tested_at: NOW },
            ],
          } as T
        }
        if (method === 'POST') {
          return undefined as T
        }
      }
      if (pathParts.length === 3) {
        if (pathParts[2] === 'test' && method === 'POST') {
          return { ok: true } as T
        }
        if (method === 'DELETE') {
          return undefined as T
        }
      }
    }
  }

  // --- Knowledge bases ---
  if (pathParts[0] === 'knowledge-bases') {
    if (pathParts.length === 1) {
      if (method === 'GET') {
        return {
          knowledge_bases: [
            { id: MOCK_IDS.knowledgeBase, name: 'Product docs', status: 'ready', chunk_count: 1200 },
          ],
        } as T
      }
      if (method === 'POST') {
        return { id: MOCK_IDS.knowledgeBase } as T
      }
    }
    if (pathParts.length === 2 && pathParts[1] !== 'new') {
      const id = pathParts[1]
      if (method === 'GET') {
        return {
          id,
          name: 'Product docs',
          status: 'ready',
          chunk_count: 1200,
          source: { type: 'upload' },
          embedding_model: 'text-embedding-3-small',
          embedding_dimension: 1536,
          chunk_config: { size: 512, overlap: 64 },
        } as T
      }
      if (pathParts.length === 3 && pathParts[2] === 'ingest' && method === 'POST') {
        return { status: 'ready', chunk_count: 1200 } as T
      }
    }
  }

  // --- Pipelines ---
  if (pathParts[0] === 'pipelines') {
    if (pathParts.length === 1) {
      if (method === 'GET') {
        return {
          pipelines: [
            { id: MOCK_IDS.pipeline, name: 'Summarize then classify', description: '', steps: [], created_at: NOW },
          ],
        } as T
      }
      if (method === 'POST') {
        return { id: MOCK_IDS.pipeline } as T
      }
    }
    if (pathParts.length === 2 && pathParts[1] !== 'new') {
      const id = pathParts[1]
      if (method === 'GET') {
        return {
          id,
          name: 'Summarize then classify',
          description: '',
          steps: [{ id: 'step1', type: 'model', name: 'step1' }],
        } as T
      }
    }
  }

  // --- Triggers ---
  if (pathParts[0] === 'triggers') {
    if (pathParts.length === 1) {
      if (method === 'GET') {
        return {
          triggers: [
            {
              id: MOCK_IDS.trigger,
              pipeline_id: MOCK_IDS.pipeline,
              name: 'Webhook',
              type: 'webhook',
              status: 'active',
              webhook_url: 'https://api.aploy.dev/webhooks/trig_mock1',
            },
          ],
        } as T
      }
      if (method === 'POST') {
        return undefined as T
      }
    }
    if (pathParts.length === 2 && method === 'DELETE') {
      return undefined as T
    }
  }

  // --- Billing ---
  if (pathParts[0] === 'billing') {
    if (pathParts[1] === 'usage' && method === 'GET') {
      return {
        period_start: new Date().toISOString().slice(0, 10),
        period_end: new Date().toISOString().slice(0, 10),
        compute_gpu_hours: 24.5,
        storage_gb_months: 120,
        total_usd: 42.5,
        forecast_usd: 55,
      } as T
    }
    if (pathParts[1] === 'invoices' && method === 'GET') {
      return { invoices: [] } as T
    }
    if (pathParts[1] === 'setup-customer' && method === 'POST') {
      return { stripe_customer_id: 'cus_mock' } as T
    }
  }

  // Fallback: return empty/ok so UI doesn't break
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
