import { _ as __nuxt_component_0 } from './nuxt-link-D0qNmuHi.mjs';
import { mergeProps, withCtx, createTextVNode, defineComponent, useSSRContext } from 'vue';
import { u as useMockMode } from './useMockMode-j3YD3gix.mjs';
import { n as navigateTo } from './server.mjs';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
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

const _sfc_main = defineComponent({
  name: "HomePage",
  layout: "blank",
  setup() {
    const { setMockMode } = useMockMode();
    function startMock() {
      setMockMode(true);
      navigateTo("/app");
    }
    return { startMock };
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_NuxtLink = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col items-center justify-center gap-8 p-8 bg-surface" }, _attrs))}><h1 class="text-4xl font-bold text-zinc-900 tracking-tight">Aploy</h1><p class="text-muted-foreground text-center max-w-md"> Stripe/Vercel for LLM training. One API + UI for fine-tuning, DPO, and deployment. </p><div class="flex flex-wrap justify-center gap-3"><button type="button" class="rounded-app bg-accent px-4 py-2 text-sm font-medium text-white shadow-app-sm hover:bg-accent-hover transition-colors duration-app focus:outline-none focus:ring-2 focus:ring-accent/30 focus:ring-offset-2 focus:ring-offset-surface"> Start Mock </button>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/login",
    class: "rounded-app border border-border bg-surface-elevated px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-surface-overlay hover:text-zinc-900 transition-colors duration-app"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Sign in with Google `);
      } else {
        return [
          createTextVNode(" Sign in with Google ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { index as default };
//# sourceMappingURL=index-CyNfF1iO.mjs.map
