import { _ as __nuxt_component_0 } from './nuxt-link-T1BgcM6o.mjs';
import { mergeProps, withCtx, createTextVNode, defineComponent, useSSRContext } from 'vue';
import { n as navigateTo, a as useRuntimeConfig } from './server.mjs';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent } from 'vue/server-renderer';
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
  name: "AuthCallbackPage",
  layout: "blank",
  data() {
    return {
      status: "loading",
      mfaToken: ""
    };
  },
  mounted() {
    this.checkAuth();
  },
  methods: {
    async checkAuth() {
      const config = useRuntimeConfig();
      const apiUrl = config.public.apiUrl;
      try {
        const res = await $fetch(`${apiUrl}/auth/me`, { credentials: "include" });
        if (res.mfaEnabled) {
          this.status = "mfa_required";
          return;
        }
        this.status = "done";
        await navigateTo("/app", { replace: true });
      } catch {
        this.status = "error";
      }
    },
    async submitMfa() {
      const config = useRuntimeConfig();
      const apiUrl = config.public.apiUrl;
      try {
        await $fetch(`${apiUrl}/auth/mfa/check`, {
          method: "POST",
          credentials: "include",
          body: { token: this.mfaToken }
        });
        await navigateTo("/app", { replace: true });
      } catch {
        this.status = "error";
      }
    }
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_NuxtLink = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col items-center justify-center gap-6 p-8 bg-[#0a0a0f]" }, _attrs))}>`);
  if (_ctx.status === "loading") {
    _push(`<p class="text-zinc-400">Signing you in...</p>`);
  } else if (_ctx.status === "mfa_required") {
    _push(`<!--[--><h2 class="text-xl font-semibold text-white">Two-factor authentication</h2><p class="text-zinc-400">Enter the code from your authenticator app.</p><form class="flex flex-col gap-4 w-64"><input${ssrRenderAttr("value", _ctx.mfaToken)} type="text" placeholder="000000" class="w-full rounded-lg border border-zinc-600 bg-zinc-900 px-3 py-2 text-center text-lg tracking-widest text-zinc-100" maxlength="6"><button type="submit" class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"> Verify </button></form><!--]-->`);
  } else if (_ctx.status === "error") {
    _push(`<p class="text-red-400"> Auth failed. `);
    _push(ssrRenderComponent(_component_NuxtLink, {
      to: "/login",
      class: "underline"
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`Try again`);
        } else {
          return [
            createTextVNode("Try again")
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(`. </p>`);
  } else {
    _push(`<p class="text-zinc-400">Redirecting...</p>`);
  }
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/auth/callback.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const callback = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { callback as default };
//# sourceMappingURL=callback-ssaxVS8r.mjs.map
