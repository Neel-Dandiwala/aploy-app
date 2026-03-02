<template>
  <div class="app-page">
    <AppPageHeader
      :title="`Evaluation ${$route.params.id}`"
      back-to="/app/evaluations"
      back-label="Evaluations"
    />
    <p v-if="loading" class="text-muted-foreground text-sm">Loading…</p>
    <p v-else-if="error" class="app-error">{{ error }}</p>
    <template v-else-if="evaluation">
      <p class="text-muted-foreground text-sm mb-4">Run {{ evaluation.run_id }} vs baseline · Status: {{ evaluation.status }}</p>
      <AppCard>
        <table v-if="evaluation.metrics && Object.keys(evaluation.metrics).length" class="app-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Baseline</th>
              <th>Tuned</th>
              <th>Δ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(val, key) in evaluation.metrics" :key="key">
              <td class="text-muted-foreground">{{ metricLabel(key) }}</td>
              <td class="text-zinc-900">{{ metricVal(val, 'baseline') }}</td>
              <td class="text-zinc-900">{{ metricVal(val, 'tuned') }}</td>
              <td class="font-medium" :class="metricDeltaClass(val)">
                {{ metricDelta(val) }}
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else class="text-muted-foreground text-sm">No metrics yet. Evaluation may still be running.</p>
        <AppButton to="/app/deployments/new" class="mt-4">Deploy tuned model</AppButton>
      </AppCard>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

definePageMeta({ layout: 'app' })

export default defineComponent({
  name: 'EvaluationDetail',
  data() {
    return {
      evaluation: null as {
        run_id?: string
        status?: string
        metrics?: Record<string, { baseline?: number; tuned?: number; delta_pct?: number }>
      } | null,
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
    metricLabel(k: string) {
      return String(k).replace(/_/g, ' ')
    },
    metricVal(val: unknown, field: 'baseline' | 'tuned') {
      const v = val && typeof val === 'object' && field in val ? (val as Record<string, unknown>)[field] : undefined
      return v != null ? String(v) : '—'
    },
    metricDelta(val: unknown) {
      const v = val && typeof val === 'object' && 'delta_pct' in val ? (val as Record<string, unknown>).delta_pct : undefined
      return v != null ? `${v}%` : '—'
    },
    metricDeltaClass(val: unknown) {
      const v = val && typeof val === 'object' && 'delta_pct' in val ? (val as Record<string, unknown>).delta_pct : undefined
      const n = typeof v === 'number' ? v : 0
      return n >= 0 ? 'text-emerald-500' : 'text-amber-500'
    },
    async load() {
      const id = (this.$route.params as { id: string }).id
      this.loading = true
      this.error = ''
      try {
        this.evaluation = await this.apiFetch<typeof this.evaluation>(`/api/evaluate/${id}`)
      } catch (e) {
        this.error = (e as Error).message || 'Failed to load evaluation'
      } finally {
        this.loading = false
      }
    },
  },
})
</script>
