<template>
  <div class="app-page">
    <AppPageHeader title="Projects">
      <template #actions>
        <AppButton to="/app/projects/new">Create project</AppButton>
      </template>
    </AppPageHeader>
    <div class="mb-4 flex gap-2">
      <input
        v-model="search"
        type="text"
        placeholder="Search projects..."
        class="app-input flex-1 max-w-xs py-2"
        @input="debouncedLoad"
      />
    </div>
    <p v-if="loading" class="text-muted-foreground text-sm">Loading…</p>
    <p v-else-if="error" class="app-error">{{ error }}</p>
    <div v-else class="app-table-wrap">
      <table class="app-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Base model</th>
            <th>Objective</th>
            <th>Status</th>
            <th>Created</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in projects" :key="p.id">
            <td class="font-medium text-zinc-900">{{ p.name }}</td>
            <td class="text-muted-foreground">{{ p.base_model }}</td>
            <td class="text-muted-foreground">{{ p.objective }}</td>
            <td>
              <span
                class="inline-flex px-2 py-0.5 rounded text-xs font-medium"
                :class="statusChipClass(p.status)"
              >
                {{ p.status_badge }}
              </span>
            </td>
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
      <div v-if="!loading && !error && projects.length === 0" class="app-empty text-center py-8 px-4">
        <p class="font-medium text-zinc-900 mb-1">No projects yet</p>
        <p class="text-sm text-muted-foreground mb-4">A project defines what you're training: which base model and goal. Create one to start.</p>
        <AppButton to="/app/projects/new">Create project</AppButton>
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
  name: 'ProjectsList',
  data() {
    return {
      projects: [] as Array<{ id: string; name: string; base_model: string; objective: string; status: string; status_badge: string; created_at: string }>,
      search: '',
      loading: true,
      error: '',
      debounceTimer: null as ReturnType<typeof setTimeout> | null,
    }
  },
  setup() {
    const { apiFetch } = useAployApi()
    return { apiFetch }
  },
  async mounted() {
    await this.loadProjects()
  },
  methods: {
    statusChipClass(status: string): string {
      const map: Record<string, string> = {
        no_script: 'bg-zinc-200 text-zinc-600',
        needs_test: 'bg-amber-100 text-amber-800',
        test_failed: 'bg-red-100 text-red-700',
        ready_to_train: 'bg-emerald-100 text-emerald-700',
        training: 'bg-blue-100 text-blue-700',
        deployed: 'bg-emerald-100 text-emerald-700',
      }
      return map[status] || 'bg-zinc-200 text-zinc-600'
    },
    debouncedLoad() {
      if (this.debounceTimer) clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => this.loadProjects(), 300)
    },
    async loadProjects() {
      this.loading = true
      this.error = ''
      try {
        const q = this.search.trim() ? `?search=${encodeURIComponent(this.search.trim())}` : ''
        const data = await this.apiFetch<{ projects: Array<{ id: string; name: string; base_model: string; objective: string; status: string; status_badge: string; created_at: string }> }>('/api/projects' + q)
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
        return new Date(created_at).toLocaleDateString()
      } catch {
        return created_at
      }
    },
  },
})
</script>
