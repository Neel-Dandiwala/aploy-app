import { _ as __nuxt_component_0 } from './nuxt-link-D0qNmuHi.mjs';
import { _ as __nuxt_component_0$1 } from './AppButton-oAgfFzQm.mjs';
import { defineComponent, useSSRContext, mergeProps, withCtx, createTextVNode, toDisplayString } from 'vue';
import { u as useMockMode } from './useMockMode-j3YD3gix.mjs';
import { a as useRuntimeConfig } from './server.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrRenderSlot, ssrRenderClass, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import { u as useEnvironment } from './useEnvironment-BnZbXQTt.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main$1 = defineComponent({
  name: "ChatPanel",
  data() {
    return {
      open: true,
      messages: [],
      input: "",
      loading: false,
      apiKey: "",
      listRef: null
    };
  },
  watch: {
    messages() {
      this.$nextTick(() => {
        if (this.listRef) this.listRef.scrollTo(0, this.listRef.scrollHeight);
      });
    }
  },
  setup() {
    const { mockMode } = useMockMode();
    return { mockMode };
  },
  methods: {
    async send() {
      var _a, _b, _c;
      const text = this.input.trim();
      if (!text || this.loading) return;
      this.input = "";
      this.messages.push({ role: "user", content: text });
      this.loading = true;
      try {
        if ((_a = this.mockMode) == null ? void 0 : _a.value) {
          await new Promise((r) => setTimeout(r, 400));
          this.messages.push({
            role: "assistant",
            content: "I've created the project and added a dataset. You can start a training run from the Runs page, then deploy from Deployments.",
            actions: [
              { action: "create_project", result: { id: "proj_mock1" } },
              { action: "add_dataset", result: { id: "ds_mock1" } }
            ]
          });
          this.loading = false;
          return;
        }
        const config = useRuntimeConfig();
        const apiUrl = config.public.apiUrl;
        const data = await $fetch(`${apiUrl}/api/chat`, {
          method: "POST",
          credentials: "include",
          body: {
            messages: this.messages.map((m) => ({ role: m.role, content: m.content })),
            openai_api_key: this.apiKey || void 0
          }
        });
        this.messages.push({
          role: "assistant",
          content: data.reply || "Done.",
          actions: ((_b = data.actions_taken) == null ? void 0 : _b.length) ? data.actions_taken : void 0
        });
      } catch (e) {
        const err = e;
        this.messages.push({
          role: "assistant",
          content: ((_c = err == null ? void 0 : err.data) == null ? void 0 : _c.error) || (err == null ? void 0 : err.message) || "Request failed. Check API key."
        });
      } finally {
        this.loading = false;
      }
    }
  }
});
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_AppButton = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: ["flex flex-col border-l border-border bg-surface-elevated/95 transition-all duration-200", _ctx.open ? "w-[380px] min-w-[380px]" : "w-12 min-w-[48px]"]
  }, _attrs))}><button type="button" class="flex items-center justify-between p-3 border-b border-border text-left hover:bg-white/[0.04] transition-colors">`);
  if (_ctx.open) {
    _push(`<!--[--><span class="text-sm font-medium text-zinc-900">Aploy assistant</span><span class="text-muted text-xs">\u25C0</span><!--]-->`);
  } else {
    _push(`<span class="text-muted text-xs p-2" title="Open chat">\u25B6</span>`);
  }
  _push(`</button>`);
  if (_ctx.open) {
    _push(`<!--[--><div class="p-3 border-b border-border"><label class="app-label">OpenAI API key (or set in API .env)</label><input${ssrRenderAttr("value", _ctx.apiKey)} type="password" placeholder="sk-..." class="app-input py-1.5 text-xs"></div><div class="flex-1 overflow-y-auto p-3 space-y-3 min-h-[200px] max-h-[calc(100vh-280px)]">`);
    if (_ctx.messages.length === 0) {
      _push(`<p class="text-muted text-sm"> Ask me to create a project, add a dataset, start training, or deploy. </p>`);
    } else {
      _push(`<!---->`);
    }
    _push(`<!--[-->`);
    ssrRenderList(_ctx.messages, (msg, i) => {
      var _a;
      _push(`<div class="${ssrRenderClass(msg.role === "user" ? "flex justify-end" : "")}"><div class="${ssrRenderClass([
        "rounded-app text-sm px-3 py-2 max-w-[90%]",
        msg.role === "user" ? "bg-accent/90 text-white" : "bg-surface-overlay text-muted-foreground border border-border"
      ])}"><div class="whitespace-pre-wrap">${ssrInterpolate(msg.content)}</div>`);
      if ((_a = msg.actions) == null ? void 0 : _a.length) {
        _push(`<div class="mt-2 pt-2 border-t border-border text-xs text-emerald-500"><!--[-->`);
        ssrRenderList(msg.actions, (a, j) => {
          _push(`<div>${ssrInterpolate(a.action)}: ${ssrInterpolate(typeof a.result === "object" && a.result && "id" in a.result ? `created ${a.result.id}` : "ok")}</div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    });
    _push(`<!--]-->`);
    if (_ctx.loading) {
      _push(`<div class="rounded-app bg-surface-overlay text-muted text-sm px-3 py-2 border border-border">Thinking\u2026</div>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div><div class="p-3 border-t border-border"><form class="flex gap-2"><input${ssrRenderAttr("value", _ctx.input)} type="text" placeholder="Create a project, add dataset\u2026" class="app-input flex-1 min-w-0 py-2"${ssrIncludeBooleanAttr(_ctx.loading) ? " disabled" : ""}>`);
    _push(ssrRenderComponent(_component_AppButton, {
      type: "submit",
      disabled: _ctx.loading,
      size: "md"
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(` Send `);
        } else {
          return [
            createTextVNode(" Send ")
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(`</form></div><!--]-->`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ChatPanel.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1]]);
const STORAGE_KEY = "aploy-environment";
const _sfc_main = defineComponent({
  name: "AppLayout",
  components: { ChatPanel: __nuxt_component_1 },
  data() {
    return {
      environment: "sandbox",
      nav: [
        { href: "/app", label: "Dashboard" },
        { href: "/app/datasets", label: "Datasets" },
        { href: "/app/projects", label: "Projects" },
        { href: "/app/runs", label: "Runs" },
        { href: "/app/evaluations", label: "Evaluations" },
        { href: "/app/registry", label: "Registry" },
        { href: "/app/deployments", label: "Deployments" },
        { href: "/app/knowledge-bases", label: "Knowledge bases" },
        { href: "/app/pipelines", label: "Pipelines" },
        { href: "/app/triggers", label: "Triggers" },
        { href: "/app/api-explorer", label: "API Explorer" },
        { href: "/app/billing", label: "Billing" },
        { href: "/app/settings", label: "Settings" },
        { href: "/app/integrations", label: "Integrations" },
        { href: "/app/org", label: "Org" }
      ]
    };
  },
  mounted() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "sandbox" || stored === "production") {
        this.environment = stored;
        this.syncEnvironmentToState(stored);
      }
    } catch (_) {
    }
  },
  methods: {
    syncEnvironmentToState(value) {
      const { setEnvironment } = useEnvironment();
      setEnvironment(value);
    },
    onEnvironmentChange(e) {
      const target = e.target;
      const value = target == null ? void 0 : target.value;
      if (value !== "sandbox" && value !== "production") return;
      this.environment = value;
      try {
        localStorage.setItem(STORAGE_KEY, value);
      } catch (_) {
      }
      this.syncEnvironmentToState(value);
    }
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_NuxtLink = __nuxt_component_0;
  const _component_ChatPanel = __nuxt_component_1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex min-h-screen bg-surface" }, _attrs))}><aside class="w-56 shrink-0 flex flex-col border-r border-border bg-surface-elevated"><div class="p-4 border-b border-border">`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/",
    class: "text-lg font-semibold text-zinc-900 tracking-tight transition-colors hover:text-accent"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Aploy`);
      } else {
        return [
          createTextVNode("Aploy")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><nav class="flex-1 p-3 space-y-0.5"><!--[-->`);
  ssrRenderList(_ctx.nav, (item) => {
    _push(ssrRenderComponent(_component_NuxtLink, {
      key: item.href,
      to: item.href,
      class: "flex items-center rounded-app px-3 py-2 text-sm text-muted-foreground hover:bg-surface-overlay hover:text-zinc-900 transition-colors duration-app"
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`${ssrInterpolate(item.label)}`);
        } else {
          return [
            createTextVNode(toDisplayString(item.label), 1)
          ];
        }
      }),
      _: 2
    }, _parent));
  });
  _push(`<!--]--></nav><div class="p-3 border-t border-border">`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/",
    class: "flex items-center rounded-app px-3 py-2 text-sm text-muted-foreground hover:bg-surface-overlay hover:text-zinc-900 transition-colors duration-app"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Back to home `);
      } else {
        return [
          createTextVNode(" Back to home ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></aside><div class="flex-1 flex flex-col min-w-0"><header class="flex items-center justify-end gap-3 px-6 py-3 border-b border-border shrink-0"><span class="text-sm text-muted">Environment</span><select${ssrRenderAttr("value", _ctx.environment)} class="app-input w-auto min-w-[120px] py-1.5 text-sm"><option value="sandbox">Sandbox</option><option value="production">Production</option></select></header><main class="flex-1 overflow-auto">`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</main></div>`);
  _push(ssrRenderComponent(_component_ChatPanel, null, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/app.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const app = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { app as default };
//# sourceMappingURL=app-B2wLlbJn.mjs.map
