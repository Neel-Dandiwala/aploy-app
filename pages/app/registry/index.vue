<template>
  <div class="app-page">
    <AppPageHeader title="Model registry" />
    <p v-if="loading" class="text-muted-foreground text-sm">Loading…</p>
    <p v-else-if="error" class="app-error">{{ error }}</p>
    <div v-else class="app-table-wrap">
      <table class="app-table">
        <thead>
          <tr>
            <th>Version</th>
            <th>Run</th>
            <th>Created</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in models" :key="m.id">
            <td class="font-mono text-zinc-900 text-sm">{{ m.id }}</td>
            <td class="text-muted-foreground">{{ m.run_id }}</td>
            <td class="text-muted text-sm">{{ formatDate(m.created_at) }}</td>
            <td>
              <NuxtLink
                :to="`/app/deployments/new?model=${m.id}`"
                class="text-accent hover:text-accent-hover text-sm transition-colors"
              >
                Deploy
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!loading && !error && models.length === 0" class="app-empty">No model versions yet. Complete a training run to add models here.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

definePageMeta({ layout: 'app' })

export default defineComponent({
  name: 'RegistryList',
  data() {
    return {
      models: [] as Array<{ id: string; project_id?: string; run_id?: string; created_at?: string }>,
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
    async load() {
      this.loading = true
      this.error = ''
      try {
        const data = await this.apiFetch<{ models: Array<{ id: string; project_id?: string; run_id?: string; created_at?: string }> }>('/api/registry')
        this.models = data.models || []
      } catch (e) {
        this.error = (e as Error).message || 'Failed to load registry'
      } finally {
        this.loading = false
      }
    },
    formatDate(created_at?: string) {
      if (!created_at) return '—'
      try {
        return new Date(created_at).toLocaleDateString()
      } catch {
        return created_at
      }
    },
  },
})
</script>
