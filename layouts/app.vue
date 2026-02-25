<template>
  <div class="flex min-h-screen bg-surface">
    <aside class="w-56 shrink-0 flex flex-col border-r border-border bg-surface-elevated">
      <div class="p-4 border-b border-border">
        <NuxtLink to="/" class="text-lg font-semibold text-zinc-900 tracking-tight transition-colors hover:text-accent">Aploy</NuxtLink>
      </div>
      <nav class="flex-1 p-3 overflow-auto space-y-4">
        <div>
          <NuxtLink
            :to="navOverview.href"
            :title="navOverview.subtitle"
            class="flex items-center rounded-app px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-surface-overlay transition-colors duration-app"
          >
            {{ navOverview.label }}
          </NuxtLink>
        </div>
        <div>
          <p class="px-3 py-1 text-[11px] font-semibold text-muted-foreground/90 uppercase tracking-wider">Training</p>
          <NuxtLink
            v-for="item in navTraining"
            :key="item.href"
            :to="item.href"
            :title="item.subtitle"
            class="flex items-center rounded-app px-3 py-2 text-sm text-muted-foreground hover:bg-surface-overlay hover:text-zinc-900 transition-colors duration-app"
          >
            {{ item.label }}
          </NuxtLink>
        </div>
        <div>
          <p class="px-3 py-1 text-[11px] font-semibold text-muted-foreground/90 uppercase tracking-wider">Live & use</p>
          <NuxtLink
            v-for="item in navLive"
            :key="item.href"
            :to="item.href"
            :title="item.subtitle"
            class="flex items-center rounded-app px-3 py-2 text-sm text-muted-foreground hover:bg-surface-overlay hover:text-zinc-900 transition-colors duration-app"
          >
            {{ item.label }}
          </NuxtLink>
        </div>
        <div>
          <p class="px-3 py-1 text-[11px] font-semibold text-muted-foreground/90 uppercase tracking-wider">Automations</p>
          <NuxtLink
            v-for="item in navAutomations"
            :key="item.href"
            :to="item.href"
            :title="item.subtitle"
            class="flex items-center rounded-app px-3 py-2 text-sm text-muted-foreground hover:bg-surface-overlay hover:text-zinc-900 transition-colors duration-app"
          >
            {{ item.label }}
          </NuxtLink>
        </div>
        <div>
          <p class="px-3 py-1 text-[11px] font-semibold text-muted-foreground/90 uppercase tracking-wider">Account & help</p>
          <NuxtLink
            v-for="item in navAccount"
            :key="item.href"
            :to="item.href"
            :title="item.subtitle"
            class="flex items-center rounded-app px-3 py-2 text-sm text-muted-foreground hover:bg-surface-overlay hover:text-zinc-900 transition-colors duration-app"
          >
            {{ item.label }}
          </NuxtLink>
        </div>
        <div>
          <p class="px-3 py-1 text-[11px] font-semibold text-muted-foreground/90 uppercase tracking-wider">For developers</p>
          <NuxtLink
            v-for="item in navDevelopers"
            :key="item.href"
            :to="item.href"
            :title="item.subtitle"
            class="flex items-center rounded-app px-3 py-2 text-sm text-muted-foreground hover:bg-surface-overlay hover:text-zinc-900 transition-colors duration-app"
          >
            {{ item.label }}
          </NuxtLink>
        </div>
      </nav>
      <div class="p-3 border-t border-border">
        <NuxtLink
          to="/"
          class="flex items-center rounded-app px-3 py-2 text-sm text-muted-foreground hover:bg-surface-overlay hover:text-zinc-900 transition-colors duration-app"
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
      navOverview: { href: '/app', label: 'Dashboard', subtitle: 'Usage, journey, and overview' },
      navTraining: [
        { href: '/app/projects', label: 'Projects', subtitle: 'What you\'re training (model + goal)' },
        { href: '/app/datasets', label: 'Data', subtitle: 'Your training data' },
        { href: '/app/runs', label: 'Training runs', subtitle: 'Past and current jobs' },
        { href: '/app/evaluations', label: 'Compare results', subtitle: 'Baseline vs tuned model' },
        { href: '/app/registry', label: 'Saved models', subtitle: 'Model versions from runs' },
      ],
      navLive: [
        { href: '/app/deployments', label: 'Live models', subtitle: 'Models you can call now' },
        { href: '/app/deployments/try', label: 'Try your model', subtitle: 'Test with a simple prompt' },
        { href: '/app/knowledge-bases', label: 'Your docs', subtitle: 'Docs for search in flows' },
      ],
      navAutomations: [
        { href: '/app/pipelines', label: 'Flows', subtitle: 'Chain steps (e.g. search docs → model)' },
        { href: '/app/triggers', label: 'Webhooks', subtitle: 'Run flows from Zapier or your app' },
      ],
      navAccount: [
        { href: '/app/billing', label: 'Billing', subtitle: 'Usage and payment' },
        { href: '/app/settings', label: 'Settings', subtitle: 'Profile and security' },
        { href: '/app/integrations', label: 'Connections', subtitle: 'Cloud and API credentials' },
        { href: '/app/org', label: 'Team', subtitle: 'Members and API keys' },
        { href: '/app/glossary', label: 'Concepts', subtitle: 'Learn key terms' },
      ],
      navDevelopers: [
        { href: '/app/api-explorer', label: 'API Explorer', subtitle: 'Send JSON to your model' },
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
