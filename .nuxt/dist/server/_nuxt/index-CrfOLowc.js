import { _ as __nuxt_component_0 } from "./AppPageHeader-3vaz4YvC.js";
import { _ as __nuxt_component_0$1 } from "./nuxt-link-T1BgcM6o.js";
import { defineComponent, mergeProps, withCtx, createTextVNode, useSSRContext } from "vue";
import "/Users/neeldandiwala/Projects/aploy/aploy-app/node_modules/hookable/dist/index.mjs";
import { u as useAployApi } from "./useAployApi-BHR4anxl.js";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass } from "vue/server-renderer";
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
import "./useEnvironment-BxGroLsJ.js";
const _sfc_main = defineComponent({
  name: "RunsList",
  data() {
    return {
      runs: [],
      loading: true,
      error: ""
    };
  },
  setup() {
    const { apiFetch } = useAployApi();
    return { apiFetch };
  },
  async mounted() {
    await this.loadRuns();
  },
  methods: {
    async loadRuns() {
      this.loading = true;
      this.error = "";
      try {
        const data = await this.apiFetch("/api/runs");
        this.runs = data.runs || [];
      } catch (e) {
        this.error = e.message || "Failed to load runs";
      } finally {
        this.loading = false;
      }
    }
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_AppPageHeader = __nuxt_component_0;
  const _component_NuxtLink = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "app-page" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_AppPageHeader, { title: "Runs" }, null, _parent));
  if (_ctx.loading) {
    _push(`<p class="text-muted-foreground text-sm">Loading…</p>`);
  } else if (_ctx.error) {
    _push(`<p class="app-error">${ssrInterpolate(_ctx.error)}</p>`);
  } else {
    _push(`<div class="app-table-wrap"><table class="app-table"><thead><tr><th>Run</th><th>Status</th><th>Duration</th><th>Cost</th><th></th></tr></thead><tbody><!--[-->`);
    ssrRenderList(_ctx.runs, (r) => {
      _push(`<tr><td class="font-mono text-white text-sm">${ssrInterpolate(r.id)}</td><td class="${ssrRenderClass(r.status === "succeeded" ? "text-emerald-500" : "text-amber-500")}">${ssrInterpolate(r.status)}</td><td class="text-muted-foreground">${ssrInterpolate(r.duration_sec ? `${Math.round(r.duration_sec / 3600)}h` : "—")}</td><td class="text-muted-foreground">${ssrInterpolate(r.cost_usd != null ? `$${r.cost_usd}` : "—")}</td><td>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/app/runs/${r.id}`,
        class: "text-accent hover:text-accent-hover text-sm transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Dashboard `);
          } else {
            return [
              createTextVNode(" Dashboard ")
            ];
          }
        }),
        _: 2
      }, _parent));
      _push(`</td></tr>`);
    });
    _push(`<!--]--></tbody></table>`);
    if (!_ctx.loading && !_ctx.error && _ctx.runs.length === 0) {
      _push(`<p class="app-empty"> No runs yet. </p>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div>`);
  }
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/runs/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  index as default
};
//# sourceMappingURL=index-CrfOLowc.js.map
