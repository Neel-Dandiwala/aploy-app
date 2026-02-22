import { _ as __nuxt_component_0 } from './AppPageHeader-CFOue3Zn.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-D0qNmuHi.mjs';
import { mergeProps, withCtx, createTextVNode, defineComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
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
import './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main = defineComponent({
  name: "RegistryList",
  data() {
    return {
      models: [
        { id: "mv_1", project_id: "proj_demo1", run_id: "run_1", created_at: "2025-02-14", support_accuracy: 0.84 }
      ]
    };
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_AppPageHeader = __nuxt_component_0;
  const _component_NuxtLink = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "app-page" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_AppPageHeader, { title: "Model registry" }, null, _parent));
  _push(`<div class="app-table-wrap"><table class="app-table"><thead><tr><th>Version</th><th>Run</th><th>Created</th><th></th></tr></thead><tbody><!--[-->`);
  ssrRenderList(_ctx.models, (m) => {
    _push(`<tr><td class="font-mono text-zinc-900 text-sm">${ssrInterpolate(m.id)}</td><td class="text-muted-foreground">${ssrInterpolate(m.run_id)}</td><td class="text-muted text-sm">${ssrInterpolate(m.created_at)}</td><td>`);
    _push(ssrRenderComponent(_component_NuxtLink, {
      to: `/app/deployments/new?model=${m.id}`,
      class: "text-accent hover:text-accent-hover text-sm transition-colors"
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(` Deploy `);
        } else {
          return [
            createTextVNode(" Deploy ")
          ];
        }
      }),
      _: 2
    }, _parent));
    _push(`</td></tr>`);
  });
  _push(`<!--]--></tbody></table></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/registry/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { index as default };
//# sourceMappingURL=index-D8UPpvaR.mjs.map
