<template>
  <div class="min-h-screen flex flex-col items-center justify-center gap-6 p-8 bg-[#0a0a0f]">
    <p v-if="status === 'loading'" class="text-zinc-400">Signing you in...</p>
    <template v-else-if="status === 'mfa_required'">
      <h2 class="text-xl font-semibold text-white">Two-factor authentication</h2>
      <p class="text-zinc-400">Enter the code from your authenticator app.</p>
      <form @submit.prevent="submitMfa" class="flex flex-col gap-4 w-64">
        <input
          v-model="mfaToken"
          type="text"
          placeholder="000000"
          class="w-full rounded-lg border border-zinc-600 bg-zinc-900 px-3 py-2 text-center text-lg tracking-widest text-zinc-100"
          maxlength="6"
        />
        <button type="submit" class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">
          Verify
        </button>
      </form>
    </template>
    <p v-else-if="status === 'error'" class="text-red-400">
      Auth failed. <NuxtLink to="/login" class="underline">Try again</NuxtLink>.
    </p>
    <p v-else class="text-zinc-400">Redirecting...</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AuthCallbackPage',
  layout: 'blank',
  data() {
    return {
      status: 'loading' as 'loading' | 'mfa_required' | 'done' | 'error',
      mfaToken: '',
    }
  },
  mounted() {
    this.checkAuth()
  },
  methods: {
    async checkAuth() {
      const config = useRuntimeConfig()
      const apiUrl = config.public.apiUrl as string
      try {
        const res = await $fetch<{ mfaEnabled?: boolean }>(`${apiUrl}/auth/me`, { credentials: 'include' })
        if (res.mfaEnabled) {
          this.status = 'mfa_required'
          return
        }
        this.status = 'done'
        await navigateTo('/app', { replace: true })
      } catch {
        this.status = 'error'
      }
    },
    async submitMfa() {
      const config = useRuntimeConfig()
      const apiUrl = config.public.apiUrl as string
      try {
        await $fetch(`${apiUrl}/auth/mfa/check`, {
          method: 'POST',
          credentials: 'include',
          body: { token: this.mfaToken },
        })
        await navigateTo('/app', { replace: true })
      } catch {
        this.status = 'error'
      }
    },
  },
})
</script>
