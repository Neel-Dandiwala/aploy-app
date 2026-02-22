<template>
  <div class="app-page-narrow">
    <AppPageHeader
      title="New pipeline"
      description="Add steps: retrieve (knowledge base), model (deployment), or HTTP. Order defines execution."
      back-to="/app/pipelines"
      back-label="Pipelines"
    />
    <form @submit.prevent="onSubmit" class="space-y-6">
      <div>
        <label class="app-label">Name</label>
        <input v-model="form.name" class="app-input" placeholder="e.g. Summarize then classify" />
      </div>
      <div>
        <label class="app-label">Description (optional)</label>
        <input v-model="form.description" class="app-input" placeholder="Short description" />
      </div>
      <div>
        <label class="app-label">Steps</label>
        <div v-for="(step, i) in form.steps" :key="i" class="mb-4 rounded border border-border/50 p-3 space-y-2">
          <div class="flex justify-between items-center">
            <span class="font-medium text-sm">Step {{ i + 1 }}</span>
            <button type="button" class="text-destructive text-sm hover:underline" @click="removeStep(i)">Remove</button>
          </div>
          <div>
            <label class="app-label text-xs">Type</label>
            <select v-model="step.type" class="app-select">
              <option value="retrieve">Retrieve (knowledge base)</option>
              <option value="model">Model (deployment)</option>
              <option value="http">HTTP request</option>
            </select>
          </div>
          <div>
            <label class="app-label text-xs">Name (id)</label>
            <input v-model="step.name" class="app-input" placeholder="e.g. step1" />
          </div>
          <template v-if="step.type === 'retrieve'">
            <div>
              <label class="app-label text-xs">Knowledge base</label>
              <select v-model="step.knowledgeBaseId" class="app-select">
                <option value="">Select knowledge base</option>
                <option v-for="kb in knowledgeBases" :key="kb.id" :value="kb.id">{{ kb.name }}</option>
              </select>
            </div>
            <div>
              <label class="app-label text-xs">Top K</label>
              <input v-model.number="step.topK" type="number" min="1" max="100" class="app-input" placeholder="5" />
            </div>
            <div>
              <label class="app-label text-xs">Query mapping (optional, default $.input.query)</label>
              <input v-model="step.queryMapping" class="app-input font-mono text-xs" placeholder="$.input.query" />
            </div>
          </template>
          <template v-else-if="step.type === 'model'">
            <div>
              <label class="app-label text-xs">Deployment</label>
              <select v-model="step.deploymentId" class="app-select">
                <option value="">Select deployment</option>
                <option v-for="d in deployments" :key="d.id" :value="d.id">{{ d.id }} — {{ d.model_version_id }}</option>
              </select>
            </div>
            <div>
              <label class="app-label text-xs">Input mapping (optional) e.g. {"messages": "$.input"}</label>
              <input v-model="step.inputMappingStr" class="app-input font-mono text-xs" placeholder='{"messages": "$.input"}'>
            </div>
          </template>
          <template v-else>
            <div>
              <label class="app-label text-xs">URL</label>
              <input v-model="step.url" class="app-input" placeholder="https://..." />
            </div>
            <div>
              <label class="app-label text-xs">Method</label>
              <select v-model="step.method" class="app-select">
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>
            </div>
          </template>
          <div v-if="i > 0">
            <label class="app-label text-xs">Depends on (step name, comma-separated)</label>
            <input v-model="step.dependsOnStr" class="app-input text-xs" placeholder="step1" />
          </div>
        </div>
        <AppButton type="button" variant="secondary" class="mt-2" @click="addStep">Add step</AppButton>
      </div>
      <p v-if="error" class="app-error">{{ error }}</p>
      <div class="flex gap-3">
        <AppButton type="submit" :disabled="loading">{{ loading ? 'Creating…' : 'Create pipeline' }}</AppButton>
        <AppButton variant="secondary" to="/app/pipelines">Cancel</AppButton>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

definePageMeta({ layout: 'app' })

interface DeploymentItem { id: string; model_version_id: string }
interface KnowledgeBaseItem { id: string; name: string }

interface StepForm {
  type: 'model' | 'http' | 'retrieve'
  name: string
  deploymentId?: string
  inputMappingStr?: string
  knowledgeBaseId?: string
  topK?: number
  queryMapping?: string
  url?: string
  method?: string
  dependsOnStr?: string
}

export default defineComponent({
  name: 'NewPipeline',
  data() {
    return {
      form: {
        name: '',
        description: '',
        steps: [] as StepForm[],
      },
      deployments: [] as DeploymentItem[],
      knowledgeBases: [] as KnowledgeBaseItem[],
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
      const data = await this.apiFetch<{ deployments: DeploymentItem[] }>('/api/deploy')
      this.deployments = data.deployments || []
    } catch {
      this.deployments = []
    }
    try {
      const kbData = await this.apiFetch<{ knowledge_bases: KnowledgeBaseItem[] }>('/api/knowledge-bases')
      this.knowledgeBases = kbData.knowledge_bases || []
    } catch {
      this.knowledgeBases = []
    }
  },
  methods: {
    addStep() {
      this.form.steps.push({
        type: 'model',
        name: `step${this.form.steps.length + 1}`,
        deploymentId: '',
        method: 'POST',
        topK: 5,
      })
    },
    removeStep(i: number) {
      this.form.steps.splice(i, 1)
    },
    buildSteps() {
      return this.form.steps.map((s) => {
        const step: Record<string, unknown> = {
          id: s.name,
          type: s.type,
          name: s.name,
        }
        if (s.type === 'retrieve') {
          step.knowledgeBaseId = s.knowledgeBaseId || undefined
          step.topK = s.topK ?? 5
          if (s.queryMapping?.trim()) step.queryMapping = s.queryMapping.trim()
        } else if (s.type === 'model') {
          step.deploymentId = s.deploymentId || undefined
          if (s.inputMappingStr?.trim()) {
            try {
              step.inputMapping = JSON.parse(s.inputMappingStr)
            } catch {}
          }
        } else {
          step.url = s.url
          step.method = s.method || 'GET'
        }
        if (s.dependsOnStr?.trim()) {
          step.dependsOn = s.dependsOnStr.split(',').map((x) => x.trim()).filter(Boolean)
        }
        return step
      })
    },
    async onSubmit() {
      this.error = ''
      this.loading = true
      try {
        const data = await this.apiFetch<{ id: string }>('/api/pipelines', {
          method: 'POST',
          body: {
            name: this.form.name || 'Untitled pipeline',
            description: this.form.description,
            steps: this.buildSteps(),
          },
        })
        await navigateTo(`/app/pipelines/${data.id}`)
      } catch (e) {
        this.error = (e as Error).message || 'Failed to create pipeline'
      } finally {
        this.loading = false
      }
    },
  },
})
</script>
