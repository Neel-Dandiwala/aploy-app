<template>
  <div class="app-page">
    <AppPageHeader title="Evaluations" />
    <p v-if="loading" class="text-muted-foreground text-sm">Loading…</p>
    <p v-else-if="error" class="app-error">{{ error }}</p>
    <template v-else>
      <div v-for="e in evaluations" :key="e.id" class="mb-4">
        <AppCard>
          <h3 class="app-section-title mb-1">Run {{ e.run_id }} vs baseline</h3>
          <p class="app-section-description mb-6">Status: {{ e.status }}. <NuxtLink :to="`/app/evaluations/${e.id}`" class="text-accent hover:text-accent-hover">View metrics</NuxtLink>.</p>
          <AppButton to="/app/deployments/new" class="mt-4">Deploy tuned model</AppButton>
        </AppCard>
      </div>
      <p v-if="!loading && !error && evaluations.length === 0" class="app-empty">No evaluations yet. Run training first; evaluations run after a successful run.</p>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

definePageMeta({ layout: 'app' })

export default defineComponent({
  name: 'EvaluationsList',
  data() {
    return {
      evaluations: [] as Array<{ id: string; run_id: string; status: string }>,
      loading: true,
      error: '',
    }
  },
  setup() {
    const { apiFetch } = useAployApi()
    return { apiFetch }
  },
  async mounted() {
    await this.load()
  },
  methods: {
    async load() {
      this.loading = true
      this.error = ''
      try {
        const data = await this.apiFetch<{ evaluations: Array<{ id: string; run_id: string; status: string }> }>('/api/evaluate')
        this.evaluations = data.evaluations || []
      } catch (e) {
        this.error = (e as Error).message || 'Failed to load evaluations'
      } finally {
        this.loading = false
      }
    },
  },
})
</script>
