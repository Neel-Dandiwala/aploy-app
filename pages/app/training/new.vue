<template>
  <div class="app-page-narrow">
    <AppPageHeader
      title="Configure training"
      :description="costDescription"
      back-to="/app/projects/proj_demo1"
      back-label="Project"
    />
    <form @submit.prevent="onSubmit" class="space-y-6">
      <div>
        <label class="app-label">What do you want to achieve?</label>
        <p class="text-sm text-muted-foreground mb-3">We'll apply recommended settings. You can change them in Advanced below.</p>
        <div class="space-y-2">
          <label class="flex gap-3 p-3 rounded-app border border-border/50 cursor-pointer hover:bg-muted/30 transition-colors">
            <input v-model="trainingGoal" type="radio" value="chat" class="mt-1 rounded border-border text-accent focus:ring-accent/30" />
            <div>
              <span class="font-medium text-zinc-900">A model tuned for chat</span>
              <p class="text-sm text-muted-foreground mt-0.5">Best for support, sales, or any conversational use. Uses recommended epochs and adapter size.</p>
            </div>
          </label>
          <label class="flex gap-3 p-3 rounded-app border border-border/50 cursor-pointer hover:bg-muted/30 transition-colors">
            <input v-model="trainingGoal" type="radio" value="preferences" class="mt-1 rounded border-border text-accent focus:ring-accent/30" />
            <div>
              <span class="font-medium text-zinc-900">A model that learns your preferences</span>
              <p class="text-sm text-muted-foreground mt-0.5">Best when you have good vs. bad answer pairs. Uses settings suited for preference training.</p>
            </div>
          </label>
          <label class="flex gap-3 p-3 rounded-app border border-border/50 cursor-pointer hover:bg-muted/30 transition-colors">
            <input v-model="trainingGoal" type="radio" value="custom" class="mt-1 rounded border-border text-accent focus:ring-accent/30" />
            <div>
              <span class="font-medium text-zinc-900">I'll set my own (Advanced)</span>
              <p class="text-sm text-muted-foreground mt-0.5">Use recommended as a starting point, then adjust epochs and adapter size in Advanced.</p>
            </div>
          </label>
        </div>
        <AppButton type="button" variant="secondary" class="mt-3" @click="applyRecommended">
          Use recommended settings
        </AppButton>
      </div>
      <div>
        <label class="app-label">
          <AppHelpTip tip="A saved snapshot of your data. Creating a version locks the data so this training run is reproducible.">Dataset version</AppHelpTip>
        </label>
        <select v-model="form.dataset_version_id" class="app-select">
          <option value="dsv_1">Support chat v1 (10,200 rows)</option>
        </select>
      </div>
      <details class="rounded-app border border-border/50 overflow-hidden">
        <summary class="app-label cursor-pointer px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors list-none flex items-center gap-2">
          <span class="inline-block w-4 h-4 text-muted-foreground">▶</span>
          Advanced (epochs, adapter size)
        </summary>
        <div class="px-4 pb-4 pt-1 space-y-4 border-t border-border/50">
          <div>
            <label class="app-label">
              <AppHelpTip tip="How many times we go through your data. More epochs can improve quality but take longer and cost more; 3 is usually a good start.">Epochs</AppHelpTip>
            </label>
            <input
              v-model.number="form.epochs"
              type="number"
              class="app-input"
              min="1"
              max="20"
            />
          </div>
          <div>
            <label class="app-label">
              <AppHelpTip tip="Adapter size — higher can fit more nuance but may overfit. Default 16 is usually best.">LoRA rank</AppHelpTip>
            </label>
            <select v-model.number="form.lora_rank" class="app-select">
              <option :value="8">8</option>
              <option :value="16">16</option>
              <option :value="32">32</option>
            </select>
          </div>
        </div>
      </details>
      <div v-if="testRun" class="rounded-app border border-border/50 p-4 bg-muted/20">
        <h4 class="app-section-title mb-2">Safeguard test</h4>
        <p v-if="testRun.status === 'queued' || testRun.status === 'running'" class="text-sm text-muted-foreground">
          Running test… ({{ testRun.status }})
        </p>
        <p v-else-if="testRun.test_passed === true" class="text-sm text-emerald-600 flex items-center gap-2">
          <span class="inline-block w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600">✓</span>
          Test passed. Ready to start training.
        </p>
        <p v-else-if="testRun.test_passed === false || testRun.status === 'failed'" class="text-sm text-destructive flex items-center gap-2">
          <span class="inline-block w-5 h-5 rounded-full bg-destructive/20 flex items-center justify-center text-destructive">✗</span>
          Test failed. Fix your script or config before training.
        </p>
        <AppButton
          v-if="!testRun.id"
          type="button"
          variant="secondary"
          class="mt-2"
          :disabled="loading"
          @click="runTest"
        >
          Run safeguard test first
        </AppButton>
      </div>
      <div v-if="error">
        <p class="app-error">What happened: {{ error }}</p>
        <AppErrorRecovery :error="error" />
      </div>
      <div class="flex flex-wrap gap-3 pt-1">
        <AppButton
          type="submit"
          :disabled="loading || testRun?.test_passed !== true"
          :title="testRun?.test_passed !== true ? 'Run safeguard test first and wait for it to pass' : ''"
        >
          {{ loading ? 'Starting…' : 'Start training' }}
        </AppButton>
        <AppButton variant="secondary" to="/app/projects/proj_demo1">Cancel</AppButton>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

