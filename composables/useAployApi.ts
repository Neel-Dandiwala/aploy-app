import type { UseFetchOptions } from 'nuxt/app'

/**
 * Returns options and helpers for calling the Aploy API with the current
 * environment (X-Environment: sandbox | production). SANDBOX = mock data,
 * Production = real DB scoped by workspace/user.
 */
export function useAployApi() {
  const config = useRuntimeConfig()
  const apiUrl = (config.public.apiUrl as string) || 'http://localhost:4000'
  const { environment } = useEnvironment()

  function apiHeaders(): Record<string, string> {
    return {
      'X-Environment': environment.value,
    }
  }

  async function apiFetch<T>(
    path: string,
    options: { method?: string; body?: unknown; query?: Record<string, string> } = {}
  ): Promise<T> {
    const url = path.startsWith('http') ? path : `${apiUrl}${path}`
    return $fetch<T>(url, {
      ...options,
      credentials: 'include',
      headers: {
        ...apiHeaders(),
        ...(options.headers as Record<string, string>),
      },
    })
  }

  return { apiUrl, apiHeaders, apiFetch, environment }
}
