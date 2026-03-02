<template>
  <div class="app-page">
    <h2 class="text-lg font-semibold text-zinc-900 mb-4">Script</h2>
    <p v-if="loading" class="text-muted-foreground text-sm">Loading…</p>
    <p v-else-if="error" class="app-error">{{ error }}</p>
    <div v-else class="grid gap-4">
      <AppCard>
        <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 class="app-section-title">Script versions</h3>
          <div class="flex gap-2 flex-wrap">
            <AppButton
              :disabled="!selectedScript || testRunning"
              @click="runTest"
            >
              {{ testRunning ? 'Running…' : 'Run quick test' }}
            </AppButton>
            <AppButton
              variant="primary"
              :disabled="!canStartTraining || trainingRunning"
              @click="startTraining"
            >
              {{ trainingRunning ? 'Starting…' : 'Start training' }}
            </AppButton>
          </div>
        </div>
        <div class="flex gap-4 flex-wrap">
          <select
            v-model="selectedVersionId"
            class="app-input py-1.5 text-sm w-40"
            @change="loadScript(selectedVersionId)"
          >
            <option v-for="s in scripts" :key="s.id" :value="s.id">
              v{{ s.version }}{{ s.change_summary ? ` — ${s.change_summary.slice(0, 30)}` : '' }}
            </option>
          </select>
          <span v-if="selectedScript" class="text-muted-foreground text-sm self-center">
            {{ formatDate(selectedScript.created_at) }}
          </span>
        </div>
        <div v-if="selectedScript?.change_summary" class="mt-2 text-sm text-muted-foreground">
          {{ selectedScript.change_summary }}
        </div>
        <textarea
          v-model="code"
          class="app-input font-mono text-sm w-full min-h-[300px] p-3 resize-y mt-4"
          placeholder="# Training script"
          spellcheck="false"
        />
        <div class="mt-4 flex flex-wrap gap-2">
          <AppButton :disabled="saving" @click="saveNewVersion">
            Save as new version
          </AppButton>
        </div>
      </AppCard>
      <AppCard v-if="selectedScript?.config">
        <h3 class="app-section-title mb-2">Config</h3>
        <pre class="text-sm text-muted-foreground bg-surface-overlay p-3 rounded-app overflow-x-auto">{{ JSON.stringify(selectedScript.config, null, 2) }}</pre>
      </AppCard>
      <AppCard v-if="scripts.length > 1">
        <h3 class="app-section-title mb-2">Version history</h3>
        <ul class="space-y-2">
          <li
            v-for="s in scripts"
            :key="s.id"
            class="flex items-center justify-between py-2 border-b border-border last:border-0"
          >
            <button
              class="text-left hover:text-accent"
              :class="selectedVersionId === s.id ? 'font-medium text-accent' : ''"
              @click="selectVersion(s.id)"
            >
              v{{ s.version }} — {{ formatDate(s.created_at) }}
            </button>
            <span v-if="s.change_summary" class="text-xs text-muted-foreground truncate max-w-[200px]">{{ s.change_summary }}</span>
          </li>
        </ul>
      </AppCard>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

definePageMeta({ layout: 'app' })

