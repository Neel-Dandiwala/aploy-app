<template>
  <div class="app-page">
    <AppPageHeader
      :title="`Try your model — ${project?.name ?? 'Project'}`"
      description="Test inference with sample prompts. Deploy a model first if you haven't."
      :back-to="`/app/projects/${$route.params.id}`"
      back-label="Project"
    />
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
                :class="d.status === 'live' ? 'bg-emerald-500/20 text-emerald-600' : 'bg-amber-500/20 text-amber-600'"
              >
                {{ d.status }}
              </span>
            </div>
            <p v-if="d.endpoint_url" class="text-xs text-muted-foreground truncate">{{ d.endpoint_url }}</p>
            <div v-if="d.status === 'live'" class="mt-3">
              <label class="app-label text-sm">Try a prompt</label>
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
            <p v-else class="text-sm text-muted-foreground mt-2">Deployment not ready. Deploy from Registry or Deployments.</p>
          </div>
        </div>
      </AppCard>
      <AppCard v-else>
        <h3 class="app-section-title mb-2">No deployments yet</h3>
        <p class="text-sm text-muted-foreground mb-4">
          Deploy a model from the <NuxtLink to="/app/registry" class="text-accent">Registry</NuxtLink> or
          <NuxtLink to="/app/deployments" class="text-accent">Deployments</NuxtLink> to try inference here.
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
  name: 'ProjectTrial',
  data() {
    return {
      project: null as { name?: string } | null,
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
    const id = (this.$route.params as { id: string }).id
    await this.$router.replace(`/app/projects/${id}/deploy`)
  },
  methods: {
    async loadProject() {
      const id = (this.$route.params as { id: string }).id
      try {
        this.project = await this.apiFetch<{ name?: string }>(`/api/projects/${id}`)
      } catch {
        this.project = null
      }
    },
    async loadDeployments() {
      this.loading = true
      this.error = ''
      try {
        const data = await this.apiFetch<{ deployments: Array<{ id: string; status: string; endpoint_url?: string | null }> }>('/api/deploy')
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
