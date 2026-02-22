<template>
  <div class="app-page-narrow">
    <AppPageHeader
      title="Add dataset"
      description="Upload or connect S3/GCS/Hugging Face. JSONL format."
      back-to="/app/datasets"
      back-label="Datasets"
    />
    <form @submit.prevent="onSubmit" class="space-y-6">
      <div>
        <label class="app-label">Dataset name</label>
        <input
          v-model="form.name"
          class="app-input"
          placeholder="Support chat v1"
        />
      </div>
      <div>
        <label class="app-label">Source</label>
        <select v-model="form.sourceType" class="app-select">
          <option value="upload">Upload</option>
          <option value="s3">S3</option>
          <option value="gcs">GCS</option>
          <option value="hf">Hugging Face</option>
        </select>
        <template v-if="form.sourceType === 's3' || form.sourceType === 'gcs'">
          <label class="app-label mt-2">Credential</label>
          <select v-model="form.credentialId" class="app-select">
            <option value="">Select credential</option>
            <option v-for="c in credentialsByType" :key="c.id" :value="c.id">{{ c.name }} ({{ c.type }})</option>
          </select>
          <input v-model="form.bucket" class="app-input mt-2" placeholder="Bucket" />
          <input v-model="form.prefix" class="app-input mt-2" placeholder="Prefix (optional)" />
        </template>
        <template v-else-if="form.sourceType === 'hf'">
          <label class="app-label mt-2">Credential</label>
          <select v-model="form.credentialId" class="app-select">
            <option value="">Select credential</option>
            <option v-for="c in hfCredentials" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
          <input v-model="form.hfDataset" class="app-input mt-2" placeholder="Dataset (e.g. username/dataset_name)" />
        </template>
      </div>
      <div class="flex flex-wrap gap-3 pt-1">
        <AppButton type="submit" :disabled="loading">
          {{ loading ? 'Starting…' : 'Create dataset' }}
        </AppButton>
        <AppButton variant="secondary" to="/app/datasets">Cancel</AppButton>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

definePageMeta({ layout: 'app' })

interface Credential { id: string; name: string; type: string }

export default defineComponent({
  name: 'NewDataset',
  data() {
    return {
      form: {
        name: '',
        sourceType: 'upload' as 'upload' | 's3' | 'gcs' | 'hf',
        bucket: '',
        prefix: '',
        credentialId: '',
        hfDataset: '',
      },
      credentials: [] as Credential[],
      loading: false,
    }
  },
  computed: {
    credentialsByType(): Credential[] {
      return this.credentials.filter((c) => c.type === this.form.sourceType)
    },
    hfCredentials(): Credential[] {
      return this.credentials.filter((c) => c.type === 'hf')
    },
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
      this.loading = true
      const body: Record<string, unknown> = { name: this.form.name || 'Untitled dataset', schema_ref: 'chat' }
      if (this.form.sourceType === 's3') {
        body.source = {
          type: 's3',
          bucket: this.form.bucket,
          prefix: this.form.prefix,
          credentialId: this.form.credentialId || undefined,
        }
      } else if (this.form.sourceType === 'gcs') {
        body.source = {
          type: 'gcs',
          bucket: this.form.bucket,
          prefix: this.form.prefix,
          credentialId: this.form.credentialId || undefined,
        }
      } else if (this.form.sourceType === 'hf') {
        body.source = {
          type: 'hf',
          dataset: this.form.hfDataset,
          credentialId: this.form.credentialId || undefined,
        }
      } else {
        body.source = { type: 'upload' }
      }
      try {
        const data = await this.apiFetch<{ id: string }>('/api/datasets', { method: 'POST', body })
        await navigateTo(`/app/datasets/${data.id}`)
      } finally {
        this.loading = false
      }
    },
  },
})
</script>
