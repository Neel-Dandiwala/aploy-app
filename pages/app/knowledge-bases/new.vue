<template>
  <div class="app-page-narrow">
    <AppPageHeader
      title="New knowledge base"
      description="Create a knowledge base. Add documents via ingest (upload files or S3/GCS)."
      back-to="/app/knowledge-bases"
      back-label="Knowledge bases"
    />
    <form @submit.prevent="onSubmit" class="space-y-6">
      <div>
        <label class="app-label">Name</label>
        <input v-model="form.name" class="app-input" placeholder="e.g. Product docs" />
      </div>
      <div>
        <label class="app-label">Source (for ingest without upload)</label>
        <select v-model="form.sourceType" class="app-select">
          <option value="upload">Upload (use ingest with files)</option>
          <option value="s3">S3</option>
          <option value="gcs">GCS</option>
        </select>
        <template v-if="form.sourceType === 's3' || form.sourceType === 'gcs'">
          <label class="app-label mt-2">Credential</label>
          <select v-model="form.credentialId" class="app-select">
            <option value="">Select credential</option>
            <option v-for="c in credentials" :key="c.id" :value="c.id">{{ c.name }} ({{ c.type }})</option>
          </select>
          <input v-model="form.bucket" class="app-input mt-2" placeholder="Bucket" />
          <input v-model="form.prefix" class="app-input mt-2" placeholder="Prefix (optional)" />
        </template>
      </div>
      <div>
        <label class="app-label">Chunk size</label>
        <input v-model.number="form.chunkSize" type="number" min="64" max="2048" class="app-input" placeholder="512" />
      </div>
      <div>
        <label class="app-label">Chunk overlap</label>
        <input v-model.number="form.chunkOverlap" type="number" min="0" max="512" class="app-input" placeholder="64" />
      </div>
      <p v-if="error" class="app-error">{{ error }}</p>
      <div class="flex gap-3">
        <AppButton type="submit" :disabled="loading">{{ loading ? 'Creating…' : 'Create knowledge base' }}</AppButton>
        <AppButton variant="secondary" to="/app/knowledge-bases">Cancel</AppButton>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

definePageMeta({ layout: 'app' })

interface Credential { id: string; name: string; type: string }

export default defineComponent({
  name: 'NewKnowledgeBase',
  data() {
    return {
      form: {
        name: '',
        sourceType: 'upload' as 'upload' | 's3' | 'gcs',
        credentialId: '',
        bucket: '',
        prefix: '',
        chunkSize: 512,
        chunkOverlap: 64,
      },
      credentials: [] as Credential[],
      loading: false,
      error: '',
    }
  },
  setup() {
    const { apiFetch } = useAployApi()
    return { apiFetch }
  },
  async mounted() {
    try {
      const data = await this.apiFetch<{ credentials: Credential[] }>('/api/org/credentials')
      this.credentials = data.credentials || []
    } catch {
      this.credentials = []
    }
  },
  methods: {
    async onSubmit() {
      this.error = ''
      this.loading = true
      try {
        const source: Record<string, unknown> = { type: this.form.sourceType }
        if (this.form.sourceType === 's3' || this.form.sourceType === 'gcs') {
          source.bucket = this.form.bucket || undefined
          source.prefix = this.form.prefix || undefined
          if (this.form.credentialId) source.credentialId = this.form.credentialId
        }
        const data = await this.apiFetch<{ id: string }>('/api/knowledge-bases', {
          method: 'POST',
          body: {
            name: this.form.name || 'Untitled knowledge base',
            source,
            chunk_config: { size: this.form.chunkSize || 512, overlap: this.form.chunkOverlap ?? 64 },
          },
        })
        await navigateTo(`/app/knowledge-bases/${data.id}`)
      } catch (e) {
        this.error = (e as Error).message || 'Failed to create knowledge base'
      } finally {
        this.loading = false
      }
    },
  },
})
</script>
