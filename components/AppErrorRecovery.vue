<template>
  <div v-if="recovery" class="mt-2 rounded-app border border-border/50 bg-muted/20 p-3 text-sm">
    <p class="font-medium text-zinc-900 mb-1">What you can do</p>
    <p class="text-muted-foreground">{{ recovery.fix }}</p>
    <NuxtLink v-if="recovery.link" :to="recovery.link" class="text-accent hover:text-accent-hover mt-1 inline-block">
      {{ recovery.linkText || 'Go there' }}
    </NuxtLink>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

function getRecovery(error: string): { fix: string; link?: string; linkText?: string } | null {
  const e = (error || '').toLowerCase()
  if (e.includes('dataset') || e.includes('version') || e.includes('training')) {
    return { fix: 'Make sure your dataset has a version. Create a version from your dataset page after ingestion.', link: '/app/datasets', linkText: 'Open Datasets' }
  }
  if (e.includes('invalid json') || e.includes('json')) {
    return { fix: 'Check that your input is valid JSON (e.g. use double quotes, no trailing commas).' }
  }
  if (e.includes('deploy')) {
    return { fix: 'Check that the model version exists in Registry and that you have a successful run. Try again or pick another model version.', link: '/app/registry', linkText: 'Open Registry' }
  }
  if (e.includes('not found') || e.includes('404')) {
    return { fix: 'The resource may have been deleted or the link is wrong. Try going back and opening it again.' }
  }
  if (e.includes('failed') || e.includes('error')) {
    return { fix: 'Try again in a few moments. If it keeps failing, check your data and settings.' }
  }
  return null
}

export default defineComponent({
  name: 'AppErrorRecovery',
  props: {
    error: { type: String, default: '' },
  },
  computed: {
    recovery() {
      return this.error ? getRecovery(this.error) : null
    },
  },
})
</script>
