import { _ as __nuxt_component_0 } from './AppPageHeader-3vaz4YvC.mjs';
import { _ as __nuxt_component_1 } from './AppCard-T_GiUAp6.mjs';
import { mergeProps, withCtx, createVNode, defineComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import './nuxt-link-T1BgcM6o.mjs';
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
  name: "OrgPage"
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_AppPageHeader = __nuxt_component_0;
  const _component_AppCard = __nuxt_component_1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "app-page" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_AppPageHeader, { title: "Organization" }, null, _parent));
  _push(`<div class="space-y-4">`);
  _push(ssrRenderComponent(_component_AppCard, null, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<h3 class="app-section-title mb-1"${_scopeId}>General</h3><p class="app-section-description"${_scopeId}>Name: Demo Org. Slug: demo-org.</p>`);
      } else {
        return [
          createVNode("h3", { class: "app-section-title mb-1" }, "General"),
          createVNode("p", { class: "app-section-description" }, "Name: Demo Org. Slug: demo-org.")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_AppCard, null, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<h3 class="app-section-title mb-4"${_scopeId}>Credentials (vault)</h3><ul class="space-y-2 text-sm text-muted-foreground"${_scopeId}><li${_scopeId}>AWS prod \u2014 S3 \u2014 OK</li><li${_scopeId}>Hugging Face \u2014 HF \u2014 OK</li></ul>`);
      } else {
        return [
          createVNode("h3", { class: "app-section-title mb-4" }, "Credentials (vault)"),
          createVNode("ul", { class: "space-y-2 text-sm text-muted-foreground" }, [
            createVNode("li", null, "AWS prod \u2014 S3 \u2014 OK"),
            createVNode("li", null, "Hugging Face \u2014 HF \u2014 OK")
          ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/org.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const org = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { org as default };
//# sourceMappingURL=org-BjPXPuYD.mjs.map
