<template>
  <div class="app-page-narrow">
    <AppPageHeader
      title="New pipeline"
      description="Chain steps: search your docs, call your model, or call a web URL. Start from a template or build from scratch."
      back-to="/app/pipelines"
      back-label="Pipelines"
    />
    <form @submit.prevent="onSubmit" class="space-y-6">
      <div>
        <label class="app-label">Start from a template</label>
        <p class="text-sm text-muted-foreground mb-3">Templates prefill steps with sensible defaults. You only need to pick your knowledge base or model.</p>
        <div class="space-y-2">
          <label class="flex gap-3 p-3 rounded-app border border-border/50 cursor-pointer hover:bg-muted/30 transition-colors">
            <input v-model="selectedTemplate" type="radio" value="none" class="mt-1 rounded border-border text-accent focus:ring-accent/30" />
            <div>
              <span class="font-medium text-zinc-900">Empty pipeline</span>
              <p class="text-sm text-muted-foreground mt-0.5">Add steps manually.</p>
            </div>
          </label>
          <label class="flex gap-3 p-3 rounded-app border border-border/50 cursor-pointer hover:bg-muted/30 transition-colors">
            <input v-model="selectedTemplate" type="radio" value="chat_with_docs" class="mt-1 rounded border-border text-accent focus:ring-accent/30" />
            <div>
              <span class="font-medium text-zinc-900">Chat with your docs</span>
              <p class="text-sm text-muted-foreground mt-0.5">Search your knowledge base, then send the results to your model. Great for Q&A on your content.</p>
            </div>
          </label>
          <label class="flex gap-3 p-3 rounded-app border border-border/50 cursor-pointer hover:bg-muted/30 transition-colors">
            <input v-model="selectedTemplate" type="radio" value="kb_only" class="mt-1 rounded border-border text-accent focus:ring-accent/30" />
            <div>
              <span class="font-medium text-zinc-900">Answer from knowledge base only</span>
              <p class="text-sm text-muted-foreground mt-0.5">Just search your docs and return the top chunks (e.g. for custom display or another tool).</p>
            </div>
          </label>
          <label class="flex gap-3 p-3 rounded-app border border-border/50 cursor-pointer hover:bg-muted/30 transition-colors">
            <input v-model="selectedTemplate" type="radio" value="summarize_classify" class="mt-1 rounded border-border text-accent focus:ring-accent/30" />
            <div>
              <span class="font-medium text-zinc-900">Summarize then classify</span>
              <p class="text-sm text-muted-foreground mt-0.5">Call your model twice (or model + HTTP): first summarize, then classify. Add steps and pick deployments.</p>
            </div>
          </label>
        </div>
      </div>
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
        <p class="text-sm text-muted-foreground mb-2">Order defines execution. Each step runs after the ones it depends on.</p>
        <div v-for="(step, i) in form.steps" :key="i" class="mb-4 rounded border border-border/50 p-3 space-y-2">
          <div class="flex justify-between items-center">
            <span class="font-medium text-sm">Step {{ i + 1 }}: {{ stepTypeLabel(step.type) }}</span>
            <button type="button" class="text-destructive text-sm hover:underline" @click="removeStep(i)">Remove</button>
          </div>
          <div>
            <label class="app-label text-xs">What this step does</label>
            <select v-model="step.type" class="app-select">
              <option value="retrieve">Search your knowledge base</option>
              <option value="model">Call your trained model</option>
              <option value="http">Call a web URL</option>
            </select>
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
              <label class="app-label text-xs">How many results to return (Top K)</label>
              <input v-model.number="step.topK" type="number" min="1" max="100" class="app-input" placeholder="5" />
            </div>
          </template>
          <template v-else-if="step.type === 'model'">
            <div>
              <label class="app-label text-xs">Deployment (your trained model)</label>
              <select v-model="step.deploymentId" class="app-select">
                <option value="">Select deployment</option>
                <option v-for="d in deployments" :key="d.id" :value="d.id">{{ d.model_version_id }} — {{ d.id }}</option>
              </select>
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
          <details class="mt-2">
            <summary class="app-label text-xs cursor-pointer text-muted-foreground hover:text-zinc-700">Advanced (for developers)</summary>
            <div class="mt-2 space-y-2 pl-0">
              <div>
                <label class="app-label text-xs">Step name (id)</label>
                <input v-model="step.name" class="app-input text-xs" placeholder="e.g. step1" />
              </div>
              <template v-if="step.type === 'retrieve'">
                <div>
                  <label class="app-label text-xs">Query mapping (default: use input query)</label>
                  <input v-model="step.queryMapping" class="app-input font-mono text-xs" placeholder="$.input.query" />
                </div>
              </template>
              <template v-else-if="step.type === 'model'">
                <div>
                  <label class="app-label text-xs">Input mapping (optional)</label>
                  <input v-model="step.inputMappingStr" class="app-input font-mono text-xs" placeholder='{"messages": "$.input"}' />
                </div>
              </template>
              <div v-if="i > 0">
                <label class="app-label text-xs">Depends on (step names, comma-separated)</label>
                <input v-model="step.dependsOnStr" class="app-input text-xs" placeholder="step1" />
              </div>
            </div>
          </details>
        </div>
        <AppButton type="button" variant="secondary" class="mt-2" @click="addStep">Add step</AppButton>
      </div>
      <div v-if="error">
        <p class="app-error">What happened: {{ error }}</p>
        <AppErrorRecovery :error="error" />
      </div>
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

const STEP_TYPE_LABELS: Record<string, string> = {
  retrieve: 'Search your knowledge base',
  model: 'Call your trained model',
  http: 'Call a web URL',
}

export default defineComponent({
  name: 'NewPipeline',
  data() {
    return {
      selectedTemplate: 'none' as 'none' | 'chat_with_docs' | 'kb_only' | 'summarize_classify',
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
  watch: {
    selectedTemplate(tpl: string) {
      this.applyTemplate(tpl)
    },
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
    this.applyTemplate(this.selectedTemplate)
  },
  methods: {
    stepTypeLabel(type: string): string {
      return STEP_TYPE_LABELS[type] || type
    },
    applyTemplate(tpl: string) {
      const firstKb = this.knowledgeBases[0]?.id || ''
      const firstDeploy = this.deployments[0]?.id || ''
      if (tpl === 'chat_with_docs') {
        this.form.name = 'Chat with your docs'
        this.form.description = 'Search knowledge base then answer with your model'
        this.form.steps = [
          { type: 'retrieve', name: 'retrieve', knowledgeBaseId: firstKb, topK: 5 },
          { type: 'model', name: 'model', deploymentId: firstDeploy, inputMappingStr: '{"messages": "$.input"}', dependsOnStr: 'retrieve' },
        ]
      } else if (tpl === 'kb_only') {
        this.form.name = 'Answer from knowledge base only'
        this.form.description = 'Return top chunks from your docs'
        this.form.steps = [
          { type: 'retrieve', name: 'retrieve', knowledgeBaseId: firstKb, topK: 5 },
        ]
      } else if (tpl === 'summarize_classify') {
        this.form.name = 'Summarize then classify'
        this.form.description = 'Call model twice: summarize then classify'
        this.form.steps = [
          { type: 'model', name: 'summarize', deploymentId: firstDeploy, inputMappingStr: '{"messages": "$.input"}' },
          { type: 'model', name: 'classify', deploymentId: firstDeploy, inputMappingStr: '{"messages": "$.steps.summarize"}', dependsOnStr: 'summarize' },
        ]
      } else {
        if (this.form.steps.length === 0) {
          this.form.name = ''
          this.form.description = ''
        }
      }
    },
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
