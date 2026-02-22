<template>
  <div class="app-page-narrow">
    <AppPageHeader
      title="Deploy model"
      description="We host your model; you get an API. Or export weights."
      back-to="/app/deployments"
      back-label="Deployments"
    />
    <form @submit.prevent="onSubmit" class="space-y-6">
      <div>
        <label class="app-label">Model version</label>
        <select v-model="form.model_version_id" class="app-select">
          <option value="mv_1">mv_1 (Support Bot, run_1)</option>
        </select>
      </div>
      <div>
        <label class="app-label">Type</label>
        <div class="flex gap-6">
          <label class="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-white transition-colors">
            <input v-model="form.type" type="radio" value="api" class="rounded border-border text-accent focus:ring-accent/30" />
            <span>API endpoint</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-white transition-colors">
            <input v-model="form.type" type="radio" value="export" class="rounded border-border text-accent focus:ring-accent/30" />
            <span>Export weights</span>
          </label>
        </div>
      </div>
      <div v-if="form.type === 'api'">
        <label class="app-label">Region</label>
        <select v-model="form.region" class="app-select">
          <option value="us-east-1">us-east-1</option>
          <option value="eu-west-1">eu-west-1</option>
        </select>
      </div>
      <div class="flex flex-wrap gap-3 pt-1">
        <AppButton type="submit" :disabled="loading">
          {{ loading ? 'Deploying…' : form.type === 'api' ? 'Deploy to API' : 'Export weights' }}
        </AppButton>
        <AppButton variant="secondary" to="/app/deployments">Cancel</AppButton>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

definePageMeta({ layout: 'app' })

export default defineComponent({
  name: 'NewDeployment',
  data() {
    return {
      form: { model_version_id: 'mv_1', type: 'api' as 'api' | 'export', region: 'us-east-1' },
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
        await this.apiFetch('/api/deploy', {
          method: 'POST',
          body: {
            model_version_id: this.form.model_version_id,
            type: this.form.type,
            config: this.form.type === 'api' ? { region: this.form.region } : {},
          },
        })
        await navigateTo('/app/deployments')
      } finally {
        this.loading = false
      }
    },
  },
})
</script>
