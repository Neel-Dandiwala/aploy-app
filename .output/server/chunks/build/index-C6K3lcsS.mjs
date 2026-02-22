import { _ as __nuxt_component_0 } from './AppPageHeader-3vaz4YvC.mjs';
import { _ as __nuxt_component_1 } from './AppCard-T_GiUAp6.mjs';
import { _ as __nuxt_component_0$1 } from './AppButton-DJM0cog_.mjs';
import { mergeProps, withCtx, createTextVNode, createVNode, defineComponent, useSSRContext } from 'vue';
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
  name: "EvaluationsList"
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_AppPageHeader = __nuxt_component_0;
  const _component_AppCard = __nuxt_component_1;
  const _component_AppButton = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "app-page" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_AppPageHeader, { title: "Evaluations" }, null, _parent));
  _push(ssrRenderComponent(_component_AppCard, null, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<h3 class="app-section-title mb-1"${_scopeId}>Run run_1 vs baseline</h3><p class="app-section-description mb-6"${_scopeId}>Tuned model improves support accuracy by 16.7%.</p><table class="app-table"${_scopeId}><thead${_scopeId}><tr${_scopeId}><th${_scopeId}>Metric</th><th${_scopeId}>Baseline</th><th${_scopeId}>Tuned</th><th${_scopeId}>\u0394</th></tr></thead><tbody${_scopeId}><tr${_scopeId}><td class="text-muted-foreground"${_scopeId}>Perplexity</td><td class="text-white"${_scopeId}>12.4</td><td class="text-white"${_scopeId}>10.1</td><td class="text-emerald-500"${_scopeId}>-18.5%</td></tr><tr${_scopeId}><td class="text-muted-foreground"${_scopeId}>Support accuracy</td><td class="text-white"${_scopeId}>0.72</td><td class="text-white"${_scopeId}>0.84</td><td class="text-emerald-500"${_scopeId}>+16.7%</td></tr></tbody></table>`);
        _push2(ssrRenderComponent(_component_AppButton, {
          to: "/app/deployments/new",
          class: "mt-4"
        }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`Deploy tuned model`);
            } else {
              return [
                createTextVNode("Deploy tuned model")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
      } else {
        return [
          createVNode("h3", { class: "app-section-title mb-1" }, "Run run_1 vs baseline"),
          createVNode("p", { class: "app-section-description mb-6" }, "Tuned model improves support accuracy by 16.7%."),
          createVNode("table", { class: "app-table" }, [
            createVNode("thead", null, [
              createVNode("tr", null, [
                createVNode("th", null, "Metric"),
                createVNode("th", null, "Baseline"),
                createVNode("th", null, "Tuned"),
                createVNode("th", null, "\u0394")
              ])
            ]),
            createVNode("tbody", null, [
              createVNode("tr", null, [
                createVNode("td", { class: "text-muted-foreground" }, "Perplexity"),
                createVNode("td", { class: "text-white" }, "12.4"),
                createVNode("td", { class: "text-white" }, "10.1"),
                createVNode("td", { class: "text-emerald-500" }, "-18.5%")
              ]),
              createVNode("tr", null, [
                createVNode("td", { class: "text-muted-foreground" }, "Support accuracy"),
                createVNode("td", { class: "text-white" }, "0.72"),
                createVNode("td", { class: "text-white" }, "0.84"),
                createVNode("td", { class: "text-emerald-500" }, "+16.7%")
              ])
            ])
          ]),
          createVNode(_component_AppButton, {
            to: "/app/deployments/new",
            class: "mt-4"
          }, {
            default: withCtx(() => [
              createTextVNode("Deploy tuned model")
            ]),
            _: 1
          })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/evaluations/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { index as default };
//# sourceMappingURL=index-C6K3lcsS.mjs.map
