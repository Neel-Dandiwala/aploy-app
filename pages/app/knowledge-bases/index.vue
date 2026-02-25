<template>
  <div class="app-page">
    <AppPageHeader title="Knowledge bases">
      <template #actions>
        <AppButton to="/app/knowledge-bases/new">Add knowledge base</AppButton>
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
            <th>Chunks</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="kb in knowledgeBases" :key="kb.id">
            <td class="font-medium text-zinc-900">{{ kb.name }}</td>
            <td :class="statusClass(kb.status)">{{ kb.status }}</td>
            <td class="text-muted-foreground">{{ kb.chunk_count ?? '—' }}</td>
            <td>
              <NuxtLink
                :to="`/app/knowledge-bases/${kb.id}`"
                class="text-accent hover:text-accent-hover text-sm transition-colors"
              >
                Open
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!loading && !error && knowledgeBases.length === 0" class="app-empty text-center py-8 px-4">
        <p class="font-medium text-zinc-900 mb-1">No knowledge bases yet</p>
        <p class="text-sm text-muted-foreground mb-4">Knowledge bases store your documents so pipelines can search them (e.g. "chat with your docs"). Add one, then upload or connect a source.</p>
        <AppButton to="/app/knowledge-bases/new">Add knowledge base</AppButton>
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

interface KBItem {
  id: string
  name: string
  status: string
  chunk_count?: number | null
}

export default defineComponent({
  name: 'KnowledgeBasesList',
  data() {
    return {
      knowledgeBases: [] as KBItem[],
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
        const data = await this.apiFetch<{ knowledge_bases: KBItem[] }>('/api/knowledge-bases')
        this.knowledgeBases = data.knowledge_bases || []
      } catch (e) {
        this.error = (e as Error).message || 'Failed to load knowledge bases'
      } finally {
        this.loading = false
      }
    },
    statusClass(status: string): string {
      if (status === 'ready') return 'text-emerald-500'
      if (status === 'failed') return 'text-destructive'
      if (status === 'ingesting') return 'text-amber-500'
      return 'text-muted-foreground'
    },
  },
})
</script>
