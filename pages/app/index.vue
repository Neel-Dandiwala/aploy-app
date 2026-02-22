<template>
  <div class="app-page">
    <AppPageHeader
      title="Dashboard"
      description="Welcome to Aploy. Follow the journey: project → data → run → evaluate → deploy."
    />
    <AppCard class="mb-section">
      <h2 class="app-section-title">Your journey (start → finish)</h2>
      <p class="app-section-description mb-6">Do these in order.</p>
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
            <p class="font-medium text-white">{{ step.title }}</p>
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
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-section">
      <AppCard
        v-for="stat in stats"
        :key="stat.label"
        class="p-5"
      >
        <h3 class="app-section-title">{{ stat.label }}</h3>
        <p class="text-xl font-semibold text-white mt-1">{{ stat.value }}</p>
        <NuxtLink
          :to="stat.href"
          class="text-sm text-accent hover:text-accent-hover mt-2 inline-block transition-colors"
        >
          View all
        </NuxtLink>
      </AppCard>
    </div>
    <AppButton to="/app/projects/new">Create project</AppButton>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

definePageMeta({ layout: 'app' })

export default defineComponent({
  name: 'AppDashboard',
  data() {
    return {
      journeySteps: [
        { step: 1, title: 'Create a project', desc: 'Define base model + objective.', href: '/app/projects/new', label: 'Create project' },
        { step: 2, title: 'Add a dataset', desc: 'Upload or connect S3/GCS.', href: '/app/datasets/new', label: 'Add dataset' },
        { step: 3, title: 'Preview & version data', desc: 'Quality, dedupe, create version.', href: '/app/datasets', label: 'Datasets' },
        { step: 4, title: 'Start a run', desc: 'Pick dataset + config, start training.', href: '/app/training/new', label: 'Start training' },
        { step: 5, title: 'Watch run & evaluations', desc: 'Metrics, logs, compare baseline vs tuned.', href: '/app/runs', label: 'Runs' },
        { step: 6, title: 'Deploy or export', desc: 'Live API or export weights.', href: '/app/deployments/new', label: 'Deploy' },
      ],
      stats: [
        { label: 'Projects', value: '1', href: '/app/projects' },
        { label: 'Datasets', value: '1', href: '/app/datasets' },
        { label: 'Runs', value: '2', href: '/app/runs' },
      ],
    }
  },
})
</script>
