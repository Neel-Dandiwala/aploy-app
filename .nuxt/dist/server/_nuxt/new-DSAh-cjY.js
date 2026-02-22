import { _ as __nuxt_component_0 } from "./AppPageHeader-CFOue3Zn.js";
import { _ as __nuxt_component_0$1 } from "./AppButton-oAgfFzQm.js";
import { defineComponent, mergeProps, withCtx, createTextVNode, toDisplayString, useSSRContext } from "vue";
import "/Users/neeldandiwala/Projects/aploy/aploy-app/node_modules/hookable/dist/index.mjs";
import { u as useAployApi } from "./useAployApi-BEdJYRuf.js";
import { n as navigateTo } from "../server.mjs";
import { ssrRenderAttrs, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrInterpolate } from "vue/server-renderer";
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
  name: "NewDeployment",
  data() {
    return {
      form: { model_version_id: "mv_1", type: "api", region: "us-east-1" },
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
        await this.apiFetch("/api/deploy", {
          method: "POST",
          body: {
            model_version_id: this.form.model_version_id,
            type: this.form.type,
            config: this.form.type === "api" ? { region: this.form.region } : {}
          }
        });
        await navigateTo("/app/deployments");
      } catch (e) {
        this.error = e.message || "Deploy failed";
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
    title: "Deploy model",
    description: "We host your model; you get an API. Or export weights.",
    "back-to": "/app/deployments",
    "back-label": "Deployments"
  }, null, _parent));
  _push(`<form class="space-y-6"><div><label class="app-label">Model version</label><select class="app-select"><option value="mv_1"${ssrIncludeBooleanAttr(Array.isArray(_ctx.form.model_version_id) ? ssrLooseContain(_ctx.form.model_version_id, "mv_1") : ssrLooseEqual(_ctx.form.model_version_id, "mv_1")) ? " selected" : ""}>mv_1 (Support Bot, run_1)</option></select></div><div><label class="app-label">Type</label><div class="flex gap-6"><label class="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-zinc-900 transition-colors"><input${ssrIncludeBooleanAttr(ssrLooseEqual(_ctx.form.type, "api")) ? " checked" : ""} type="radio" value="api" class="rounded border-border text-accent focus:ring-accent/30"><span>API endpoint</span></label><label class="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-zinc-900 transition-colors"><input${ssrIncludeBooleanAttr(ssrLooseEqual(_ctx.form.type, "export")) ? " checked" : ""} type="radio" value="export" class="rounded border-border text-accent focus:ring-accent/30"><span>Export weights</span></label></div></div>`);
  if (_ctx.form.type === "api") {
    _push(`<div><label class="app-label">Region</label><select class="app-select"><option value="us-east-1"${ssrIncludeBooleanAttr(Array.isArray(_ctx.form.region) ? ssrLooseContain(_ctx.form.region, "us-east-1") : ssrLooseEqual(_ctx.form.region, "us-east-1")) ? " selected" : ""}>us-east-1</option><option value="eu-west-1"${ssrIncludeBooleanAttr(Array.isArray(_ctx.form.region) ? ssrLooseContain(_ctx.form.region, "eu-west-1") : ssrLooseEqual(_ctx.form.region, "eu-west-1")) ? " selected" : ""}>eu-west-1</option></select></div>`);
  } else {
    _push(`<!---->`);
  }
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
        _push2(`${ssrInterpolate(_ctx.loading ? "Deploying…" : _ctx.form.type === "api" ? "Deploy to API" : "Export weights")}`);
      } else {
        return [
          createTextVNode(toDisplayString(_ctx.loading ? "Deploying…" : _ctx.form.type === "api" ? "Deploy to API" : "Export weights"), 1)
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_AppButton, {
    variant: "secondary",
    to: "/app/deployments"
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/deployments/new.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _new = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  _new as default
};
//# sourceMappingURL=new-DSAh-cjY.js.map
