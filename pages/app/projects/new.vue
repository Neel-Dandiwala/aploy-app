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
        <label class="app-label">Base model *</label>
        <select v-model="form.base_model" class="app-select">
          <option value="mistralai/Mistral-7B-v0.2">Mistral 7B v0.2</option>
          <option value="meta-llama/Llama-3.2-3B">Llama 3.2 3B</option>
        </select>
      </div>
      <div>
        <label class="app-label">Training objective *</label>
        <select v-model="form.objective" class="app-select">
          <option value="sft">SFT</option>
          <option value="dpo">DPO</option>
          <option value="rlhf">RLHF</option>
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
