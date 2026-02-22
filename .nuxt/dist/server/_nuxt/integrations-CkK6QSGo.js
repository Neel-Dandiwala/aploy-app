import { _ as __nuxt_component_0 } from "./AppPageHeader-CFOue3Zn.js";
import { _ as __nuxt_component_1 } from "./AppCard-T_GiUAp6.js";
import { _ as __nuxt_component_0$1 } from "./AppButton-oAgfFzQm.js";
import { defineComponent, mergeProps, withCtx, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, Fragment, renderList, createCommentVNode, withModifiers, withDirectives, vModelText, useSSRContext } from "vue";
import "/Users/neeldandiwala/Projects/aploy/aploy-app/node_modules/hookable/dist/index.mjs";
import { u as useAployApi } from "./useAployApi-BEdJYRuf.js";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderAttr } from "vue/server-renderer";
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
const INTEGRATION_TYPES = [
  {
    type: "s3",
    title: "S3 (AWS)",
    description: "For datasets and knowledge base ingestion from S3 buckets.",
    placeholder: "e.g. AWS prod"
  },
  {
    type: "gcs",
    title: "GCS (Google Cloud)",
    description: "For datasets and knowledge base ingestion from Google Cloud Storage.",
    placeholder: "e.g. GCP prod"
  },
  {
    type: "hf",
    title: "Hugging Face",
    description: "For datasets from Hugging Face and model access.",
    placeholder: "e.g. HF token"
  }
];
const _sfc_main = defineComponent({
  name: "IntegrationsPage",
  data() {
    return {
      integrationTypes: INTEGRATION_TYPES,
      credentials: [],
      loading: true,
      addLoading: false,
      testingId: null,
      addingType: null,
      addForms: {
        s3: {
          name: "",
          s3AccessKeyId: "",
          s3SecretAccessKey: "",
          s3Region: ""
        },
        gcs: {
          name: "",
          gcsJson: ""
        },
        hf: {
          name: "",
          hfToken: ""
        }
      }
    };
  },
  computed: {
    credentialsByType() {
      const byType = { s3: [], gcs: [], hf: [] };
      this.credentials.forEach((c) => {
        if (byType[c.type]) byType[c.type].push(c);
      });
      return byType;
    }
  },
  setup() {
    const { apiFetch } = useAployApi();
    return { apiFetch };
  },
  async mounted() {
    await this.loadCredentials();
  },
  methods: {
    formatDate(iso) {
      try {
        return new Date(iso).toLocaleDateString();
      } catch {
        return iso;
      }
    },
    async loadCredentials() {
      this.loading = true;
      try {
        const data = await this.apiFetch("/api/org/credentials");
        this.credentials = data.credentials || [];
      } catch {
        this.credentials = [];
      } finally {
        this.loading = false;
      }
    },
    async testCredential(id) {
      this.testingId = id;
      try {
        await this.apiFetch(`/api/org/credentials/${id}/test`, { method: "POST" });
        await this.loadCredentials();
      } finally {
        this.testingId = null;
      }
    },
    async deleteCredential(id) {
      if (!confirm("Delete this credential?")) return;
      try {
        await this.apiFetch(`/api/org/credentials/${id}`, { method: "DELETE" });
        await this.loadCredentials();
      } catch (e) {
        alert(e.message || "Delete failed");
      }
    },
    async onAddCredential(type) {
      const payload = {};
      const form = this.addForms[type];
      if (type === "s3") {
        payload.s3 = {
          accessKeyId: form.s3AccessKeyId,
          secretAccessKey: form.s3SecretAccessKey,
          region: form.s3Region || void 0
        };
      } else if (type === "gcs") {
        try {
          payload.gcs = { serviceAccountKey: JSON.parse(form.gcsJson || "{}") };
        } catch {
          alert("Invalid JSON for GCS service account");
          return;
        }
      } else {
        payload.hf = { token: form.hfToken };
      }
      const name = form.name || "Unnamed";
      this.addLoading = true;
      try {
        await this.apiFetch("/api/org/credentials", {
          method: "POST",
          body: { name: name || "Unnamed", type, payload }
        });
        this.addingType = null;
        this.addForms.s3 = { name: "", s3AccessKeyId: "", s3SecretAccessKey: "", s3Region: "" };
        this.addForms.gcs = { name: "", gcsJson: "" };
        this.addForms.hf = { name: "", hfToken: "" };
        await this.loadCredentials();
      } catch (e) {
        alert(e.message || "Add failed");
      } finally {
        this.addLoading = false;
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
    title: "Integrations",
    description: "Connect S3, GCS, and Hugging Face. Credentials are used for datasets and knowledge base ingestion."
  }, null, _parent));
  if (_ctx.loading) {
    _push(`<p class="text-muted-foreground text-sm">Loading…</p>`);
  } else {
    _push(`<div class="space-y-6"><!--[-->`);
    ssrRenderList(_ctx.integrationTypes, (integration) => {
      _push(ssrRenderComponent(_component_AppCard, {
        key: integration.type,
        class: "space-y-4"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><h3 class="app-section-title"${_scopeId}>${ssrInterpolate(integration.title)}</h3><p class="app-section-description mt-1"${_scopeId}>${ssrInterpolate(integration.description)}</p></div><ul class="space-y-2"${_scopeId}><!--[-->`);
            ssrRenderList(_ctx.credentialsByType[integration.type], (c) => {
              _push2(`<li class="flex items-center justify-between gap-2 rounded border border-border/50 bg-muted/30 px-3 py-2 text-sm"${_scopeId}><span class="text-foreground"${_scopeId}>${ssrInterpolate(c.name)}</span><span class="${ssrRenderClass({
                "text-emerald-600": c.status === "ok",
                "text-amber-600": c.status === "pending",
                "text-destructive": c.status === "error"
              })}"${_scopeId}>${ssrInterpolate(c.status)}</span><span class="text-muted-foreground text-xs"${_scopeId}>${ssrInterpolate(c.last_tested_at ? "Tested " + _ctx.formatDate(c.last_tested_at) : "Not tested")}</span><div class="flex gap-2"${_scopeId}><button type="button" class="text-primary hover:underline"${ssrIncludeBooleanAttr(_ctx.testingId === c.id) ? " disabled" : ""}${_scopeId}>${ssrInterpolate(_ctx.testingId === c.id ? "Testing…" : "Test")}</button><button type="button" class="text-destructive hover:underline"${_scopeId}> Delete </button></div></li>`);
            });
            _push2(`<!--]-->`);
            if (_ctx.credentialsByType[integration.type].length === 0 && _ctx.addingType !== integration.type) {
              _push2(`<p class="text-muted-foreground text-sm"${_scopeId}> No credentials yet. </p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</ul>`);
            if (_ctx.addingType === integration.type) {
              _push2(`<form class="space-y-3 rounded border border-border/50 bg-muted/20 p-4"${_scopeId}><div${_scopeId}><label class="app-label"${_scopeId}>Name</label><input${ssrRenderAttr("value", _ctx.addForms[integration.type].name)} class="app-input"${ssrRenderAttr("placeholder", integration.placeholder)}${_scopeId}></div>`);
              if (integration.type === "s3") {
                _push2(`<!--[--><div${_scopeId}><label class="app-label"${_scopeId}>Access Key ID</label><input${ssrRenderAttr("value", _ctx.addForms.s3.s3AccessKeyId)} class="app-input" type="text"${_scopeId}></div><div${_scopeId}><label class="app-label"${_scopeId}>Secret Access Key</label><input${ssrRenderAttr("value", _ctx.addForms.s3.s3SecretAccessKey)} class="app-input" type="password"${_scopeId}></div><div${_scopeId}><label class="app-label"${_scopeId}>Region (optional)</label><input${ssrRenderAttr("value", _ctx.addForms.s3.s3Region)} class="app-input" placeholder="us-east-1"${_scopeId}></div><!--]-->`);
              } else if (integration.type === "gcs") {
                _push2(`<div${_scopeId}><label class="app-label"${_scopeId}>Service account JSON (paste full JSON)</label><textarea class="app-input min-h-[120px] font-mono text-sm" placeholder="{&quot;type&quot;:&quot;service_account&quot;,...}"${_scopeId}>${ssrInterpolate(_ctx.addForms.gcs.gcsJson)}</textarea></div>`);
              } else if (integration.type === "hf") {
                _push2(`<div${_scopeId}><label class="app-label"${_scopeId}>Hugging Face token</label><input${ssrRenderAttr("value", _ctx.addForms.hf.hfToken)} class="app-input" type="password" placeholder="hf_..."${_scopeId}></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="flex gap-2"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_AppButton, {
                type: "submit",
                disabled: _ctx.addLoading
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(_ctx.addLoading ? "Adding…" : "Add credential")}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(_ctx.addLoading ? "Adding…" : "Add credential"), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_AppButton, {
                variant: "secondary",
                type: "button",
                onClick: ($event) => _ctx.addingType = null
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Cancel `);
                  } else {
                    return [
                      createTextVNode(" Cancel ")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</div></form>`);
            } else {
              _push2(ssrRenderComponent(_component_AppButton, {
                variant: "secondary",
                onClick: ($event) => _ctx.addingType = integration.type
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Add ${ssrInterpolate(integration.title)} credential `);
                  } else {
                    return [
                      createTextVNode(" Add " + toDisplayString(integration.title) + " credential ", 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            }
          } else {
            return [
              createVNode("div", null, [
                createVNode("h3", { class: "app-section-title" }, toDisplayString(integration.title), 1),
                createVNode("p", { class: "app-section-description mt-1" }, toDisplayString(integration.description), 1)
              ]),
              createVNode("ul", { class: "space-y-2" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(_ctx.credentialsByType[integration.type], (c) => {
                  return openBlock(), createBlock("li", {
                    key: c.id,
                    class: "flex items-center justify-between gap-2 rounded border border-border/50 bg-muted/30 px-3 py-2 text-sm"
                  }, [
                    createVNode("span", { class: "text-foreground" }, toDisplayString(c.name), 1),
                    createVNode("span", {
                      class: {
                        "text-emerald-600": c.status === "ok",
                        "text-amber-600": c.status === "pending",
                        "text-destructive": c.status === "error"
                      }
                    }, toDisplayString(c.status), 3),
                    createVNode("span", { class: "text-muted-foreground text-xs" }, toDisplayString(c.last_tested_at ? "Tested " + _ctx.formatDate(c.last_tested_at) : "Not tested"), 1),
                    createVNode("div", { class: "flex gap-2" }, [
                      createVNode("button", {
                        type: "button",
                        class: "text-primary hover:underline",
                        disabled: _ctx.testingId === c.id,
                        onClick: ($event) => _ctx.testCredential(c.id)
                      }, toDisplayString(_ctx.testingId === c.id ? "Testing…" : "Test"), 9, ["disabled", "onClick"]),
                      createVNode("button", {
                        type: "button",
                        class: "text-destructive hover:underline",
                        onClick: ($event) => _ctx.deleteCredential(c.id)
                      }, " Delete ", 8, ["onClick"])
                    ])
                  ]);
                }), 128)),
                _ctx.credentialsByType[integration.type].length === 0 && _ctx.addingType !== integration.type ? (openBlock(), createBlock("p", {
                  key: 0,
                  class: "text-muted-foreground text-sm"
                }, " No credentials yet. ")) : createCommentVNode("", true)
              ]),
              _ctx.addingType === integration.type ? (openBlock(), createBlock("form", {
                key: integration.type,
                onSubmit: withModifiers(($event) => _ctx.onAddCredential(integration.type), ["prevent"]),
                class: "space-y-3 rounded border border-border/50 bg-muted/20 p-4"
              }, [
                createVNode("div", null, [
                  createVNode("label", { class: "app-label" }, "Name"),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => _ctx.addForms[integration.type].name = $event,
                    class: "app-input",
                    placeholder: integration.placeholder
                  }, null, 8, ["onUpdate:modelValue", "placeholder"]), [
                    [vModelText, _ctx.addForms[integration.type].name]
                  ])
                ]),
                integration.type === "s3" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                  createVNode("div", null, [
                    createVNode("label", { class: "app-label" }, "Access Key ID"),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => _ctx.addForms.s3.s3AccessKeyId = $event,
                      class: "app-input",
                      type: "text"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, _ctx.addForms.s3.s3AccessKeyId]
                    ])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "app-label" }, "Secret Access Key"),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => _ctx.addForms.s3.s3SecretAccessKey = $event,
                      class: "app-input",
                      type: "password"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, _ctx.addForms.s3.s3SecretAccessKey]
                    ])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "app-label" }, "Region (optional)"),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => _ctx.addForms.s3.s3Region = $event,
                      class: "app-input",
                      placeholder: "us-east-1"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, _ctx.addForms.s3.s3Region]
                    ])
                  ])
                ], 64)) : integration.type === "gcs" ? (openBlock(), createBlock("div", { key: 1 }, [
                  createVNode("label", { class: "app-label" }, "Service account JSON (paste full JSON)"),
                  withDirectives(createVNode("textarea", {
                    "onUpdate:modelValue": ($event) => _ctx.addForms.gcs.gcsJson = $event,
                    class: "app-input min-h-[120px] font-mono text-sm",
                    placeholder: '{"type":"service_account",...}'
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, _ctx.addForms.gcs.gcsJson]
                  ])
                ])) : integration.type === "hf" ? (openBlock(), createBlock("div", { key: 2 }, [
                  createVNode("label", { class: "app-label" }, "Hugging Face token"),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => _ctx.addForms.hf.hfToken = $event,
                    class: "app-input",
                    type: "password",
                    placeholder: "hf_..."
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, _ctx.addForms.hf.hfToken]
                  ])
                ])) : createCommentVNode("", true),
                createVNode("div", { class: "flex gap-2" }, [
                  createVNode(_component_AppButton, {
                    type: "submit",
                    disabled: _ctx.addLoading
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(_ctx.addLoading ? "Adding…" : "Add credential"), 1)
                    ]),
                    _: 1
                  }, 8, ["disabled"]),
                  createVNode(_component_AppButton, {
                    variant: "secondary",
                    type: "button",
                    onClick: ($event) => _ctx.addingType = null
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Cancel ")
                    ]),
                    _: 1
                  }, 8, ["onClick"])
                ])
              ], 40, ["onSubmit"])) : (openBlock(), createBlock(_component_AppButton, {
                key: 1,
                variant: "secondary",
                onClick: ($event) => _ctx.addingType = integration.type
              }, {
                default: withCtx(() => [
                  createTextVNode(" Add " + toDisplayString(integration.title) + " credential ", 1)
                ]),
                _: 2
              }, 1032, ["onClick"]))
            ];
          }
        }),
        _: 2
      }, _parent));
    });
    _push(`<!--]--></div>`);
  }
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/integrations.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const integrations = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  integrations as default
};
//# sourceMappingURL=integrations-CkK6QSGo.js.map
