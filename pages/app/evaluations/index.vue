<template>
  <div class="app-page">
    <AppPageHeader title="Evaluations" />
    <AppCard>
      <h3 class="app-section-title mb-1">Run run_1 vs baseline</h3>
      <p class="app-section-description mb-6">Tuned model improves support accuracy by 16.7%.</p>
      <table class="app-table">
        <thead>
          <tr>
            <th>Metric</th>
            <th>Baseline</th>
            <th>Tuned</th>
            <th>Δ</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-muted-foreground">Perplexity</td>
            <td class="text-zinc-900">12.4</td>
            <td class="text-zinc-900">10.1</td>
            <td class="text-emerald-500">-18.5%</td>
          </tr>
          <tr>
            <td class="text-muted-foreground">Support accuracy</td>
            <td class="text-zinc-900">0.72</td>
            <td class="text-zinc-900">0.84</td>
            <td class="text-emerald-500">+16.7%</td>
          </tr>
        </tbody>
      </table>
      <AppButton to="/app/deployments/new" class="mt-4">Deploy tuned model</AppButton>
    </AppCard>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

definePageMeta({ layout: 'app' })

export default defineComponent({
  name: 'EvaluationsList',
})
</script>
