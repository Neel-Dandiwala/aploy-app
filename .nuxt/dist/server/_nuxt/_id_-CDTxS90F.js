import { _ as __nuxt_component_0 } from "./AppPageHeader-CFOue3Zn.js";
import { _ as __nuxt_component_1 } from "./AppCard-T_GiUAp6.js";
import { _ as __nuxt_component_0$1 } from "./AppButton-oAgfFzQm.js";
import { defineComponent, mergeProps, withCtx, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, createCommentVNode, Fragment, renderList, useSSRContext } from "vue";
import "/Users/neeldandiwala/Projects/aploy/aploy-app/node_modules/hookable/dist/index.mjs";
import { u as useAployApi } from "./useAployApi-BEdJYRuf.js";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderList } from "vue/server-renderer";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./nuxt-link-D0qNmuHi.js";
import "/Users/neeldandiwala/Projects/aploy/aploy-app/node_modules/ufo/dist/index.mjs";
import "../server.mjs";
import "/Users/neeldandiwala/Projects/aploy/aploy-app/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/neeldandiwala/Projects/aploy/aploy-app/node_modules/unctx/dist/index.mjs";
import "/Users/neeldandiwala/Projects/aploy/aploy-app/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/Users/neeldandiwala/Projects/aploy/aploy-app/node_modules/defu/dist/defu.mjs";
import "/Users/neeldandiwala/Projects/aploy/aploy-app/node_modules/@unhead/vue/dist/index.mjs";
import "./useEnvironment-BnZbXQTt.js";
import "./useMockMode-j3YD3gix.js";
import "./useMockApi-CJyUoVJj.js";
const _sfc_main = defineComponent({
  name: "DatasetDetail",
  data() {
    return {
      dataset: null,
      loading: true,
      error: "",
      ingesting: false
    };
  },
  computed: {
    sourceLabel() {
      if (!this.dataset?.source) return "Upload";
      const s = this.dataset.source;
      if (s.type === "s3") return `S3 ${s.bucket || ""} ${s.prefix || ""}`.trim();
      if (s.type === "gcs") return `GCS ${s.bucket || ""} ${s.prefix || ""}`.trim();
      if (s.type === "hf") return `Hugging Face ${s.dataset || ""}`.trim();
      return String(s.type || "upload");
    },
    canIngest() {
      return !!this.dataset && ["s3", "gcs", "hf"].includes(this.dataset.source?.type || "");
    },
    statusClass() {
      if (!this.dataset) return "";
      if (this.dataset.status === "ready") return "text-emerald-600";
      if (this.dataset.status === "failed") return "text-destructive";
      return "text-amber-600";
    }
  },
  setup() {
    const { apiFetch } = useAployApi();
    return { apiFetch };
  },
  async mounted() {
    await this.load();
  },
  methods: {
    async load() {
      this.loading = true;
      this.error = "";
      const id = this.$route.params.id;
      try {
        this.dataset = await this.apiFetch(`/api/datasets/${id}`);
      } catch (e) {
        this.error = e.message || "Failed to load dataset";
      } finally {
        this.loading = false;
      }
    },
    async runIngestion() {
      if (!this.dataset) return;
      this.ingesting = true;
      try {
        await this.apiFetch(`/api/datasets/${this.dataset.id}/ingest`, { method: "POST" });
        await this.load();
      } catch (e) {
        this.error = e.message || "Ingestion failed";
      } finally {
        this.ingesting = false;
      }
    }
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_AppPageHeader = __nuxt_component_0;
  const _component_AppCard = __nuxt_component_1;
  const _component_AppButton = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "app-page" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_AppPageHeader, {
    title: "Dataset — Preview & quality",
    description: "Quality report and preview. Run ingestion to sync from source.",
    "back-to": "/app/datasets",
    "back-label": "Datasets"
  }, null, _parent));
  if (_ctx.loading) {
    _push(`<p class="text-muted-foreground text-sm">Loading…</p>`);
  } else if (_ctx.error) {
    _push(`<p class="app-error">${ssrInterpolate(_ctx.error)}</p>`);
  } else if (_ctx.dataset) {
    _push(`<!--[-->`);
    _push(ssrRenderComponent(_component_AppCard, { class: "mb-4" }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<h3 class="app-section-title mb-2"${_scopeId}>Overview</h3><p class="text-sm text-muted-foreground"${_scopeId}> Status: <span class="${ssrRenderClass(_ctx.statusClass)}"${_scopeId}>${ssrInterpolate(_ctx.dataset.status)}</span> · Rows: ${ssrInterpolate(_ctx.dataset.row_count ?? "—")}</p><p class="text-sm text-muted-foreground mt-1"${_scopeId}> Source: ${ssrInterpolate(_ctx.sourceLabel)}</p>`);
          if (_ctx.canIngest) {
            _push2(`<div class="mt-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_AppButton, {
              disabled: _ctx.ingesting,
              onClick: _ctx.runIngestion
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(_ctx.ingesting ? "Ingesting…" : "Run ingestion")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(_ctx.ingesting ? "Ingesting…" : "Run ingestion"), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            _push2(`<!---->`);
          }
        } else {
          return [
            createVNode("h3", { class: "app-section-title mb-2" }, "Overview"),
            createVNode("p", { class: "text-sm text-muted-foreground" }, [
              createTextVNode(" Status: "),
              createVNode("span", { class: _ctx.statusClass }, toDisplayString(_ctx.dataset.status), 3),
              createTextVNode(" · Rows: " + toDisplayString(_ctx.dataset.row_count ?? "—"), 1)
            ]),
            createVNode("p", { class: "text-sm text-muted-foreground mt-1" }, " Source: " + toDisplayString(_ctx.sourceLabel), 1),
            _ctx.canIngest ? (openBlock(), createBlock("div", {
              key: 0,
              class: "mt-3"
            }, [
              createVNode(_component_AppButton, {
                disabled: _ctx.ingesting,
                onClick: _ctx.runIngestion
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(_ctx.ingesting ? "Ingesting…" : "Run ingestion"), 1)
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ])) : createCommentVNode("", true)
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(ssrRenderComponent(_component_AppCard, { class: "mb-4" }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<h3 class="app-section-title mb-4"${_scopeId}>Versions</h3>`);
          if (_ctx.dataset.versions?.length) {
            _push2(`<ul class="space-y-2 text-sm"${_scopeId}><!--[-->`);
            ssrRenderList(_ctx.dataset.versions, (v) => {
              _push2(`<li class="flex justify-between rounded border border-border/50 px-3 py-2"${_scopeId}><span class="font-mono"${_scopeId}>${ssrInterpolate(v.tag)}</span><span class="text-muted-foreground"${_scopeId}>${ssrInterpolate(v.status)}</span><span class="text-muted-foreground"${_scopeId}>${ssrInterpolate(v.row_count ?? "—")} rows</span></li>`);
            });
            _push2(`<!--]--></ul>`);
          } else {
            _push2(`<p class="text-muted-foreground text-sm"${_scopeId}>No versions yet. Run ingestion to create one.</p>`);
          }
        } else {
          return [
            createVNode("h3", { class: "app-section-title mb-4" }, "Versions"),
            _ctx.dataset.versions?.length ? (openBlock(), createBlock("ul", {
              key: 0,
              class: "space-y-2 text-sm"
            }, [
              (openBlock(true), createBlock(Fragment, null, renderList(_ctx.dataset.versions, (v) => {
                return openBlock(), createBlock("li", {
                  key: v.id,
                  class: "flex justify-between rounded border border-border/50 px-3 py-2"
                }, [
                  createVNode("span", { class: "font-mono" }, toDisplayString(v.tag), 1),
                  createVNode("span", { class: "text-muted-foreground" }, toDisplayString(v.status), 1),
                  createVNode("span", { class: "text-muted-foreground" }, toDisplayString(v.row_count ?? "—") + " rows", 1)
                ]);
              }), 128))
            ])) : (openBlock(), createBlock("p", {
              key: 1,
              class: "text-muted-foreground text-sm"
            }, "No versions yet. Run ingestion to create one."))
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(ssrRenderComponent(_component_AppCard, null, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<h3 class="app-section-title mb-4"${_scopeId}>Quality report</h3><ul class="space-y-2 text-sm text-muted-foreground"${_scopeId}><li${_scopeId}>Duplication: ${ssrInterpolate(_ctx.dataset.quality?.duplication_pct ?? "—")}%</li><li${_scopeId}>PII flagged: ${ssrInterpolate(_ctx.dataset.quality?.pii_flagged ?? "—")}</li><li${_scopeId}>Schema adherence: ${ssrInterpolate(_ctx.dataset.quality?.schema_adherence ?? "—")}%</li></ul>`);
        } else {
          return [
            createVNode("h3", { class: "app-section-title mb-4" }, "Quality report"),
            createVNode("ul", { class: "space-y-2 text-sm text-muted-foreground" }, [
              createVNode("li", null, "Duplication: " + toDisplayString(_ctx.dataset.quality?.duplication_pct ?? "—") + "%", 1),
              createVNode("li", null, "PII flagged: " + toDisplayString(_ctx.dataset.quality?.pii_flagged ?? "—"), 1),
              createVNode("li", null, "Schema adherence: " + toDisplayString(_ctx.dataset.quality?.schema_adherence ?? "—") + "%", 1)
            ])
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(`<!--]-->`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/datasets/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  _id_ as default
};
//# sourceMappingURL=_id_-CDTxS90F.js.map
