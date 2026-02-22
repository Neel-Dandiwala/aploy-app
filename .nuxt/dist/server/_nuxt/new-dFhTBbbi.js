import { _ as __nuxt_component_0 } from "./AppPageHeader-CFOue3Zn.js";
import { _ as __nuxt_component_0$1 } from "./AppButton-oAgfFzQm.js";
import { defineComponent, mergeProps, withCtx, createTextVNode, toDisplayString, useSSRContext } from "vue";
import "/Users/neeldandiwala/Projects/aploy/aploy-app/node_modules/hookable/dist/index.mjs";
import { u as useAployApi } from "./useAployApi-BEdJYRuf.js";
import { n as navigateTo } from "../server.mjs";
import { ssrRenderAttrs, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttr, ssrInterpolate } from "vue/server-renderer";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./nuxt-link-D0qNmuHi.js";
import "/Users/neeldandiwala/Projects/aploy/aploy-app/node_modules/ufo/dist/index.mjs";
import "./useEnvironment-BnZbXQTt.js";
import "./useMockMode-j3YD3gix.js";
import "./useMockApi-CJyUoVJj.js";
import "/Users/neeldandiwala/Projects/aploy/aploy-app/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/neeldandiwala/Projects/aploy/aploy-app/node_modules/unctx/dist/index.mjs";
import "/Users/neeldandiwala/Projects/aploy/aploy-app/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/Users/neeldandiwala/Projects/aploy/aploy-app/node_modules/defu/dist/defu.mjs";
import "/Users/neeldandiwala/Projects/aploy/aploy-app/node_modules/@unhead/vue/dist/index.mjs";
const _sfc_main = defineComponent({
  name: "NewTraining",
  data() {
    return {
      form: { dataset_version_id: "dsv_1", epochs: 3, lora_rank: 16, compute_mode: "auto" },
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
        const data = await this.apiFetch("/api/runs", {
          method: "POST",
          body: {
            project_id: "proj_demo1",
            dataset_version_id: this.form.dataset_version_id,
            config: { epochs: this.form.epochs, lora_rank: this.form.lora_rank },
            compute: { mode: this.form.compute_mode }
          }
        });
        await navigateTo(`/app/runs/${data.id}`);
      } catch (e) {
        this.error = e.message || "Failed to start training";
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
    title: "Configure training",
    description: "Select dataset version and config. Estimated ~$14.50, ~2h.",
    "back-to": "/app/projects/proj_demo1",
    "back-label": "Project"
  }, null, _parent));
  _push(`<form class="space-y-6"><div><label class="app-label">Dataset version</label><select class="app-select"><option value="dsv_1"${ssrIncludeBooleanAttr(Array.isArray(_ctx.form.dataset_version_id) ? ssrLooseContain(_ctx.form.dataset_version_id, "dsv_1") : ssrLooseEqual(_ctx.form.dataset_version_id, "dsv_1")) ? " selected" : ""}>Support chat v1 (10,200 rows)</option></select></div><div><label class="app-label">Epochs</label><input${ssrRenderAttr("value", _ctx.form.epochs)} type="number" class="app-input" min="1" max="20"></div><div><label class="app-label">LoRA rank</label><select class="app-select"><option${ssrRenderAttr("value", 8)}${ssrIncludeBooleanAttr(Array.isArray(_ctx.form.lora_rank) ? ssrLooseContain(_ctx.form.lora_rank, 8) : ssrLooseEqual(_ctx.form.lora_rank, 8)) ? " selected" : ""}>8</option><option${ssrRenderAttr("value", 16)}${ssrIncludeBooleanAttr(Array.isArray(_ctx.form.lora_rank) ? ssrLooseContain(_ctx.form.lora_rank, 16) : ssrLooseEqual(_ctx.form.lora_rank, 16)) ? " selected" : ""}>16</option><option${ssrRenderAttr("value", 32)}${ssrIncludeBooleanAttr(Array.isArray(_ctx.form.lora_rank) ? ssrLooseContain(_ctx.form.lora_rank, 32) : ssrLooseEqual(_ctx.form.lora_rank, 32)) ? " selected" : ""}>32</option></select></div>`);
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
        _push2(`${ssrInterpolate(_ctx.loading ? "Starting…" : "Start training")}`);
      } else {
        return [
          createTextVNode(toDisplayString(_ctx.loading ? "Starting…" : "Start training"), 1)
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_AppButton, {
    variant: "secondary",
    to: "/app/projects/proj_demo1"
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/training/new.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _new = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  _new as default
};
//# sourceMappingURL=new-dFhTBbbi.js.map
