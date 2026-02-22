import { _ as __nuxt_component_0 } from './AppPageHeader-CFOue3Zn.mjs';
import { _ as __nuxt_component_1 } from './AppCard-T_GiUAp6.mjs';
import { _ as __nuxt_component_0$1 } from './AppButton-oAgfFzQm.mjs';
import { _ as __nuxt_component_0$2 } from './nuxt-link-D0qNmuHi.mjs';
import { mergeProps, withCtx, createTextVNode, createVNode, defineComponent, useSSRContext } from 'vue';
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
import './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main = defineComponent({
  name: "ProjectDetail"
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_AppPageHeader = __nuxt_component_0;
  const _component_AppCard = __nuxt_component_1;
  const _component_AppButton = __nuxt_component_0$1;
  const _component_NuxtLink = __nuxt_component_0$2;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "app-page" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_AppPageHeader, {
    title: "Support Bot",
    description: "DPO tuning for support chat. Base: Mistral-7B-v0.2",
    "back-to": "/app/projects",
    "back-label": "Projects"
  }, null, _parent));
  _push(`<div class="grid gap-4">`);
  _push(ssrRenderComponent(_component_AppCard, null, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<h3 class="app-section-title mb-4"${_scopeId}>Datasets</h3>`);
        _push2(ssrRenderComponent(_component_AppButton, {
          variant: "secondary",
          to: "/app/datasets/new",
          class: "mb-4"
        }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`Add dataset`);
            } else {
              return [
                createTextVNode("Add dataset")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(`<ul class="space-y-2 text-sm text-muted-foreground"${_scopeId}><li${_scopeId}>Support chat v1 (10,200 rows) \u2014 <span class="text-emerald-500"${_scopeId}>ready</span></li></ul>`);
      } else {
        return [
          createVNode("h3", { class: "app-section-title mb-4" }, "Datasets"),
          createVNode(_component_AppButton, {
            variant: "secondary",
            to: "/app/datasets/new",
            class: "mb-4"
          }, {
            default: withCtx(() => [
              createTextVNode("Add dataset")
            ]),
            _: 1
          }),
          createVNode("ul", { class: "space-y-2 text-sm text-muted-foreground" }, [
            createVNode("li", null, [
              createTextVNode("Support chat v1 (10,200 rows) \u2014 "),
              createVNode("span", { class: "text-emerald-500" }, "ready")
            ])
          ])
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_AppCard, null, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<h3 class="app-section-title mb-4"${_scopeId}>Recent runs</h3>`);
        _push2(ssrRenderComponent(_component_NuxtLink, {
          to: "/app/runs/run_1",
          class: "text-accent hover:text-accent-hover text-sm"
        }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`run_1`);
            } else {
              return [
                createTextVNode("run_1")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(`<span class="text-muted-foreground text-sm"${_scopeId}> \u2014 succeeded</span>`);
        _push2(ssrRenderComponent(_component_AppButton, {
          to: "/app/training/new",
          class: "mt-4"
        }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`Start training`);
            } else {
              return [
                createTextVNode("Start training")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
      } else {
        return [
          createVNode("h3", { class: "app-section-title mb-4" }, "Recent runs"),
          createVNode(_component_NuxtLink, {
            to: "/app/runs/run_1",
            class: "text-accent hover:text-accent-hover text-sm"
          }, {
            default: withCtx(() => [
              createTextVNode("run_1")
            ]),
            _: 1
          }),
          createVNode("span", { class: "text-muted-foreground text-sm" }, " \u2014 succeeded"),
          createVNode(_component_AppButton, {
            to: "/app/training/new",
            class: "mt-4"
          }, {
            default: withCtx(() => [
              createTextVNode("Start training")
            ]),
            _: 1
          })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/projects/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { _id_ as default };
//# sourceMappingURL=_id_-CEBsbsSg.mjs.map
