<template>
  <div class="app-page">
    <AppPageHeader
      title="Deployments"
      description="Live models you can call. Use “Try it” to test with a simple prompt, or use the API for your app."
    >
      <template #actions>
        <AppButton to="/app/deployments/try">Try your model</AppButton>
        <AppButton to="/app/deployments/new">Deploy</AppButton>
      </template>
    </AppPageHeader>
    <p v-if="loading" class="text-muted-foreground text-sm">Loading…</p>
    <p v-else-if="error" class="app-error">{{ error }}</p>
    <div v-else class="app-table-wrap">
      <table class="app-table">
        <thead>
          <tr>
            <th>Deployment</th>
            <th>Model</th>
            <th>Status</th>
            <th>Endpoint</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in deployments" :key="d.id">
            <td class="font-mono text-zinc-900 text-sm">{{ d.id }}</td>
            <td class="text-muted-foreground">{{ d.model_version_id }}</td>
            <td class="text-emerald-500">{{ d.status }}</td>
            <td class="text-muted-foreground font-mono text-sm">{{ d.endpoint_url }}</td>
            <td>
              <NuxtLink :to="`/app/deployments/try?deployment=${d.id}`" class="text-accent hover:text-accent-hover text-sm">
                Try it
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!loading && !error && deployments.length === 0" class="app-empty text-center py-8 px-4">
        <p class="font-medium text-zinc-900 mb-1">No deployments yet</p>
        <p class="text-sm text-muted-foreground mb-4">Deploy a trained model to get a live URL you can call from your app or try in the browser. You can also export weights to run elsewhere.</p>
        <AppButton to="/app/deployments/new">Deploy</AppButton>
        <p class="mt-3">
          <NuxtLink to="/app/glossary" class="text-sm text-accent hover:text-accent-hover">Learn key concepts</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

definePageMeta({ layout: 'app' })

export default defineComponent({
  name: 'DeploymentsList',
  data() {
    return {
      deployments: [] as Array<{ id: string; model_version_id: string; type?: string; status: string; endpoint_url?: string | null; created_at?: string }>,
      loading: true,
      error: '',
    }
  },
  setup() {
    const { apiFetch } = useAployApi()
    return { apiFetch }
  },
  async mounted() {
    await this.loadDeployments()
  },
  methods: {
    async loadDeployments() {
      this.loading = true
      this.error = ''
      try {
        const data = await this.apiFetch<{ deployments: Array<{ id: string; model_version_id: string; type?: string; status: string; endpoint_url?: string | null; created_at?: string }> }>('/api/deploy')
        this.deployments = data.deployments || []
      } catch (e) {
        this.error = (e as Error).message || 'Failed to load deployments'
      } finally {
        this.loading = false
      }
    },
  },
})
</script>
