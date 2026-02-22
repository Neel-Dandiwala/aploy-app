const STORAGE_KEY = 'aploy-environment'

export type Environment = 'sandbox' | 'production'

export function useEnvironment() {
  const env = useState<Environment>(STORAGE_KEY, () => 'sandbox')

  function setEnvironment(value: Environment) {
    env.value = value
    if (import.meta.client && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, value)
      } catch (_) {}
    }
  }

  return { environment: env, setEnvironment }
}
