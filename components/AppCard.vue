<template>
  <div class="app-card" :class="$attrs.class">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppCard',
  inheritAttrs: false,
})
</script>
