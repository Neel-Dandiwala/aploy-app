import { _ as __nuxt_component_0 } from './AppPageHeader-CFOue3Zn.mjs';
import { _ as __nuxt_component_1 } from './AppCard-T_GiUAp6.mjs';
import { _ as __nuxt_component_0$1 } from './AppButton-oAgfFzQm.mjs';
import { mergeProps, withCtx, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, createCommentVNode, defineComponent, useSSRContext } from 'vue';
import { a as useRuntimeConfig } from './server.mjs';
import { u as useAployApi } from './useAployApi-BEdJYRuf.mjs';
import { u as useEnvironment } from './useEnvironment-BnZbXQTt.mjs';
import { u as useMockMode } from './useMockMode-j3YD3gix.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';
import './useMockApi-CJyUoVJj.mjs';

const _sfc_main = defineComponent({
  name: "KnowledgeBaseDetail",
  data() {
    return {
      kb: null,
      loading: true,
      error: "",
      ingesting: false,
      selectedFiles: []
    };
  },
  computed: {
    sourceLabel() {
      var _a;
      if (!((_a = this.kb) == null ? void 0 : _a.source)) return "Upload";
      const s = this.kb.source;
      if (s.type === "s3") return `S3 ${s.bucket || ""} ${s.prefix || ""}`.trim();
      if (s.type === "gcs") return `GCS ${s.bucket || ""} ${s.prefix || ""}`.trim();
      return String(s.type || "upload");
    },
    statusClass() {
      if (!this.kb) return "";
      if (this.kb.status === "ready") return "text-emerald-600";
      if (this.kb.status === "failed") return "text-destructive";
      return "text-amber-600";
    }
  },
  setup() {
    const { apiFetch, apiUrl } = useAployApi();
    const { environment } = useEnvironment();
    const { mockMode } = useMockMode();
    return { apiFetch, apiUrl, environment, mockMode };
  },
  async mounted() {
    await this.load();
  },
  methods: {
    onFileSelect(e) {
      const input = e.target;
      this.selectedFiles = (input == null ? void 0 : input.files) ? Array.from(input.files) : [];
    },
    async load() {
      this.loading = true;
      this.error = "";
      const id = this.$route.params.id;
      try {
        this.kb = await this.apiFetch(`/api/knowledge-bases/${id}`);
      } catch (e) {
        this.error = e.message || "Failed to load knowledge base";
      } finally {
        this.loading = false;
      }
    },
    async runIngest() {
      if (!this.kb) return;
      this.ingesting = true;
      try {
        await this.apiFetch(`/api/knowledge-bases/${this.kb.id}/ingest`, { method: "POST" });
        await this.load();
      } catch (e) {
        this.error = e.message || "Ingestion failed";
      } finally {
        this.ingesting = false;
      }
    },
    async runIngestWithFiles() {
      var _a, _b, _c;
      if (!this.kb || !this.selectedFiles.length) return;
      this.ingesting = true;
      try {
        if ((_a = this.mockMode) == null ? void 0 : _a.value) {
          await new Promise((r) => setTimeout(r, 500));
          this.selectedFiles = [];
          const input2 = this.$refs.fileInput;
          if (input2) input2.value = "";
          await this.load();
          return;
        }
        const config = useRuntimeConfig();
        const base = config.public.apiUrl || "http://localhost:4000";
        const url = `${base.replace(/\/$/, "")}/api/knowledge-bases/${this.kb.id}/ingest`;
        const form = new FormData();
        for (const f of this.selectedFiles) form.append("files", f);
        await $fetch(url, {
          method: "POST",
          body: form,
          credentials: "include",
          headers: { "X-Environment": (_c = (_b = this.environment) == null ? void 0 : _b.value) != null ? _c : "production" }
        });
        this.selectedFiles = [];
        const input = this.$refs.fileInput;
        if (input) input.value = "";
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
  var _a, _b;
  const _component_AppPageHeader = __nuxt_component_0;
  const _component_AppCard = __nuxt_component_1;
  const _component_AppButton = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "app-page" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_AppPageHeader, {
    title: (_b = (_a = _ctx.kb) == null ? void 0 : _a.name) != null ? _b : "Knowledge base",
    description: "Status and ingestion. Run ingest to sync from source or upload files.",
    "back-to": "/app/knowledge-bases",
    "back-label": "Knowledge bases"
  }, null, _parent));
  if (_ctx.loading) {
    _push(`<p class="text-muted-foreground text-sm">Loading\u2026</p>`);
  } else if (_ctx.error) {
    _push(`<p class="app-error">${ssrInterpolate(_ctx.error)}</p>`);
  } else if (_ctx.kb) {
    _push(`<!--[-->`);
    _push(ssrRenderComponent(_component_AppCard, { class: "mb-4" }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        var _a2, _b2, _c, _d, _e, _f;
        if (_push2) {
          _push2(`<h3 class="app-section-title mb-2"${_scopeId}>Overview</h3><p class="text-sm text-muted-foreground"${_scopeId}> Status: <span class="${ssrRenderClass(_ctx.statusClass)}"${_scopeId}>${ssrInterpolate(_ctx.kb.status)}</span> \xB7 Chunks: ${ssrInterpolate((_a2 = _ctx.kb.chunk_count) != null ? _a2 : "\u2014")}</p>`);
          if (_ctx.kb.error_message) {
            _push2(`<p class="text-sm text-destructive mt-1"${_scopeId}>${ssrInterpolate(_ctx.kb.error_message)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<p class="text-sm text-muted-foreground mt-1"${_scopeId}> Source: ${ssrInterpolate(_ctx.sourceLabel)} \xB7 Embedding: ${ssrInterpolate((_b2 = _ctx.kb.embedding_model) != null ? _b2 : "text-embedding-3-small")}</p><div class="mt-4 flex flex-wrap gap-3"${_scopeId}>`);
          if (((_c = _ctx.kb.source) == null ? void 0 : _c.type) === "upload") {
            _push2(`<div class="flex flex-wrap items-center gap-2"${_scopeId}><input type="file" multiple accept=".pdf,.html,.htm,.md,.txt,text/plain,text/html,text/markdown,application/pdf" class="text-sm text-muted-foreground file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-muted file:text-foreground"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_AppButton, {
              disabled: _ctx.ingesting || !_ctx.selectedFiles.length,
              onClick: _ctx.runIngestWithFiles
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(_ctx.ingesting ? "Ingesting\u2026" : "Upload & ingest")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(_ctx.ingesting ? "Ingesting\u2026" : "Upload & ingest"), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            _push2(ssrRenderComponent(_component_AppButton, {
              disabled: _ctx.ingesting,
              onClick: _ctx.runIngest
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(_ctx.ingesting ? "Ingesting\u2026" : "Run ingest")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(_ctx.ingesting ? "Ingesting\u2026" : "Run ingest"), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          }
          _push2(`</div>`);
        } else {
          return [
            createVNode("h3", { class: "app-section-title mb-2" }, "Overview"),
            createVNode("p", { class: "text-sm text-muted-foreground" }, [
              createTextVNode(" Status: "),
              createVNode("span", { class: _ctx.statusClass }, toDisplayString(_ctx.kb.status), 3),
              createTextVNode(" \xB7 Chunks: " + toDisplayString((_d = _ctx.kb.chunk_count) != null ? _d : "\u2014"), 1)
            ]),
            _ctx.kb.error_message ? (openBlock(), createBlock("p", {
              key: 0,
              class: "text-sm text-destructive mt-1"
            }, toDisplayString(_ctx.kb.error_message), 1)) : createCommentVNode("", true),
            createVNode("p", { class: "text-sm text-muted-foreground mt-1" }, " Source: " + toDisplayString(_ctx.sourceLabel) + " \xB7 Embedding: " + toDisplayString((_e = _ctx.kb.embedding_model) != null ? _e : "text-embedding-3-small"), 1),
            createVNode("div", { class: "mt-4 flex flex-wrap gap-3" }, [
              ((_f = _ctx.kb.source) == null ? void 0 : _f.type) === "upload" ? (openBlock(), createBlock("div", {
                key: 0,
                class: "flex flex-wrap items-center gap-2"
              }, [
                createVNode("input", {
                  ref: "fileInput",
                  type: "file",
                  multiple: "",
                  accept: ".pdf,.html,.htm,.md,.txt,text/plain,text/html,text/markdown,application/pdf",
                  class: "text-sm text-muted-foreground file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-muted file:text-foreground",
                  onChange: _ctx.onFileSelect
                }, null, 40, ["onChange"]),
                createVNode(_component_AppButton, {
                  disabled: _ctx.ingesting || !_ctx.selectedFiles.length,
                  onClick: _ctx.runIngestWithFiles
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(_ctx.ingesting ? "Ingesting\u2026" : "Upload & ingest"), 1)
                  ]),
                  _: 1
                }, 8, ["disabled", "onClick"])
              ])) : (openBlock(), createBlock(_component_AppButton, {
                key: 1,
                disabled: _ctx.ingesting,
                onClick: _ctx.runIngest
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(_ctx.ingesting ? "Ingesting\u2026" : "Run ingest"), 1)
                ]),
                _: 1
              }, 8, ["disabled", "onClick"]))
            ])
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(ssrRenderComponent(_component_AppCard, null, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        var _a2, _b2, _c, _d, _e, _f, _g, _h, _i, _j;
        if (_push2) {
          _push2(`<h3 class="app-section-title mb-2"${_scopeId}>Config</h3><ul class="space-y-1 text-sm text-muted-foreground"${_scopeId}><li${_scopeId}>Chunk size: ${ssrInterpolate((_b2 = (_a2 = _ctx.kb.chunk_config) == null ? void 0 : _a2.size) != null ? _b2 : 512)} \xB7 Overlap: ${ssrInterpolate((_d = (_c = _ctx.kb.chunk_config) == null ? void 0 : _c.overlap) != null ? _d : 64)}</li><li${_scopeId}>Dimension: ${ssrInterpolate((_e = _ctx.kb.embedding_dimension) != null ? _e : 1536)}</li></ul>`);
        } else {
          return [
            createVNode("h3", { class: "app-section-title mb-2" }, "Config"),
            createVNode("ul", { class: "space-y-1 text-sm text-muted-foreground" }, [
              createVNode("li", null, "Chunk size: " + toDisplayString((_g = (_f = _ctx.kb.chunk_config) == null ? void 0 : _f.size) != null ? _g : 512) + " \xB7 Overlap: " + toDisplayString((_i = (_h = _ctx.kb.chunk_config) == null ? void 0 : _h.overlap) != null ? _i : 64), 1),
              createVNode("li", null, "Dimension: " + toDisplayString((_j = _ctx.kb.embedding_dimension) != null ? _j : 1536), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/knowledge-bases/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { _id_ as default };
//# sourceMappingURL=_id_-D5dmGHNJ.mjs.map
