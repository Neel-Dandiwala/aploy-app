<template>
  <div class="app-page">
    <AppPageHeader title="Organization" />
    <div class="space-y-4">
      <AppCard>
        <h3 class="app-section-title mb-1">General</h3>
        <p v-if="org" class="app-section-description">
          Name: {{ org.name }}. Slug: {{ org.slug }}.
        </p>
        <p v-else-if="loadingOrg" class="text-muted-foreground text-sm">Loading…</p>
        <p class="text-sm text-muted-foreground mt-3">
          Manage S3, GCS, and Hugging Face in
          <NuxtLink to="/app/integrations" class="text-accent hover:text-accent-hover transition-colors">Integrations</NuxtLink>.
        </p>
      </AppCard>
      <AppCard>
        <h3 class="app-section-title mb-4">API keys</h3>
        <p v-if="loadingKeys" class="text-muted-foreground text-sm">Loading…</p>
        <ul v-else class="space-y-2">
          <li
            v-for="k in apiKeys"
            :key="k.id"
            class="flex items-center justify-between gap-2 rounded border border-border/50 bg-muted/30 px-3 py-2 text-sm"
          >
            <span class="text-foreground">{{ k.name }}</span>
            <span class="font-mono text-muted-foreground">{{ k.key_prefix }}…</span>
            <span class="text-muted-foreground text-xs">{{ k.last_used_at ? 'Used ' + formatDate(k.last_used_at) : 'Never used' }}</span>
            <button
              type="button"
              class="text-destructive hover:underline"
              @click="revokeApiKey(k.id)"
            >
              Revoke
            </button>
          </li>
          <p v-if="!loadingKeys && apiKeys.length === 0" class="text-muted-foreground text-sm">
            No API keys. Create one to call invoke APIs from scripts or external apps.
          </p>
        </ul>
        <div v-if="showCreateKey" class="mt-4 space-y-2 border-t border-border/50 pt-4">
          <label class="app-label">Key name</label>
          <input v-model="newKeyName" class="app-input" placeholder="e.g. Production" />
          <div class="flex gap-2">
            <AppButton :disabled="creatingKey" @click="createApiKey">
              {{ creatingKey ? 'Creating…' : 'Create key' }}
            </AppButton>
            <AppButton variant="secondary" @click="showCreateKey = false; newKeyName = ''">Cancel</AppButton>
          </div>
        </div>
        <div v-if="newKeyRaw" class="mt-4 rounded border border-amber-500/50 bg-amber-500/10 p-3 text-sm">
          <p class="font-medium text-amber-700 dark:text-amber-400">Copy your key now. It won’t be shown again.</p>
          <code class="mt-2 block break-all font-mono text-xs">{{ newKeyRaw }}</code>
          <AppButton class="mt-2" variant="secondary" size="sm" @click="copyKeyThenClose">Copy and close</AppButton>
        </div>
        <AppButton v-else-if="!showCreateKey" class="mt-4" variant="secondary" @click="showCreateKey = true">
          Create API key
        </AppButton>
      </AppCard>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

definePageMeta({ layout: 'app' })

export default defineComponent({
  name: 'OrgPage',
  data() {
    return {
      org: null as { name: string; slug: string } | null,
      loadingOrg: true,
      apiKeys: [] as Array<{ id: string; name: string; key_prefix: string; last_used_at?: string | null }>,
      loadingKeys: true,
      showCreateKey: false,
      newKeyName: '',
      creatingKey: false,
      newKeyRaw: '',
    }
  },
  setup() {
    const { apiFetch } = useAployApi()
    return { apiFetch }
  },
  async mounted() {
    await Promise.all([this.loadOrg(), this.loadApiKeys()])
  },
  methods: {
    async loadOrg() {
      this.loadingOrg = true
      try {
        this.org = await this.apiFetch<{ name: string; slug: string }>('/api/org')
      } catch {
        this.org = null
      } finally {
        this.loadingOrg = false
      }
    },
    async loadApiKeys() {
      this.loadingKeys = true
      try {
        const data = await this.apiFetch<{ api_keys: Array<{ id: string; name: string; key_prefix: string; last_used_at?: string | null }> }>('/api/org/api-keys')
        this.apiKeys = data.api_keys || []
      } catch {
        this.apiKeys = []
      } finally {
        this.loadingKeys = false
      }
    },
    formatDate(iso: string) {
      try {
        return new Date(iso).toLocaleDateString()
      } catch {
        return iso
      }
    },
    async createApiKey() {
      if (!this.newKeyName.trim()) return
      this.creatingKey = true
      try {
        const data = await this.apiFetch<{ raw_key: string }>('/api/org/api-keys', {
          method: 'POST',
          body: { name: this.newKeyName.trim() },
        })
        this.newKeyRaw = data.raw_key
        this.showCreateKey = false
        this.newKeyName = ''
        await this.loadApiKeys()
      } catch (e) {
        alert((e as Error).message || 'Create failed')
      } finally {
        this.creatingKey = false
      }
    },
    copyKeyThenClose() {
      if (this.newKeyRaw && typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(this.newKeyRaw)
      }
      this.newKeyRaw = ''
    },
    async revokeApiKey(id: string) {
      if (!confirm('Revoke this API key? It will stop working immediately.')) return
      try {
        await this.apiFetch(`/api/org/api-keys/${id}`, { method: 'DELETE' })
        await this.loadApiKeys()
      } catch (e) {
        alert((e as Error).message || 'Revoke failed')
      }
    },
  },
})
</script>
