<template>
  <div class="app-page">
    <AppPageHeader
      :title="`Datasets — ${project?.name ?? 'Project'}`"
      description="Datasets linked to this project. Link from the global Datasets tab."
      :back-to="`/app/projects/${$route.params.id}`"
      back-label="Project"
    />
    <p v-if="loading" class="text-muted-foreground text-sm">Loading…</p>
    <p v-else-if="error" class="app-error">{{ error }}</p>
    <div v-else class="grid gap-4">
      <AppCard>
        <div class="flex items-center justify-between mb-4">
          <h3 class="app-section-title">Linked datasets</h3>
          <NuxtLink to="/app/datasets" class="text-sm text-accent hover:text-accent-hover">
            Browse all datasets →
          </NuxtLink>
        </div>
        <table class="app-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Rows</th>
              <th>Versions</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ds in datasets" :key="ds.id">
              <td class="font-medium">{{ ds.name }}</td>
              <td class="text-muted-foreground">{{ ds.status }}</td>
              <td class="text-muted-foreground">{{ ds.row_count?.toLocaleString() ?? '—' }}</td>
              <td class="text-sm">
                <span v-for="v in ds.versions" :key="v.id" class="mr-2">{{ v.tag }}</span>
              </td>
              <td>
                <button
                  type="button"
                  class="text-destructive hover:text-destructive/80 text-sm"
                  @click="unlink(ds.id)"
                >
                  Unlink
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="!datasets.length" class="text-muted-foreground text-sm py-4">
          No datasets linked. <NuxtLink to="/app/datasets" class="text-accent">Add datasets</NuxtLink> from the Data page, then link them here or from the dataset detail.
        </p>
      </AppCard>
      <AppCard v-if="allDatasets.length">
        <h3 class="app-section-title mb-4">Link a dataset</h3>
        <p class="text-sm text-muted-foreground mb-4">Select a dataset from your org to link to this project.</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="ds in linkableDatasets"
            :key="ds.id"
            type="button"
            class="app-button-secondary text-sm py-1.5 px-3"
            @click="link(ds.id)"
          >
            + {{ ds.name }}
          </button>
        </div>
        <p v-if="!linkableDatasets.length" class="text-muted-foreground text-sm">
          All your datasets are already linked, or you have none. <NuxtLink to="/app/datasets/new">Create one</NuxtLink>.
        </p>
      </AppCard>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

definePageMeta({ layout: 'app' })

export default defineComponent({
  name: 'ProjectDatasets',
  data() {
    return {
      project: null as { name?: string } | null,
      datasets: [] as Array<{ id: string; name: string; status: string; row_count?: number; versions: Array<{ id: string; tag: string; status: string }> }>,
      allDatasets: [] as Array<{ id: string; name: string }>,
      loading: true,
      error: '',
    }
  },
  computed: {
    linkedIds(): Set<string> {
      return new Set(this.datasets.map((d) => d.id))
    },
    linkableDatasets() {
      return this.allDatasets.filter((d) => !this.linkedIds.has(d.id))
    },
  },
  setup() {
    const { apiFetch } = useAployApi()
    return { apiFetch }
  },
  async mounted() {
    await this.loadProject()
    await this.loadProjectDatasets()
    await this.loadAllDatasets()
  },
  methods: {
    async loadProject() {
      const id = (this.$route.params as { id: string }).id
      try {
        this.project = await this.apiFetch<{ name?: string }>(`/api/projects/${id}`)
      } catch {
        this.project = null
      }
    },
    async loadProjectDatasets() {
      const id = (this.$route.params as { id: string }).id
      this.loading = true
      this.error = ''
      try {
        const data = await this.apiFetch<{ datasets: typeof this.datasets }>(`/api/projects/${id}/datasets`)
        this.datasets = data.datasets || []
      } catch (e) {
        this.error = (e as Error).message || 'Failed to load'
      } finally {
        this.loading = false
      }
    },
    async loadAllDatasets() {
      try {
        const data = await this.apiFetch<{ datasets: Array<{ id: string; name: string }> }>('/api/datasets')
        this.allDatasets = (data.datasets || []).map((d) => ({ id: d.id, name: d.name }))
      } catch {
        this.allDatasets = []
      }
    },
    async link(datasetId: string) {
      const id = (this.$route.params as { id: string }).id
      try {
        await this.apiFetch(`/api/projects/${id}/datasets`, {
          method: 'POST',
          body: { dataset_id: datasetId },
        })
        await this.loadProjectDatasets()
        await this.loadAllDatasets()
      } catch (e) {
        this.error = (e as Error).message || 'Failed to link'
      }
    },
    async unlink(datasetId: string) {
      const id = (this.$route.params as { id: string }).id
      if (!confirm('Unlink this dataset from the project?')) return
      try {
        await this.apiFetch(`/api/projects/${id}/datasets?dataset_id=${datasetId}`, { method: 'DELETE' })
        await this.loadProjectDatasets()
        await this.loadAllDatasets()
      } catch (e) {
        this.error = (e as Error).message || 'Failed to unlink'
      }
    },
  },
})
</script>