export default defineComponent({
  name: 'ProjectScript',
  data() {
    return {
      project: null as { name?: string; status?: string } | null,
      scripts: [] as Array<{ id: string; version: number; code: string; config?: object; change_summary?: string; created_at: string }>,
      selectedVersionId: '',
      selectedScript: null as { id: string; version: number; code: string; config?: object; change_summary?: string; created_at: string } | null,
      code: '',
      latestTestPassed: null as boolean | null,
      loading: true,
      saving: false,
      testRunning: false,
      trainingRunning: false,
      error: '',
    }
  },
  computed: {
    canStartTraining(): boolean {
      return this.latestTestPassed === true && !!this.selectedScript
    },
  },
  setup() {
    const { apiFetch } = useAployApi()
    return { apiFetch }
  },
  watch: {
    selectedVersionId() {
      this.loadLatestTest()
    },
  },
  async mounted() {
    await this.loadProject()
    await this.loadScripts()
    await this.loadLatestTest()
  },
  methods: {
    formatDate(d?: string) {
      if (!d) return '—'
      try {
        return new Date(d).toLocaleString()
      } catch {
        return d
      }
    },
    selectVersion(scriptId: string) {
      this.selectedVersionId = scriptId
      this.loadScript(scriptId)
    },
    async loadProject() {
      const id = (this.$route.params as { id: string }).id
      try {
        this.project = await this.apiFetch<{ name?: string; status?: string }>(`/api/projects/${id}`)
      } catch {
        this.project = null
      }
    },
    async loadLatestTest() {
      const id = (this.$route.params as { id: string }).id
      const scriptId = this.selectedVersionId
      try {
        const data = await this.apiFetch<{ runs: Array<{ type: string; script_version_id?: string; test_passed?: boolean }> }>(`/api/runs?project_id=${id}`)
        const safeguards = (data.runs || []).filter((r) => r.type === 'safeguard')
        const forThisScript = scriptId ? safeguards.find((r) => r.script_version_id === scriptId) : null
        const latest = forThisScript || safeguards[0]
        this.latestTestPassed = latest ? (latest.test_passed ?? null) : null
      } catch {
        this.latestTestPassed = null
      }
    },
    async loadScripts() {
      const id = (this.$route.params as { id: string }).id
      this.loading = true
      this.error = ''
      try {
        const data = await this.apiFetch<{ scripts: Array<{ id: string; version: number; code: string; config?: object; change_summary?: string; created_at: string }> }>(`/api/projects/${id}/scripts`)
        this.scripts = data.scripts || []
        if (this.scripts.length) {
          this.selectedVersionId = this.scripts[0].id
          await this.loadScript(this.selectedVersionId)
        } else {
          this.code = '# Training script\n# Add your Python code here\n'
          this.selectedScript = null
        }
      } catch (e) {
        this.error = (e as Error).message || 'Failed to load scripts'
      } finally {
        this.loading = false
      }
    },
    async loadScript(scriptId: string) {
      if (!scriptId) return
      const id = (this.$route.params as { id: string }).id
      try {
        const script = await this.apiFetch<{ id: string; version: number; code: string; config?: object; change_summary?: string; created_at: string }>(`/api/projects/${id}/scripts/${scriptId}`)
        this.selectedScript = script
        this.code = script.code
      } catch {
        this.selectedScript = null
        this.code = ''
      }
    },
    async saveNewVersion() {
      const id = (this.$route.params as { id: string }).id
      this.saving = true
      this.error = ''
      try {
        const config = this.selectedScript?.config || { epochs: 3, lora_rank: 16 }
        const created = await this.apiFetch<{ id: string; version: number; code: string; config?: object; change_summary?: string; created_at: string }>(`/api/projects/${id}/scripts`, {
          method: 'POST',
          body: { code: this.code, config },
        })
        this.scripts.unshift(created)
        this.selectedVersionId = created.id
        this.selectedScript = created
        this.latestTestPassed = null
      } catch (e) {
        this.error = (e as Error).message || 'Failed to save'
      } finally {
        this.saving = false
      }
    },
    async runTest() {
      if (!this.selectedScript) return
      const id = (this.$route.params as { id: string }).id
      this.testRunning = true
      this.error = ''
      try {
        const datasets = await this.apiFetch<{ datasets: Array<{ versions: Array<{ id: string }> }> }>(`/api/projects/${id}/datasets`)
        const versionId = datasets.datasets?.[0]?.versions?.[0]?.id || 'dsv_1'
        await this.apiFetch(`/api/runs/test`, {
          method: 'POST',
          body: {
            project_id: id,
            script_version_id: this.selectedScript.id,
            dataset_version_id: versionId,
          },
        })
        await this.loadLatestTest()
        this.$router.push(`/app/projects/${id}/runs`)
      } catch (e) {
        this.error = (e as Error).message || 'Test failed'
      } finally {
        this.testRunning = false
      }
    },
    async startTraining() {
      if (!this.canStartTraining || !this.selectedScript) return
      const id = (this.$route.params as { id: string }).id
      this.trainingRunning = true
      this.error = ''
      try {
        const datasets = await this.apiFetch<{ datasets: Array<{ versions: Array<{ id: string }> }> }>(`/api/projects/${id}/datasets`)
        const versionId = datasets.datasets?.[0]?.versions?.[0]?.id || 'dsv_1'
        await this.apiFetch(`/api/runs`, {
          method: 'POST',
          body: {
            project_id: id,
            script_version_id: this.selectedScript.id,
            dataset_version_id: versionId,
          },
        })
        this.$router.push(`/app/projects/${id}/runs`)
      } catch (e) {
        this.error = (e as Error).message || 'Failed to start training'
      } finally {
        this.trainingRunning = false
      }
    },
  },
})
</script>
