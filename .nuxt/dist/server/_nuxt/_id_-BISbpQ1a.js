import { _ as __nuxt_component_0 } from "./AppPageHeader-CFOue3Zn.js";
import { _ as __nuxt_component_1 } from "./AppCard-T_GiUAp6.js";
import { _ as __nuxt_component_0$1 } from "./AppButton-oAgfFzQm.js";
import { defineComponent, mergeProps, withCtx, createTextVNode, toDisplayString, createVNode, withDirectives, vModelText, openBlock, createBlock, createCommentVNode, Fragment, renderList, useSSRContext } from "vue";
import { a as useRuntimeConfig } from "../server.mjs";
import { u as useAployApi } from "./useAployApi-BEdJYRuf.js";
import { u as useMockMode } from "./useMockMode-j3YD3gix.js";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
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
import "./useEnvironment-BnZbXQTt.js";
import "./useMockApi-CJyUoVJj.js";
const _sfc_main = defineComponent({
  name: "PipelineDetail",
  data() {
    return {
      pipeline: null,
      loading: true,
      error: "",
      testInput: "{}",
      running: false,
      testOutput: null
    };
  },
  computed: {
    testOutputText() {
      if (this.testOutput === null) return "";
      return typeof this.testOutput === "string" ? this.testOutput : JSON.stringify(this.testOutput, null, 2);
    }
  },
  setup() {
    const { apiFetch, apiUrl, environment } = useAployApi();
    const { mockMode } = useMockMode();
    return { apiFetch, apiUrl, environment, mockMode };
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
        this.pipeline = await this.apiFetch(`/api/pipelines/${id}`);
      } catch (e) {
        this.error = e.message || "Failed to load pipeline";
      } finally {
        this.loading = false;
      }
    },
    async runTest() {
      if (!this.pipeline) return;
      let input;
      try {
        input = this.testInput.trim() ? JSON.parse(this.testInput) : {};
      } catch {
        this.testOutput = { error: "Invalid JSON in input" };
        return;
      }
      this.running = true;
      this.testOutput = null;
      try {
        if (this.mockMode?.value) {
          await new Promise((r) => setTimeout(r, 400));
          this.testOutput = { result: "Mock pipeline output", input };
          return;
        }
        const config = useRuntimeConfig();
        const base = config.public.apiUrl || "http://localhost:4000";
        const url = `${base.replace(/\/$/, "")}/v1/pipelines/${this.pipeline.id}/invoke`;
        const res = await $fetch(url, {
          method: "POST",
          body: input,
          credentials: "include",
          headers: { "Content-Type": "application/json", "X-Environment": this.environment?.value ?? "production" }
        });
        this.testOutput = res.error ? { error: res.error, output: res.output, steps: res.steps } : res.output;
      } catch (e) {
        const err = e;
        this.testOutput = err.data ?? e.message;
      } finally {
        this.running = false;
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
    title: _ctx.pipeline?.name ?? "Pipeline",
    description: "Edit and test run.",
    "back-to": "/app/pipelines",
    "back-label": "Pipelines"
  }, null, _parent));
  if (_ctx.loading) {
    _push(`<p class="text-muted-foreground text-sm">Loading…</p>`);
  } else if (_ctx.error) {
    _push(`<p class="app-error">${ssrInterpolate(_ctx.error)}</p>`);
  } else if (_ctx.pipeline) {
    _push(`<!--[-->`);
    _push(ssrRenderComponent(_component_AppCard, { class: "mb-4" }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<h3 class="app-section-title mb-2"${_scopeId}>Test run</h3><p class="text-sm text-muted-foreground mb-2"${_scopeId}>Send sample input (JSON) and see the output.</p><textarea class="app-input min-h-[100px] font-mono text-sm mb-2" placeholder="{&quot;query&quot;: &quot;Hello&quot;}"${_scopeId}>${ssrInterpolate(_ctx.testInput)}</textarea>`);
          _push2(ssrRenderComponent(_component_AppButton, {
            disabled: _ctx.running,
            onClick: _ctx.runTest
          }, {
            default: withCtx((_2, _push3, _parent3, _scopeId2) => {
              if (_push3) {
                _push3(`${ssrInterpolate(_ctx.running ? "Running…" : "Run pipeline")}`);
              } else {
                return [
                  createTextVNode(toDisplayString(_ctx.running ? "Running…" : "Run pipeline"), 1)
                ];
              }
            }),
            _: 1
          }, _parent2, _scopeId));
          if (_ctx.testOutput !== null) {
            _push2(`<div class="mt-4 rounded bg-muted/50 p-3"${_scopeId}><p class="text-sm font-medium mb-2"${_scopeId}>Output</p><pre class="text-xs overflow-auto max-h-[300px]"${_scopeId}>${ssrInterpolate(_ctx.testOutputText)}</pre></div>`);
          } else {
            _push2(`<!---->`);
          }
        } else {
          return [
            createVNode("h3", { class: "app-section-title mb-2" }, "Test run"),
            createVNode("p", { class: "text-sm text-muted-foreground mb-2" }, "Send sample input (JSON) and see the output."),
            withDirectives(createVNode("textarea", {
              "onUpdate:modelValue": ($event) => _ctx.testInput = $event,
              class: "app-input min-h-[100px] font-mono text-sm mb-2",
              placeholder: '{"query": "Hello"}'
            }, null, 8, ["onUpdate:modelValue"]), [
              [vModelText, _ctx.testInput]
            ]),
            createVNode(_component_AppButton, {
              disabled: _ctx.running,
              onClick: _ctx.runTest
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(_ctx.running ? "Running…" : "Run pipeline"), 1)
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            _ctx.testOutput !== null ? (openBlock(), createBlock("div", {
              key: 0,
              class: "mt-4 rounded bg-muted/50 p-3"
            }, [
              createVNode("p", { class: "text-sm font-medium mb-2" }, "Output"),
              createVNode("pre", { class: "text-xs overflow-auto max-h-[300px]" }, toDisplayString(_ctx.testOutputText), 1)
            ])) : createCommentVNode("", true)
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(ssrRenderComponent(_component_AppCard, null, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<h3 class="app-section-title mb-2"${_scopeId}>Steps</h3><ul class="space-y-2 text-sm"${_scopeId}><!--[-->`);
          ssrRenderList(_ctx.pipeline.steps, (s, i) => {
            _push2(`<li class="flex gap-2"${_scopeId}><span class="text-muted-foreground"${_scopeId}>${ssrInterpolate(i + 1)}.</span><span class="font-medium"${_scopeId}>${ssrInterpolate(s.name)}</span><span class="text-muted-foreground"${_scopeId}>(${ssrInterpolate(s.type)})</span></li>`);
          });
          _push2(`<!--]--></ul>`);
          if (!_ctx.pipeline.steps?.length) {
            _push2(`<p class="text-muted-foreground text-sm"${_scopeId}>No steps.</p>`);
          } else {
            _push2(`<!---->`);
          }
        } else {
          return [
            createVNode("h3", { class: "app-section-title mb-2" }, "Steps"),
            createVNode("ul", { class: "space-y-2 text-sm" }, [
              (openBlock(true), createBlock(Fragment, null, renderList(_ctx.pipeline.steps, (s, i) => {
                return openBlock(), createBlock("li", {
                  key: i,
                  class: "flex gap-2"
                }, [
                  createVNode("span", { class: "text-muted-foreground" }, toDisplayString(i + 1) + ".", 1),
                  createVNode("span", { class: "font-medium" }, toDisplayString(s.name), 1),
                  createVNode("span", { class: "text-muted-foreground" }, "(" + toDisplayString(s.type) + ")", 1)
                ]);
              }), 128))
            ]),
            !_ctx.pipeline.steps?.length ? (openBlock(), createBlock("p", {
              key: 0,
              class: "text-muted-foreground text-sm"
            }, "No steps.")) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/pipelines/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  _id_ as default
};
//# sourceMappingURL=_id_-BISbpQ1a.js.map
