<template>
  <div class="app-page">
    <AppPageHeader title="Projects">
      <template #actions>
        <AppButton to="/app/projects/new">Create project</AppButton>
      </template>
    </AppPageHeader>
    <p v-if="loading" class="text-muted-foreground text-sm">Loading…</p>
    <p v-else-if="error" class="app-error">{{ error }}</p>
    <div v-else class="app-table-wrap">
      <table class="app-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Base model</th>
            <th>Objective</th>
            <th>Created</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in projects" :key="p.id">
            <td class="font-medium text-zinc-900">{{ p.name }}</td>
            <td class="text-muted-foreground">{{ p.base_model }}</td>
            <td class="text-muted-foreground">{{ p.objective }}</td>
            <td class="text-muted text-sm">{{ formatDate(p.created_at) }}</td>
            <td>
              <NuxtLink
                :to="`/app/projects/${p.id}`"
                class="text-accent hover:text-accent-hover text-sm transition-colors"
              >
                Open
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!loading && !error && projects.length === 0" class="app-empty">
        No projects yet. Create one to get started.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

definePageMeta({ layout: 'app' })

export default defineComponent({
  name: 'ProjectsList',
  data() {
    return {
      projects: [] as Array<{ id: string; name: string; base_model: string; objective: string; created_at: string }>,
      loading: true,
      error: '',
    }
  },
  setup() {
    const { apiFetch, environment } = useAployApi()
    return { apiFetch, environment }
  },
  async mounted() {
    await this.loadProjects()
  },
  methods: {
    async loadProjects() {
      this.loading = true
      this.error = ''
      try {
        const data = await this.apiFetch<{ projects: Array<{ id: string; name: string; base_model: string; objective: string; created_at: string }> }>('/api/projects')
        this.projects = data.projects || []
      } catch (e) {
        this.error = (e as Error).message || 'Failed to load projects'
      } finally {
        this.loading = false
      }
    },
    formatDate(created_at: string) {
      if (!created_at) return ''
      try {
        const d = new Date(created_at)
        return d.toLocaleDateString()
      } catch {
        return created_at
      }
    },
  },
})
</script>
