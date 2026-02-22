<template>
  <div class="min-h-screen flex flex-col items-center justify-center gap-8 p-8 bg-surface">
    <h1 class="text-4xl font-bold text-zinc-900 tracking-tight">Aploy</h1>
    <p class="text-muted-foreground text-center max-w-md">
      Stripe/Vercel for LLM training. One API + UI for fine-tuning, DPO, and deployment.
    </p>
    <div class="flex flex-wrap justify-center gap-3">
      <button
        type="button"
        class="rounded-app bg-accent px-4 py-2 text-sm font-medium text-white shadow-app-sm hover:bg-accent-hover transition-colors duration-app focus:outline-none focus:ring-2 focus:ring-accent/30 focus:ring-offset-2 focus:ring-offset-surface"
        @click="startMock"
      >
        Start Mock
      </button>
      <NuxtLink
        to="/login"
        class="rounded-app border border-border bg-surface-elevated px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-surface-overlay hover:text-zinc-900 transition-colors duration-app"
      >
        Sign in with Google
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomePage',
  layout: 'blank',
  setup() {
    const { setMockMode } = useMockMode()
    function startMock() {
      setMockMode(true)
      navigateTo('/app')
    }
    return { startMock }
  },
})
</script>
