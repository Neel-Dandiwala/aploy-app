<template>
  <span class="inline-flex items-center gap-1">
    <span><slot /></span>
    <span
      v-if="tip"
      class="inline-flex items-center justify-center w-4 h-4 rounded-full text-muted-foreground hover:text-zinc-700 cursor-help border border-border/60 hover:border-border text-[10px] font-medium"
      :title="tip"
    >
      ?
    </span>
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppHelpTip',
  props: {
    tip: { type: String, default: '' },
  },
})
</script>
