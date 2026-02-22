import { a as useState } from './useMockMode-j3YD3gix.mjs';

const STORAGE_KEY = "aploy-environment";
function useEnvironment() {
  const env = useState(STORAGE_KEY, () => "sandbox");
  function setEnvironment(value) {
    env.value = value;
  }
  return { environment: env, setEnvironment };
}

export { useEnvironment as u };
//# sourceMappingURL=useEnvironment-BnZbXQTt.mjs.map
