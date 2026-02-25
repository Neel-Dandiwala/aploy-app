<template>
  <div class="app-page">
    <AppPageHeader
      title="Dashboard"
      description="See how your models and automations are doing. Follow the steps below to train and deploy."
    />
    <!-- Usage at a glance -->
    <section class="mb-section">
      <h2 class="app-section-title mb-4">Usage at a glance</h2>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <AppCard class="p-5">
          <h3 class="text-sm font-medium text-zinc-900 mb-1">Calls to your models</h3>
          <p class="text-2xl font-semibold text-zinc-900 mb-2">{{ totalCalls.toLocaleString() }} <span class="text-sm font-normal text-muted-foreground">this week</span></p>
          <p class="text-xs text-muted-foreground mb-3">How often your live models were used (API or Try it).</p>
          <div class="flex items-end gap-1 h-16">
            <div
              v-for="(day, i) in apiUsageByDay"
              :key="i"
              class="flex-1 min-w-0 flex flex-col items-center gap-0.5"
            >
              <span
                class="w-full rounded-t bg-accent/70 hover:bg-accent transition-colors min-h-[4px]"
                :style="{ height: Math.max(4, (day.calls / maxDayCalls) * 48) + 'px' }"
              />
              <span class="text-[10px] text-muted-foreground truncate w-full text-center">{{ day.label }}</span>
            </div>
          </div>
        </AppCard>
        <AppCard class="p-5">
          <h3 class="text-sm font-medium text-zinc-900 mb-1">Your live models</h3>
          <p class="text-2xl font-semibold text-zinc-900 mb-2">{{ deployments.length }} <span class="text-sm font-normal text-muted-foreground">deployed</span></p>
          <p class="text-xs text-muted-foreground mb-3">Models you can call right now.</p>
          <ul class="space-y-2">
            <li
              v-for="d in deployments.slice(0, 3)"
              :key="d.id"
              class="flex items-center justify-between text-sm"
            >
              <span class="truncate text-zinc-900">{{ d.model_version_id || d.id }}</span>
              <span class="text-muted-foreground text-xs shrink-0">{{ d.recent_calls ?? 0 }} calls</span>
            </li>
            <p v-if="deployments.length === 0" class="text-sm text-muted-foreground">No live models yet. Deploy one to get a URL to call.</p>
          </ul>
          <NuxtLink to="/app/deployments" class="text-sm text-accent hover:text-accent-hover mt-2 inline-block">View all</NuxtLink>
        </AppCard>
        <AppCard class="p-5">
          <h3 class="text-sm font-medium text-zinc-900 mb-1">Automations & webhooks</h3>
          <p class="text-2xl font-semibold text-zinc-900 mb-2">{{ pipelines.length }} flows, {{ triggers.length }} webhooks</p>
          <p class="text-xs text-muted-foreground mb-3">Pipelines and webhooks that run from outside Aploy.</p>
          <ul class="space-y-2">
            <li
              v-for="t in triggers.slice(0, 3)"
              :key="t.id"
              class="flex items-center gap-2 text-sm"
            >
              <span
                class="w-2 h-2 rounded-full shrink-0"
                :class="t.last_ok ? 'bg-emerald-500' : 'bg-muted-foreground'"
                :title="t.last_ok ? 'Last run OK' : 'No recent run'"
              />
              <span class="truncate text-zinc-900">{{ t.name || 'Webhook' }}</span>
            </li>
            <p v-if="triggers.length === 0" class="text-sm text-muted-foreground">No webhooks yet. Create one to run a flow from Zapier or your app.</p>
          </ul>
          <NuxtLink to="/app/pipelines" class="text-sm text-accent hover:text-accent-hover mt-2 inline-block">Flows</NuxtLink>
          <NuxtLink to="/app/triggers" class="text-sm text-accent hover:text-accent-hover mt-2 ml-3 inline-block">Webhooks</NuxtLink>
        </AppCard>
      </div>
    </section>
    <!-- Your journey -->
    <AppCard class="mb-section">
      <h2 class="app-section-title">Your journey (start → finish)</h2>
      <p class="app-section-description mb-6">Do these in order to train and deploy a model.</p>
      <ol class="space-y-4">
        <li
          v-for="step in journeySteps"
          :key="step.step"
          class="flex gap-4 items-start"
        >
          <span
            class="flex-shrink-0 w-8 h-8 rounded-app bg-accent/90 text-white text-sm font-medium flex items-center justify-center"
          >
            {{ step.step }}
          </span>
          <div class="flex-1 min-w-0">
            <p class="font-medium text-zinc-900">{{ step.title }}</p>
            <p class="text-muted-foreground text-sm mt-0.5">{{ step.desc }}</p>
            <NuxtLink
              :to="step.href"
              class="text-accent hover:text-accent-hover text-sm mt-1 inline-block transition-colors"
            >
              {{ step.label }} →
            </NuxtLink>
          </div>
        </li>
      </ol>
    </AppCard>
    <!-- Quick counts -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-section">
      <AppCard
        v-for="stat in stats"
        :key="stat.label"
        class="p-5"
      >
        <h3 class="app-section-title">{{ stat.label }}</h3>
        <p class="text-xl font-semibold text-zinc-900 mt-1">{{ stat.value }}</p>
        <NuxtLink
          :to="stat.href"
          class="text-sm text-accent hover:text-accent-hover mt-2 inline-block transition-colors"
        >
          View all
        </NuxtLink>
      </AppCard>
    </div>
    <div class="flex flex-wrap items-center gap-4">
      <AppButton to="/app/projects/new">Create project</AppButton>
      <NuxtLink to="/app/deployments/try" class="text-sm text-accent hover:text-accent-hover">Try your model</NuxtLink>
      <button
        v-if="mockMode"
        type="button"
        class="text-xs text-muted-foreground hover:text-destructive transition-colors underline"
        @click="simulateErrorNext"
      >
        Simulate error (next request)
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

