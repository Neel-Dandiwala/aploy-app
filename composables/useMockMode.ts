const STORAGE_KEY = 'aploy-mock-mode'
let hydrated = false

export function useMockMode() {
  const mockMode = useState<boolean>(STORAGE_KEY, () => false)

  function setMockMode(on: boolean) {
    mockMode.value = on
    if (import.meta.client && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, on ? '1' : '0')
      } catch (_) {}
    }
  }

  if (import.meta.client && typeof localStorage !== 'undefined' && !hydrated) {
    hydrated = true
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === '1') mockMode.value = true
      else if (stored === '0') mockMode.value = false
    } catch (_) {}
  }

  return { mockMode, setMockMode }
}
