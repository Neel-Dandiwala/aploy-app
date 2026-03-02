<template>
  <div class="app-page">
    <h2 class="text-lg font-semibold text-zinc-900 mb-4">Chats</h2>
    <div class="flex gap-6">
      <div class="w-56 shrink-0">
        <AppButton class="w-full mb-4" @click="createNewChat">
          New chat
        </AppButton>
        <div class="space-y-1">
          <button
            v-for="c in chats"
            :key="c.id"
            class="w-full text-left px-3 py-2 rounded-app text-sm truncate transition-colors"
            :class="activeChatId === c.id ? 'bg-surface-overlay font-medium' : 'hover:bg-surface-overlay/50 text-muted-foreground'"
            @click="selectChat(c.id)"
          >
            {{ c.title || 'New chat' }}
          </button>
        </div>
      </div>
      <div class="flex-1 min-w-0 flex flex-col min-h-[400px]">
        <p v-if="loading" class="text-muted-foreground text-sm">Loading…</p>
        <p v-else-if="error" class="app-error">{{ error }}</p>
        <div v-else-if="!activeChatId" class="text-muted-foreground text-sm py-8">
          Select a chat or start a new one.
        </div>
        <div v-else class="flex flex-col h-[calc(100vh-280px)] min-h-[400px]">
          <div
            ref="messagesRef"
            class="flex-1 overflow-y-auto p-4 space-y-4 border border-border rounded-app bg-surface-elevated"
          >
            <p v-if="guidedPrompts.length && messages.length === 0" class="text-muted text-sm mb-3">Try one of these:</p>
            <div v-if="messages.length === 0" class="flex flex-wrap gap-2 mb-4">
              <button
                v-for="gp in guidedPrompts"
                :key="gp.label"
                class="px-3 py-2 rounded-app border border-border text-sm hover:bg-surface-overlay transition-colors"
                @click="usePrompt(gp.prompt)"
              >
                {{ gp.label }}
              </button>
            </div>
            <div
              v-for="(msg, i) in messages"
              :key="msg.id || i"
              :class="msg.role === 'user' ? 'flex justify-end' : ''"
            >
              <div
                :class="[
                  'rounded-app text-sm px-3 py-2 max-w-[85%]',
                  msg.role === 'user'
                    ? 'bg-accent/90 text-white'
                    : 'bg-surface-overlay text-muted-foreground border border-border',
                ]"
              >
                <div class="whitespace-pre-wrap">{{ msg.content }}</div>
                <div v-if="msg.actions?.length" class="mt-2 pt-2 border-t border-border text-xs text-emerald-500">
                  <div v-for="(a, j) in msg.actions" :key="j">
                    {{ a.action }}: {{ actionSummary(a.result) }}
                  </div>
                </div>
              </div>
            </div>
            <div v-if="sending" class="rounded-app bg-surface-overlay text-muted text-sm px-3 py-2 border border-border w-fit">
              Thinking…
            </div>
          </div>
          <div class="mt-4 flex gap-2">
            <input
              v-model="input"
              type="text"
              placeholder="Which dataset, what config, what results..."
              class="app-input flex-1 min-w-0 py-2"
              :disabled="sending"
              @keydown.enter.prevent="send"
            />
            <AppButton :disabled="sending || !input.trim()" @click="send">
              Send
            </AppButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

definePageMeta({ layout: 'app' })

