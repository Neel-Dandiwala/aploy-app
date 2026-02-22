import { _ as __nuxt_component_0 } from './AppPageHeader-CFOue3Zn.mjs';
import { _ as __nuxt_component_0$1 } from './AppButton-oAgfFzQm.mjs';
import { mergeProps, withCtx, createTextVNode, toDisplayString, defineComponent, useSSRContext } from 'vue';
import { u as useAployApi } from './useAployApi-BEdJYRuf.mjs';
import { n as navigateTo } from './server.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
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
import './useEnvironment-BnZbXQTt.mjs';
import './useMockMode-j3YD3gix.mjs';
import './useMockApi-CJyUoVJj.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main = defineComponent({
  name: "NewDataset",
  data() {
    return {
      form: {
        name: "",
        sourceType: "upload",
        bucket: "",
        prefix: "",
        credentialId: "",
        hfDataset: ""
      },
      credentials: [],
      loading: false,
      error: ""
    };
  },
  computed: {
    credentialsByType() {
      return this.credentials.filter((c) => c.type === this.form.sourceType);
    },
    hfCredentials() {
      return this.credentials.filter((c) => c.type === "hf");
    }
  },
  setup() {
    const { apiFetch } = useAployApi();
    return { apiFetch };
  },
  async mounted() {
    try {
      const data = await this.apiFetch("/api/org/credentials");
      this.credentials = data.credentials || [];
    } catch {
      this.credentials = [];
    }
  },
  methods: {
    async onSubmit() {
      this.error = "";
      this.loading = true;
      const body = { name: this.form.name || "Untitled dataset", schema_ref: "chat" };
      if (this.form.sourceType === "s3") {
        body.source = {
          type: "s3",
          bucket: this.form.bucket,
          prefix: this.form.prefix,
          credentialId: this.form.credentialId || void 0
        };
      } else if (this.form.sourceType === "gcs") {
        body.source = {
          type: "gcs",
          bucket: this.form.bucket,
          prefix: this.form.prefix,
          credentialId: this.form.credentialId || void 0
        };
      } else if (this.form.sourceType === "hf") {
        body.source = {
          type: "hf",
          dataset: this.form.hfDataset,
          credentialId: this.form.credentialId || void 0
        };
      } else {
        body.source = { type: "upload" };
      }
      try {
        const data = await this.apiFetch("/api/datasets", { method: "POST", body });
        await navigateTo(`/app/datasets/${data.id}`);
      } catch (e) {
        this.error = e.message || "Failed to create dataset";
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
    title: "Add dataset",
    description: "Upload or connect S3/GCS/Hugging Face. JSONL format.",
    "back-to": "/app/datasets",
    "back-label": "Datasets"
  }, null, _parent));
  _push(`<form class="space-y-6"><div><label class="app-label">Dataset name</label><input${ssrRenderAttr("value", _ctx.form.name)} class="app-input" placeholder="Support chat v1"></div><div><label class="app-label">Source</label><select class="app-select"><option value="upload"${ssrIncludeBooleanAttr(Array.isArray(_ctx.form.sourceType) ? ssrLooseContain(_ctx.form.sourceType, "upload") : ssrLooseEqual(_ctx.form.sourceType, "upload")) ? " selected" : ""}>Upload</option><option value="s3"${ssrIncludeBooleanAttr(Array.isArray(_ctx.form.sourceType) ? ssrLooseContain(_ctx.form.sourceType, "s3") : ssrLooseEqual(_ctx.form.sourceType, "s3")) ? " selected" : ""}>S3</option><option value="gcs"${ssrIncludeBooleanAttr(Array.isArray(_ctx.form.sourceType) ? ssrLooseContain(_ctx.form.sourceType, "gcs") : ssrLooseEqual(_ctx.form.sourceType, "gcs")) ? " selected" : ""}>GCS</option><option value="hf"${ssrIncludeBooleanAttr(Array.isArray(_ctx.form.sourceType) ? ssrLooseContain(_ctx.form.sourceType, "hf") : ssrLooseEqual(_ctx.form.sourceType, "hf")) ? " selected" : ""}>Hugging Face</option></select>`);
  if (_ctx.form.sourceType === "s3" || _ctx.form.sourceType === "gcs") {
    _push(`<!--[--><label class="app-label mt-2">Credential</label><select class="app-select"><option value=""${ssrIncludeBooleanAttr(Array.isArray(_ctx.form.credentialId) ? ssrLooseContain(_ctx.form.credentialId, "") : ssrLooseEqual(_ctx.form.credentialId, "")) ? " selected" : ""}>Select credential</option><!--[-->`);
    ssrRenderList(_ctx.credentialsByType, (c) => {
      _push(`<option${ssrRenderAttr("value", c.id)}${ssrIncludeBooleanAttr(Array.isArray(_ctx.form.credentialId) ? ssrLooseContain(_ctx.form.credentialId, c.id) : ssrLooseEqual(_ctx.form.credentialId, c.id)) ? " selected" : ""}>${ssrInterpolate(c.name)} (${ssrInterpolate(c.type)})</option>`);
    });
    _push(`<!--]--></select><input${ssrRenderAttr("value", _ctx.form.bucket)} class="app-input mt-2" placeholder="Bucket"><input${ssrRenderAttr("value", _ctx.form.prefix)} class="app-input mt-2" placeholder="Prefix (optional)"><!--]-->`);
  } else if (_ctx.form.sourceType === "hf") {
    _push(`<!--[--><label class="app-label mt-2">Credential</label><select class="app-select"><option value=""${ssrIncludeBooleanAttr(Array.isArray(_ctx.form.credentialId) ? ssrLooseContain(_ctx.form.credentialId, "") : ssrLooseEqual(_ctx.form.credentialId, "")) ? " selected" : ""}>Select credential</option><!--[-->`);
    ssrRenderList(_ctx.hfCredentials, (c) => {
      _push(`<option${ssrRenderAttr("value", c.id)}${ssrIncludeBooleanAttr(Array.isArray(_ctx.form.credentialId) ? ssrLooseContain(_ctx.form.credentialId, c.id) : ssrLooseEqual(_ctx.form.credentialId, c.id)) ? " selected" : ""}>${ssrInterpolate(c.name)}</option>`);
    });
    _push(`<!--]--></select><input${ssrRenderAttr("value", _ctx.form.hfDataset)} class="app-input mt-2" placeholder="Dataset (e.g. username/dataset_name)"><!--]-->`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
  if (_ctx.error) {
    _push(`<p class="app-error">${ssrInterpolate(_ctx.error)}</p>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<div class="flex flex-wrap gap-3 pt-1">`);
  _push(ssrRenderComponent(_component_AppButton, {
    type: "submit",
    disabled: _ctx.loading
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`${ssrInterpolate(_ctx.loading ? "Starting\u2026" : "Create dataset")}`);
      } else {
        return [
          createTextVNode(toDisplayString(_ctx.loading ? "Starting\u2026" : "Create dataset"), 1)
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_AppButton, {
    variant: "secondary",
    to: "/app/datasets"
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/datasets/new.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _new = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { _new as default };
//# sourceMappingURL=new-C8K0xz7R.mjs.map
