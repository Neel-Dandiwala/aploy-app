<template>
  <div
    class="flex flex-col border-l border-border bg-surface-elevated/95 transition-all duration-200"
    :class="open ? 'w-[380px] min-w-[380px]' : 'w-12 min-w-[48px]'"
  >
    <button
      type="button"
      class="flex items-center justify-between p-3 border-b border-border text-left hover:bg-white/[0.04] transition-colors"
      @click="open = !open"
    >
      <template v-if="open">
        <span class="text-sm font-medium text-white">Aploy assistant</span>
        <span class="text-muted text-xs">◀</span>
      </template>
      <template v-else>
        <span class="text-muted text-xs p-2" title="Open chat">▶</span>
      </template>
    </button>
    <template v-if="open">
      <div class="p-3 border-b border-border">
        <label class="app-label">OpenAI API key (or set in API .env)</label>
        <input
          v-model="apiKey"
          type="password"
          placeholder="sk-..."
          class="app-input py-1.5 text-xs"
        />
      </div>
      <div
        ref="listRef"
        class="flex-1 overflow-y-auto p-3 space-y-3 min-h-[200px] max-h-[calc(100vh-280px)]"
      >
        <p v-if="messages.length === 0" class="text-muted text-sm">
          Ask me to create a project, add a dataset, start training, or deploy.
        </p>
        <div
          v-for="(msg, i) in messages"
          :key="i"
          :class="msg.role === 'user' ? 'flex justify-end' : ''"
        >
          <div
            :class="[
              'rounded-app text-sm px-3 py-2 max-w-[90%]',
              msg.role === 'user'
                ? 'bg-accent/90 text-white'
                : 'bg-surface-overlay text-muted-foreground border border-border',
            ]"
          >
            <div class="whitespace-pre-wrap">{{ msg.content }}</div>
            <div v-if="msg.actions?.length" class="mt-2 pt-2 border-t border-border text-xs text-emerald-500">
              <div v-for="(a, j) in msg.actions" :key="j">
                {{ a.action }}: {{ typeof a.result === 'object' && a.result && 'id' in a.result ? `created ${(a.result as { id: string }).id}` : 'ok' }}
              </div>
            </div>
          </div>
        </div>
        <div v-if="loading" class="rounded-app bg-surface-overlay text-muted text-sm px-3 py-2 border border-border">Thinking…</div>
      </div>
      <div class="p-3 border-t border-border">
        <form class="flex gap-2" @submit.prevent="send">
          <input
            v-model="input"
            type="text"
            placeholder="Create a project, add dataset…"
            class="app-input flex-1 min-w-0 py-2"
            :disabled="loading"
          />
          <AppButton type="submit" :disabled="loading" size="md">
            Send
          </AppButton>
        </form>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface Message {
  role: 'user' | 'assistant'
  content: string
  actions?: Array<{ action: string; result: unknown }>
}

export default defineComponent({
  name: 'ChatPanel',
  data() {
    return {
      open: true,
      messages: [] as Message[],
      input: '',
      loading: false,
      apiKey: '',
      listRef: null as HTMLElement | null,
    }
  },
  watch: {
    messages() {
      this.$nextTick(() => {
        if (this.listRef) this.listRef.scrollTo(0, this.listRef.scrollHeight)
      })
    },
  },
  methods: {
    async send() {
      const text = this.input.trim()
      if (!text || this.loading) return
      this.input = ''
      this.messages.push({ role: 'user', content: text })
      this.loading = true
      const config = useRuntimeConfig()
      const apiUrl = config.public.apiUrl as string
      try {
        const data = await $fetch<{ reply: string; actions_taken?: Array<{ action: string; result: unknown }> }>(`${apiUrl}/api/chat`, {
          method: 'POST',
          credentials: 'include',
          body: {
            messages: this.messages.map((m) => ({ role: m.role, content: m.content })),
            openai_api_key: this.apiKey || undefined,
          },
        })
        this.messages.push({
          role: 'assistant',
          content: data.reply || 'Done.',
          actions: data.actions_taken?.length ? data.actions_taken : undefined,
        })
      } catch (e: unknown) {
        const err = e as { data?: { error?: string }; message?: string }
        this.messages.push({
          role: 'assistant',
          content: err?.data?.error || err?.message || 'Request failed. Check API key.',
        })
      } finally {
        this.loading = false
      }
    },
  },
})
</script>
