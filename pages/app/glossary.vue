<template>
  <div class="app-page max-w-3xl">
    <AppPageHeader
      title="Concepts & glossary"
      description="Short explanations of terms you'll see in Aploy. No jargon required."
      back-to="/app"
      back-label="Dashboard"
    />
    <AppCard class="space-y-6">
      <section>
        <h2 class="app-section-title mb-2">Training</h2>
        <dl class="space-y-3 text-sm">
          <div>
            <dt class="font-medium text-zinc-900">Base model</dt>
            <dd class="text-muted-foreground mt-0.5">The starting model we tune (e.g. Mistral 7B). Smaller models are faster and cheaper; larger ones can capture more nuance.</dd>
          </div>
          <div>
            <dt class="font-medium text-zinc-900">Training objective (SFT, DPO, RLHF)</dt>
            <dd class="text-muted-foreground mt-0.5"><strong>SFT</strong> = Supervised Fine-Tuning: train on example conversations so the model responds in your style. <strong>DPO</strong> = train from preference pairs (good vs. bad answers). <strong>RLHF</strong> = Reinforcement Learning from Human Feedback: use human ratings to refine the model.</dd>
          </div>
          <div>
            <dt class="font-medium text-zinc-900">Epochs</dt>
            <dd class="text-muted-foreground mt-0.5">How many times we go through your data. More epochs can improve quality but take longer and cost more; 3 is usually a good start.</dd>
          </div>
          <div>
            <dt class="font-medium text-zinc-900">LoRA rank</dt>
            <dd class="text-muted-foreground mt-0.5">Adapter size: higher can fit more nuance but may overfit. Default 16 is usually best.</dd>
          </div>
          <div>
            <dt class="font-medium text-zinc-900">Dataset version</dt>
            <dd class="text-muted-foreground mt-0.5">A saved snapshot of your data. When you start a training run, you pick a version so the run is reproducible.</dd>
          </div>
        </dl>
      </section>
      <section>
        <h2 class="app-section-title mb-2">Data & knowledge</h2>
        <dl class="space-y-3 text-sm">
          <div>
            <dt class="font-medium text-zinc-900">Chunk size / Chunk overlap</dt>
            <dd class="text-muted-foreground mt-0.5">How we split your documents for search. Chunk size = max characters per piece; overlap = shared text between chunks so context isn't lost. Default (recommended) is usually best.</dd>
          </div>
          <div>
            <dt class="font-medium text-zinc-900">Knowledge base</dt>
            <dd class="text-muted-foreground mt-0.5">Your documents, split into chunks and indexed so pipelines can search them (e.g. "answer from my docs").</dd>
          </div>
        </dl>
      </section>
      <section>
        <h2 class="app-section-title mb-2">Deployments & inference</h2>
        <dl class="space-y-3 text-sm">
          <div>
            <dt class="font-medium text-zinc-900">Deployment</dt>
            <dd class="text-muted-foreground mt-0.5">A trained model that's live and callable. You get a URL (endpoint) and can send prompts and get replies.</dd>
          </div>
          <div>
            <dt class="font-medium text-zinc-900">Endpoint</dt>
            <dd class="text-muted-foreground mt-0.5">The URL where your deployed model accepts requests (e.g. for your app or the "Try your model" page).</dd>
          </div>
          <div>
            <dt class="font-medium text-zinc-900">API endpoint vs Export weights</dt>
            <dd class="text-muted-foreground mt-0.5"><strong>API endpoint</strong>: we host your model; you call our URL to get replies. <strong>Export weights</strong>: download the model file to run elsewhere (your own server, another provider).</dd>
          </div>
        </dl>
      </section>
      <section>
        <h2 class="app-section-title mb-2">Pipelines</h2>
        <dl class="space-y-3 text-sm">
          <div>
            <dt class="font-medium text-zinc-900">Pipeline</dt>
            <dd class="text-muted-foreground mt-0.5">A chain of steps: e.g. search your knowledge base, then send the results to your model. You define the order and what each step does.</dd>
          </div>
          <div>
            <dt class="font-medium text-zinc-900">Step types</dt>
            <dd class="text-muted-foreground mt-0.5"><strong>Search your knowledge base</strong>: find relevant chunks from your docs. <strong>Call your trained model</strong>: send a prompt to a deployment and get a reply. <strong>Call a web URL</strong>: call an external API (e.g. another service).</dd>
          </div>
          <div>
            <dt class="font-medium text-zinc-900">Trigger / Webhook</dt>
            <dd class="text-muted-foreground mt-0.5">A way to run a pipeline from outside Aploy (e.g. from Zapier, a cron job, or your app) by calling a URL with a secret.</dd>
          </div>
        </dl>
      </section>
    </AppCard>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

definePageMeta({ layout: 'app' })

export default defineComponent({
  name: 'Glossary',
})
</script>
