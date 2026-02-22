<template>
  <div class="app-page">
    <AppPageHeader
      :title="kb?.name ?? 'Knowledge base'"
      description="Status and ingestion. Run ingest to sync from source or upload files."
      back-to="/app/knowledge-bases"
      back-label="Knowledge bases"
    />
    <p v-if="loading" class="text-muted-foreground text-sm">Loading…</p>
    <p v-else-if="error" class="app-error">{{ error }}</p>
    <template v-else-if="kb">
      <AppCard class="mb-4">
        <h3 class="app-section-title mb-2">Overview</h3>
        <p class="text-sm text-muted-foreground">
          Status: <span :class="statusClass">{{ kb.status }}</span>
          · Chunks: {{ kb.chunk_count ?? '—' }}
        </p>
        <p v-if="kb.error_message" class="text-sm text-destructive mt-1">{{ kb.error_message }}</p>
        <p class="text-sm text-muted-foreground mt-1">
          Source: {{ sourceLabel }} · Embedding: {{ kb.embedding_model ?? 'text-embedding-3-small' }}
        </p>
        <div class="mt-4 flex flex-wrap gap-3">
          <div v-if="kb.source?.type === 'upload'" class="flex flex-wrap items-center gap-2">
            <input
              ref="fileInput"
              type="file"
              multiple
              accept=".pdf,.html,.htm,.md,.txt,text/plain,text/html,text/markdown,application/pdf"
              class="text-sm text-muted-foreground file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-muted file:text-foreground"
              @change="onFileSelect"
            />
            <AppButton :disabled="ingesting || !selectedFiles.length" @click="runIngestWithFiles">
              {{ ingesting ? 'Ingesting…' : 'Upload & ingest' }}
            </AppButton>
          </div>
          <AppButton
            v-else
            :disabled="ingesting"
            @click="runIngest"
          >
            {{ ingesting ? 'Ingesting…' : 'Run ingest' }}
          </AppButton>
        </div>
      </AppCard>
      <AppCard>
        <h3 class="app-section-title mb-2">Config</h3>
        <ul class="space-y-1 text-sm text-muted-foreground">
          <li>Chunk size: {{ kb.chunk_config?.size ?? 512 }} · Overlap: {{ kb.chunk_config?.overlap ?? 64 }}</li>
          <li>Dimension: {{ kb.embedding_dimension ?? 1536 }}</li>
        </ul>
      </AppCard>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

definePageMeta({ layout: 'app' })

interface KBDetail {
  id: string
  name: string
  status: string
  chunk_count?: number | null
  error_message?: string | null
  source?: { type?: string; bucket?: string; prefix?: string }
  embedding_model?: string
  embedding_dimension?: number
  chunk_config?: { size?: number; overlap?: number }
}

export default defineComponent({
  name: 'KnowledgeBaseDetail',
  data() {
    return {
      kb: null as KBDetail | null,
      loading: true,
      error: '',
      ingesting: false,
      selectedFiles: [] as File[],
    }
  },
  computed: {
    sourceLabel(): string {
      if (!this.kb?.source) return 'Upload'
      const s = this.kb.source
      if (s.type === 's3') return `S3 ${s.bucket || ''} ${s.prefix || ''}`.trim()
      if (s.type === 'gcs') return `GCS ${s.bucket || ''} ${s.prefix || ''}`.trim()
      return String(s.type || 'upload')
    },
    statusClass(): string {
      if (!this.kb) return ''
      if (this.kb.status === 'ready') return 'text-emerald-600'
      if (this.kb.status === 'failed') return 'text-destructive'
      return 'text-amber-600'
    },
  },
  setup() {
    const { apiFetch, apiUrl } = useAployApi()
    const { environment } = useEnvironment()
    return { apiFetch, apiUrl, environment }
  },
  async mounted() {
    await this.load()
  },
  methods: {
    onFileSelect(e: Event) {
      const input = e.target as HTMLInputElement
      this.selectedFiles = input?.files ? Array.from(input.files) : []
    },
    async load() {
      this.loading = true
      this.error = ''
      const id = (this.$route.params as { id: string }).id
      try {
        this.kb = await this.apiFetch<KBDetail>(`/api/knowledge-bases/${id}`)
      } catch (e) {
        this.error = (e as Error).message || 'Failed to load knowledge base'
      } finally {
        this.loading = false
      }
    },
    async runIngest() {
      if (!this.kb) return
      this.ingesting = true
      try {
        await this.apiFetch<{ status: string; chunk_count: number }>(`/api/knowledge-bases/${this.kb.id}/ingest`, { method: 'POST' })
        await this.load()
      } catch (e) {
        this.error = (e as Error).message || 'Ingestion failed'
      } finally {
        this.ingesting = false
      }
    },
    async runIngestWithFiles() {
      if (!this.kb || !this.selectedFiles.length) return
      this.ingesting = true
      try {
        const config = useRuntimeConfig()
        const base = (config.public.apiUrl as string) || 'http://localhost:4000'
        const url = `${base.replace(/\/$/, '')}/api/knowledge-bases/${this.kb.id}/ingest`
        const form = new FormData()
        for (const f of this.selectedFiles) form.append('files', f)
        await $fetch(url, {
          method: 'POST',
          body: form,
          credentials: 'include',
          headers: { 'X-Environment': this.environment?.value ?? 'production' },
        })
        this.selectedFiles = []
        const input = this.$refs.fileInput as HTMLInputElement | undefined
        if (input) input.value = ''
        await this.load()
      } catch (e) {
        this.error = (e as Error).message || 'Ingestion failed'
      } finally {
        this.ingesting = false
      }
    },
  },
})
</script>
