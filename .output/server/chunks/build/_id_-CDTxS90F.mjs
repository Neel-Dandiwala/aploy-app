import { _ as __nuxt_component_0 } from './AppPageHeader-CFOue3Zn.mjs';
import { _ as __nuxt_component_1 } from './AppCard-T_GiUAp6.mjs';
import { _ as __nuxt_component_0$1 } from './AppButton-oAgfFzQm.mjs';
import { mergeProps, withCtx, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, createCommentVNode, Fragment, renderList, defineComponent, useSSRContext } from 'vue';
import { u as useAployApi } from './useAployApi-BEdJYRuf.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderList } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import './nuxt-link-D0qNmuHi.mjs';
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
import './useEnvironment-BnZbXQTt.mjs';
import './useMockMode-j3YD3gix.mjs';
import './useMockApi-CJyUoVJj.mjs';

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
      var _a;
      if (!((_a = this.dataset) == null ? void 0 : _a.source)) return "Upload";
      const s = this.dataset.source;
      if (s.type === "s3") return `S3 ${s.bucket || ""} ${s.prefix || ""}`.trim();
      if (s.type === "gcs") return `GCS ${s.bucket || ""} ${s.prefix || ""}`.trim();
      if (s.type === "hf") return `Hugging Face ${s.dataset || ""}`.trim();
      return String(s.type || "upload");
    },
    canIngest() {
      var _a;
      return !!this.dataset && ["s3", "gcs", "hf"].includes(((_a = this.dataset.source) == null ? void 0 : _a.type) || "");
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
    title: "Dataset \u2014 Preview & quality",
    description: "Quality report and preview. Run ingestion to sync from source.",
    "back-to": "/app/datasets",
    "back-label": "Datasets"
  }, null, _parent));
  if (_ctx.loading) {
    _push(`<p class="text-muted-foreground text-sm">Loading\u2026</p>`);
  } else if (_ctx.error) {
    _push(`<p class="app-error">${ssrInterpolate(_ctx.error)}</p>`);
  } else if (_ctx.dataset) {
    _push(`<!--[-->`);
    _push(ssrRenderComponent(_component_AppCard, { class: "mb-4" }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        var _a, _b;
        if (_push2) {
          _push2(`<h3 class="app-section-title mb-2"${_scopeId}>Overview</h3><p class="text-sm text-muted-foreground"${_scopeId}> Status: <span class="${ssrRenderClass(_ctx.statusClass)}"${_scopeId}>${ssrInterpolate(_ctx.dataset.status)}</span> \xB7 Rows: ${ssrInterpolate((_a = _ctx.dataset.row_count) != null ? _a : "\u2014")}</p><p class="text-sm text-muted-foreground mt-1"${_scopeId}> Source: ${ssrInterpolate(_ctx.sourceLabel)}</p>`);
          if (_ctx.canIngest) {
            _push2(`<div class="mt-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_AppButton, {
              disabled: _ctx.ingesting,
              onClick: _ctx.runIngestion
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(_ctx.ingesting ? "Ingesting\u2026" : "Run ingestion")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(_ctx.ingesting ? "Ingesting\u2026" : "Run ingestion"), 1)
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
              createTextVNode(" \xB7 Rows: " + toDisplayString((_b = _ctx.dataset.row_count) != null ? _b : "\u2014"), 1)
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
                  createTextVNode(toDisplayString(_ctx.ingesting ? "Ingesting\u2026" : "Run ingestion"), 1)
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
        var _a, _b;
        if (_push2) {
          _push2(`<h3 class="app-section-title mb-4"${_scopeId}>Versions</h3>`);
          if ((_a = _ctx.dataset.versions) == null ? void 0 : _a.length) {
            _push2(`<ul class="space-y-2 text-sm"${_scopeId}><!--[-->`);
            ssrRenderList(_ctx.dataset.versions, (v) => {
              var _a2;
              _push2(`<li class="flex justify-between rounded border border-border/50 px-3 py-2"${_scopeId}><span class="font-mono"${_scopeId}>${ssrInterpolate(v.tag)}</span><span class="text-muted-foreground"${_scopeId}>${ssrInterpolate(v.status)}</span><span class="text-muted-foreground"${_scopeId}>${ssrInterpolate((_a2 = v.row_count) != null ? _a2 : "\u2014")} rows</span></li>`);
            });
            _push2(`<!--]--></ul>`);
          } else {
            _push2(`<p class="text-muted-foreground text-sm"${_scopeId}>No versions yet. Run ingestion to create one.</p>`);
          }
        } else {
          return [
            createVNode("h3", { class: "app-section-title mb-4" }, "Versions"),
            ((_b = _ctx.dataset.versions) == null ? void 0 : _b.length) ? (openBlock(), createBlock("ul", {
              key: 0,
              class: "space-y-2 text-sm"
            }, [
              (openBlock(true), createBlock(Fragment, null, renderList(_ctx.dataset.versions, (v) => {
                var _a2;
                return openBlock(), createBlock("li", {
                  key: v.id,
                  class: "flex justify-between rounded border border-border/50 px-3 py-2"
                }, [
                  createVNode("span", { class: "font-mono" }, toDisplayString(v.tag), 1),
                  createVNode("span", { class: "text-muted-foreground" }, toDisplayString(v.status), 1),
                  createVNode("span", { class: "text-muted-foreground" }, toDisplayString((_a2 = v.row_count) != null ? _a2 : "\u2014") + " rows", 1)
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
        if (_push2) {
          _push2(`<h3 class="app-section-title mb-4"${_scopeId}>Quality report</h3><ul class="space-y-2 text-sm text-muted-foreground"${_scopeId}><li${_scopeId}>Duplication: ${ssrInterpolate((_b = (_a = _ctx.dataset.quality) == null ? void 0 : _a.duplication_pct) != null ? _b : "\u2014")}%</li><li${_scopeId}>PII flagged: ${ssrInterpolate((_d = (_c = _ctx.dataset.quality) == null ? void 0 : _c.pii_flagged) != null ? _d : "\u2014")}</li><li${_scopeId}>Schema adherence: ${ssrInterpolate((_f = (_e = _ctx.dataset.quality) == null ? void 0 : _e.schema_adherence) != null ? _f : "\u2014")}%</li></ul>`);
        } else {
          return [
            createVNode("h3", { class: "app-section-title mb-4" }, "Quality report"),
            createVNode("ul", { class: "space-y-2 text-sm text-muted-foreground" }, [
              createVNode("li", null, "Duplication: " + toDisplayString((_h = (_g = _ctx.dataset.quality) == null ? void 0 : _g.duplication_pct) != null ? _h : "\u2014") + "%", 1),
              createVNode("li", null, "PII flagged: " + toDisplayString((_j = (_i = _ctx.dataset.quality) == null ? void 0 : _i.pii_flagged) != null ? _j : "\u2014"), 1),
              createVNode("li", null, "Schema adherence: " + toDisplayString((_l = (_k = _ctx.dataset.quality) == null ? void 0 : _k.schema_adherence) != null ? _l : "\u2014") + "%", 1)
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

export { _id_ as default };
//# sourceMappingURL=_id_-CDTxS90F.mjs.map
