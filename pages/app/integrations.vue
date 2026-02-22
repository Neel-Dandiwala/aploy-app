<template>
  <div class="app-page">
    <AppPageHeader
      title="Integrations"
      description="Connect S3, GCS, and Hugging Face. Credentials are used for datasets and knowledge base ingestion."
    />
    <p v-if="loading" class="text-muted-foreground text-sm">Loading…</p>
    <div v-else class="space-y-6">
      <AppCard
        v-for="integration in integrationTypes"
        :key="integration.type"
        class="space-y-4"
      >
        <div>
          <h3 class="app-section-title">{{ integration.title }}</h3>
          <p class="app-section-description mt-1">{{ integration.description }}</p>
        </div>
        <ul class="space-y-2">
          <li
            v-for="c in credentialsByType[integration.type]"
            :key="c.id"
            class="flex items-center justify-between gap-2 rounded border border-border/50 bg-muted/30 px-3 py-2 text-sm"
          >
            <span class="text-foreground">{{ c.name }}</span>
            <span
              :class="{
                'text-emerald-600': c.status === 'ok',
                'text-amber-600': c.status === 'pending',
                'text-destructive': c.status === 'error',
              }"
            >
              {{ c.status }}
            </span>
            <span class="text-muted-foreground text-xs">
              {{ c.last_tested_at ? 'Tested ' + formatDate(c.last_tested_at) : 'Not tested' }}
            </span>
            <div class="flex gap-2">
              <button
                type="button"
                class="text-primary hover:underline"
                :disabled="testingId === c.id"
                @click="testCredential(c.id)"
              >
                {{ testingId === c.id ? 'Testing…' : 'Test' }}
              </button>
              <button
                type="button"
                class="text-destructive hover:underline"
                @click="deleteCredential(c.id)"
              >
                Delete
              </button>
            </div>
          </li>
          <p
            v-if="credentialsByType[integration.type].length === 0 && addingType !== integration.type"
            class="text-muted-foreground text-sm"
          >
            No credentials yet.
          </p>
        </ul>
        <form
          v-if="addingType === integration.type"
          :key="integration.type"
          @submit.prevent="onAddCredential(integration.type)"
          class="space-y-3 rounded border border-border/50 bg-muted/20 p-4"
        >
          <div>
            <label class="app-label">Name</label>
            <input
              v-model="addForms[integration.type].name"
              class="app-input"
              :placeholder="integration.placeholder"
            />
          </div>
          <template v-if="integration.type === 's3'">
            <div>
              <label class="app-label">Access Key ID</label>
              <input v-model="addForms.s3.s3AccessKeyId" class="app-input" type="text" />
            </div>
            <div>
              <label class="app-label">Secret Access Key</label>
              <input v-model="addForms.s3.s3SecretAccessKey" class="app-input" type="password" />
            </div>
            <div>
              <label class="app-label">Region (optional)</label>
              <input v-model="addForms.s3.s3Region" class="app-input" placeholder="us-east-1" />
            </div>
          </template>
          <template v-else-if="integration.type === 'gcs'">
            <div>
              <label class="app-label">Service account JSON (paste full JSON)</label>
              <textarea
                v-model="addForms.gcs.gcsJson"
                class="app-input min-h-[120px] font-mono text-sm"
                placeholder='{"type":"service_account",...}'
              />
            </div>
          </template>
          <template v-else-if="integration.type === 'hf'">
            <div>
              <label class="app-label">Hugging Face token</label>
              <input
                v-model="addForms.hf.hfToken"
                class="app-input"
                type="password"
                placeholder="hf_..."
              />
            </div>
          </template>
          <div class="flex gap-2">
            <AppButton type="submit" :disabled="addLoading">
              {{ addLoading ? 'Adding…' : 'Add credential' }}
            </AppButton>
            <AppButton variant="secondary" type="button" @click="addingType = null">
              Cancel
            </AppButton>
          </div>
        </form>
        <AppButton
          v-else
          variant="secondary"
          @click="addingType = integration.type"
        >
          Add {{ integration.title }} credential
        </AppButton>
      </AppCard>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

definePageMeta({ layout: 'app' })

