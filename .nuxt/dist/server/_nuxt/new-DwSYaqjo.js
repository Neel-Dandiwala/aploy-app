import { _ as __nuxt_component_0 } from "./AppPageHeader-3vaz4YvC.js";
import { _ as __nuxt_component_0$1 } from "./AppButton-DJM0cog_.js";
import { defineComponent, mergeProps, withCtx, createTextVNode, toDisplayString, useSSRContext } from "vue";
import "/Users/neeldandiwala/Projects/aploy/aploy-app/node_modules/hookable/dist/index.mjs";
import { u as useAployApi } from "./useAployApi-BHR4anxl.js";
import { n as navigateTo } from "../server.mjs";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from "vue/server-renderer";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./nuxt-link-T1BgcM6o.js";
import "/Users/neeldandiwala/Projects/aploy/aploy-app/node_modules/ufo/dist/index.mjs";
import "./useEnvironment-BxGroLsJ.js";
import "/Users/neeldandiwala/Projects/aploy/aploy-app/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/neeldandiwala/Projects/aploy/aploy-app/node_modules/unctx/dist/index.mjs";
import "/Users/neeldandiwala/Projects/aploy/aploy-app/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/Users/neeldandiwala/Projects/aploy/aploy-app/node_modules/defu/dist/defu.mjs";
import "/Users/neeldandiwala/Projects/aploy/aploy-app/node_modules/@unhead/vue/dist/index.mjs";
const _sfc_main = defineComponent({
  name: "NewProject",
  data() {
    return {
      form: {
        name: "",
        description: "",
        base_model: "mistralai/Mistral-7B-v0.2",
        objective: "sft"
      },
      loading: false,
      error: ""
    };
  },
  setup() {
    const { apiFetch } = useAployApi();
    return { apiFetch };
  },
  methods: {
    async onSubmit() {
      this.error = "";
      this.loading = true;
      try {
        const data = await this.apiFetch("/api/projects", { method: "POST", body: this.form });
        await navigateTo(`/app/projects/${data.id}`);
      } catch (e) {
        this.error = e.message || "Failed";
      } finally {
        this.loading = false;
      }
    }
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_AppPageHeader = __nuxt_component_0;
  const _component_AppButton = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "app-page-narrow" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_AppPageHeader, {
    title: "Create project",
    description: "Set base model and training objective.",
    "back-to": "/app/projects",
    "back-label": "Projects"
  }, null, _parent));
  _push(`<form class="space-y-6"><div><label class="app-label">Project name *</label><input${ssrRenderAttr("value", _ctx.form.name)} class="app-input" placeholder="Support Bot" required></div><div><label class="app-label">Description</label><textarea class="app-textarea" placeholder="Optional">${ssrInterpolate(_ctx.form.description)}</textarea></div><div><label class="app-label">Base model *</label><select class="app-select"><option value="mistralai/Mistral-7B-v0.2"${ssrIncludeBooleanAttr(Array.isArray(_ctx.form.base_model) ? ssrLooseContain(_ctx.form.base_model, "mistralai/Mistral-7B-v0.2") : ssrLooseEqual(_ctx.form.base_model, "mistralai/Mistral-7B-v0.2")) ? " selected" : ""}>Mistral 7B v0.2</option><option value="meta-llama/Llama-3.2-3B"${ssrIncludeBooleanAttr(Array.isArray(_ctx.form.base_model) ? ssrLooseContain(_ctx.form.base_model, "meta-llama/Llama-3.2-3B") : ssrLooseEqual(_ctx.form.base_model, "meta-llama/Llama-3.2-3B")) ? " selected" : ""}>Llama 3.2 3B</option></select></div><div><label class="app-label">Training objective *</label><select class="app-select"><option value="sft"${ssrIncludeBooleanAttr(Array.isArray(_ctx.form.objective) ? ssrLooseContain(_ctx.form.objective, "sft") : ssrLooseEqual(_ctx.form.objective, "sft")) ? " selected" : ""}>SFT</option><option value="dpo"${ssrIncludeBooleanAttr(Array.isArray(_ctx.form.objective) ? ssrLooseContain(_ctx.form.objective, "dpo") : ssrLooseEqual(_ctx.form.objective, "dpo")) ? " selected" : ""}>DPO</option><option value="rlhf"${ssrIncludeBooleanAttr(Array.isArray(_ctx.form.objective) ? ssrLooseContain(_ctx.form.objective, "rlhf") : ssrLooseEqual(_ctx.form.objective, "rlhf")) ? " selected" : ""}>RLHF</option></select></div>`);
  if (_ctx.error) {
    _push(`<p class="app-error">${ssrInterpolate(_ctx.error)}</p>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<div class="flex flex-wrap gap-3 pt-1">`);
  _push(ssrRenderComponent(_component_AppButton, {
    type: "submit",
    disabled: _ctx.loading
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`${ssrInterpolate(_ctx.loading ? "Creating…" : "Create project")}`);
      } else {
        return [
          createTextVNode(toDisplayString(_ctx.loading ? "Creating…" : "Create project"), 1)
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_AppButton, {
    variant: "secondary",
    to: "/app/projects"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Cancel`);
      } else {
        return [
          createTextVNode("Cancel")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></form></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/projects/new.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _new = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  _new as default
};
//# sourceMappingURL=new-DwSYaqjo.js.map
