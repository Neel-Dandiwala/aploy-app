import { _ as __nuxt_component_0$1 } from "./nuxt-link-T1BgcM6o.js";
import { defineComponent, mergeProps, withCtx, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderSlot } from "vue/server-renderer";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = defineComponent({
  name: "AppPageHeader",
  props: {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    backTo: { type: String, default: "" },
    backLabel: { type: String, default: "Back" }
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_NuxtLink = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col gap-2 mb-content" }, _attrs))}>`);
  if (_ctx.backTo) {
    _push(ssrRenderComponent(_component_NuxtLink, {
      to: _ctx.backTo,
      class: "app-back-link"
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(` ← ${ssrInterpolate(_ctx.backLabel)}`);
        } else {
          return [
            createTextVNode(" ← " + toDisplayString(_ctx.backLabel), 1)
          ];
        }
      }),
      _: 1
    }, _parent));
  } else {
    _push(`<!---->`);
  }
  _push(`<div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"><div><h1 class="app-page-title">${ssrInterpolate(_ctx.title)}</h1>`);
  if (_ctx.description) {
    _push(`<p class="app-page-description">${ssrInterpolate(_ctx.description)}</p>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
  if (_ctx.$slots.actions) {
    _push(`<div class="flex items-center gap-2 shrink-0">`);
    ssrRenderSlot(_ctx.$slots, "actions", {}, null, _push, _parent);
    _push(`</div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppPageHeader.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __nuxt_component_0 as _
};
//# sourceMappingURL=AppPageHeader-3vaz4YvC.js.map
