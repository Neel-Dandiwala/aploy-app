<template>
  <div class="app-page">
    <h2 class="text-lg font-semibold text-zinc-900 mb-4">Deploy / API</h2>
    <p v-if="loading" class="text-muted-foreground text-sm">Loading…</p>
    <p v-else-if="error" class="app-error">{{ error }}</p>
    <div v-else class="grid gap-4">
      <AppCard v-if="deployments.length">
        <h3 class="app-section-title mb-4">Deployments</h3>
        <div class="space-y-4">
          <div
            v-for="d in deployments"
            :key="d.id"
            class="rounded-app border border-border/50 p-4"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="font-mono text-sm">{{ d.id }}</span>
              <span
                class="px-2 py-0.5 rounded text-xs font-medium"
                :class="d.status === 'ready' || d.status === 'active' ? 'bg-emerald-500/20 text-emerald-600' : 'bg-amber-500/20 text-amber-600'"
              >
                {{ d.status }}
              </span>
            </div>
            <div v-if="d.endpoint_url" class="mt-2 space-y-2">
              <label class="app-label text-xs">Endpoint</label>
              <p class="font-mono text-sm text-muted-foreground truncate">{{ d.endpoint_url }}</p>
              <label class="app-label text-xs block mt-2">API key</label>
              <p class="text-sm text-muted-foreground">Use your workspace API key from Settings → Team.</p>
            </div>
            <div v-if="(d.status === 'ready' || d.status === 'active') && d.endpoint_url" class="mt-4">
              <label class="app-label text-sm">Try it</label>
              <div class="flex gap-2 mt-1">
                <input
                  v-model="prompts[d.id]"
                  type="text"
                  placeholder="Enter a prompt..."
                  class="app-input flex-1 py-2"
                  @keydown.enter="invoke(d.id)"
                />
                <AppButton :disabled="invoking === d.id" @click="invoke(d.id)">
                  {{ invoking === d.id ? '…' : 'Generate' }}
                </AppButton>
              </div>
              <div v-if="responses[d.id]" class="mt-2 p-3 rounded-app bg-surface-overlay text-sm border border-border">
                {{ responses[d.id] }}
              </div>
            </div>
            <p v-else class="text-sm text-muted-foreground mt-2">Deployment not ready yet.</p>
          </div>
        </div>
      </AppCard>
      <AppCard v-else>
        <h3 class="app-section-title mb-2">No deployments yet</h3>
        <p class="text-sm text-muted-foreground mb-4">
          Complete a successful training run, then deploy your model from the
          <NuxtLink to="/app/registry" class="text-accent">Registry</NuxtLink> or
          <NuxtLink to="/app/deployments" class="text-accent">Deployments</NuxtLink>.
        </p>
        <AppButton to="/app/deployments/new">Deploy a model</AppButton>
      </AppCard>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

definePageMeta({ layout: 'app' })

export default defineComponent({
  name: 'ProjectDeploy',
  data() {
    return {
      deployments: [] as Array<{ id: string; status: string; endpoint_url?: string | null }>,
      prompts: {} as Record<string, string>,
      responses: {} as Record<string, string>,
      loading: true,
      invoking: null as string | null,
      error: '',
    }
  },
  setup() {
    const { apiFetch } = useAployApi()
    return { apiFetch }
  },
  async mounted() {
    await this.load()
  },
  methods: {
    async load() {
      const id = (this.$route.params as { id: string }).id
      this.loading = true
      this.error = ''
      try {
        const data = await this.apiFetch<{ deployments: Array<{ id: string; status: string; endpoint_url?: string | null }> }>(`/api/projects/${id}/deployments`)
        this.deployments = data.deployments || []
      } catch (e) {
        this.error = (e as Error).message || 'Failed to load deployments'
      } finally {
        this.loading = false
      }
    },
    async invoke(deploymentId: string) {
      const prompt = this.prompts[deploymentId]
      if (!prompt?.trim()) return

      this.invoking = deploymentId
      try {
        const data = await this.apiFetch<{ output?: string; choices?: Array<{ text?: string }> }>(`/v1/deployments/${deploymentId}/invoke`, {
          method: 'POST',
          body: { prompt: prompt.trim(), max_tokens: 256 },
        })
        const text = (data as { output?: string })?.output
          || (data as { choices?: Array<{ text?: string }> })?.choices?.[0]?.text
          || JSON.stringify(data)
        this.responses = { ...this.responses, [deploymentId]: text }
      } catch (e) {
        this.responses = { ...this.responses, [deploymentId]: `Error: ${(e as Error).message}` }
      } finally {
        this.invoking = null
      }
    },
  },
})
</script>
