<template>
  <div class="app-page">
    <AppPageHeader title="Triggers">
      <template #actions>
        <AppButton @click="showCreate = true">Create trigger</AppButton>
      </template>
    </AppPageHeader>
    <p v-if="loading" class="text-muted-foreground text-sm">Loading…</p>
    <p v-else-if="error" class="app-error">{{ error }}</p>
    <div v-else class="space-y-2">
      <div
        v-for="t in triggers"
        :key="t.id"
        class="rounded border border-border/50 bg-muted/30 px-4 py-3 flex flex-wrap items-center justify-between gap-2"
      >
        <div>
          <span class="font-medium">{{ t.name }}</span>
          <span class="text-muted-foreground text-sm ml-2">{{ t.type }}</span>
          <span class="text-muted-foreground text-sm ml-2">Pipeline {{ t.pipeline_id }}</span>
        </div>
        <div class="flex items-center gap-2">
          <code v-if="t.webhook_url" class="text-xs bg-surface-overlay px-2 py-1 rounded break-all max-w-md text-zinc-800">{{ t.webhook_url }}</code>
          <button type="button" class="text-destructive text-sm hover:underline" @click="deleteTrigger(t.id)">Delete</button>
        </div>
      </div>
      <p v-if="!loading && !error && triggers.length === 0" class="text-muted-foreground text-sm">
        No triggers. Create a webhook to run a pipeline from Zapier, cron, or your app.
      </p>
    </div>
    <AppCard v-if="showCreate" class="mt-6">
      <h3 class="app-section-title mb-3">Create trigger</h3>
      <div class="space-y-3">
        <div>
          <label class="app-label">Pipeline</label>
          <select v-model="createForm.pipeline_id" class="app-select">
            <option value="">Select pipeline</option>
            <option v-for="p in pipelines" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
        </div>
        <div>
          <label class="app-label">Name</label>
          <input v-model="createForm.name" class="app-input" placeholder="Webhook" />
        </div>
        <div>
          <label class="app-label">Type</label>
          <select v-model="createForm.type" class="app-select">
            <option value="webhook">Webhook</option>
          </select>
        </div>
        <div>
          <label class="app-label">Webhook secret (optional)</label>
          <input v-model="createForm.webhook_secret" class="app-input" type="password" placeholder="Set X-Webhook-Secret header" />
        </div>
        <div class="flex gap-2">
          <AppButton :disabled="creating" @click="onCreate">{{ creating ? 'Creating…' : 'Create' }}</AppButton>
          <AppButton variant="secondary" @click="showCreate = false">Cancel</AppButton>
        </div>
      </div>
    </AppCard>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

definePageMeta({ layout: 'app' })

interface TriggerItem {
  id: string
  pipeline_id: string
  name: string
  type: string
  status: string
  webhook_url?: string | null
}

interface PipelineItem { id: string; name: string }

export default defineComponent({
  name: 'TriggersList',
  data() {
    return {
      triggers: [] as TriggerItem[],
      pipelines: [] as PipelineItem[],
      loading: true,
      error: '',
      showCreate: false,
      creating: false,
      createForm: {
        pipeline_id: '',
        name: 'Webhook',
        type: 'webhook' as const,
        webhook_secret: '',
      },
    }
  },
  setup() {
    const { apiFetch } = useAployApi()
    return { apiFetch }
  },
  async mounted() {
    await Promise.all([this.loadTriggers(), this.loadPipelines()])
  },
  methods: {
    async loadTriggers() {
      this.loading = true
      this.error = ''
      try {
        const data = await this.apiFetch<{ triggers: TriggerItem[] }>('/api/triggers')
        this.triggers = data.triggers || []
      } catch (e) {
        this.error = (e as Error).message || 'Failed to load triggers'
      } finally {
        this.loading = false
      }
    },
    async loadPipelines() {
      try {
        const data = await this.apiFetch<{ pipelines: PipelineItem[] }>('/api/pipelines')
        this.pipelines = data.pipelines || []
      } catch {
        this.pipelines = []
      }
    },
    async onCreate() {
      if (!this.createForm.pipeline_id) return
      this.creating = true
      try {
        await this.apiFetch('/api/triggers', {
          method: 'POST',
          body: {
            pipeline_id: this.createForm.pipeline_id,
            name: this.createForm.name || 'Webhook',
            type: this.createForm.type,
            webhook_secret: this.createForm.webhook_secret || undefined,
          },
        })
        this.showCreate = false
        this.createForm = { pipeline_id: '', name: 'Webhook', type: 'webhook', webhook_secret: '' }
        await this.loadTriggers()
      } catch (e) {
        alert((e as Error).message || 'Create failed')
      } finally {
        this.creating = false
      }
    },
    async deleteTrigger(id: string) {
      if (!confirm('Delete this trigger?')) return
      try {
        await this.apiFetch(`/api/triggers/${id}`, { method: 'DELETE' })
        await this.loadTriggers()
      } catch (e) {
        alert((e as Error).message || 'Delete failed')
      }
    },
  },
})
</script>
