import { createVNode, resolveDynamicComponent, mergeProps, withCtx, renderSlot, defineComponent, computed, useSSRContext } from 'vue';
import { ssrRenderVNode, ssrRenderSlot } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';

const base = "inline-flex items-center justify-center gap-2 rounded-app px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent/30 focus:ring-offset-2 focus:ring-offset-surface disabled:pointer-events-none disabled:opacity-50";
const variants = {
  primary: "bg-accent text-white hover:bg-accent-hover shadow-app-sm",
  secondary: "border border-border bg-surface-elevated text-muted-foreground hover:bg-surface-overlay hover:text-white hover:border-white/10",
  ghost: "text-muted-foreground hover:bg-white/[0.06] hover:text-white"
};
const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm"
};
const _sfc_main = defineComponent({
  name: "AppButton",
  props: {
    variant: {
      type: String,
      default: "primary"
    },
    size: {
      type: String,
      default: "md"
    },
    type: {
      type: String,
      default: "button"
    },
    to: { type: String, default: void 0 },
    href: { type: String, default: void 0 },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ["click"],
  setup(props, { emit }) {
    const tag = computed(
      () => props.href ? "a" : props.to ? "NuxtLink" : "button"
    );
    const buttonClasses = computed(
      () => [base, variants[props.variant], sizes[props.size]].filter(Boolean).join(" ")
    );
    function onClick(e) {
      if (!props.disabled) emit("click", e);
    }
    return { tag, buttonClasses, onClick };
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  ssrRenderVNode(_push, createVNode(resolveDynamicComponent(_ctx.tag), mergeProps({
    to: _ctx.to,
    href: _ctx.href,
    type: _ctx.tag === "button" ? _ctx.type : void 0,
    disabled: _ctx.disabled,
    class: _ctx.buttonClasses,
    onClick: _ctx.onClick
  }, _attrs), {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
      } else {
        return [
          renderSlot(_ctx.$slots, "default")
        ];
      }
    }),
    _: 3
  }), _parent);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppButton.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { __nuxt_component_0 as _ };
//# sourceMappingURL=AppButton-DJM0cog_.mjs.map
