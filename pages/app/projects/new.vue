<template>
  <div class="app-page-narrow">
    <AppPageHeader
      title="Create project"
      description="Set base model and training objective."
      back-to="/app/projects"
      back-label="Projects"
    />
    <form @submit.prevent="onSubmit" class="space-y-6">
      <div>
        <label class="app-label">What do you want to do?</label>
        <p class="text-sm text-muted-foreground mb-3">Choose the goal that best matches your use case. We'll set the right training mode for you.</p>
        <div class="space-y-2">
          <label class="flex gap-3 p-3 rounded-app border border-border/50 cursor-pointer hover:bg-muted/30 transition-colors">
            <input v-model="form.objective" type="radio" value="sft" class="mt-1 rounded border-border text-accent focus:ring-accent/30" />
            <div>
              <span class="font-medium text-zinc-900">Improve a model for chat</span>
              <p class="text-sm text-muted-foreground mt-0.5">Train on example conversations so the model responds in your style or domain (e.g. support, sales).</p>
            </div>
          </label>
          <label class="flex gap-3 p-3 rounded-app border border-border/50 cursor-pointer hover:bg-muted/30 transition-colors">
            <input v-model="form.objective" type="radio" value="dpo" class="mt-1 rounded border-border text-accent focus:ring-accent/30" />
            <div>
              <span class="font-medium text-zinc-900">Train from preference data</span>
              <p class="text-sm text-muted-foreground mt-0.5">Use pairs of good vs. bad answers so the model learns what you prefer (e.g. helpful, concise, safe).</p>
            </div>
          </label>
          <label class="flex gap-3 p-3 rounded-app border border-border/50 cursor-pointer hover:bg-muted/30 transition-colors">
            <input v-model="form.objective" type="radio" value="rlhf" class="mt-1 rounded border-border text-accent focus:ring-accent/30" />
            <div>
              <span class="font-medium text-zinc-900">Train with human feedback</span>
              <p class="text-sm text-muted-foreground mt-0.5">Use human ratings or rewards to refine the model (advanced; often used with preference data).</p>
            </div>
          </label>
        </div>
      </div>
      <div>
        <label class="app-label">Project name *</label>
        <input
          v-model="form.name"
          class="app-input"
          placeholder="Support Bot"
          required
        />
      </div>
      <div>
        <label class="app-label">Description</label>
        <textarea
          v-model="form.description"
          class="app-textarea"
          placeholder="Optional"
        />
      </div>
      <div>
        <label class="app-label">
          <AppHelpTip tip="The starting model we'll tune. Smaller models are faster and cheaper; larger ones can capture more nuance.">Base model *</AppHelpTip>
        </label>
        <select v-model="form.base_model" class="app-select">
          <option value="mistralai/Mistral-7B-v0.2">Mistral 7B v0.2</option>
          <option value="meta-llama/Llama-3.2-3B">Llama 3.2 3B</option>
        </select>
      </div>
      <div>
        <label class="app-label">
          <AppHelpTip tip="Already set above by your goal. SFT = chat-style training, DPO = preference pairs, RLHF = human feedback.">Training objective *</AppHelpTip>
        </label>
        <select v-model="form.objective" class="app-select">
          <option value="sft">SFT — Improve for chat</option>
          <option value="dpo">DPO — Preference data</option>
          <option value="rlhf">RLHF — Human feedback</option>
        </select>
      </div>
      <p v-if="error" class="app-error">{{ error }}</p>
      <div class="flex flex-wrap gap-3 pt-1">
        <AppButton type="submit" :disabled="loading">
          {{ loading ? 'Creating…' : 'Create project' }}
        </AppButton>
        <AppButton variant="secondary" to="/app/projects">Cancel</AppButton>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

definePageMeta({ layout: 'app' })

export default defineComponent({
  name: 'NewProject',
  data() {
    return {
      form: {
        name: '',
        description: '',
        base_model: 'mistralai/Mistral-7B-v0.2',
        objective: 'sft',
      },
      loading: false,
      error: '',
    }
  },
  setup() {
    const { apiFetch } = useAployApi()
    return { apiFetch }
  },
  methods: {
    async onSubmit() {
      this.error = ''
      this.loading = true
      try {
        const data = await this.apiFetch<{ id: string }>('/api/projects', { method: 'POST', body: this.form })
        await navigateTo(`/app/projects/${data.id}`)
      } catch (e: unknown) {
        this.error = (e as Error).message || 'Failed'
      } finally {
        this.loading = false
      }
    },
  },
})
</script>
