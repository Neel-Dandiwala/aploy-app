<template>
  <div class="app-page max-w-2xl">
    <AppPageHeader
      title="Try your model"
      description="Ask your deployed model something and see the reply. No JSON required."
      back-to="/app/deployments"
      back-label="Deployments"
    />
    <AppCard class="space-y-4">
      <div>
        <label class="app-label">Deployment (model to use)</label>
        <select v-model="selectedDeploymentId" class="app-select">
          <option value="">Select a deployment</option>
          <option v-for="d in deployments" :key="d.id" :value="d.id">
            {{ d.model_version_id }} — {{ d.status }}
          </option>
        </select>
      </div>
      <div>
        <label class="app-label">Ask your model something</label>
        <textarea
          v-model="prompt"
          class="app-input min-h-[100px]"
          placeholder="e.g. What are the main benefits of fine-tuning?"
          rows="3"
        />
      </div>
      <div class="flex flex-wrap gap-2">
        <AppButton :disabled="!selectedDeploymentId || !prompt.trim() || sending" @click="send">
          {{ sending ? 'Sending…' : 'Send' }}
        </AppButton>
        <NuxtLink to="/app/api-explorer" class="text-sm text-muted-foreground hover:text-accent">
          For developers: send raw JSON or copy cURL
        </NuxtLink>
      </div>
      <div v-if="reply !== null" class="rounded-app bg-muted/40 p-4 border border-border/50">
        <h3 class="app-section-title mb-2">Reply</h3>
        <p class="text-zinc-900 whitespace-pre-wrap">{{ reply }}</p>
      </div>
      <div v-if="error" class="app-error">{{ error }}</div>
      <details v-if="lastRequestJson" class="mt-2">
        <summary class="text-sm text-muted-foreground cursor-pointer hover:text-zinc-700">Show API request (for developers)</summary>
        <pre class="mt-2 p-3 rounded-app bg-muted/50 text-xs overflow-auto">{{ lastRequestJson }}</pre>
      </details>
    </AppCard>
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
  name: 'TryDeployment',
  data() {
    return {
      deployments: [] as DeploymentItem[],
      selectedDeploymentId: '',
      prompt: '',
      sending: false,
      reply: null as string | null,
      error: '',
      lastRequestJson: '',
    }
  },
  async mounted() {
    await this.loadDeployments()
    const deploymentId = (this.$route.query.deployment as string) || ''
    if (deploymentId && this.deployments.some((d) => d.id === deploymentId)) {
      this.selectedDeploymentId = deploymentId
    } else if (this.deployments.length && !this.selectedDeploymentId) {
      this.selectedDeploymentId = this.deployments[0].id
    }
  },
  setup() {
    const { apiFetch, apiUrl, environment } = useAployApi()
    const { mockMode } = useMockMode()
    return { apiFetch, apiUrl, environment, mockMode }
  },
  methods: {
    async loadDeployments() {
      try {
        const data = await this.apiFetch<{ deployments: DeploymentItem[] }>('/api/deploy')
        this.deployments = data.deployments || []
      } catch {
        this.deployments = []
      }
    },
    async send() {
      if (!this.selectedDeploymentId || !this.prompt.trim()) return
      const body = {
        messages: [{ role: 'user' as const, content: this.prompt.trim() }],
        max_tokens: 256,
      }
      this.lastRequestJson = JSON.stringify(body, null, 2)
      this.sending = true
      this.reply = null
      this.error = ''
      try {
        if (this.mockMode?.value) {
          await new Promise((r) => setTimeout(r, 400))
          this.reply = 'Mock response from your deployed model. In production, you\'ll see the real model reply here.'
          this.sending = false
          return
        }
        const apiUrl = (useRuntimeConfig().public.apiUrl as string) || 'http://localhost:4000'
        const url = `${apiUrl.replace(/\/$/, '')}/v1/deployments/${this.selectedDeploymentId}/invoke`
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'X-Environment': this.environment?.value ?? 'production',
        }
        const res = await $fetch<unknown>(url, {
          method: 'POST',
          body,
          credentials: 'include',
          headers,
        })
        const obj = res as { choices?: Array<{ message?: { content?: string } }>; raw?: string }
        if (obj.choices?.[0]?.message?.content != null) {
          this.reply = obj.choices[0].message.content
        } else if (typeof (obj as { raw?: string }).raw === 'string') {
          this.reply = (obj as { raw: string }).raw
        } else {
          this.reply = JSON.stringify(res, null, 2)
        }
      } catch (e: unknown) {
        const err = e as { data?: { error?: string; message?: string }; response?: { status?: number } }
        this.error = err.data?.message || err.data?.error || (e as Error).message || 'Request failed'
      } finally {
        this.sending = false
      }
    },
  },
})
</script>
