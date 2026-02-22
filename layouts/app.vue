<template>
  <div class="flex min-h-screen bg-surface">
    <aside class="w-56 shrink-0 flex flex-col border-r border-border">
      <div class="p-4 border-b border-border">
        <NuxtLink to="/" class="text-lg font-semibold text-white tracking-tight">Aploy</NuxtLink>
      </div>
      <nav class="flex-1 p-3 space-y-0.5">
        <NuxtLink
          v-for="item in nav"
          :key="item.href"
          :to="item.href"
          class="flex items-center rounded-app px-3 py-2 text-sm text-muted-foreground hover:bg-white/[0.04] hover:text-white transition-colors"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>
      <div class="p-3 border-t border-border">
        <NuxtLink
          to="/"
          class="flex items-center rounded-app px-3 py-2 text-sm text-muted hover:text-muted-foreground transition-colors"
        >
          Back to home
        </NuxtLink>
      </div>
    </aside>
    <div class="flex-1 flex flex-col min-w-0">
      <header class="flex items-center justify-end gap-3 px-6 py-3 border-b border-border shrink-0">
        <span class="text-sm text-muted">Environment</span>
        <select
          :value="environment"
          class="app-input w-auto min-w-[120px] py-1.5 text-sm"
          @change="onEnvironmentChange"
        >
          <option value="sandbox">Sandbox</option>
          <option value="production">Production</option>
        </select>
      </header>
      <main class="flex-1 overflow-auto">
        <slot />
      </main>
    </div>
    <ChatPanel />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ChatPanel from '~/components/ChatPanel.vue'

const STORAGE_KEY = 'aploy-environment'

export default defineComponent({
  name: 'AppLayout',
  components: { ChatPanel },
  data() {
    return {
      environment: 'sandbox' as 'sandbox' | 'production',
      nav: [
        { href: '/app', label: 'Dashboard' },
        { href: '/app/datasets', label: 'Datasets' },
        { href: '/app/projects', label: 'Projects' },
        { href: '/app/runs', label: 'Runs' },
        { href: '/app/evaluations', label: 'Evaluations' },
        { href: '/app/registry', label: 'Registry' },
        { href: '/app/deployments', label: 'Deployments' },
        { href: '/app/knowledge-bases', label: 'Knowledge bases' },
        { href: '/app/pipelines', label: 'Pipelines' },
        { href: '/app/triggers', label: 'Triggers' },
        { href: '/app/api-explorer', label: 'API Explorer' },
        { href: '/app/billing', label: 'Billing' },
        { href: '/app/settings', label: 'Settings' },
        { href: '/app/integrations', label: 'Integrations' },
        { href: '/app/org', label: 'Org' },
      ],
    }
  },
  mounted() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === 'sandbox' || stored === 'production') {
        this.environment = stored
        this.syncEnvironmentToState(stored)
      }
    } catch (_) {}
  },
  methods: {
    syncEnvironmentToState(value: 'sandbox' | 'production') {
      const { setEnvironment } = useEnvironment()
      setEnvironment(value)
    },
    onEnvironmentChange(e: Event) {
      const target = e.target as HTMLSelectElement
      const value = target?.value as 'sandbox' | 'production'
      if (value !== 'sandbox' && value !== 'production') return
      this.environment = value
      try {
        localStorage.setItem(STORAGE_KEY, value)
      } catch (_) {}
      this.syncEnvironmentToState(value)
    },
  },
})
</script>
