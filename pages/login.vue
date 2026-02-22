<template>
  <div class="min-h-screen flex flex-col items-center justify-center gap-6 p-8 bg-surface">
    <h1 class="text-2xl font-semibold text-zinc-900 tracking-tight">Sign in to Aploy</h1>
    <p class="text-muted-foreground text-sm text-center max-w-sm">
      Use Google with MFA for secure access.
    </p>
    <a
      :href="googleAuthUrl"
      class="inline-flex items-center justify-center gap-2 rounded-app px-4 py-2 text-sm font-medium bg-accent text-white hover:bg-accent-hover shadow-app-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent/30 focus:ring-offset-2 focus:ring-offset-surface no-underline"
    >
      Sign in with Google
    </a>
    <p class="text-muted text-xs text-center">
      Redirect goes to API then back to /auth/callback.
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LoginPage',
  layout: 'blank',
  data() {
    return {
      apiUrl: '',
    }
  },
  computed: {
    googleAuthUrl(): string {
      return this.apiUrl ? `${this.apiUrl}/auth/google` : 'http://localhost:4000/auth/google'
    },
  },
  mounted() {
    this.apiUrl = useRuntimeConfig().public.apiUrl as string
  },
})
</script>
