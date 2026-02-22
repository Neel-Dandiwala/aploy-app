import { _ as __nuxt_component_0 } from "./AppPageHeader-CFOue3Zn.js";
import { _ as __nuxt_component_0$1 } from "./AppButton-oAgfFzQm.js";
import { defineComponent, mergeProps, withCtx, createTextVNode, toDisplayString, useSSRContext } from "vue";
import "/Users/neeldandiwala/Projects/aploy/aploy-app/node_modules/hookable/dist/index.mjs";
import { u as useAployApi } from "./useAployApi-BEdJYRuf.js";
import { n as navigateTo } from "../server.mjs";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from "vue/server-renderer";
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
  name: "NewPipeline",
  data() {
    return {
      form: {
        name: "",
        description: "",
        steps: []
      },
      deployments: [],
      knowledgeBases: [],
      loading: false,
      error: ""
    };
  },
  setup() {
    const { apiFetch } = useAployApi();
    return { apiFetch };
  },
  async mounted() {
    try {
      const data = await this.apiFetch("/api/deploy");
      this.deployments = data.deployments || [];
    } catch {
      this.deployments = [];
    }
    try {
      const kbData = await this.apiFetch("/api/knowledge-bases");
      this.knowledgeBases = kbData.knowledge_bases || [];
    } catch {
      this.knowledgeBases = [];
    }
  },
  methods: {
    addStep() {
      this.form.steps.push({
        type: "model",
        name: `step${this.form.steps.length + 1}`,
        deploymentId: "",
        method: "POST",
        topK: 5
      });
    },
    removeStep(i) {
      this.form.steps.splice(i, 1);
    },
    buildSteps() {
      return this.form.steps.map((s) => {
        const step = {
          id: s.name,
          type: s.type,
          name: s.name
        };
        if (s.type === "retrieve") {
          step.knowledgeBaseId = s.knowledgeBaseId || void 0;
          step.topK = s.topK ?? 5;
          if (s.queryMapping?.trim()) step.queryMapping = s.queryMapping.trim();
        } else if (s.type === "model") {
          step.deploymentId = s.deploymentId || void 0;
          if (s.inputMappingStr?.trim()) {
            try {
              step.inputMapping = JSON.parse(s.inputMappingStr);
            } catch {
            }
          }
        } else {
          step.url = s.url;
          step.method = s.method || "GET";
        }
        if (s.dependsOnStr?.trim()) {
          step.dependsOn = s.dependsOnStr.split(",").map((x) => x.trim()).filter(Boolean);
        }
        return step;
      });
    },
    async onSubmit() {
      this.error = "";
      this.loading = true;
      try {
        const data = await this.apiFetch("/api/pipelines", {
          method: "POST",
          body: {
            name: this.form.name || "Untitled pipeline",
            description: this.form.description,
            steps: this.buildSteps()
          }
        });
        await navigateTo(`/app/pipelines/${data.id}`);
      } catch (e) {
        this.error = e.message || "Failed to create pipeline";
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
    title: "New pipeline",
    description: "Add steps: retrieve (knowledge base), model (deployment), or HTTP. Order defines execution.",
    "back-to": "/app/pipelines",
    "back-label": "Pipelines"
  }, null, _parent));
  _push(`<form class="space-y-6"><div><label class="app-label">Name</label><input${ssrRenderAttr("value", _ctx.form.name)} class="app-input" placeholder="e.g. Summarize then classify"></div><div><label class="app-label">Description (optional)</label><input${ssrRenderAttr("value", _ctx.form.description)} class="app-input" placeholder="Short description"></div><div><label class="app-label">Steps</label><!--[-->`);
  ssrRenderList(_ctx.form.steps, (step, i) => {
    _push(`<div class="mb-4 rounded border border-border/50 p-3 space-y-2"><div class="flex justify-between items-center"><span class="font-medium text-sm">Step ${ssrInterpolate(i + 1)}</span><button type="button" class="text-destructive text-sm hover:underline">Remove</button></div><div><label class="app-label text-xs">Type</label><select class="app-select"><option value="retrieve"${ssrIncludeBooleanAttr(Array.isArray(step.type) ? ssrLooseContain(step.type, "retrieve") : ssrLooseEqual(step.type, "retrieve")) ? " selected" : ""}>Retrieve (knowledge base)</option><option value="model"${ssrIncludeBooleanAttr(Array.isArray(step.type) ? ssrLooseContain(step.type, "model") : ssrLooseEqual(step.type, "model")) ? " selected" : ""}>Model (deployment)</option><option value="http"${ssrIncludeBooleanAttr(Array.isArray(step.type) ? ssrLooseContain(step.type, "http") : ssrLooseEqual(step.type, "http")) ? " selected" : ""}>HTTP request</option></select></div><div><label class="app-label text-xs">Name (id)</label><input${ssrRenderAttr("value", step.name)} class="app-input" placeholder="e.g. step1"></div>`);
    if (step.type === "retrieve") {
      _push(`<!--[--><div><label class="app-label text-xs">Knowledge base</label><select class="app-select"><option value=""${ssrIncludeBooleanAttr(Array.isArray(step.knowledgeBaseId) ? ssrLooseContain(step.knowledgeBaseId, "") : ssrLooseEqual(step.knowledgeBaseId, "")) ? " selected" : ""}>Select knowledge base</option><!--[-->`);
      ssrRenderList(_ctx.knowledgeBases, (kb) => {
        _push(`<option${ssrRenderAttr("value", kb.id)}${ssrIncludeBooleanAttr(Array.isArray(step.knowledgeBaseId) ? ssrLooseContain(step.knowledgeBaseId, kb.id) : ssrLooseEqual(step.knowledgeBaseId, kb.id)) ? " selected" : ""}>${ssrInterpolate(kb.name)}</option>`);
      });
      _push(`<!--]--></select></div><div><label class="app-label text-xs">Top K</label><input${ssrRenderAttr("value", step.topK)} type="number" min="1" max="100" class="app-input" placeholder="5"></div><div><label class="app-label text-xs">Query mapping (optional, default $.input.query)</label><input${ssrRenderAttr("value", step.queryMapping)} class="app-input font-mono text-xs" placeholder="$.input.query"></div><!--]-->`);
    } else if (step.type === "model") {
      _push(`<!--[--><div><label class="app-label text-xs">Deployment</label><select class="app-select"><option value=""${ssrIncludeBooleanAttr(Array.isArray(step.deploymentId) ? ssrLooseContain(step.deploymentId, "") : ssrLooseEqual(step.deploymentId, "")) ? " selected" : ""}>Select deployment</option><!--[-->`);
      ssrRenderList(_ctx.deployments, (d) => {
        _push(`<option${ssrRenderAttr("value", d.id)}${ssrIncludeBooleanAttr(Array.isArray(step.deploymentId) ? ssrLooseContain(step.deploymentId, d.id) : ssrLooseEqual(step.deploymentId, d.id)) ? " selected" : ""}>${ssrInterpolate(d.id)} — ${ssrInterpolate(d.model_version_id)}</option>`);
      });
      _push(`<!--]--></select></div><div><label class="app-label text-xs">Input mapping (optional) e.g. {&quot;messages&quot;: &quot;$.input&quot;}</label><input${ssrRenderAttr("value", step.inputMappingStr)} class="app-input font-mono text-xs" placeholder="{&quot;messages&quot;: &quot;$.input&quot;}"></div><!--]-->`);
    } else {
      _push(`<!--[--><div><label class="app-label text-xs">URL</label><input${ssrRenderAttr("value", step.url)} class="app-input" placeholder="https://..."></div><div><label class="app-label text-xs">Method</label><select class="app-select"><option value="GET"${ssrIncludeBooleanAttr(Array.isArray(step.method) ? ssrLooseContain(step.method, "GET") : ssrLooseEqual(step.method, "GET")) ? " selected" : ""}>GET</option><option value="POST"${ssrIncludeBooleanAttr(Array.isArray(step.method) ? ssrLooseContain(step.method, "POST") : ssrLooseEqual(step.method, "POST")) ? " selected" : ""}>POST</option></select></div><!--]-->`);
    }
    if (i > 0) {
      _push(`<div><label class="app-label text-xs">Depends on (step name, comma-separated)</label><input${ssrRenderAttr("value", step.dependsOnStr)} class="app-input text-xs" placeholder="step1"></div>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div>`);
  });
  _push(`<!--]-->`);
  _push(ssrRenderComponent(_component_AppButton, {
    type: "button",
    variant: "secondary",
    class: "mt-2",
    onClick: _ctx.addStep
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Add step`);
      } else {
        return [
          createTextVNode("Add step")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div>`);
  if (_ctx.error) {
    _push(`<p class="app-error">${ssrInterpolate(_ctx.error)}</p>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<div class="flex gap-3">`);
  _push(ssrRenderComponent(_component_AppButton, {
    type: "submit",
    disabled: _ctx.loading
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`${ssrInterpolate(_ctx.loading ? "Creating…" : "Create pipeline")}`);
      } else {
        return [
          createTextVNode(toDisplayString(_ctx.loading ? "Creating…" : "Create pipeline"), 1)
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_AppButton, {
    variant: "secondary",
    to: "/app/pipelines"
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/pipelines/new.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _new = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  _new as default
};
//# sourceMappingURL=new-DdaWsMTd.js.map
