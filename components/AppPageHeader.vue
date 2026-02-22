<template>
  <div class="flex flex-col gap-2 mb-content">
    <NuxtLink
      v-if="backTo"
      :to="backTo"
      class="app-back-link"
    >
      ← {{ backLabel }}
    </NuxtLink>
    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div>
        <h1 class="app-page-title">
          {{ title }}
        </h1>
        <p v-if="description" class="app-page-description">
          {{ description }}
        </p>
      </div>
      <div v-if="$slots.actions" class="flex items-center gap-2 shrink-0">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppPageHeader',
  props: {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    backTo: { type: String, default: '' },
    backLabel: { type: String, default: 'Back' },
  },
})
</script>
