<template>
  <div class="app-page">
    <AppPageHeader title="Runs" />
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
      <p v-if="!loading && !error && runs.length === 0" class="app-empty">
        No runs yet.
      </p>
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
