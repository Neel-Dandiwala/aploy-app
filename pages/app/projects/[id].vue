<template>
  <div class="app-page">
    <AppPageHeader
      :title="project?.name ?? 'Project'"
      :description="project ? `${project.description || ''} Base: ${project.base_model || '—'}` : ''"
      back-to="/app/projects"
      back-label="Projects"
    />
    <p v-if="loading" class="text-muted-foreground text-sm">Loading…</p>
    <p v-else-if="error" class="app-error">{{ error }}</p>
    <div v-else-if="project" class="space-y-6">
      <div class="flex items-center gap-2 flex-wrap">
        <span
          class="inline-flex px-2 py-0.5 rounded text-xs font-medium"
          :class="statusChipClass(project.status)"
        >
          {{ project.status_badge }}
        </span>
      </div>
      <nav class="flex gap-1 border-b border-border pb-px">
        <NuxtLink
          v-for="tab in tabs"
          :key="tab.id"
          :to="`/app/projects/${$route.params.id}${tab.path}`"
          class="px-4 py-2 text-sm font-medium rounded-t-app transition-colors"
          :class="isActive(tab) ? 'bg-surface-elevated text-zinc-900 border border-border border-b-0 -mb-px' : 'text-muted-foreground hover:text-zinc-900'"
        >
          {{ tab.label }}
        </NuxtLink>
      </nav>
      <NuxtPage />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

definePageMeta({ layout: 'app' })

const TABS = [
  { id: 'overview', label: 'Overview', path: '' },
  { id: 'chats', label: 'Chats', path: '/chat' },
  { id: 'datasets', label: 'Datasets', path: '/datasets' },
  { id: 'script', label: 'Script', path: '/script' },
  { id: 'runs', label: 'Runs', path: '/runs' },
  { id: 'deploy', label: 'Deploy / API', path: '/deploy' },
]

export default defineComponent({
  name: 'ProjectDetail',
  data() {
    return {
      project: null as {
        name?: string;
        description?: string;
        base_model?: string;
        status?: string;
        status_badge?: string;
        runs?: Array<{ id: string; status: string }>;
      } | null,
      loading: true,
      error: '',
    }
  },
  setup() {
    const { apiFetch } = useAployApi()
    return { apiFetch }
  },
  computed: {
    tabs() {
      return TABS
    },
  },
  watch: {
    '$route.params.id'() {
      this.load()
    },
  },
  async mounted() {
    await this.load()
  },
  methods: {
    statusChipClass(status?: string): string {
      const map: Record<string, string> = {
        no_script: 'bg-zinc-200 text-zinc-600',
        needs_test: 'bg-amber-100 text-amber-800',
        test_failed: 'bg-red-100 text-red-700',
        ready_to_train: 'bg-emerald-100 text-emerald-700',
        training: 'bg-blue-100 text-blue-700',
        deployed: 'bg-emerald-100 text-emerald-700',
      }
      return map[status || ''] || 'bg-zinc-200 text-zinc-600'
    },
    isActive(tab: { path: string }) {
      const path = (this.$route.path as string)
      const id = (this.$route.params as { id: string }).id
      const base = `/app/projects/${id}`
      if (tab.path === '') return path === base || path === `${base}/`
      return path.startsWith(`${base}${tab.path}`)
    },
    async load() {
      const id = (this.$route.params as { id: string }).id
      this.loading = true
      this.error = ''
      try {
        this.project = await this.apiFetch<typeof this.project>(`/api/projects/${id}`)
      } catch (e) {
        this.error = (e as Error).message || 'Failed to load project'
      } finally {
        this.loading = false
      }
    },
  },
})
</script>
