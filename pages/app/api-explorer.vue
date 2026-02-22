<template>
  <div class="app-page">
    <AppPageHeader
      title="API Explorer"
      description="Try your deployed model. Send a request and see the response."
    />
    <div class="space-y-4">
      <AppCard>
        <h3 class="app-section-title mb-3">Request</h3>
        <div class="space-y-3">
          <div>
            <label class="app-label">Deployment (trained model)</label>
            <select v-model="selectedDeploymentId" class="app-select">
              <option value="">Select a deployment</option>
              <option v-for="d in deployments" :key="d.id" :value="d.id">
                {{ d.id }} — {{ d.model_version_id }} ({{ d.status }})
              </option>
            </select>
          </div>
          <div>
            <label class="app-label">API key (optional — leave blank to use session)</label>
            <input
              v-model="apiKey"
              class="app-input font-mono text-sm"
              type="password"
              placeholder="aploy_..."
            />
          </div>
          <div>
            <label class="app-label">URL</label>
            <p class="font-mono text-sm text-muted-foreground break-all">
              {{ invokeUrl }}
            </p>
          </div>
          <div>
            <label class="app-label">Request body (JSON)</label>
            <textarea
              v-model="requestBody"
              class="app-input min-h-[180px] font-mono text-sm"
              placeholder='{"messages": [{"role": "user", "content": "Hello"}], "max_tokens": 128}'
            />
          </div>
          <div class="flex flex-wrap gap-2">
            <AppButton :disabled="!selectedDeploymentId || sending" @click="sendRequest">
              {{ sending ? 'Sending…' : 'Send' }}
            </AppButton>
            <AppButton variant="secondary" :disabled="!invokeUrl" @click="copyCurl">
              Copy as cURL
            </AppButton>
          </div>
        </div>
      </AppCard>
      <AppCard v-if="response !== null">
        <h3 class="app-section-title mb-2">Response</h3>
        <p class="text-sm text-muted-foreground mb-2">
          Status: <span :class="statusClass">{{ responseStatus }}</span>
          <span v-if="responseTime !== null" class="ml-2">· {{ responseTime }} ms</span>
        </p>
        <pre class="rounded bg-muted/50 p-3 text-xs overflow-auto max-h-[400px]">{{ responseText }}</pre>
      </AppCard>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

definePageMeta({ layout: 'app' })

interface DeploymentItem {
  id: string
  model_version_id: string
  status: string
  endpoint_url?: string | null
}

export default defineComponent({
  name: 'ApiExplorer',
  data() {
    return {
      deployments: [] as DeploymentItem[],
      loading: true,
      selectedDeploymentId: '',
      requestBody: '{"messages": [{"role": "user", "content": "Hello"}], "max_tokens": 128}',
      apiKey: '',
      sending: false,
      response: null as string | null,
      responseStatus: null as number | null,
      responseTime: null as number | null,
    }
  },
  computed: {
    invokeUrl(): string {
      const config = useRuntimeConfig()
      const apiUrl = (config.public.apiUrl as string) || 'http://localhost:4000'
      if (!this.selectedDeploymentId) return apiUrl + '/v1/deployments/:id/invoke'
      return `${apiUrl.replace(/\/$/, '')}/v1/deployments/${this.selectedDeploymentId}/invoke`
    },
    responseText(): string {
      if (this.response === null) return ''
      try {
        return JSON.stringify(JSON.parse(this.response), null, 2)
      } catch {
        return this.response
      }
    },
    statusClass(): string {
      if (this.responseStatus === null) return ''
      if (this.responseStatus >= 200 && this.responseStatus < 300) return 'text-emerald-600'
      if (this.responseStatus >= 400) return 'text-destructive'
      return 'text-amber-600'
    },
  },
  async mounted() {
    await this.loadDeployments()
  },
  methods: {
    async loadDeployments() {
      this.loading = true
      try {
        const data = await this.apiFetch<{ deployments: DeploymentItem[] }>('/api/deploy')
        this.deployments = data.deployments || []
        if (this.deployments.length && !this.selectedDeploymentId) {
          this.selectedDeploymentId = this.deployments[0].id
        }
      } catch {
        this.deployments = []
      } finally {
        this.loading = false
      }
    },
    async sendRequest() {
      if (!this.selectedDeploymentId) return
      let body: unknown
      try {
        body = this.requestBody.trim() ? JSON.parse(this.requestBody) : {}
      } catch {
        this.response = 'Invalid JSON in request body'
        this.responseStatus = 0
        this.responseTime = null
        return
      }
      this.sending = true
      this.response = null
      this.responseStatus = null
      this.responseTime = null
      const start = Date.now()
      try {
        if (this.mockMode?.value) {
          await new Promise((r) => setTimeout(r, 300))
          this.responseStatus = 200
          this.response = JSON.stringify({ choices: [{ message: { role: 'assistant', content: 'Mock response from deployed model.' } }] }, null, 2)
          this.responseTime = Date.now() - start
          this.sending = false
          return
        }
        const config = useRuntimeConfig()
        const apiUrl = (config.public.apiUrl as string) || 'http://localhost:4000'
        const url = `${apiUrl.replace(/\/$/, '')}/v1/deployments/${this.selectedDeploymentId}/invoke`
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'X-Environment': this.environment?.value ?? 'production',
        }
        if (this.apiKey.trim()) headers.Authorization = `Bearer ${this.apiKey.trim()}`
        const res = await $fetch<string>(url, {
          method: 'POST',
          body,
          credentials: this.apiKey.trim() ? 'omit' : 'include',
          headers,
        })
        this.responseStatus = 200
        this.response = typeof res === 'string' ? res : JSON.stringify(res)
      } catch (e: unknown) {
        const err = e as { response?: { status?: number }; data?: unknown }
        this.responseStatus = err.response?.status ?? 0
        this.response = err.data != null ? JSON.stringify(err.data, null, 2) : (e as Error).message
      } finally {
        this.responseTime = Date.now() - start
        this.sending = false
      }
    },
    copyCurl() {
      let body: string
      try {
        body = this.requestBody.trim() ? JSON.stringify(JSON.parse(this.requestBody)) : '{}'
      } catch {
        body = '{}'
      }
      const auth = this.apiKey.trim() ? ` -H "Authorization: Bearer ${this.apiKey.trim()}"` : ''
      const curl = `curl -X POST "${this.invokeUrl}" -H "Content-Type: application/json"${auth} -d '${body}'`
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(curl)
      }
      // Fallback for older browsers
      try {
        const ta = document.createElement('textarea')
        ta.value = curl
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      } catch {}
    },
  },
  setup() {
    const { apiFetch, apiUrl, environment } = useAployApi()
    const { mockMode } = useMockMode()
    return { apiFetch, apiUrl, environment, mockMode }
  },
})
</script>
