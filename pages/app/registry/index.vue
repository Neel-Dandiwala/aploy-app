<template>
  <div class="app-page">
    <AppPageHeader title="Model registry" />
    <div class="app-table-wrap">
      <table class="app-table">
        <thead>
          <tr>
            <th>Version</th>
            <th>Run</th>
            <th>Created</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in models" :key="m.id">
            <td class="font-mono text-white text-sm">{{ m.id }}</td>
            <td class="text-muted-foreground">{{ m.run_id }}</td>
            <td class="text-muted text-sm">{{ m.created_at }}</td>
            <td>
              <NuxtLink
                :to="`/app/deployments/new?model=${m.id}`"
                class="text-accent hover:text-accent-hover text-sm transition-colors"
              >
                Deploy
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

definePageMeta({ layout: 'app' })

export default defineComponent({
  name: 'RegistryList',
  data() {
    return {
      models: [
        { id: 'mv_1', project_id: 'proj_demo1', run_id: 'run_1', created_at: '2025-02-14', support_accuracy: 0.84 },
      ],
    }
  },
})
</script>
