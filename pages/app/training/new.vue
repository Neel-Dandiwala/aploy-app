<template>
  <div class="app-page-narrow">
    <AppPageHeader
      title="Configure training"
      description="Select dataset version and config. Estimated ~$14.50, ~2h."
      back-to="/app/projects/proj_demo1"
      back-label="Project"
    />
    <form @submit.prevent="onSubmit" class="space-y-6">
      <div>
        <label class="app-label">Dataset version</label>
        <select v-model="form.dataset_version_id" class="app-select">
          <option value="dsv_1">Support chat v1 (10,200 rows)</option>
        </select>
      </div>
      <div>
        <label class="app-label">Epochs</label>
        <input
          v-model.number="form.epochs"
          type="number"
          class="app-input"
          min="1"
          max="20"
        />
      </div>
      <div>
        <label class="app-label">LoRA rank</label>
        <select v-model.number="form.lora_rank" class="app-select">
          <option :value="8">8</option>
          <option :value="16">16</option>
          <option :value="32">32</option>
        </select>
      </div>
      <div class="flex flex-wrap gap-3 pt-1">
        <AppButton type="submit" :disabled="loading">
          {{ loading ? 'Starting…' : 'Start training' }}
        </AppButton>
        <AppButton variant="secondary" to="/app/projects/proj_demo1">Cancel</AppButton>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

definePageMeta({ layout: 'app' })

export default defineComponent({
  name: 'NewTraining',
  data() {
    return {
      form: { dataset_version_id: 'dsv_1', epochs: 3, lora_rank: 16, compute_mode: 'auto' },
      loading: false,
    }
  },
  setup() {
    const { apiFetch } = useAployApi()
    return { apiFetch }
  },
  methods: {
    async onSubmit() {
      this.loading = true
      try {
        const data = await this.apiFetch<{ id: string }>('/api/runs', {
          method: 'POST',
          body: {
            project_id: 'proj_demo1',
            dataset_version_id: this.form.dataset_version_id,
            config: { epochs: this.form.epochs, lora_rank: this.form.lora_rank },
            compute: { mode: this.form.compute_mode },
          },
        })
        await navigateTo(`/app/runs/${data.id}`)
      } finally {
        this.loading = false
      }
    },
  },
})
</script>
