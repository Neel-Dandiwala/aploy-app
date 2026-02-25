<template>
  <div class="app-page-narrow">
    <AppPageHeader
      title="Add dataset"
      description="Upload a file with your training examples, or connect a folder in the cloud. We accept JSONL: one JSON object per line."
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
        <label class="app-label">How do you want to add your data?</label>
        <p class="text-sm text-muted-foreground mb-3">Upload a file from your computer, or connect to cloud storage or Hugging Face.</p>
        <div class="space-y-2 mb-4">
          <label class="flex gap-3 p-3 rounded-app border border-border/50 cursor-pointer hover:bg-muted/30 transition-colors">
            <input v-model="form.sourceType" type="radio" value="upload" class="mt-1 rounded border-border text-accent focus:ring-accent/30" />
            <div>
              <span class="font-medium text-zinc-900">Upload a file</span>
              <p class="text-sm text-muted-foreground mt-0.5">Best for getting started. Upload a JSONL file (one example per line). We'll validate and prepare it for training.</p>
            </div>
          </label>
          <label class="flex gap-3 p-3 rounded-app border border-border/50 cursor-pointer hover:bg-muted/30 transition-colors">
            <input v-model="form.sourceType" type="radio" value="s3" class="mt-1 rounded border-border text-accent focus:ring-accent/30" />
            <div>
              <span class="font-medium text-zinc-900">Connect S3 (AWS)</span>
              <p class="text-sm text-muted-foreground mt-0.5">Use a folder in an S3 bucket where your training data lives.</p>
            </div>
          </label>
          <label class="flex gap-3 p-3 rounded-app border border-border/50 cursor-pointer hover:bg-muted/30 transition-colors">
            <input v-model="form.sourceType" type="radio" value="gcs" class="mt-1 rounded border-border text-accent focus:ring-accent/30" />
            <div>
              <span class="font-medium text-zinc-900">Connect GCS (Google Cloud)</span>
              <p class="text-sm text-muted-foreground mt-0.5">Use a folder in Google Cloud Storage.</p>
            </div>
          </label>
          <label class="flex gap-3 p-3 rounded-app border border-border/50 cursor-pointer hover:bg-muted/30 transition-colors">
            <input v-model="form.sourceType" type="radio" value="hf" class="mt-1 rounded border-border text-accent focus:ring-accent/30" />
            <div>
              <span class="font-medium text-zinc-900">Connect Hugging Face</span>
              <p class="text-sm text-muted-foreground mt-0.5">Use a dataset from the Hugging Face Hub.</p>
            </div>
          </label>
        </div>
        <div v-if="form.sourceType === 'upload'" class="rounded-app bg-muted/30 border border-border/50 p-4">
          <p class="text-sm text-muted-foreground">
            <strong class="text-zinc-900">JSONL format:</strong> One JSON object per line. Each line should have a <code class="text-xs bg-muted px-1 rounded">messages</code> array (for chat) or <code class="text-xs bg-muted px-1 rounded">instruction</code> / <code class="text-xs bg-muted px-1 rounded">response</code> fields. After you create the dataset, go to its page to upload the file and run ingestion.
          </p>
        </div>
        <div v-else-if="form.sourceType === 's3' || form.sourceType === 'gcs'" class="rounded-app border border-border/50 p-4 space-y-3">
          <p class="text-sm text-muted-foreground">Connect a folder in the cloud where your examples live. You'll need a credential (add one under Integrations).</p>
          <div>
            <label class="app-label text-xs">Credential</label>
            <select v-model="form.credentialId" class="app-select">
              <option value="">Select credential</option>
              <option v-for="c in credentialsByType" :key="c.id" :value="c.id">{{ c.name }} ({{ c.type }})</option>
            </select>
          </div>
          <div>
            <label class="app-label text-xs">Bucket</label>
            <input v-model="form.bucket" class="app-input" placeholder="my-bucket-name" />
          </div>
          <div>
            <label class="app-label text-xs">Prefix (optional)</label>
            <input v-model="form.prefix" class="app-input" placeholder="path/to/data/" />
          </div>
        </div>
        <div v-else-if="form.sourceType === 'hf'" class="rounded-app border border-border/50 p-4 space-y-3">
          <p class="text-sm text-muted-foreground">Use a dataset from the Hugging Face Hub. You'll need a Hugging Face token (add under Integrations).</p>
          <div>
            <label class="app-label text-xs">Credential</label>
            <select v-model="form.credentialId" class="app-select">
              <option value="">Select credential</option>
              <option v-for="c in hfCredentials" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
          <div>
            <label class="app-label text-xs">Dataset</label>
            <input v-model="form.hfDataset" class="app-input" placeholder="username/dataset_name" />
          </div>
        </div>
      </div>
      <div v-if="error">
        <p class="app-error">What happened: {{ error }}</p>
        <AppErrorRecovery :error="error" />
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
      error: '',
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
      this.error = ''
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
      } catch (e) {
        this.error = (e as Error).message || 'Failed to create dataset'
      } finally {
        this.loading = false
      }
    },
  },
})
</script>
