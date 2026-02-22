import { toRef, isRef } from 'vue';
import { c as useNuxtApp } from './server.mjs';

const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxtApp = useNuxtApp();
  const state = toRef(nuxtApp.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxtApp.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
const STORAGE_KEY = "aploy-mock-mode";
function useMockMode() {
  const mockMode = useState(STORAGE_KEY, () => false);
  function setMockMode(on) {
    mockMode.value = on;
  }
  return { mockMode, setMockMode };
}

export { useState as a, useMockMode as u };
//# sourceMappingURL=useMockMode-j3YD3gix.mjs.map
