import { _ as __nuxt_component_0 } from './AppPageHeader-CFOue3Zn.mjs';
import { _ as __nuxt_component_1 } from './AppCard-T_GiUAp6.mjs';
import { _ as __nuxt_component_0$1 } from './AppButton-oAgfFzQm.mjs';
import { mergeProps, withCtx, createTextVNode, toDisplayString, createVNode, withDirectives, openBlock, createBlock, Fragment, renderList, vModelSelect, vModelText, createCommentVNode, defineComponent, useSSRContext } from 'vue';
import { a as useRuntimeConfig } from './server.mjs';
import { u as useAployApi } from './useAployApi-BEdJYRuf.mjs';
import { u as useMockMode } from './useMockMode-j3YD3gix.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
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
import './useEnvironment-BnZbXQTt.mjs';
import './useMockApi-CJyUoVJj.mjs';

const _sfc_main = defineComponent({
  name: "ApiExplorer",
  data() {
    return {
      deployments: [],
      loading: true,
      selectedDeploymentId: "",
      requestBody: '{"messages": [{"role": "user", "content": "Hello"}], "max_tokens": 128}',
      apiKey: "",
      sending: false,
      response: null,
      responseStatus: null,
      responseTime: null
    };
  },
  computed: {
    invokeUrl() {
      const config = useRuntimeConfig();
      const apiUrl = config.public.apiUrl || "http://localhost:4000";
      if (!this.selectedDeploymentId) return apiUrl + "/v1/deployments/:id/invoke";
      return `${apiUrl.replace(/\/$/, "")}/v1/deployments/${this.selectedDeploymentId}/invoke`;
    },
    responseText() {
      if (this.response === null) return "";
      try {
        return JSON.stringify(JSON.parse(this.response), null, 2);
      } catch {
        return this.response;
      }
    },
    statusClass() {
      if (this.responseStatus === null) return "";
      if (this.responseStatus >= 200 && this.responseStatus < 300) return "text-emerald-600";
      if (this.responseStatus >= 400) return "text-destructive";
      return "text-amber-600";
    }
  },
  async mounted() {
    await this.loadDeployments();
  },
  methods: {
    async loadDeployments() {
      this.loading = true;
      try {
        const data = await this.apiFetch("/api/deploy");
        this.deployments = data.deployments || [];
        if (this.deployments.length && !this.selectedDeploymentId) {
          this.selectedDeploymentId = this.deployments[0].id;
        }
      } catch {
        this.deployments = [];
      } finally {
        this.loading = false;
      }
    },
    async sendRequest() {
      var _a, _b, _c, _d, _e;
      if (!this.selectedDeploymentId) return;
      let body;
      try {
        body = this.requestBody.trim() ? JSON.parse(this.requestBody) : {};
      } catch {
        this.response = "Invalid JSON in request body";
        this.responseStatus = 0;
        this.responseTime = null;
        return;
      }
      this.sending = true;
      this.response = null;
      this.responseStatus = null;
      this.responseTime = null;
      const start = Date.now();
      try {
        if ((_a = this.mockMode) == null ? void 0 : _a.value) {
          await new Promise((r) => setTimeout(r, 300));
          this.responseStatus = 200;
          this.response = JSON.stringify({ choices: [{ message: { role: "assistant", content: "Mock response from deployed model." } }] }, null, 2);
          this.responseTime = Date.now() - start;
          this.sending = false;
          return;
        }
        const config = useRuntimeConfig();
        const apiUrl = config.public.apiUrl || "http://localhost:4000";
        const url = `${apiUrl.replace(/\/$/, "")}/v1/deployments/${this.selectedDeploymentId}/invoke`;
        const headers = {
          "Content-Type": "application/json",
          "X-Environment": (_c = (_b = this.environment) == null ? void 0 : _b.value) != null ? _c : "production"
        };
        if (this.apiKey.trim()) headers.Authorization = `Bearer ${this.apiKey.trim()}`;
        const res = await $fetch(url, {
          method: "POST",
          body,
          credentials: this.apiKey.trim() ? "omit" : "include",
          headers
        });
        this.responseStatus = 200;
        this.response = typeof res === "string" ? res : JSON.stringify(res);
      } catch (e) {
        const err = e;
        this.responseStatus = (_e = (_d = err.response) == null ? void 0 : _d.status) != null ? _e : 0;
        this.response = err.data != null ? JSON.stringify(err.data, null, 2) : e.message;
      } finally {
        this.responseTime = Date.now() - start;
        this.sending = false;
      }
    },
    copyCurl() {
      let body;
      try {
        body = this.requestBody.trim() ? JSON.stringify(JSON.parse(this.requestBody)) : "{}";
      } catch {
        body = "{}";
      }
      const auth = this.apiKey.trim() ? ` -H "Authorization: Bearer ${this.apiKey.trim()}"` : "";
      const curl = `curl -X POST "${this.invokeUrl}" -H "Content-Type: application/json"${auth} -d '${body}'`;
      try {
        const ta = (void 0).createElement("textarea");
        ta.value = curl;
        (void 0).body.appendChild(ta);
        ta.select();
        (void 0).execCommand("copy");
        (void 0).body.removeChild(ta);
      } catch {
      }
    }
  },
  setup() {
    const { apiFetch, apiUrl, environment } = useAployApi();
    const { mockMode } = useMockMode();
    return { apiFetch, apiUrl, environment, mockMode };
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_AppPageHeader = __nuxt_component_0;
  const _component_AppCard = __nuxt_component_1;
  const _component_AppButton = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "app-page" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_AppPageHeader, {
    title: "API Explorer",
    description: "Try your deployed model. Send a request and see the response."
  }, null, _parent));
  _push(`<div class="space-y-4">`);
  _push(ssrRenderComponent(_component_AppCard, null, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<h3 class="app-section-title mb-3"${_scopeId}>Request</h3><div class="space-y-3"${_scopeId}><div${_scopeId}><label class="app-label"${_scopeId}>Deployment (trained model)</label><select class="app-select"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(_ctx.selectedDeploymentId) ? ssrLooseContain(_ctx.selectedDeploymentId, "") : ssrLooseEqual(_ctx.selectedDeploymentId, "")) ? " selected" : ""}${_scopeId}>Select a deployment</option><!--[-->`);
        ssrRenderList(_ctx.deployments, (d) => {
          _push2(`<option${ssrRenderAttr("value", d.id)}${ssrIncludeBooleanAttr(Array.isArray(_ctx.selectedDeploymentId) ? ssrLooseContain(_ctx.selectedDeploymentId, d.id) : ssrLooseEqual(_ctx.selectedDeploymentId, d.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(d.id)} \u2014 ${ssrInterpolate(d.model_version_id)} (${ssrInterpolate(d.status)}) </option>`);
        });
        _push2(`<!--]--></select></div><div${_scopeId}><label class="app-label"${_scopeId}>API key (optional \u2014 leave blank to use session)</label><input${ssrRenderAttr("value", _ctx.apiKey)} class="app-input font-mono text-sm" type="password" placeholder="aploy_..."${_scopeId}></div><div${_scopeId}><label class="app-label"${_scopeId}>URL</label><p class="font-mono text-sm text-muted-foreground break-all"${_scopeId}>${ssrInterpolate(_ctx.invokeUrl)}</p></div><div${_scopeId}><label class="app-label"${_scopeId}>Request body (JSON)</label><textarea class="app-input min-h-[180px] font-mono text-sm" placeholder="{&quot;messages&quot;: [{&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;Hello&quot;}], &quot;max_tokens&quot;: 128}"${_scopeId}>${ssrInterpolate(_ctx.requestBody)}</textarea></div><div class="flex flex-wrap gap-2"${_scopeId}>`);
        _push2(ssrRenderComponent(_component_AppButton, {
          disabled: !_ctx.selectedDeploymentId || _ctx.sending,
          onClick: _ctx.sendRequest
        }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`${ssrInterpolate(_ctx.sending ? "Sending\u2026" : "Send")}`);
            } else {
              return [
                createTextVNode(toDisplayString(_ctx.sending ? "Sending\u2026" : "Send"), 1)
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_AppButton, {
          variant: "secondary",
          disabled: !_ctx.invokeUrl,
          onClick: _ctx.copyCurl
        }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(` Copy as cURL `);
            } else {
              return [
                createTextVNode(" Copy as cURL ")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(`</div></div>`);
      } else {
        return [
          createVNode("h3", { class: "app-section-title mb-3" }, "Request"),
          createVNode("div", { class: "space-y-3" }, [
            createVNode("div", null, [
              createVNode("label", { class: "app-label" }, "Deployment (trained model)"),
              withDirectives(createVNode("select", {
                "onUpdate:modelValue": ($event) => _ctx.selectedDeploymentId = $event,
                class: "app-select"
              }, [
                createVNode("option", { value: "" }, "Select a deployment"),
                (openBlock(true), createBlock(Fragment, null, renderList(_ctx.deployments, (d) => {
                  return openBlock(), createBlock("option", {
                    key: d.id,
                    value: d.id
                  }, toDisplayString(d.id) + " \u2014 " + toDisplayString(d.model_version_id) + " (" + toDisplayString(d.status) + ") ", 9, ["value"]);
                }), 128))
              ], 8, ["onUpdate:modelValue"]), [
                [vModelSelect, _ctx.selectedDeploymentId]
              ])
            ]),
            createVNode("div", null, [
              createVNode("label", { class: "app-label" }, "API key (optional \u2014 leave blank to use session)"),
              withDirectives(createVNode("input", {
                "onUpdate:modelValue": ($event) => _ctx.apiKey = $event,
                class: "app-input font-mono text-sm",
                type: "password",
                placeholder: "aploy_..."
              }, null, 8, ["onUpdate:modelValue"]), [
                [vModelText, _ctx.apiKey]
              ])
            ]),
            createVNode("div", null, [
              createVNode("label", { class: "app-label" }, "URL"),
              createVNode("p", { class: "font-mono text-sm text-muted-foreground break-all" }, toDisplayString(_ctx.invokeUrl), 1)
            ]),
            createVNode("div", null, [
              createVNode("label", { class: "app-label" }, "Request body (JSON)"),
              withDirectives(createVNode("textarea", {
                "onUpdate:modelValue": ($event) => _ctx.requestBody = $event,
                class: "app-input min-h-[180px] font-mono text-sm",
                placeholder: '{"messages": [{"role": "user", "content": "Hello"}], "max_tokens": 128}'
              }, null, 8, ["onUpdate:modelValue"]), [
                [vModelText, _ctx.requestBody]
              ])
            ]),
            createVNode("div", { class: "flex flex-wrap gap-2" }, [
              createVNode(_component_AppButton, {
                disabled: !_ctx.selectedDeploymentId || _ctx.sending,
                onClick: _ctx.sendRequest
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(_ctx.sending ? "Sending\u2026" : "Send"), 1)
                ]),
                _: 1
              }, 8, ["disabled", "onClick"]),
              createVNode(_component_AppButton, {
                variant: "secondary",
                disabled: !_ctx.invokeUrl,
                onClick: _ctx.copyCurl
              }, {
                default: withCtx(() => [
                  createTextVNode(" Copy as cURL ")
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ])
          ])
        ];
      }
    }),
    _: 1
  }, _parent));
  if (_ctx.response !== null) {
    _push(ssrRenderComponent(_component_AppCard, null, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<h3 class="app-section-title mb-2"${_scopeId}>Response</h3><p class="text-sm text-muted-foreground mb-2"${_scopeId}> Status: <span class="${ssrRenderClass(_ctx.statusClass)}"${_scopeId}>${ssrInterpolate(_ctx.responseStatus)}</span>`);
          if (_ctx.responseTime !== null) {
            _push2(`<span class="ml-2"${_scopeId}>\xB7 ${ssrInterpolate(_ctx.responseTime)} ms</span>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</p><pre class="rounded bg-muted/50 p-3 text-xs overflow-auto max-h-[400px]"${_scopeId}>${ssrInterpolate(_ctx.responseText)}</pre>`);
        } else {
          return [
            createVNode("h3", { class: "app-section-title mb-2" }, "Response"),
            createVNode("p", { class: "text-sm text-muted-foreground mb-2" }, [
              createTextVNode(" Status: "),
              createVNode("span", { class: _ctx.statusClass }, toDisplayString(_ctx.responseStatus), 3),
              _ctx.responseTime !== null ? (openBlock(), createBlock("span", {
                key: 0,
                class: "ml-2"
              }, "\xB7 " + toDisplayString(_ctx.responseTime) + " ms", 1)) : createCommentVNode("", true)
            ]),
            createVNode("pre", { class: "rounded bg-muted/50 p-3 text-xs overflow-auto max-h-[400px]" }, toDisplayString(_ctx.responseText), 1)
          ];
        }
      }),
      _: 1
    }, _parent));
  } else {
    _push(`<!---->`);
  }
  _push(`</div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/api-explorer.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const apiExplorer = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { apiExplorer as default };
//# sourceMappingURL=api-explorer-DE7tGIc9.mjs.map
