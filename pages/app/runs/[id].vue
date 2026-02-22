<template>
  <div class="app-page">
    <AppPageHeader
      :title="`Run ${$route.params.id}`"
      back-to="/app/runs"
      back-label="Runs"
    />
    <div class="flex flex-wrap items-center gap-3 mb-content">
      <span class="px-2.5 py-1 rounded-app text-sm font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
        succeeded
      </span>
    </div>
    <AppCard>
      <p class="text-muted-foreground text-sm">Duration: 3h · Cost: $14.20 · Loss: 0.42</p>
      <div class="flex flex-wrap gap-3 mt-4">
        <NuxtLink to="/app/evaluations" class="text-accent hover:text-accent-hover text-sm transition-colors">
          View evaluation
        </NuxtLink>
        <AppButton variant="secondary" to="/app/deployments/new">Deploy</AppButton>
      </div>
    </AppCard>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

definePageMeta({ layout: 'app' })

export default defineComponent({
  name: 'RunDetail',
})
</script>
