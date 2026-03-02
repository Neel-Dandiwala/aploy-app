<template>
  <div class="app-page">
    <h2 class="text-lg font-semibold text-zinc-900 mb-4">Runs</h2>
    <p v-if="loading" class="text-muted-foreground text-sm">Loading…</p>
    <p v-else-if="error" class="app-error">{{ error }}</p>
    <div v-else class="app-table-wrap">
      <table class="app-table">
        <thead>
          <tr>
            <th>Run</th>
            <th>Type</th>
            <th>Status</th>
            <th>Created</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in runs" :key="r.id">
            <td class="font-mono text-sm">{{ r.id.slice(-8) }}</td>
            <td class="text-muted-foreground">{{ r.type }}</td>
            <td>
              <span
                class="inline-flex px-2 py-0.5 rounded text-xs font-medium"
                :class="r.status_color === 'green' ? 'bg-emerald-100 text-emerald-700' : r.status_color === 'red' ? 'bg-red-100 text-red-700' : 'bg-zinc-200 text-zinc-600'"
              >
                {{ r.status }}
              </span>
            </td>
            <td class="text-muted text-sm">{{ formatDate(r.created_at) }}</td>
            <td>
              <NuxtLink :to="`/app/runs/${r.id}`" class="text-accent hover:text-accent-hover text-sm">
                Logs
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!loading && !error && runs.length === 0" class="app-empty text-center py-8 px-4">
        <p class="font-medium text-zinc-900 mb-1">No runs yet</p>
        <p class="text-sm text-muted-foreground">Run a quick test from the Script tab, then start training.</p>
        <NuxtLink :to="`/app/projects/${$route.params.id}/script`">
          <AppButton class="mt-4">Go to Script</AppButton>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

definePageMeta({ layout: 'app' })

export default defineComponent({
  name: 'ProjectRuns',
  data() {
    return {
      runs: [] as Array<{ id: string; type: string; status: string; status_color: string; created_at: string }>,
      loading: true,
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
    formatDate(d?: string) {
      if (!d) return '—'
      try {
        return new Date(d).toLocaleString()
      } catch {
        return d
      }
    },
    async load() {
      const id = (this.$route.params as { id: string }).id
      this.loading = true
      this.error = ''
      try {
        const data = await this.apiFetch<{ runs: Array<{ id: string; type: string; status: string; status_color: string; created_at: string }> }>(`/api/runs?project_id=${id}`)
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
