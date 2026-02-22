<template>
  <div class="app-page">
    <AppPageHeader
      title="Support Bot"
      description="DPO tuning for support chat. Base: Mistral-7B-v0.2"
      back-to="/app/projects"
      back-label="Projects"
    />
    <div class="grid gap-4">
      <AppCard>
        <h3 class="app-section-title mb-4">Datasets</h3>
        <AppButton variant="secondary" to="/app/datasets/new" class="mb-4">Add dataset</AppButton>
        <ul class="space-y-2 text-sm text-muted-foreground">
          <li>Support chat v1 (10,200 rows) — <span class="text-emerald-500">ready</span></li>
        </ul>
      </AppCard>
      <AppCard>
        <h3 class="app-section-title mb-4">Recent runs</h3>
        <NuxtLink to="/app/runs/run_1" class="text-accent hover:text-accent-hover text-sm">run_1</NuxtLink>
        <span class="text-muted-foreground text-sm"> — succeeded</span>
        <AppButton to="/app/training/new" class="mt-4">Start training</AppButton>
      </AppCard>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

definePageMeta({ layout: 'app' })

export default defineComponent({
  name: 'ProjectDetail',
})
</script>
