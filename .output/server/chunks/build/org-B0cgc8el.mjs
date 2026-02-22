import { _ as __nuxt_component_0 } from './AppPageHeader-CFOue3Zn.mjs';
import { _ as __nuxt_component_1 } from './AppCard-T_GiUAp6.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-D0qNmuHi.mjs';
import { _ as __nuxt_component_0$2 } from './AppButton-oAgfFzQm.mjs';
import { mergeProps, withCtx, createTextVNode, createVNode, openBlock, createBlock, toDisplayString, createCommentVNode, Fragment, renderList, withDirectives, vModelText, defineComponent, useSSRContext } from 'vue';
import { u as useAployApi } from './useAployApi-BEdJYRuf.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
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
  name: "OrgPage",
  data() {
    return {
      org: null,
      loadingOrg: true,
      apiKeys: [],
      loadingKeys: true,
      showCreateKey: false,
      newKeyName: "",
      creatingKey: false,
      newKeyRaw: ""
    };
  },
  setup() {
    const { apiFetch } = useAployApi();
    return { apiFetch };
  },
  async mounted() {
    await Promise.all([this.loadOrg(), this.loadApiKeys()]);
  },
  methods: {
    async loadOrg() {
      this.loadingOrg = true;
      try {
        this.org = await this.apiFetch("/api/org");
      } catch {
        this.org = null;
      } finally {
        this.loadingOrg = false;
      }
    },
    async loadApiKeys() {
      this.loadingKeys = true;
      try {
        const data = await this.apiFetch("/api/org/api-keys");
        this.apiKeys = data.api_keys || [];
      } catch {
        this.apiKeys = [];
      } finally {
        this.loadingKeys = false;
      }
    },
    formatDate(iso) {
      try {
        return new Date(iso).toLocaleDateString();
      } catch {
        return iso;
      }
    },
    async createApiKey() {
      if (!this.newKeyName.trim()) return;
      this.creatingKey = true;
      try {
        const data = await this.apiFetch("/api/org/api-keys", {
          method: "POST",
          body: { name: this.newKeyName.trim() }
        });
        this.newKeyRaw = data.raw_key;
        this.showCreateKey = false;
        this.newKeyName = "";
        await this.loadApiKeys();
      } catch (e) {
        alert(e.message || "Create failed");
      } finally {
        this.creatingKey = false;
      }
    },
    copyKeyThenClose() {
      if (this.newKeyRaw && false) ;
      this.newKeyRaw = "";
    },
    async revokeApiKey(id) {
      if (!confirm("Revoke this API key? It will stop working immediately.")) return;
      try {
        await this.apiFetch(`/api/org/api-keys/${id}`, { method: "DELETE" });
        await this.loadApiKeys();
      } catch (e) {
        alert(e.message || "Revoke failed");
      }
    }
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_AppPageHeader = __nuxt_component_0;
  const _component_AppCard = __nuxt_component_1;
  const _component_NuxtLink = __nuxt_component_0$1;
  const _component_AppButton = __nuxt_component_0$2;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "app-page" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_AppPageHeader, { title: "Organization" }, null, _parent));
  _push(`<div class="space-y-4">`);
  _push(ssrRenderComponent(_component_AppCard, null, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<h3 class="app-section-title mb-1"${_scopeId}>General</h3>`);
        if (_ctx.org) {
          _push2(`<p class="app-section-description"${_scopeId}> Name: ${ssrInterpolate(_ctx.org.name)}. Slug: ${ssrInterpolate(_ctx.org.slug)}. </p>`);
        } else if (_ctx.loadingOrg) {
          _push2(`<p class="text-muted-foreground text-sm"${_scopeId}>Loading\u2026</p>`);
        } else {
          _push2(`<!---->`);
        }
        _push2(`<p class="text-sm text-muted-foreground mt-3"${_scopeId}> Manage S3, GCS, and Hugging Face in `);
        _push2(ssrRenderComponent(_component_NuxtLink, {
          to: "/app/integrations",
          class: "text-accent hover:text-accent-hover transition-colors"
        }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`Integrations`);
            } else {
              return [
                createTextVNode("Integrations")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(`. </p>`);
      } else {
        return [
          createVNode("h3", { class: "app-section-title mb-1" }, "General"),
          _ctx.org ? (openBlock(), createBlock("p", {
            key: 0,
            class: "app-section-description"
          }, " Name: " + toDisplayString(_ctx.org.name) + ". Slug: " + toDisplayString(_ctx.org.slug) + ". ", 1)) : _ctx.loadingOrg ? (openBlock(), createBlock("p", {
            key: 1,
            class: "text-muted-foreground text-sm"
          }, "Loading\u2026")) : createCommentVNode("", true),
          createVNode("p", { class: "text-sm text-muted-foreground mt-3" }, [
            createTextVNode(" Manage S3, GCS, and Hugging Face in "),
            createVNode(_component_NuxtLink, {
              to: "/app/integrations",
              class: "text-accent hover:text-accent-hover transition-colors"
            }, {
              default: withCtx(() => [
                createTextVNode("Integrations")
              ]),
              _: 1
            }),
            createTextVNode(". ")
          ])
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_AppCard, null, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<h3 class="app-section-title mb-4"${_scopeId}>API keys</h3>`);
        if (_ctx.loadingKeys) {
          _push2(`<p class="text-muted-foreground text-sm"${_scopeId}>Loading\u2026</p>`);
        } else {
          _push2(`<ul class="space-y-2"${_scopeId}><!--[-->`);
          ssrRenderList(_ctx.apiKeys, (k) => {
            _push2(`<li class="flex items-center justify-between gap-2 rounded border border-border/50 bg-muted/30 px-3 py-2 text-sm"${_scopeId}><span class="text-foreground"${_scopeId}>${ssrInterpolate(k.name)}</span><span class="font-mono text-muted-foreground"${_scopeId}>${ssrInterpolate(k.key_prefix)}\u2026</span><span class="text-muted-foreground text-xs"${_scopeId}>${ssrInterpolate(k.last_used_at ? "Used " + _ctx.formatDate(k.last_used_at) : "Never used")}</span><button type="button" class="text-destructive hover:underline"${_scopeId}> Revoke </button></li>`);
          });
          _push2(`<!--]-->`);
          if (!_ctx.loadingKeys && _ctx.apiKeys.length === 0) {
            _push2(`<p class="text-muted-foreground text-sm"${_scopeId}> No API keys. Create one to call invoke APIs from scripts or external apps. </p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</ul>`);
        }
        if (_ctx.showCreateKey) {
          _push2(`<div class="mt-4 space-y-2 border-t border-border/50 pt-4"${_scopeId}><label class="app-label"${_scopeId}>Key name</label><input${ssrRenderAttr("value", _ctx.newKeyName)} class="app-input" placeholder="e.g. Production"${_scopeId}><div class="flex gap-2"${_scopeId}>`);
          _push2(ssrRenderComponent(_component_AppButton, {
            disabled: _ctx.creatingKey,
            onClick: _ctx.createApiKey
          }, {
            default: withCtx((_2, _push3, _parent3, _scopeId2) => {
              if (_push3) {
                _push3(`${ssrInterpolate(_ctx.creatingKey ? "Creating\u2026" : "Create key")}`);
              } else {
                return [
                  createTextVNode(toDisplayString(_ctx.creatingKey ? "Creating\u2026" : "Create key"), 1)
                ];
              }
            }),
            _: 1
          }, _parent2, _scopeId));
          _push2(ssrRenderComponent(_component_AppButton, {
            variant: "secondary",
            onClick: ($event) => {
              _ctx.showCreateKey = false;
              _ctx.newKeyName = "";
            }
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
          _push2(`<!---->`);
        }
        if (_ctx.newKeyRaw) {
          _push2(`<div class="mt-4 rounded border border-amber-500/50 bg-amber-500/10 p-3 text-sm"${_scopeId}><p class="font-medium text-amber-700 dark:text-amber-400"${_scopeId}>Copy your key now. It won\u2019t be shown again.</p><code class="mt-2 block break-all font-mono text-xs"${_scopeId}>${ssrInterpolate(_ctx.newKeyRaw)}</code>`);
          _push2(ssrRenderComponent(_component_AppButton, {
            class: "mt-2",
            variant: "secondary",
            size: "sm",
            onClick: _ctx.copyKeyThenClose
          }, {
            default: withCtx((_2, _push3, _parent3, _scopeId2) => {
              if (_push3) {
                _push3(`Copy and close`);
              } else {
                return [
                  createTextVNode("Copy and close")
                ];
              }
            }),
            _: 1
          }, _parent2, _scopeId));
          _push2(`</div>`);
        } else if (!_ctx.showCreateKey) {
          _push2(ssrRenderComponent(_component_AppButton, {
            class: "mt-4",
            variant: "secondary",
            onClick: ($event) => _ctx.showCreateKey = true
          }, {
            default: withCtx((_2, _push3, _parent3, _scopeId2) => {
              if (_push3) {
                _push3(` Create API key `);
              } else {
                return [
                  createTextVNode(" Create API key ")
                ];
              }
            }),
            _: 1
          }, _parent2, _scopeId));
        } else {
          _push2(`<!---->`);
        }
      } else {
        return [
          createVNode("h3", { class: "app-section-title mb-4" }, "API keys"),
          _ctx.loadingKeys ? (openBlock(), createBlock("p", {
            key: 0,
            class: "text-muted-foreground text-sm"
          }, "Loading\u2026")) : (openBlock(), createBlock("ul", {
            key: 1,
            class: "space-y-2"
          }, [
            (openBlock(true), createBlock(Fragment, null, renderList(_ctx.apiKeys, (k) => {
              return openBlock(), createBlock("li", {
                key: k.id,
                class: "flex items-center justify-between gap-2 rounded border border-border/50 bg-muted/30 px-3 py-2 text-sm"
              }, [
                createVNode("span", { class: "text-foreground" }, toDisplayString(k.name), 1),
                createVNode("span", { class: "font-mono text-muted-foreground" }, toDisplayString(k.key_prefix) + "\u2026", 1),
                createVNode("span", { class: "text-muted-foreground text-xs" }, toDisplayString(k.last_used_at ? "Used " + _ctx.formatDate(k.last_used_at) : "Never used"), 1),
                createVNode("button", {
                  type: "button",
                  class: "text-destructive hover:underline",
                  onClick: ($event) => _ctx.revokeApiKey(k.id)
                }, " Revoke ", 8, ["onClick"])
              ]);
            }), 128)),
            !_ctx.loadingKeys && _ctx.apiKeys.length === 0 ? (openBlock(), createBlock("p", {
              key: 0,
              class: "text-muted-foreground text-sm"
            }, " No API keys. Create one to call invoke APIs from scripts or external apps. ")) : createCommentVNode("", true)
          ])),
          _ctx.showCreateKey ? (openBlock(), createBlock("div", {
            key: 2,
            class: "mt-4 space-y-2 border-t border-border/50 pt-4"
          }, [
            createVNode("label", { class: "app-label" }, "Key name"),
            withDirectives(createVNode("input", {
              "onUpdate:modelValue": ($event) => _ctx.newKeyName = $event,
              class: "app-input",
              placeholder: "e.g. Production"
            }, null, 8, ["onUpdate:modelValue"]), [
              [vModelText, _ctx.newKeyName]
            ]),
            createVNode("div", { class: "flex gap-2" }, [
              createVNode(_component_AppButton, {
                disabled: _ctx.creatingKey,
                onClick: _ctx.createApiKey
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(_ctx.creatingKey ? "Creating\u2026" : "Create key"), 1)
                ]),
                _: 1
              }, 8, ["disabled", "onClick"]),
              createVNode(_component_AppButton, {
                variant: "secondary",
                onClick: ($event) => {
                  _ctx.showCreateKey = false;
                  _ctx.newKeyName = "";
                }
              }, {
                default: withCtx(() => [
                  createTextVNode("Cancel")
                ]),
                _: 1
              }, 8, ["onClick"])
            ])
          ])) : createCommentVNode("", true),
          _ctx.newKeyRaw ? (openBlock(), createBlock("div", {
            key: 3,
            class: "mt-4 rounded border border-amber-500/50 bg-amber-500/10 p-3 text-sm"
          }, [
            createVNode("p", { class: "font-medium text-amber-700 dark:text-amber-400" }, "Copy your key now. It won\u2019t be shown again."),
            createVNode("code", { class: "mt-2 block break-all font-mono text-xs" }, toDisplayString(_ctx.newKeyRaw), 1),
            createVNode(_component_AppButton, {
              class: "mt-2",
              variant: "secondary",
              size: "sm",
              onClick: _ctx.copyKeyThenClose
            }, {
              default: withCtx(() => [
                createTextVNode("Copy and close")
              ]),
              _: 1
            }, 8, ["onClick"])
          ])) : !_ctx.showCreateKey ? (openBlock(), createBlock(_component_AppButton, {
            key: 4,
            class: "mt-4",
            variant: "secondary",
            onClick: ($event) => _ctx.showCreateKey = true
          }, {
            default: withCtx(() => [
              createTextVNode(" Create API key ")
            ]),
            _: 1
          }, 8, ["onClick"])) : createCommentVNode("", true)
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/org.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const org = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { org as default };
//# sourceMappingURL=org-B0cgc8el.mjs.map
