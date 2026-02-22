import { _ as __nuxt_component_0 } from './AppPageHeader-CFOue3Zn.mjs';
import { _ as __nuxt_component_0$1 } from './AppButton-oAgfFzQm.mjs';
import { _ as __nuxt_component_1 } from './AppCard-T_GiUAp6.mjs';
import { mergeProps, withCtx, createTextVNode, createVNode, toDisplayString, withDirectives, openBlock, createBlock, Fragment, renderList, vModelSelect, vModelText, defineComponent, useSSRContext } from 'vue';
import { u as useAployApi } from './useAployApi-BEdJYRuf.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttr } from 'vue/server-renderer';
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
  name: "TriggersList",
  data() {
    return {
      triggers: [],
      pipelines: [],
      loading: true,
      error: "",
      showCreate: false,
      creating: false,
      createForm: {
        pipeline_id: "",
        name: "Webhook",
        type: "webhook",
        webhook_secret: ""
      }
    };
  },
  setup() {
    const { apiFetch } = useAployApi();
    return { apiFetch };
  },
  async mounted() {
    await Promise.all([this.loadTriggers(), this.loadPipelines()]);
  },
  methods: {
    async loadTriggers() {
      this.loading = true;
      this.error = "";
      try {
        const data = await this.apiFetch("/api/triggers");
        this.triggers = data.triggers || [];
      } catch (e) {
        this.error = e.message || "Failed to load triggers";
      } finally {
        this.loading = false;
      }
    },
    async loadPipelines() {
      try {
        const data = await this.apiFetch("/api/pipelines");
        this.pipelines = data.pipelines || [];
      } catch {
        this.pipelines = [];
      }
    },
    async onCreate() {
      if (!this.createForm.pipeline_id) return;
      this.creating = true;
      try {
        await this.apiFetch("/api/triggers", {
          method: "POST",
          body: {
            pipeline_id: this.createForm.pipeline_id,
            name: this.createForm.name || "Webhook",
            type: this.createForm.type,
            webhook_secret: this.createForm.webhook_secret || void 0
          }
        });
        this.showCreate = false;
        this.createForm = { pipeline_id: "", name: "Webhook", type: "webhook", webhook_secret: "" };
        await this.loadTriggers();
      } catch (e) {
        alert(e.message || "Create failed");
      } finally {
        this.creating = false;
      }
    },
    async deleteTrigger(id) {
      if (!confirm("Delete this trigger?")) return;
      try {
        await this.apiFetch(`/api/triggers/${id}`, { method: "DELETE" });
        await this.loadTriggers();
      } catch (e) {
        alert(e.message || "Delete failed");
      }
    }
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_AppPageHeader = __nuxt_component_0;
  const _component_AppButton = __nuxt_component_0$1;
  const _component_AppCard = __nuxt_component_1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "app-page" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_AppPageHeader, { title: "Triggers" }, {
    actions: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_AppButton, {
          onClick: ($event) => _ctx.showCreate = true
        }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`Create trigger`);
            } else {
              return [
                createTextVNode("Create trigger")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_AppButton, {
            onClick: ($event) => _ctx.showCreate = true
          }, {
            default: withCtx(() => [
              createTextVNode("Create trigger")
            ]),
            _: 1
          }, 8, ["onClick"])
        ];
      }
    }),
    _: 1
  }, _parent));
  if (_ctx.loading) {
    _push(`<p class="text-muted-foreground text-sm">Loading\u2026</p>`);
  } else if (_ctx.error) {
    _push(`<p class="app-error">${ssrInterpolate(_ctx.error)}</p>`);
  } else {
    _push(`<div class="space-y-2"><!--[-->`);
    ssrRenderList(_ctx.triggers, (t) => {
      _push(`<div class="rounded border border-border/50 bg-muted/30 px-4 py-3 flex flex-wrap items-center justify-between gap-2"><div><span class="font-medium">${ssrInterpolate(t.name)}</span><span class="text-muted-foreground text-sm ml-2">${ssrInterpolate(t.type)}</span><span class="text-muted-foreground text-sm ml-2">Pipeline ${ssrInterpolate(t.pipeline_id)}</span></div><div class="flex items-center gap-2">`);
      if (t.webhook_url) {
        _push(`<code class="text-xs bg-surface-overlay px-2 py-1 rounded break-all max-w-md text-zinc-800">${ssrInterpolate(t.webhook_url)}</code>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="button" class="text-destructive text-sm hover:underline">Delete</button></div></div>`);
    });
    _push(`<!--]-->`);
    if (!_ctx.loading && !_ctx.error && _ctx.triggers.length === 0) {
      _push(`<p class="text-muted-foreground text-sm"> No triggers. Create a webhook to run a pipeline from Zapier, cron, or your app. </p>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div>`);
  }
  if (_ctx.showCreate) {
    _push(ssrRenderComponent(_component_AppCard, { class: "mt-6" }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<h3 class="app-section-title mb-3"${_scopeId}>Create trigger</h3><div class="space-y-3"${_scopeId}><div${_scopeId}><label class="app-label"${_scopeId}>Pipeline</label><select class="app-select"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(_ctx.createForm.pipeline_id) ? ssrLooseContain(_ctx.createForm.pipeline_id, "") : ssrLooseEqual(_ctx.createForm.pipeline_id, "")) ? " selected" : ""}${_scopeId}>Select pipeline</option><!--[-->`);
          ssrRenderList(_ctx.pipelines, (p) => {
            _push2(`<option${ssrRenderAttr("value", p.id)}${ssrIncludeBooleanAttr(Array.isArray(_ctx.createForm.pipeline_id) ? ssrLooseContain(_ctx.createForm.pipeline_id, p.id) : ssrLooseEqual(_ctx.createForm.pipeline_id, p.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(p.name)}</option>`);
          });
          _push2(`<!--]--></select></div><div${_scopeId}><label class="app-label"${_scopeId}>Name</label><input${ssrRenderAttr("value", _ctx.createForm.name)} class="app-input" placeholder="Webhook"${_scopeId}></div><div${_scopeId}><label class="app-label"${_scopeId}>Type</label><select class="app-select"${_scopeId}><option value="webhook"${ssrIncludeBooleanAttr(Array.isArray(_ctx.createForm.type) ? ssrLooseContain(_ctx.createForm.type, "webhook") : ssrLooseEqual(_ctx.createForm.type, "webhook")) ? " selected" : ""}${_scopeId}>Webhook</option></select></div><div${_scopeId}><label class="app-label"${_scopeId}>Webhook secret (optional)</label><input${ssrRenderAttr("value", _ctx.createForm.webhook_secret)} class="app-input" type="password" placeholder="Set X-Webhook-Secret header"${_scopeId}></div><div class="flex gap-2"${_scopeId}>`);
          _push2(ssrRenderComponent(_component_AppButton, {
            disabled: _ctx.creating,
            onClick: _ctx.onCreate
          }, {
            default: withCtx((_2, _push3, _parent3, _scopeId2) => {
              if (_push3) {
                _push3(`${ssrInterpolate(_ctx.creating ? "Creating\u2026" : "Create")}`);
              } else {
                return [
                  createTextVNode(toDisplayString(_ctx.creating ? "Creating\u2026" : "Create"), 1)
                ];
              }
            }),
            _: 1
          }, _parent2, _scopeId));
          _push2(ssrRenderComponent(_component_AppButton, {
            variant: "secondary",
            onClick: ($event) => _ctx.showCreate = false
          }, {
            default: withCtx((_2, _push3, _parent3, _scopeId2) => {
              if (_push3) {
                _push3(`Cancel`);
              } else {
                return [
                  createTextVNode("Cancel")
                ];
              }
            }),
            _: 1
          }, _parent2, _scopeId));
          _push2(`</div></div>`);
        } else {
          return [
            createVNode("h3", { class: "app-section-title mb-3" }, "Create trigger"),
            createVNode("div", { class: "space-y-3" }, [
              createVNode("div", null, [
                createVNode("label", { class: "app-label" }, "Pipeline"),
                withDirectives(createVNode("select", {
                  "onUpdate:modelValue": ($event) => _ctx.createForm.pipeline_id = $event,
                  class: "app-select"
                }, [
                  createVNode("option", { value: "" }, "Select pipeline"),
                  (openBlock(true), createBlock(Fragment, null, renderList(_ctx.pipelines, (p) => {
                    return openBlock(), createBlock("option", {
                      key: p.id,
                      value: p.id
                    }, toDisplayString(p.name), 9, ["value"]);
                  }), 128))
                ], 8, ["onUpdate:modelValue"]), [
                  [vModelSelect, _ctx.createForm.pipeline_id]
                ])
              ]),
              createVNode("div", null, [
                createVNode("label", { class: "app-label" }, "Name"),
                withDirectives(createVNode("input", {
                  "onUpdate:modelValue": ($event) => _ctx.createForm.name = $event,
                  class: "app-input",
                  placeholder: "Webhook"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, _ctx.createForm.name]
                ])
              ]),
              createVNode("div", null, [
                createVNode("label", { class: "app-label" }, "Type"),
                withDirectives(createVNode("select", {
                  "onUpdate:modelValue": ($event) => _ctx.createForm.type = $event,
                  class: "app-select"
                }, [
                  createVNode("option", { value: "webhook" }, "Webhook")
                ], 8, ["onUpdate:modelValue"]), [
                  [vModelSelect, _ctx.createForm.type]
                ])
              ]),
              createVNode("div", null, [
                createVNode("label", { class: "app-label" }, "Webhook secret (optional)"),
                withDirectives(createVNode("input", {
                  "onUpdate:modelValue": ($event) => _ctx.createForm.webhook_secret = $event,
                  class: "app-input",
                  type: "password",
                  placeholder: "Set X-Webhook-Secret header"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, _ctx.createForm.webhook_secret]
                ])
              ]),
              createVNode("div", { class: "flex gap-2" }, [
                createVNode(_component_AppButton, {
                  disabled: _ctx.creating,
                  onClick: _ctx.onCreate
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(_ctx.creating ? "Creating\u2026" : "Create"), 1)
                  ]),
                  _: 1
                }, 8, ["disabled", "onClick"]),
                createVNode(_component_AppButton, {
                  variant: "secondary",
                  onClick: ($event) => _ctx.showCreate = false
                }, {
                  default: withCtx(() => [
                    createTextVNode("Cancel")
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])
            ])
          ];
        }
      }),
      _: 1
    }, _parent));
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/triggers/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { index as default };
//# sourceMappingURL=index-CsU1oxMO.mjs.map
