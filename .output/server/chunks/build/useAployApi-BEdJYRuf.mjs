import { a as useRuntimeConfig } from './server.mjs';
import { u as useEnvironment } from './useEnvironment-BnZbXQTt.mjs';
import { u as useMockMode } from './useMockMode-j3YD3gix.mjs';
import { u as useMockApi } from './useMockApi-CJyUoVJj.mjs';

function useAployApi() {
  const config = useRuntimeConfig();
  const apiUrl = config.public.apiUrl || "http://localhost:4000";
  const { environment } = useEnvironment();
  const { mockMode } = useMockMode();
  function apiHeaders() {
    return {
      "X-Environment": environment.value
    };
  }
  async function apiFetch(path, options = {}) {
    if (mockMode.value) {
      const { mockFetch } = useMockApi();
      return mockFetch(path, options);
    }
    const url = path.startsWith("http") ? path : `${apiUrl}${path}`;
    return $fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        ...apiHeaders(),
        ...options.headers
      }
    });
  }
  return { apiUrl, apiHeaders, apiFetch, environment };
}

export { useAployApi as u };
//# sourceMappingURL=useAployApi-BEdJYRuf.mjs.map
