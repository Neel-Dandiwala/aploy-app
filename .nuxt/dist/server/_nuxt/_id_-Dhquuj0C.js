import { _ as __nuxt_component_0 } from "./AppPageHeader-CFOue3Zn.js";
import { _ as __nuxt_component_1 } from "./AppCard-T_GiUAp6.js";
import { _ as __nuxt_component_0$1 } from "./nuxt-link-D0qNmuHi.js";
import { _ as __nuxt_component_0$2 } from "./AppButton-oAgfFzQm.js";
import { defineComponent, mergeProps, withCtx, createTextVNode, createVNode, useSSRContext } from "vue";
import "/Users/neeldandiwala/Projects/aploy/aploy-app/node_modules/hookable/dist/index.mjs";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "/Users/neeldandiwala/Projects/aploy/aploy-app/node_modules/ufo/dist/index.mjs";
import "../server.mjs";
import "/Users/neeldandiwala/Projects/aploy/aploy-app/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/neeldandiwala/Projects/aploy/aploy-app/node_modules/unctx/dist/index.mjs";
import "/Users/neeldandiwala/Projects/aploy/aploy-app/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/Users/neeldandiwala/Projects/aploy/aploy-app/node_modules/defu/dist/defu.mjs";
import "/Users/neeldandiwala/Projects/aploy/aploy-app/node_modules/@unhead/vue/dist/index.mjs";
const _sfc_main = defineComponent({
  name: "RunDetail"
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_AppPageHeader = __nuxt_component_0;
  const _component_AppCard = __nuxt_component_1;
  const _component_NuxtLink = __nuxt_component_0$1;
  const _component_AppButton = __nuxt_component_0$2;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "app-page" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_AppPageHeader, {
    title: `Run ${_ctx.$route.params.id}`,
    "back-to": "/app/runs",
    "back-label": "Runs"
  }, null, _parent));
  _push(`<div class="flex flex-wrap items-center gap-3 mb-content"><span class="px-2.5 py-1 rounded-app text-sm font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"> succeeded </span></div>`);
  _push(ssrRenderComponent(_component_AppCard, null, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<p class="text-muted-foreground text-sm"${_scopeId}>Duration: 3h · Cost: $14.20 · Loss: 0.42</p><div class="flex flex-wrap gap-3 mt-4"${_scopeId}>`);
        _push2(ssrRenderComponent(_component_NuxtLink, {
          to: "/app/evaluations",
          class: "text-accent hover:text-accent-hover text-sm transition-colors"
        }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(` View evaluation `);
            } else {
              return [
                createTextVNode(" View evaluation ")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_AppButton, {
          variant: "secondary",
          to: "/app/deployments/new"
        }, {
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
        _push2(`</div>`);
      } else {
        return [
          createVNode("p", { class: "text-muted-foreground text-sm" }, "Duration: 3h · Cost: $14.20 · Loss: 0.42"),
          createVNode("div", { class: "flex flex-wrap gap-3 mt-4" }, [
            createVNode(_component_NuxtLink, {
              to: "/app/evaluations",
              class: "text-accent hover:text-accent-hover text-sm transition-colors"
            }, {
              default: withCtx(() => [
                createTextVNode(" View evaluation ")
              ]),
              _: 1
            }),
            createVNode(_component_AppButton, {
              variant: "secondary",
              to: "/app/deployments/new"
            }, {
              default: withCtx(() => [
                createTextVNode("Deploy")
              ]),
              _: 1
            })
          ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/runs/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  _id_ as default
};
//# sourceMappingURL=_id_-Dhquuj0C.js.map
