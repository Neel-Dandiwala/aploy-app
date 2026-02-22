<template>
  <div class="app-page-narrow">
    <AppPageHeader title="Settings" />
    <div class="space-y-4">
      <AppCard>
        <h3 class="app-section-title mb-1">Profile</h3>
        <p class="app-section-description">Email and name from Google.</p>
      </AppCard>
      <AppCard>
        <h3 class="app-section-title mb-1">Two-factor authentication (MFA)</h3>
        <p class="app-section-description">Add TOTP for an extra check after Google login.</p>
      </AppCard>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

definePageMeta({ layout: 'app' })

export default defineComponent({
  name: 'SettingsPage',
})
</script>
