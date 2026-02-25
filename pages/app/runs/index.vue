<template>
  <div class="app-page">
    <AppPageHeader
      title="Runs"
      description="Training jobs. See status, duration, cost, and open a run to view metrics and deploy."
    />
    <p v-if="loading" class="text-muted-foreground text-sm">Loading…</p>
    <p v-else-if="error" class="app-error">{{ error }}</p>
    <div v-else class="app-table-wrap">
      <table class="app-table">
        <thead>
          <tr>
            <th>Run</th>
            <th>Status</th>
            <th>Duration</th>
            <th>Cost</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in runs" :key="r.id">
            <td class="font-mono text-zinc-900 text-sm">{{ r.id }}</td>
            <td :class="r.status === 'succeeded' ? 'text-emerald-500' : 'text-amber-500'">{{ r.status }}</td>
            <td class="text-muted-foreground">{{ r.duration_sec ? `${Math.round(r.duration_sec / 3600)}h` : '—' }}</td>
            <td class="text-muted-foreground">{{ r.cost_usd != null ? `$${r.cost_usd}` : '—' }}</td>
            <td>
              <NuxtLink
                :to="`/app/runs/${r.id}`"
                class="text-accent hover:text-accent-hover text-sm transition-colors"
              >
                Dashboard
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!loading && !error && runs.length === 0" class="app-empty text-center py-8 px-4">
        <p class="font-medium text-zinc-900 mb-1">No runs yet</p>
        <p class="text-sm text-muted-foreground mb-4">A run is one training job. Start one from a project (pick dataset and config); you'll see status, logs, and cost here.</p>
        <AppButton to="/app/training/new">Start training</AppButton>
        <p class="mt-3">
          <NuxtLink to="/app/glossary" class="text-sm text-accent hover:text-accent-hover">Learn key concepts</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

definePageMeta({ layout: 'app' })

export default defineComponent({
  name: 'RunsList',
  data() {
    return {
      runs: [] as Array<{ id: string; project_id?: string; status: string; duration_sec?: number; cost_usd?: number; created_at?: string }>,
      loading: true,
      error: '',
    }
  },
  setup() {
    const { apiFetch } = useAployApi()
    return { apiFetch }
  },
  async mounted() {
    await this.loadRuns()
  },
  methods: {
    async loadRuns() {
      this.loading = true
      this.error = ''
      try {
        const data = await this.apiFetch<{ runs: Array<{ id: string; project_id?: string; status: string; duration_sec?: number; cost_usd?: number; created_at?: string }> }>('/api/runs')
        this.runs = data.runs || []
      } catch (e) {
        this.error = (e as Error).message || 'Failed to load runs'
      } finally {
        this.loading = false
      }
    },
  },
})
</script>