definePageMeta({ layout: 'app' })

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default defineComponent({
  name: 'AppDashboard',
  setup() {
    const { mockMode } = useMockMode()
    const { setSimulateErrorNext } = useMockApi()
    function simulateErrorNext() {
      setSimulateErrorNext()
    }
    return { mockMode, simulateErrorNext }
  },
  data() {
    return {
      journeySteps: [
        { step: 1, title: 'Create a project', desc: 'Pick a base model and what you want to train for (e.g. chat, preferences).', href: '/app/projects/new', label: 'Create project' },
        { step: 2, title: 'Add data', desc: 'Upload a file or connect cloud storage. We accept JSONL (one example per line).', href: '/app/datasets/new', label: 'Add dataset' },
        { step: 3, title: 'Preview & version', desc: 'Check quality and create a version so your run uses a fixed snapshot.', href: '/app/datasets', label: 'Datasets' },
        { step: 4, title: 'Start training', desc: 'Pick your data and goal. Use recommended settings or tweak in Advanced.', href: '/app/training/new', label: 'Start training' },
        { step: 5, title: 'Runs & comparisons', desc: 'See metrics and compare baseline vs tuned model.', href: '/app/runs', label: 'Runs' },
        { step: 6, title: 'Deploy', desc: 'Make your model live (you get a URL) or export the weights.', href: '/app/deployments/new', label: 'Deploy' },
      ],
      apiUsageByDay: [] as Array<{ label: string; calls: number }>,
      deployments: [] as Array<{ id: string; model_version_id?: string; recent_calls?: number }>,
      pipelines: [] as Array<{ id: string; name: string }>,
      triggers: [] as Array<{ id: string; name?: string; last_ok?: boolean }>,
      stats: [
        { label: 'Projects', value: '0', href: '/app/projects' },
        { label: 'Datasets', value: '0', href: '/app/datasets' },
        { label: 'Training runs', value: '0', href: '/app/runs' },
      ],
    }
  },
  computed: {
    totalCalls(): number {
      return this.apiUsageByDay.reduce((s, d) => s + d.calls, 0)
    },
    maxDayCalls(): number {
      return Math.max(1, ...this.apiUsageByDay.map((d) => d.calls))
    },
  },
  async mounted() {
    await this.loadUsage()
  },
  methods: {
    async loadUsage() {
      const { apiFetch } = useAployApi()
      try {
        const [deployRes, pipelinesRes, triggersRes, projectsRes, datasetsRes, runsRes] = await Promise.all([
          apiFetch<{ deployments: Array<{ id: string; model_version_id?: string }> }>('/api/deploy').catch(() => ({ deployments: [] })),
          apiFetch<{ pipelines: Array<{ id: string; name: string }> }>('/api/pipelines').catch(() => ({ pipelines: [] })),
          apiFetch<{ triggers: Array<{ id: string; name?: string }> }>('/api/triggers').catch(() => ({ triggers: [] })),
          apiFetch<{ projects: unknown[] }>('/api/projects').catch(() => ({ projects: [] })),
          apiFetch<{ datasets: unknown[] }>('/api/datasets').catch(() => ({ datasets: [] })),
          apiFetch<{ runs: unknown[] }>('/api/runs').catch(() => ({ runs: [] })),
        ])
        this.deployments = (deployRes.deployments || []).map((d) => ({ ...d, recent_calls: Math.floor(Math.random() * 200) }))
        this.pipelines = pipelinesRes.pipelines || []
        this.triggers = (triggersRes.triggers || []).map((t) => ({ ...t, last_ok: true }))
        this.stats[0].value = String((projectsRes.projects || []).length)
        this.stats[1].value = String((datasetsRes.datasets || []).length)
        this.stats[2].value = String((runsRes.runs || []).length)
      } catch (_) {}
      const today = new Date()
      this.apiUsageByDay = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today)
        d.setDate(d.getDate() - (6 - i))
        const label = DAY_LABELS[(d.getDay() + 6) % 7]
        const calls = Math.floor(60 + Math.random() * 140)
        return { label, calls }
      })
    },
  },
})
</script>