const RECOMMENDED = { epochs: 3, lora_rank: 16 }

export default defineComponent({
  name: 'NewTraining',
  data() {
    return {
      trainingGoal: 'chat' as 'chat' | 'preferences' | 'custom',
      form: {
        project_id: 'proj_demo1',
        script_version_id: 'sv_mock1',
        dataset_version_id: 'dsv_1',
        epochs: RECOMMENDED.epochs,
        lora_rank: RECOMMENDED.lora_rank,
        compute_mode: 'auto' as const,
      },
      testRun: null as { id?: string; status?: string; test_passed?: boolean } | null,
      loading: false,
      error: '',
    }
  },
  computed: {
    costDescription(): string {
      return 'Select your data and goal. Estimated ~$14.50, ~2h. You\'ll get a model tuned for your use case, ready to deploy or compare in Evaluations.'
    },
  },
  watch: {
    trainingGoal(v: string) {
      if (v === 'chat' || v === 'preferences') this.applyRecommended()
    },
  },
  setup() {
    const { apiFetch } = useAployApi()
    return { apiFetch }
  },
  methods: {
    applyRecommended() {
      this.form.epochs = RECOMMENDED.epochs
      this.form.lora_rank = RECOMMENDED.lora_rank
    },
    async runTest() {
      this.error = ''
      this.loading = true
      try {
        const data = await this.apiFetch<{ id: string }>('/api/runs/test', {
          method: 'POST',
          body: {
            project_id: this.form.project_id,
            script_version_id: this.form.script_version_id,
            dataset_version_id: this.form.dataset_version_id,
            config: { epochs: this.form.epochs, lora_rank: this.form.lora_rank },
          },
        })
        this.testRun = { id: data.id, status: 'queued' }
        this.pollTestRun(data.id)
      } catch (e) {
        this.error = (e as Error).message || 'Test failed'
      } finally {
        this.loading = false
      }
    },
    async pollTestRun(id: string) {
      const maxAttempts = 30
      for (let i = 0; i < maxAttempts; i++) {
        await new Promise((r) => setTimeout(r, 1000))
        try {
          const run = await this.apiFetch<{ status: string; test_passed?: boolean }>(`/api/runs/${id}`)
          if (this.testRun) this.testRun = { ...this.testRun, status: run.status, test_passed: run.test_passed }
          if (run.status === 'succeeded' || run.status === 'failed') break
        } catch {
          break
        }
      }
    },
    async onSubmit() {
      this.error = ''
      this.loading = true
      try {
        const data = await this.apiFetch<{ id: string }>('/api/runs', {
          method: 'POST',
          body: {
            project_id: this.form.project_id,
            script_version_id: this.form.script_version_id,
            dataset_version_id: this.form.dataset_version_id,
            config: { epochs: this.form.epochs, lora_rank: this.form.lora_rank },
            compute: { mode: this.form.compute_mode },
          },
        })
        await navigateTo(`/app/runs/${data.id}`)
      } catch (e) {
        this.error = (e as Error).message || 'Failed to start training'
      } finally {
        this.loading = false
      }
    },
  },
})
</script>
