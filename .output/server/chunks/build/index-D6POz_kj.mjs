import { _ as __nuxt_component_0 } from './AppPageHeader-CFOue3Zn.mjs';
import { _ as __nuxt_component_0$1 } from './AppButton-oAgfFzQm.mjs';
import { mergeProps, withCtx, createTextVNode, createVNode, defineComponent, useSSRContext } from 'vue';
import { u as useAployApi } from './useAployApi-BEdJYRuf.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import './nuxt-link-D0qNmuHi.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';
import './useEnvironment-BnZbXQTt.mjs';
import './useMockMode-j3YD3gix.mjs';
import './useMockApi-CJyUoVJj.mjs';

const _sfc_main = defineComponent({
  name: "DeploymentsList",
  data() {
    return {
      deployments: [],
      loading: true,
      error: ""
    };
  },
  setup() {
    const { apiFetch } = useAployApi();
    return { apiFetch };
  },
  async mounted() {
    await this.loadDeployments();
  },
  methods: {
    async loadDeployments() {
      this.loading = true;
      this.error = "";
      try {
        const data = await this.apiFetch("/api/deploy");
        this.deployments = data.deployments || [];
      } catch (e) {
        this.error = e.message || "Failed to load deployments";
      } finally {
        this.loading = false;
      }
    }
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_AppPageHeader = __nuxt_component_0;
  const _component_AppButton = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "app-page" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_AppPageHeader, { title: "Deployments" }, {
    actions: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_AppButton, { to: "/app/deployments/new" }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`Deploy`);
            } else {
              return [
                createTextVNode("Deploy")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_AppButton, { to: "/app/deployments/new" }, {
            default: withCtx(() => [
              createTextVNode("Deploy")
            ]),
            _: 1
          })
        ];
      }
    }),
    _: 1
  }, _parent));
  if (_ctx.loading) {
    _push(`<p class="text-muted-foreground text-sm">Loading\u2026</p>`);
  } else if (_ctx.error) {
    _push(`<p class="app-error">${ssrInterpolate(_ctx.error)}</p>`);
  } else {
    _push(`<div class="app-table-wrap"><table class="app-table"><thead><tr><th>Deployment</th><th>Model</th><th>Status</th><th>Endpoint</th></tr></thead><tbody><!--[-->`);
    ssrRenderList(_ctx.deployments, (d) => {
      _push(`<tr><td class="font-mono text-zinc-900 text-sm">${ssrInterpolate(d.id)}</td><td class="text-muted-foreground">${ssrInterpolate(d.model_version_id)}</td><td class="text-emerald-500">${ssrInterpolate(d.status)}</td><td class="text-muted-foreground font-mono text-sm">${ssrInterpolate(d.endpoint_url)}</td></tr>`);
    });
    _push(`<!--]--></tbody></table>`);
    if (!_ctx.loading && !_ctx.error && _ctx.deployments.length === 0) {
      _push(`<p class="app-empty"> No deployments yet. </p>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div>`);
  }
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/deployments/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { index as default };
//# sourceMappingURL=index-D6POz_kj.mjs.map
