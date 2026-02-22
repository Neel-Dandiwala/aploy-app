<template>
  <div class="app-page">
    <AppPageHeader
      :title="`Model version ${$route.params.id}`"
      description="Lineage and metadata."
      back-to="/app/registry"
      back-label="Registry"
    />
    <AppCard>
      <h3 class="app-section-title mb-4">Lineage</h3>
      <ul class="space-y-2 text-sm text-muted-foreground">
        <li>Project: proj_demo1</li>
        <li>Run: run_1</li>
        <li>Dataset version: dsv_1</li>
      </ul>
      <AppButton :to="`/app/deployments/new?model=${$route.params.id}`" class="mt-6">Deploy this version</AppButton>
    </AppCard>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

definePageMeta({ layout: 'app' })

export default defineComponent({
  name: 'RegistryModelDetail',
})
</script>
