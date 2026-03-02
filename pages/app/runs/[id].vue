<template>
  <div class="app-page">
    <AppPageHeader
      :title="`Run ${runIdShort}`"
      :back-to="run?.project_id ? `/app/projects/${run.project_id}/runs` : '/app/runs'"
      :back-label="run?.project_id ? 'Project runs' : 'Runs'"
    />
    <p v-if="loading" class="text-muted-foreground text-sm">Loading…</p>
    <p v-else-if="error" class="app-error">{{ error }}</p>
    <template v-else-if="run">
      <div class="flex flex-wrap items-center gap-3 mb-4">
        <span
          class="px-2.5 py-1 rounded-app text-sm font-medium border"
          :class="statusClass"
        >
          {{ run.status }}
        </span>
        <span v-if="run.type" class="text-muted-foreground text-sm">{{ run.type }}</span>
        <span
          v-if="run.type === 'safeguard'"
          class="px-2 py-0.5 rounded text-xs font-medium"
          :class="run.test_passed === true ? 'bg-emerald-100 text-emerald-700' : run.test_passed === false ? 'bg-red-100 text-red-700' : 'bg-zinc-200 text-zinc-600'"
        >
          {{ run.test_passed === true ? '✓ Passed' : run.test_passed === false ? '✗ Failed' : 'Pending' }}
        </span>
      </div>
      <AppCard>
        <h3 class="app-section-title mb-2">Summary</h3>
        <p class="text-muted-foreground text-sm">
          <span v-if="run.duration_sec">Duration: {{ Math.round(run.duration_sec / 3600) }}h</span>
          <span v-if="run.duration_sec && run.cost_usd != null"> · </span>
          <span v-if="run.cost_usd != null">Cost: ${{ run.cost_usd }}</span>
          <span v-if="runMetricsLoss != null"> · Loss: {{ runMetricsLoss }}</span>
        </p>
        <div v-if="run.project_id" class="flex flex-wrap gap-3 mt-4">
          <NuxtLink :to="`/app/projects/${run.project_id}`" class="text-accent hover:text-accent-hover text-sm">
            View project
          </NuxtLink>
          <NuxtLink to="/app/evaluations" class="text-accent hover:text-accent-hover text-sm">
            View evaluation
          </NuxtLink>
        </div>
      </AppCard>
      <AppCard v-if="run.attempts?.length" class="mt-4">
        <h3 class="app-section-title mb-2">AI fix attempts</h3>
        <ul class="space-y-3">
          <li
            v-for="(a, i) in run.attempts"
            :key="i"
            class="border border-border rounded-app p-3 text-sm"
          >
            <div class="font-medium">{{ a.reason }}</div>
            <div v-if="a.outcome" class="text-muted-foreground mt-1">Outcome: {{ a.outcome }}</div>
          </li>
        </ul>
      </AppCard>
      <AppCard class="mt-4">
        <h3 class="app-section-title mb-2">Logs</h3>
        <div v-if="run.log_tail?.length" class="font-mono text-xs bg-zinc-900 text-zinc-100 p-4 rounded-app overflow-x-auto max-h-64 overflow-y-auto">
          <div v-for="(line, i) in run.log_tail" :key="i" class="whitespace-pre">{{ line }}</div>
        </div>
        <p v-else class="text-muted-foreground text-sm">No logs yet.</p>
      </AppCard>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

definePageMeta({ layout: 'app' })

export default defineComponent({
  name: 'RunDetail',
  data() {
    return {
      run: null as {
        status?: string;
        type?: string;
        test_passed?: boolean;
        project_id?: string;
        duration_sec?: number;
        cost_usd?: number;
        metrics?: { loss?: number };
        log_tail?: string[];
        attempts?: Array<{ reason?: string; outcome?: string }>;
      } | null,
      loading: true,
      error: '',
    }
  },
  computed: {
    runIdShort(): string {
      const id = (this.$route.params as { id: string }).id
      return id.length > 12 ? id.slice(-12) : id
    },
    runMetricsLoss(): number | null {
      const m = this.run?.metrics
      return m && typeof m === 'object' && 'loss' in m ? (m as { loss: number }).loss : null
    },
    statusClass(): string {
      if (!this.run?.status) return ''
      const s = this.run.status
      if (s === 'succeeded') return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
      if (s === 'failed' || s === 'cancelled') return 'bg-red-500/15 text-red-600 border-red-500/20'
      return 'bg-amber-500/15 text-amber-600 border-amber-500/20'
    },
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
      const id = (this.$route.params as { id: string }).id
      this.loading = true
      this.error = ''
      try {
        this.run = await this.apiFetch<typeof this.run>(`/api/runs/${id}`)
      } catch (e) {
        this.error = (e as Error).message || 'Failed to load run'
      } finally {
        this.loading = false
      }
    },
  },
})
</script>