interface Credential {
  id: string
  name: string
  type: string
  status: string
  last_tested_at?: string | null
}

const INTEGRATION_TYPES = [
  {
    type: 's3' as const,
    title: 'S3 (AWS)',
    description: 'For datasets and knowledge base ingestion from S3 buckets.',
    placeholder: 'e.g. AWS prod',
  },
  {
    type: 'gcs' as const,
    title: 'GCS (Google Cloud)',
    description: 'For datasets and knowledge base ingestion from Google Cloud Storage.',
    placeholder: 'e.g. GCP prod',
  },
  {
    type: 'hf' as const,
    title: 'Hugging Face',
    description: 'For datasets from Hugging Face and model access.',
    placeholder: 'e.g. HF token',
  },
]

export default defineComponent({
  name: 'IntegrationsPage',
  data() {
    return {
      integrationTypes: INTEGRATION_TYPES,
      credentials: [] as Credential[],
      loading: true,
      addLoading: false,
      testingId: null as string | null,
      addingType: null as 's3' | 'gcs' | 'hf' | null,
      addForms: {
        s3: {
          name: '',
          s3AccessKeyId: '',
          s3SecretAccessKey: '',
          s3Region: '',
        },
        gcs: {
          name: '',
          gcsJson: '',
        },
        hf: {
          name: '',
          hfToken: '',
        },
      },
    }
  },
  computed: {
    credentialsByType(): Record<string, Credential[]> {
      const byType: Record<string, Credential[]> = { s3: [], gcs: [], hf: [] }
      this.credentials.forEach((c) => {
        if (byType[c.type]) byType[c.type].push(c)
      })
      return byType
    },
  },
  setup() {
    const { apiFetch } = useAployApi()
    return { apiFetch }
  },
  async mounted() {
    await this.loadCredentials()
  },
  methods: {
    formatDate(iso: string) {
      try {
        return new Date(iso).toLocaleDateString()
      } catch {
        return iso
      }
    },
    async loadCredentials() {
      this.loading = true
      try {
        const data = await this.apiFetch<{ credentials: Credential[] }>('/api/org/credentials')
        this.credentials = data.credentials || []
      } catch {
        this.credentials = []
      } finally {
        this.loading = false
      }
    },
    async testCredential(id: string) {
      this.testingId = id
      try {
        await this.apiFetch<{ ok: boolean }>(`/api/org/credentials/${id}/test`, { method: 'POST' })
        await this.loadCredentials()
      } finally {
        this.testingId = null
      }
    },
    async deleteCredential(id: string) {
      if (!confirm('Delete this credential?')) return
      try {
        await this.apiFetch(`/api/org/credentials/${id}`, { method: 'DELETE' })
        await this.loadCredentials()
      } catch (e) {
        alert((e as Error).message || 'Delete failed')
      }
    },
    async onAddCredential(type: 's3' | 'gcs' | 'hf') {
      const payload: Record<string, unknown> = {}
      const form = this.addForms[type]
      if (type === 's3') {
        payload.s3 = {
          accessKeyId: form.s3AccessKeyId,
          secretAccessKey: form.s3SecretAccessKey,
          region: form.s3Region || undefined,
        }
      } else if (type === 'gcs') {
        try {
          payload.gcs = { serviceAccountKey: JSON.parse(form.gcsJson || '{}') }
        } catch {
          alert('Invalid JSON for GCS service account')
          return
        }
      } else {
        payload.hf = { token: form.hfToken }
      }
      const name = (form as { name?: string }).name || 'Unnamed'
      this.addLoading = true
      try {
        await this.apiFetch('/api/org/credentials', {
          method: 'POST',
          body: { name: name || 'Unnamed', type, payload },
        })
        this.addingType = null
        this.addForms.s3 = { name: '', s3AccessKeyId: '', s3SecretAccessKey: '', s3Region: '' }
        this.addForms.gcs = { name: '', gcsJson: '' }
        this.addForms.hf = { name: '', hfToken: '' }
        await this.loadCredentials()
      } catch (e) {
        alert((e as Error).message || 'Add failed')
      } finally {
        this.addLoading = false
      }
    },
  },
})
</script>
