<template>
  <div class="app-page-narrow">
    <AppPageHeader
      title="Add dataset"
      description="Upload your data file or connect to cloud storage. We accept CSV and JSONL—we'll prepare it for training."
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
              <p class="text-sm text-muted-foreground mt-0.5">CSV or JSONL. We'll convert and prepare it for training. Best for spreadsheets or exported data.</p>
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
        <div v-if="form.sourceType === 'upload'" class="rounded-app bg-muted/30 border border-border/50 p-4 space-y-4">
          <div>
            <label class="app-label block mb-2">Select your data file</label>
            <input
              ref="fileInput"
              type="file"
              accept=".csv,.jsonl,.json"
              class="block w-full text-sm text-muted-foreground file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border file:border-border file:bg-surface-overlay file:text-sm file:font-medium file:cursor-pointer hover:file:bg-muted/50"
              @change="onFileSelected"
            />
            <p v-if="form.selectedFile" class="text-sm text-emerald-600 mt-1">Selected: {{ form.selectedFile.name }}</p>
          </div>
          <details class="text-sm text-muted-foreground">
            <summary class="cursor-pointer hover:text-zinc-700">What formats work?</summary>
            <ul class="mt-2 space-y-1 list-disc list-inside">
              <li><strong>CSV</strong> — Spreadsheet with columns like prompt/completion, question/answer, or instruction/response. We auto-detect and convert.</li>
              <li><strong>JSONL</strong> — One JSON object per line (common for exports). Each row can have <code class="text-xs bg-muted px-1 rounded">messages</code>, <code class="text-xs bg-muted px-1 rounded">instruction</code>/<code class="text-xs bg-muted px-1 rounded">response</code>, or <code class="text-xs bg-muted px-1 rounded">prompt</code>/<code class="text-xs bg-muted px-1 rounded">completion</code>.</li>
            </ul>
          </details>
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
        <AppButton
          type="submit"
          :disabled="loading || (form.sourceType === 'upload' && !form.selectedFile)"
        >
          {{ loading ? 'Creating…' : form.sourceType === 'upload' && form.selectedFile ? 'Create & upload dataset' : 'Create dataset' }}
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
        selectedFile: null as File | null,
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
    const { apiFetch, apiUrl, environment } = useAployApi()
    const { mockMode } = useMockMode()
    return { apiFetch, apiUrl, environment, mockMode }
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
    onFileSelected(e: Event) {
      const input = e.target as HTMLInputElement
      this.form.selectedFile = input.files?.[0] || null
    },
    async onSubmit() {
      this.error = ''
      this.loading = true
      try {
        if (this.form.sourceType === 'upload' && this.form.selectedFile) {
          if (this.mockMode?.value) {
            const data = await this.apiFetch<{ id: string }>('/api/datasets', {
              method: 'POST',
              body: { name: this.form.name || 'Untitled dataset', source: { type: 'upload' } },
            })
            await navigateTo(`/app/datasets/${data.id}`)
          } else {
            const form = new FormData()
            form.append('name', this.form.name || 'Untitled dataset')
            form.append('file', this.form.selectedFile)
            const data = await $fetch<{ id: string }>(`${this.apiUrl}/api/datasets`, {
              method: 'POST',
              credentials: 'include',
              headers: { 'X-Environment': this.environment?.value ?? 'production' },
              body: form,
            })
            await navigateTo(`/app/datasets/${data.id}`)
          }
        } else {
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
          const data = await this.apiFetch<{ id: string }>('/api/datasets', { method: 'POST', body })
          await navigateTo(`/app/datasets/${data.id}`)
        }
      } catch (e) {
        this.error = (e as Error).message || 'Failed to create dataset'
      } finally {
        this.loading = false
      }
    },
  },
})
</script>
