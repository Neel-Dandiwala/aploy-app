import { _ as __nuxt_component_0 } from './AppPageHeader-CFOue3Zn.mjs';
import { _ as __nuxt_component_1 } from './AppCard-T_GiUAp6.mjs';
import { _ as __nuxt_component_0$1 } from './AppButton-oAgfFzQm.mjs';
import { mergeProps, withCtx, createTextVNode, createVNode, defineComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
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

const _sfc_main = defineComponent({
  name: "RegistryModelDetail"
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_AppPageHeader = __nuxt_component_0;
  const _component_AppCard = __nuxt_component_1;
  const _component_AppButton = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "app-page" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_AppPageHeader, {
    title: `Model version ${_ctx.$route.params.id}`,
    description: "Lineage and metadata.",
    "back-to": "/app/registry",
    "back-label": "Registry"
  }, null, _parent));
  _push(ssrRenderComponent(_component_AppCard, null, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<h3 class="app-section-title mb-4"${_scopeId}>Lineage</h3><ul class="space-y-2 text-sm text-muted-foreground"${_scopeId}><li${_scopeId}>Project: proj_demo1</li><li${_scopeId}>Run: run_1</li><li${_scopeId}>Dataset version: dsv_1</li></ul>`);
        _push2(ssrRenderComponent(_component_AppButton, {
          to: `/app/deployments/new?model=${_ctx.$route.params.id}`,
          class: "mt-6"
        }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`Deploy this version`);
            } else {
              return [
                createTextVNode("Deploy this version")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
      } else {
        return [
          createVNode("h3", { class: "app-section-title mb-4" }, "Lineage"),
          createVNode("ul", { class: "space-y-2 text-sm text-muted-foreground" }, [
            createVNode("li", null, "Project: proj_demo1"),
            createVNode("li", null, "Run: run_1"),
            createVNode("li", null, "Dataset version: dsv_1")
          ]),
          createVNode(_component_AppButton, {
            to: `/app/deployments/new?model=${_ctx.$route.params.id}`,
            class: "mt-6"
          }, {
            default: withCtx(() => [
              createTextVNode("Deploy this version")
            ]),
            _: 1
          }, 8, ["to"])
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/registry/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { _id_ as default };
//# sourceMappingURL=_id_-DuIydg-L.mjs.map
