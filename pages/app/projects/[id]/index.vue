<template>
  <div class="grid gap-4">
    <AppCard>
      <h3 class="app-section-title mb-4">Status timeline</h3>
      <div class="flex flex-wrap gap-3 items-center text-sm">
        <span class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full" :class="hasDatasets ? 'bg-emerald-500' : 'bg-zinc-300'" />
          Dataset attached
        </span>
        <span class="text-muted-foreground">→</span>
        <span class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full" :class="hasScript ? 'bg-emerald-500' : 'bg-zinc-300'" />
          Script generated
        </span>
        <span class="text-muted-foreground">→</span>
        <span class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full" :class="testDone ? 'bg-emerald-500' : 'bg-zinc-300'" />
          Quick test
        </span>
        <span class="text-muted-foreground">→</span>
        <span class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full" :class="trainingDone ? 'bg-emerald-500' : 'bg-zinc-300'" />
          Training
        </span>
        <span class="text-muted-foreground">→</span>
        <span class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full" :class="deployed ? 'bg-emerald-500' : 'bg-zinc-300'" />
          Deployed
        </span>
      </div>
    </AppCard>
    <AppCard v-if="nextAction">
      <h3 class="app-section-title mb-2">Next recommended action</h3>
      <p class="text-sm text-muted-foreground mb-4">{{ nextAction.description }}</p>
      <AppButton :to="nextAction.to" variant="secondary">
        {{ nextAction.label }}
      </AppButton>
    </AppCard>
    <AppCard>
      <h3 class="app-section-title mb-4">Recent runs</h3>
      <template v-if="runs.length">
        <div v-for="r in runs.slice(0, 5)" :key="r.id" class="mb-2 flex items-center gap-2">
          <span
            class="w-2 h-2 rounded-full shrink-0"
            :class="r.status_color === 'green' ? 'bg-emerald-500' : r.status_color === 'red' ? 'bg-red-500' : 'bg-zinc-400'"
          />
          <NuxtLink :to="`/app/runs/${r.id}`" class="text-accent hover:text-accent-hover text-sm">{{ r.id }}</NuxtLink>
          <span class="text-muted-foreground text-sm">{{ r.type }} · {{ r.status }}</span>
        </div>
      </template>
      <p v-else class="text-sm text-muted-foreground">No runs yet.</p>
      <AppButton to="/app/training/new" class="mt-4">Start training</AppButton>
    </AppCard>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

definePageMeta({ layout: 'app' })

export default defineComponent({
  name: 'ProjectOverview',
  data() {
    return {
      hasDatasets: false,
      hasScript: false,
      testDone: false,
      trainingDone: false,
      deployed: false,
      runs: [] as Array<{ id: string; type: string; status: string; status_color: string }>,
      nextAction: null as { label: string; description: string; to: string } | null,
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
      const id = (this.$route.params as { id: string }).id
      try {
        const [datasetsRes, scriptsRes, runsRes, projectRes, deploymentsRes] = await Promise.all([
          this.apiFetch<{ datasets: unknown[] }>(`/api/projects/${id}/datasets`),
          this.apiFetch<{ scripts: unknown[] }>(`/api/projects/${id}/scripts`),
          this.apiFetch<{ runs: Array<{ id: string; type: string; status: string; status_color: string }> }>(`/api/runs?project_id=${id}`),
          this.apiFetch<{ status?: string }>(`/api/projects/${id}`),
          this.apiFetch<{ deployments: unknown[] }>(`/api/projects/${id}/deployments`),
        ])
        this.hasDatasets = (datasetsRes.datasets?.length ?? 0) > 0
        this.hasScript = (scriptsRes.scripts?.length ?? 0) > 0
        this.runs = runsRes.runs || []
        this.deployed = (deploymentsRes.deployments?.length ?? 0) > 0
        const status = projectRes.status

        this.testDone = this.runs.some((r) => r.type === 'safeguard')
        this.trainingDone = this.runs.some((r) => r.status === 'succeeded' && r.type === 'training')

        if (!this.hasDatasets) {
          this.nextAction = { label: 'Attach dataset', description: 'Link a dataset from the Data library to use for training.', to: `/app/projects/${id}/datasets` }
        } else if (!this.hasScript) {
          this.nextAction = { label: 'Open chat', description: 'Describe your goals and we\'ll generate a training script.', to: `/app/projects/${id}/chat` }
        } else if (status === 'needs_test' || status === 'no_script') {
          this.nextAction = { label: 'Run quick test', description: 'Validate your script before starting training.', to: `/app/projects/${id}/script` }
        } else if (status === 'test_failed') {
          this.nextAction = { label: 'Review script', description: 'Check the script and fix any errors from the last test.', to: `/app/projects/${id}/script` }
        } else if (status === 'ready_to_train') {
          this.nextAction = { label: 'Start training', description: 'Your script passed the test. Start the training job.', to: `/app/projects/${id}/script` }
        } else if (status === 'training') {
          this.nextAction = { label: 'View runs', description: 'Monitor your training progress.', to: `/app/projects/${id}/runs` }
        } else if (this.trainingDone && !this.deployed) {
          this.nextAction = { label: 'Deploy model', description: 'Expose your trained model as an API.', to: `/app/projects/${id}/deploy` }
        } else {
          this.nextAction = null
        }
      } catch {
        this.runs = []
      }
    },
  },
})
</script>
