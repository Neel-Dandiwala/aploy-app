<template>
  <div class="app-page">
    <AppPageHeader title="Datasets">
      <template #actions>
        <AppButton to="/app/datasets/new">Add dataset</AppButton>
      </template>
    </AppPageHeader>
    <p v-if="loading" class="text-muted-foreground text-sm">Loading…</p>
    <p v-else-if="error" class="app-error">{{ error }}</p>
    <div v-else class="app-table-wrap">
      <table class="app-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Rows</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in datasets" :key="d.id">
            <td class="font-medium text-zinc-900">{{ d.name }}</td>
            <td class="text-emerald-500">{{ d.status }}</td>
            <td class="text-muted-foreground">{{ d.row_count?.toLocaleString() }}</td>
            <td>
              <NuxtLink
                :to="`/app/datasets/${d.id}`"
                class="text-accent hover:text-accent-hover text-sm transition-colors"
              >
                Preview
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!loading && !error && datasets.length === 0" class="app-empty">
        No datasets yet. Add one to get started.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

definePageMeta({ layout: 'app' })

export default defineComponent({
  name: 'DatasetsList',
  data() {
    return {
      datasets: [] as Array<{ id: string; name: string; status: string; row_count?: number; created_at?: string }>,
      loading: true,
      error: '',
    }
  },
  setup() {
    const { apiFetch } = useAployApi()
    return { apiFetch }
  },
  async mounted() {
    await this.loadDatasets()
  },
  methods: {
    async loadDatasets() {
      this.loading = true
      this.error = ''
      try {
        const data = await this.apiFetch<{ datasets: Array<{ id: string; name: string; status: string; row_count?: number; created_at?: string }> }>('/api/datasets')
        this.datasets = data.datasets || []
      } catch (e) {
        this.error = (e as Error).message || 'Failed to load datasets'
      } finally {
        this.loading = false
      }
    },
  },
})
</script>
