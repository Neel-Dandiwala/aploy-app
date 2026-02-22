<template>
  <div class="min-h-screen flex flex-col items-center justify-center gap-8 p-8 bg-[#0a0a0f]">
    <h1 class="text-4xl font-bold text-white">Aploy</h1>
    <p class="text-zinc-400 text-center max-w-md">
      Stripe/Vercel for LLM training. One API + UI for fine-tuning, DPO, and deployment.
    </p>
    <div class="flex gap-4">
      <NuxtLink to="/login" class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition">
        Sign in with Google
      </NuxtLink>
      <NuxtLink to="/app" class="rounded-lg border border-zinc-600 bg-transparent px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition">
        Open app (mock)
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomePage',
  layout: 'blank',
})
</script>
