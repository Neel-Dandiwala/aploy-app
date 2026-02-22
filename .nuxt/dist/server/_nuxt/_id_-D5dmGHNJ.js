import { _ as __nuxt_component_0 } from "./AppPageHeader-CFOue3Zn.js";
import { _ as __nuxt_component_1 } from "./AppCard-T_GiUAp6.js";
import { _ as __nuxt_component_0$1 } from "./AppButton-oAgfFzQm.js";
import { defineComponent, mergeProps, withCtx, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, createCommentVNode, useSSRContext } from "vue";
import { a as useRuntimeConfig } from "../server.mjs";
import { u as useAployApi } from "./useAployApi-BEdJYRuf.js";
import { u as useEnvironment } from "./useEnvironment-BnZbXQTt.js";
import { u as useMockMode } from "./useMockMode-j3YD3gix.js";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass } from "vue/server-renderer";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./nuxt-link-D0qNmuHi.js";
import "/Users/neeldandiwala/Projects/aploy/aploy-app/node_modules/ufo/dist/index.mjs";
import "/Users/neeldandiwala/Projects/aploy/aploy-app/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/neeldandiwala/Projects/aploy/aploy-app/node_modules/hookable/dist/index.mjs";
import "/Users/neeldandiwala/Projects/aploy/aploy-app/node_modules/unctx/dist/index.mjs";
import "/Users/neeldandiwala/Projects/aploy/aploy-app/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/Users/neeldandiwala/Projects/aploy/aploy-app/node_modules/defu/dist/defu.mjs";
import "/Users/neeldandiwala/Projects/aploy/aploy-app/node_modules/@unhead/vue/dist/index.mjs";
import "./useMockApi-CJyUoVJj.js";
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
      if (!this.kb?.source) return "Upload";
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
      this.selectedFiles = input?.files ? Array.from(input.files) : [];
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
      if (!this.kb || !this.selectedFiles.length) return;
      this.ingesting = true;
      try {
        if (this.mockMode?.value) {
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
          headers: { "X-Environment": this.environment?.value ?? "production" }
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
  const _component_AppPageHeader = __nuxt_component_0;
  const _component_AppCard = __nuxt_component_1;
  const _component_AppButton = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "app-page" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_AppPageHeader, {
    title: _ctx.kb?.name ?? "Knowledge base",
    description: "Status and ingestion. Run ingest to sync from source or upload files.",
    "back-to": "/app/knowledge-bases",
    "back-label": "Knowledge bases"
  }, null, _parent));
  if (_ctx.loading) {
    _push(`<p class="text-muted-foreground text-sm">Loading…</p>`);
  } else if (_ctx.error) {
    _push(`<p class="app-error">${ssrInterpolate(_ctx.error)}</p>`);
  } else if (_ctx.kb) {
    _push(`<!--[-->`);
    _push(ssrRenderComponent(_component_AppCard, { class: "mb-4" }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<h3 class="app-section-title mb-2"${_scopeId}>Overview</h3><p class="text-sm text-muted-foreground"${_scopeId}> Status: <span class="${ssrRenderClass(_ctx.statusClass)}"${_scopeId}>${ssrInterpolate(_ctx.kb.status)}</span> · Chunks: ${ssrInterpolate(_ctx.kb.chunk_count ?? "—")}</p>`);
          if (_ctx.kb.error_message) {
            _push2(`<p class="text-sm text-destructive mt-1"${_scopeId}>${ssrInterpolate(_ctx.kb.error_message)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<p class="text-sm text-muted-foreground mt-1"${_scopeId}> Source: ${ssrInterpolate(_ctx.sourceLabel)} · Embedding: ${ssrInterpolate(_ctx.kb.embedding_model ?? "text-embedding-3-small")}</p><div class="mt-4 flex flex-wrap gap-3"${_scopeId}>`);
          if (_ctx.kb.source?.type === "upload") {
            _push2(`<div class="flex flex-wrap items-center gap-2"${_scopeId}><input type="file" multiple accept=".pdf,.html,.htm,.md,.txt,text/plain,text/html,text/markdown,application/pdf" class="text-sm text-muted-foreground file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-muted file:text-foreground"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_AppButton, {
              disabled: _ctx.ingesting || !_ctx.selectedFiles.length,
              onClick: _ctx.runIngestWithFiles
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(_ctx.ingesting ? "Ingesting…" : "Upload & ingest")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(_ctx.ingesting ? "Ingesting…" : "Upload & ingest"), 1)
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
                  _push3(`${ssrInterpolate(_ctx.ingesting ? "Ingesting…" : "Run ingest")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(_ctx.ingesting ? "Ingesting…" : "Run ingest"), 1)
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
              createTextVNode(" · Chunks: " + toDisplayString(_ctx.kb.chunk_count ?? "—"), 1)
            ]),
            _ctx.kb.error_message ? (openBlock(), createBlock("p", {
              key: 0,
              class: "text-sm text-destructive mt-1"
            }, toDisplayString(_ctx.kb.error_message), 1)) : createCommentVNode("", true),
            createVNode("p", { class: "text-sm text-muted-foreground mt-1" }, " Source: " + toDisplayString(_ctx.sourceLabel) + " · Embedding: " + toDisplayString(_ctx.kb.embedding_model ?? "text-embedding-3-small"), 1),
            createVNode("div", { class: "mt-4 flex flex-wrap gap-3" }, [
              _ctx.kb.source?.type === "upload" ? (openBlock(), createBlock("div", {
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
                    createTextVNode(toDisplayString(_ctx.ingesting ? "Ingesting…" : "Upload & ingest"), 1)
                  ]),
                  _: 1
                }, 8, ["disabled", "onClick"])
              ])) : (openBlock(), createBlock(_component_AppButton, {
                key: 1,
                disabled: _ctx.ingesting,
                onClick: _ctx.runIngest
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(_ctx.ingesting ? "Ingesting…" : "Run ingest"), 1)
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
        if (_push2) {
          _push2(`<h3 class="app-section-title mb-2"${_scopeId}>Config</h3><ul class="space-y-1 text-sm text-muted-foreground"${_scopeId}><li${_scopeId}>Chunk size: ${ssrInterpolate(_ctx.kb.chunk_config?.size ?? 512)} · Overlap: ${ssrInterpolate(_ctx.kb.chunk_config?.overlap ?? 64)}</li><li${_scopeId}>Dimension: ${ssrInterpolate(_ctx.kb.embedding_dimension ?? 1536)}</li></ul>`);
        } else {
          return [
            createVNode("h3", { class: "app-section-title mb-2" }, "Config"),
            createVNode("ul", { class: "space-y-1 text-sm text-muted-foreground" }, [
              createVNode("li", null, "Chunk size: " + toDisplayString(_ctx.kb.chunk_config?.size ?? 512) + " · Overlap: " + toDisplayString(_ctx.kb.chunk_config?.overlap ?? 64), 1),
              createVNode("li", null, "Dimension: " + toDisplayString(_ctx.kb.embedding_dimension ?? 1536), 1)
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
export {
  _id_ as default
};
//# sourceMappingURL=_id_-D5dmGHNJ.js.map