export default defineComponent({
  name: 'ProjectChat',
  data() {
    return {
      project: null as { name?: string } | null,
      chats: [] as Array<{ id: string; title: string; created_at: string; last_message_preview: string | null }>,
      guidedPrompts: [] as Array<{ label: string; prompt: string }>,
      activeChatId: null as string | null,
      messages: [] as Array<{ id: string; role: string; content: string; actions?: Array<{ action: string; result: unknown }> }>,
      input: '',
      loading: true,
      sending: false,
      error: '',
    }
  },
  setup() {
    const { apiFetch } = useAployApi()
    return { apiFetch }
  },
  watch: {
    messages: {
      handler() {
        this.$nextTick(() => {
          const el = this.$refs.messagesRef as HTMLElement
          if (el) el.scrollTop = el.scrollHeight
        })
      },
      deep: true,
    },
  },
  async mounted() {
    await this.loadProject()
    await this.loadChats()
  },
  methods: {
    actionSummary(result: unknown): string {
      if (!result || typeof result !== 'object') return 'ok'
      const r = result as Record<string, unknown>
      if (r.id) return `created ${r.id}`
      if (r.error) return String(r.error)
      return 'ok'
    },
    usePrompt(prompt: string) {
      this.input = prompt
    },
    async loadProject() {
      const id = (this.$route.params as { id: string }).id
      try {
        this.project = await this.apiFetch<{ name?: string }>(`/api/projects/${id}`)
      } catch {
        this.project = null
      }
    },
    async loadChats() {
      const id = (this.$route.params as { id: string }).id
      this.loading = true
      this.error = ''
      try {
        const data = await this.apiFetch<{
          chats?: Array<{ id: string; title: string; created_at: string; last_message_preview: string | null }>;
          guided_prompts?: Array<{ label: string; prompt: string }>;
          messages?: Array<{ id: string; role: string; content: string }>;
        }>(`/api/projects/${id}/chats`)
        this.chats = data.chats || []
        this.guidedPrompts = data.guided_prompts || []
        if (!this.activeChatId && this.chats.length) {
          this.activeChatId = this.chats[0].id
          await this.loadMessages()
        } else if (data.messages) {
          this.messages = data.messages
        }
      } catch (e) {
        this.error = (e as Error).message || 'Failed to load chats'
      } finally {
        this.loading = false
      }
    },
    async loadMessages() {
      if (!this.activeChatId) return
      const id = (this.$route.params as { id: string }).id
      this.loading = true
      try {
        const data = await this.apiFetch<{ messages: Array<{ id: string; role: string; content: string }> }>(`/api/projects/${id}/chats?chat_id=${this.activeChatId}`)
        this.messages = data.messages || []
      } catch (e) {
        this.error = (e as Error).message || 'Failed to load messages'
      } finally {
        this.loading = false
      }
    },
    selectChat(chatId: string) {
      this.activeChatId = chatId
      this.loadMessages()
    },
    createNewChat() {
      this.activeChatId = null
      this.messages = []
      this.input = ''
    },
    async send() {
      const content = this.input.trim()
      if (!content || this.sending) return

      this.input = ''
      this.messages.push({ id: 'temp-user', role: 'user', content })
      this.sending = true

      const id = (this.$route.params as { id: string }).id
      try {
        const data = await this.apiFetch<{
          chat: { id: string; title: string };
          user_message: { id: string; role: string; content: string };
          assistant_message: { id: string; role: string; content: string; actions?: Array<{ action: string; result: unknown }> };
        }>(`/api/projects/${id}/chats`, { method: 'POST', body: { content, chat_id: this.activeChatId || undefined } })

        if (data.chat && !this.chats.some((c) => c.id === data.chat.id)) {
          this.chats.unshift({ id: data.chat.id, title: data.chat.title, created_at: new Date().toISOString(), last_message_preview: content.slice(0, 80) })
        }
        this.activeChatId = data.chat?.id || this.activeChatId

        const lastUser = this.messages.filter((m) => m.role === 'user').pop()
        if (lastUser && lastUser.id === 'temp-user') {
          lastUser.id = data.user_message.id
        }
        this.messages.push({
          id: data.assistant_message.id,
          role: 'assistant',
          content: data.assistant_message.content,
          actions: data.assistant_message.actions,
        })
      } catch (e) {
        this.messages.push({
          id: 'err-' + Date.now(),
          role: 'assistant',
          content: (e as Error).message || 'Failed to send message.',
        })
      } finally {
        this.sending = false
      }
    },
  },
})
</script>
