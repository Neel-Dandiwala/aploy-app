<template>
  <NuxtLink
    v-if="to"
    :to="to"
    :class="buttonClasses"
    @click="onClick"
  >
    <slot />
  </NuxtLink>
  <a
    v-else-if="href"
    :href="href"
    :class="buttonClasses"
    @click="onClick"
  >
    <slot />
  </a>
  <button
    v-else
    :type="type"
    :disabled="disabled"
    :class="buttonClasses"
    @click="onClick"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

const base =
  'inline-flex items-center justify-center gap-2 rounded-app px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent/30 focus:ring-offset-2 focus:ring-offset-surface disabled:pointer-events-none disabled:opacity-50'

const variants = {
  primary:
    'bg-accent text-white hover:bg-accent-hover shadow-app-sm',
  secondary:
    'border border-border bg-surface-elevated text-muted-foreground hover:bg-surface-overlay hover:text-white hover:border-white/10',
  ghost:
    'text-muted-foreground hover:bg-white/[0.06] hover:text-white',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
}

export default defineComponent({
  name: 'AppButton',
  props: {
    variant: {
      type: String as () => 'primary' | 'secondary' | 'ghost',
      default: 'primary',
    },
    size: {
      type: String as () => 'sm' | 'md',
      default: 'md',
    },
    type: {
      type: String as () => 'button' | 'submit',
      default: 'button',
    },
    to: { type: String, default: undefined },
    href: { type: String, default: undefined },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['click'],
  setup(props, { emit }) {
    const buttonClasses = computed(
      () =>
        [base, variants[props.variant], sizes[props.size]].filter(Boolean).join(' ')
    )
    function onClick(e: Event) {
      if (!props.disabled) emit('click', e)
    }
    return { buttonClasses, onClick }
  },
})
</script>
