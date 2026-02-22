import { mergeProps, defineComponent, useSSRContext } from 'vue';
import { a as useRuntimeConfig } from './server.mjs';
import { ssrRenderAttrs, ssrRenderAttr } from 'vue/server-renderer';
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
  name: "LoginPage",
  layout: "blank",
  data() {
    return {
      apiUrl: ""
    };
  },
  computed: {
    googleAuthUrl() {
      return this.apiUrl ? `${this.apiUrl}/auth/google` : "http://localhost:4000/auth/google";
    }
  },
  mounted() {
    this.apiUrl = useRuntimeConfig().public.apiUrl;
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col items-center justify-center gap-6 p-8 bg-surface" }, _attrs))}><h1 class="text-2xl font-semibold text-zinc-900 tracking-tight">Sign in to Aploy</h1><p class="text-muted-foreground text-sm text-center max-w-sm"> Use Google with MFA for secure access. </p><a${ssrRenderAttr("href", _ctx.googleAuthUrl)} class="inline-flex items-center justify-center gap-2 rounded-app px-4 py-2 text-sm font-medium bg-accent text-white hover:bg-accent-hover shadow-app-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent/30 focus:ring-offset-2 focus:ring-offset-surface no-underline"> Sign in with Google </a><p class="text-muted text-xs text-center"> Redirect goes to API then back to /auth/callback. </p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const login = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { login as default };
//# sourceMappingURL=login-BwhzcA92.mjs.map
