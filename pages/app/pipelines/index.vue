<template>
  <div class="app-page">
    <AppPageHeader title="Pipelines">
      <template #actions>
        <AppButton to="/app/pipelines/new">New pipeline</AppButton>
      </template>
    </AppPageHeader>
    <p v-if="loading" class="text-muted-foreground text-sm">Loading…</p>
    <p v-else-if="error" class="app-error">{{ error }}</p>
    <div v-else class="app-table-wrap">
      <table class="app-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Steps</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in pipelines" :key="p.id">
            <td>
              <NuxtLink :to="`/app/pipelines/${p.id}`" class="text-accent hover:underline">{{ p.name }}</NuxtLink>
            </td>
            <td class="text-muted-foreground">{{ (p.steps || []).length }} steps</td>
            <td class="text-muted-foreground text-sm">{{ formatDate(p.created_at) }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="!loading && !error && pipelines.length === 0" class="app-empty text-center py-8 px-4">
        <p class="font-medium text-zinc-900 mb-1">No pipelines yet</p>
        <p class="text-sm text-muted-foreground mb-4">Pipelines chain steps like "search your docs" and "call your model" so you can build flows (e.g. chat with your docs) without writing code.</p>
        <AppButton to="/app/pipelines/new">New pipeline</AppButton>
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

interface PipelineItem {
  id: string
  name: string
  description?: string
  steps?: unknown[]
  created_at?: string
}

export default defineComponent({
  name: 'PipelinesList',
  data() {
    return {
      pipelines: [] as PipelineItem[],
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
        const data = await this.apiFetch<{ pipelines: PipelineItem[] }>('/api/pipelines')
        this.pipelines = data.pipelines || []
      } catch (e) {
        this.error = (e as Error).message || 'Failed to load pipelines'
      } finally {
        this.loading = false
      }
    },
    formatDate(iso?: string) {
      if (!iso) return '—'
      try {
        return new Date(iso).toLocaleDateString()
      } catch {
        return iso
      }
    },
  },
})
</script>
