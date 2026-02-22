<template>
  <div class="app-page">
    <AppPageHeader
      :title="pipeline?.name ?? 'Pipeline'"
      description="Edit and test run."
      back-to="/app/pipelines"
      back-label="Pipelines"
    />
    <p v-if="loading" class="text-muted-foreground text-sm">Loading…</p>
    <p v-else-if="error" class="app-error">{{ error }}</p>
    <template v-else-if="pipeline">
      <AppCard class="mb-4">
        <h3 class="app-section-title mb-2">Test run</h3>
        <p class="text-sm text-muted-foreground mb-2">Send sample input (JSON) and see the output.</p>
        <textarea
          v-model="testInput"
          class="app-input min-h-[100px] font-mono text-sm mb-2"
          placeholder='{"query": "Hello"}'
        />
        <AppButton :disabled="running" @click="runTest">
          {{ running ? 'Running…' : 'Run pipeline' }}
        </AppButton>
        <div v-if="testOutput !== null" class="mt-4 rounded bg-muted/50 p-3">
          <p class="text-sm font-medium mb-2">Output</p>
          <pre class="text-xs overflow-auto max-h-[300px]">{{ testOutputText }}</pre>
        </div>
      </AppCard>
      <AppCard>
        <h3 class="app-section-title mb-2">Steps</h3>
        <ul class="space-y-2 text-sm">
          <li v-for="(s, i) in pipeline.steps" :key="i" class="flex gap-2">
            <span class="text-muted-foreground">{{ i + 1 }}.</span>
            <span class="font-medium">{{ (s as { name?: string }).name }}</span>
            <span class="text-muted-foreground">({{ (s as { type?: string }).type }})</span>
          </li>
        </ul>
        <p v-if="!pipeline.steps?.length" class="text-muted-foreground text-sm">No steps.</p>
      </AppCard>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

definePageMeta({ layout: 'app' })

interface PipelineDetail {
  id: string
  name: string
  description?: string
  steps?: unknown[]
}

export default defineComponent({
  name: 'PipelineDetail',
  data() {
    return {
      pipeline: null as PipelineDetail | null,
      loading: true,
      error: '',
      testInput: '{}',
      running: false,
      testOutput: null as unknown,
    }
  },
  computed: {
    testOutputText(): string {
      if (this.testOutput === null) return ''
      return typeof this.testOutput === 'string'
        ? this.testOutput
        : JSON.stringify(this.testOutput, null, 2)
    },
  },
  setup() {
    const { apiFetch, apiUrl, environment } = useAployApi()
    return { apiFetch, apiUrl, environment }
  },
  async mounted() {
    await this.load()
  },
  methods: {
    async load() {
      this.loading = true
      this.error = ''
      const id = (this.$route.params as { id: string }).id
      try {
        this.pipeline = await this.apiFetch<PipelineDetail>(`/api/pipelines/${id}`)
      } catch (e) {
        this.error = (e as Error).message || 'Failed to load pipeline'
      } finally {
        this.loading = false
      }
    },
    async runTest() {
      if (!this.pipeline) return
      let input: unknown
      try {
        input = this.testInput.trim() ? JSON.parse(this.testInput) : {}
      } catch {
        this.testOutput = { error: 'Invalid JSON in input' }
        return
      }
      this.running = true
      this.testOutput = null
      const config = useRuntimeConfig()
      const base = (config.public.apiUrl as string) || 'http://localhost:4000'
      const url = `${base.replace(/\/$/, '')}/v1/pipelines/${this.pipeline.id}/invoke`
      try {
        const res = await $fetch<{ output?: unknown; steps?: unknown; error?: string }>(url, {
          method: 'POST',
          body: input,
          credentials: 'include',
          headers: { 'Content-Type': 'application/json', 'X-Environment': this.environment?.value ?? 'production' },
        })
        this.testOutput = res.error ? { error: res.error, output: res.output, steps: res.steps } : res.output
      } catch (e: unknown) {
        const err = e as { data?: unknown }
        this.testOutput = err.data ?? (e as Error).message
      } finally {
        this.running = false
      }
    },
  },
})
</script>
