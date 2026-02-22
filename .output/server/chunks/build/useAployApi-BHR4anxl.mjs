import { a as useRuntimeConfig } from './server.mjs';
import { u as useEnvironment } from './useEnvironment-BxGroLsJ.mjs';

function useAployApi() {
  const config = useRuntimeConfig();
  const apiUrl = config.public.apiUrl || "http://localhost:4000";
  const { environment } = useEnvironment();
  function apiHeaders() {
    return {
      "X-Environment": environment.value
    };
  }
  async function apiFetch(path, options = {}) {
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
//# sourceMappingURL=useAployApi-BHR4anxl.mjs.map
