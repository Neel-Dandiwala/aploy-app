<template>
  <div class="app-page">
    <AppPageHeader
      title="Dataset — Preview & quality"
      description="Quality report and preview. Run ingestion to sync from source."
      back-to="/app/datasets"
      back-label="Datasets"
    />
    <p v-if="loading" class="text-muted-foreground text-sm">Loading…</p>
    <p v-else-if="error" class="app-error">{{ error }}</p>
    <template v-else-if="dataset">
      <AppCard class="mb-4">
        <h3 class="app-section-title mb-2">Overview</h3>
        <p class="text-sm text-muted-foreground">
          Status: <span :class="statusClass">{{ dataset.status }}</span>
          · Rows: {{ dataset.row_count ?? '—' }}
        </p>
        <p class="text-sm text-muted-foreground mt-1">
          Source: {{ sourceLabel }}
        </p>
        <div v-if="canIngest" class="mt-3">
          <AppButton :disabled="ingesting" @click="runIngestion">
            {{ ingesting ? 'Ingesting…' : 'Run ingestion' }}
          </AppButton>
        </div>
      </AppCard>
      <AppCard class="mb-4">
        <h3 class="app-section-title mb-2">Versions</h3>
        <p class="text-sm text-muted-foreground mb-4">A version is a snapshot of your data. When you start a training run, you pick a version so the run is reproducible. Create a version after ingestion to lock the data.</p>
        <ul v-if="dataset.versions?.length" class="space-y-2 text-sm">
          <li
            v-for="v in dataset.versions"
            :key="v.id"
            class="flex justify-between rounded border border-border/50 px-3 py-2"
          >
            <span class="font-mono">{{ v.tag }}</span>
            <span class="text-muted-foreground">{{ v.status }}</span>
            <span class="text-muted-foreground">{{ v.row_count ?? '—' }} rows</span>
          </li>
        </ul>
        <p v-else class="text-muted-foreground text-sm">No versions yet. Run ingestion to create one.</p>
      </AppCard>
      <AppCard>
        <h3 class="app-section-title mb-4">Quality report</h3>
        <ul class="space-y-2 text-sm text-muted-foreground">
          <li>Duplication: {{ dataset.quality?.duplication_pct ?? '—' }}%</li>
          <li>PII flagged: {{ dataset.quality?.pii_flagged ?? '—' }}</li>
          <li>Schema adherence: {{ dataset.quality?.schema_adherence ?? '—' }}%</li>
        </ul>
      </AppCard>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

definePageMeta({ layout: 'app' })

interface DatasetVersionInfo {
  id: string
  tag: string
  status: string
  row_count?: number
  created_at?: string | null
}

interface DatasetDetail {
  id: string
  name: string
  status: string
  source?: { type?: string; bucket?: string; prefix?: string; dataset?: string }
  row_count?: number
  quality?: { duplication_pct?: number; pii_flagged?: number; schema_adherence?: number }
  versions?: DatasetVersionInfo[]
}

export default defineComponent({
  name: 'DatasetDetail',
  data() {
    return {
      dataset: null as DatasetDetail | null,
      loading: true,
      error: '',
      ingesting: false,
    }
  },
  computed: {
    sourceLabel(): string {
      if (!this.dataset?.source) return 'Upload'
      const s = this.dataset.source
      if (s.type === 's3') return `S3 ${s.bucket || ''} ${(s as { prefix?: string }).prefix || ''}`.trim()
      if (s.type === 'gcs') return `GCS ${s.bucket || ''} ${(s as { prefix?: string }).prefix || ''}`.trim()
      if (s.type === 'hf') return `Hugging Face ${(s as { dataset?: string }).dataset || ''}`.trim()
      return String(s.type || 'upload')
    },
    canIngest(): boolean {
      return !!this.dataset && ['s3', 'gcs', 'hf'].includes(this.dataset.source?.type || '')
    },
    statusClass(): string {
      if (!this.dataset) return ''
      if (this.dataset.status === 'ready') return 'text-emerald-600'
      if (this.dataset.status === 'failed') return 'text-destructive'
      return 'text-amber-600'
    },
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
      const id = (this.$route.params as { id: string }).id
      try {
        this.dataset = await this.apiFetch<DatasetDetail>(`/api/datasets/${id}`)
      } catch (e) {
        this.error = (e as Error).message || 'Failed to load dataset'
      } finally {
        this.loading = false
      }
    },
    async runIngestion() {
      if (!this.dataset) return
      this.ingesting = true
      try {
        await this.apiFetch<{ status: string; row_count: number }>(`/api/datasets/${this.dataset.id}/ingest`, { method: 'POST' })
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
