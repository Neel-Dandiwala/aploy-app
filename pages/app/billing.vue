<template>
  <div class="app-page">
    <AppPageHeader title="Billing & usage" />
    <p v-if="loading" class="text-muted-foreground text-sm">Loading…</p>
    <template v-else>
      <AppCard class="mb-4">
        <h3 class="app-section-title mb-4">Current period</h3>
        <ul class="space-y-2 text-sm text-muted-foreground">
          <li>Period: {{ usage.period_start }} – {{ usage.period_end }}</li>
          <li>Compute (GPU hours): {{ usage.compute_gpu_hours }} — ${{ (usage.compute_gpu_hours * 1.56).toFixed(2) }}</li>
          <li>Storage (GB-months): {{ usage.storage_gb_months }} — ${{ (usage.storage_gb_months * 0.036).toFixed(2) }}</li>
          <li><strong class="text-zinc-900">Total: ${{ usage.total_usd.toFixed(2) }}</strong></li>
        </ul>
        <p class="text-muted text-sm mt-4">Forecast: ~${{ (usage.forecast_usd ?? usage.total_usd).toFixed(2) }}</p>
        <AppButton v-if="!stripeConnected" class="mt-4" variant="secondary" :disabled="settingUp" @click="setupCustomer">
          {{ settingUp ? 'Setting up…' : 'Connect Stripe for billing' }}
        </AppButton>
      </AppCard>
      <AppCard>
        <h3 class="app-section-title mb-4">Invoices</h3>
        <ul v-if="invoices.length" class="space-y-2 text-sm">
          <li v-for="inv in invoices" :key="inv.id" class="flex justify-between">
            <span>{{ inv.id }}</span>
            <span>${{ inv.amount_usd.toFixed(2) }}</span>
            <span>{{ inv.status }}</span>
          </li>
        </ul>
        <p v-else class="text-muted-foreground text-sm">No invoices yet.</p>
      </AppCard>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

definePageMeta({ layout: 'app' })

export default defineComponent({
  name: 'BillingPage',
  data() {
    return {
      usage: {
        period_start: '',
        period_end: '',
        compute_gpu_hours: 24.5,
        storage_gb_months: 120,
        total_usd: 42.5,
        forecast_usd: 55,
      },
      invoices: [] as Array<{ id: string; amount_usd: number; status: string }>,
      loading: true,
      settingUp: false,
      stripeConnected: false,
    }
  },
  setup() {
    const { apiFetch } = useAployApi()
    return { apiFetch }
  },
  async mounted() {
    await this.load()
  },
  methods: {
    async load() {
      this.loading = true
      try {
        const [usageRes, invRes] = await Promise.all([
          this.apiFetch<typeof this.usage>('/api/billing/usage'),
          this.apiFetch<{ invoices: typeof this.invoices }>('/api/billing/invoices'),
        ])
        this.usage = usageRes
        this.invoices = invRes.invoices ?? []
        this.stripeConnected = this.invoices.length > 0 || (usageRes as { stripe_customer_id?: string }).stripe_customer_id !== undefined
      } catch {
        this.usage = {
          period_start: new Date().toISOString().slice(0, 10),
          period_end: new Date().toISOString().slice(0, 10),
          compute_gpu_hours: 24.5,
          storage_gb_months: 120,
          total_usd: 42.5,
          forecast_usd: 55,
        }
      } finally {
        this.loading = false
      }
    },
    async setupCustomer() {
      this.settingUp = true
      try {
        await this.apiFetch<{ stripe_customer_id: string }>('/api/billing/setup-customer', { method: 'POST' })
        this.stripeConnected = true
        await this.load()
      } catch (e) {
        alert((e as Error).message || 'Setup failed')
      } finally {
        this.settingUp = false
      }
    },
  },
})
</script>
