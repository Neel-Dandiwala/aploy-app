import { _ as __nuxt_component_0 } from "./AppPageHeader-3vaz4YvC.js";
import { _ as __nuxt_component_1 } from "./AppCard-T_GiUAp6.js";
import { defineComponent, mergeProps, withCtx, createVNode, useSSRContext } from "vue";
import "/Users/neeldandiwala/Projects/aploy/aploy-app/node_modules/hookable/dist/index.mjs";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./nuxt-link-T1BgcM6o.js";
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
        _push2(`<h3 class="app-section-title mb-4"${_scopeId}>Credentials (vault)</h3><ul class="space-y-2 text-sm text-muted-foreground"${_scopeId}><li${_scopeId}>AWS prod — S3 — OK</li><li${_scopeId}>Hugging Face — HF — OK</li></ul>`);
      } else {
        return [
          createVNode("h3", { class: "app-section-title mb-4" }, "Credentials (vault)"),
          createVNode("ul", { class: "space-y-2 text-sm text-muted-foreground" }, [
            createVNode("li", null, "AWS prod — S3 — OK"),
            createVNode("li", null, "Hugging Face — HF — OK")
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
export {
  org as default
};
//# sourceMappingURL=org-BjPXPuYD.js.map
