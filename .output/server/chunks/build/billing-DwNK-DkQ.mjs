import { _ as __nuxt_component_0 } from './AppPageHeader-CFOue3Zn.mjs';
import { _ as __nuxt_component_1 } from './AppCard-T_GiUAp6.mjs';
import { _ as __nuxt_component_0$1 } from './AppButton-oAgfFzQm.mjs';
import { mergeProps, withCtx, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, createCommentVNode, Fragment, renderList, defineComponent, useSSRContext } from 'vue';
import { u as useAployApi } from './useAployApi-BEdJYRuf.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
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
  name: "BillingPage",
  data() {
    return {
      usage: {
        period_start: "",
        period_end: "",
        compute_gpu_hours: 24.5,
        storage_gb_months: 120,
        total_usd: 42.5,
        forecast_usd: 55
      },
      invoices: [],
      loading: true,
      settingUp: false,
      stripeConnected: false
    };
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
      var _a;
      this.loading = true;
      try {
        const [usageRes, invRes] = await Promise.all([
          this.apiFetch("/api/billing/usage"),
          this.apiFetch("/api/billing/invoices")
        ]);
        this.usage = usageRes;
        this.invoices = (_a = invRes.invoices) != null ? _a : [];
        this.stripeConnected = this.invoices.length > 0 || usageRes.stripe_customer_id !== void 0;
      } catch {
        this.usage = {
          period_start: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          period_end: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          compute_gpu_hours: 24.5,
          storage_gb_months: 120,
          total_usd: 42.5,
          forecast_usd: 55
        };
      } finally {
        this.loading = false;
      }
    },
    async setupCustomer() {
      this.settingUp = true;
      try {
        await this.apiFetch("/api/billing/setup-customer", { method: "POST" });
        this.stripeConnected = true;
        await this.load();
      } catch (e) {
        alert(e.message || "Setup failed");
      } finally {
        this.settingUp = false;
      }
    }
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_AppPageHeader = __nuxt_component_0;
  const _component_AppCard = __nuxt_component_1;
  const _component_AppButton = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "app-page" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_AppPageHeader, { title: "Billing & usage" }, null, _parent));
  if (_ctx.loading) {
    _push(`<p class="text-muted-foreground text-sm">Loading\u2026</p>`);
  } else {
    _push(`<!--[-->`);
    _push(ssrRenderComponent(_component_AppCard, { class: "mb-4" }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        var _a, _b;
        if (_push2) {
          _push2(`<h3 class="app-section-title mb-4"${_scopeId}>Current period</h3><ul class="space-y-2 text-sm text-muted-foreground"${_scopeId}><li${_scopeId}>Period: ${ssrInterpolate(_ctx.usage.period_start)} \u2013 ${ssrInterpolate(_ctx.usage.period_end)}</li><li${_scopeId}>Compute (GPU hours): ${ssrInterpolate(_ctx.usage.compute_gpu_hours)} \u2014 $${ssrInterpolate((_ctx.usage.compute_gpu_hours * 1.56).toFixed(2))}</li><li${_scopeId}>Storage (GB-months): ${ssrInterpolate(_ctx.usage.storage_gb_months)} \u2014 $${ssrInterpolate((_ctx.usage.storage_gb_months * 0.036).toFixed(2))}</li><li${_scopeId}><strong class="text-zinc-900"${_scopeId}>Total: $${ssrInterpolate(_ctx.usage.total_usd.toFixed(2))}</strong></li></ul><p class="text-muted text-sm mt-4"${_scopeId}>Forecast: ~$${ssrInterpolate(((_a = _ctx.usage.forecast_usd) != null ? _a : _ctx.usage.total_usd).toFixed(2))}</p>`);
          if (!_ctx.stripeConnected) {
            _push2(ssrRenderComponent(_component_AppButton, {
              class: "mt-4",
              variant: "secondary",
              disabled: _ctx.settingUp,
              onClick: _ctx.setupCustomer
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(_ctx.settingUp ? "Setting up\u2026" : "Connect Stripe for billing")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(_ctx.settingUp ? "Setting up\u2026" : "Connect Stripe for billing"), 1)
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
            createVNode("h3", { class: "app-section-title mb-4" }, "Current period"),
            createVNode("ul", { class: "space-y-2 text-sm text-muted-foreground" }, [
              createVNode("li", null, "Period: " + toDisplayString(_ctx.usage.period_start) + " \u2013 " + toDisplayString(_ctx.usage.period_end), 1),
              createVNode("li", null, "Compute (GPU hours): " + toDisplayString(_ctx.usage.compute_gpu_hours) + " \u2014 $" + toDisplayString((_ctx.usage.compute_gpu_hours * 1.56).toFixed(2)), 1),
              createVNode("li", null, "Storage (GB-months): " + toDisplayString(_ctx.usage.storage_gb_months) + " \u2014 $" + toDisplayString((_ctx.usage.storage_gb_months * 0.036).toFixed(2)), 1),
              createVNode("li", null, [
                createVNode("strong", { class: "text-zinc-900" }, "Total: $" + toDisplayString(_ctx.usage.total_usd.toFixed(2)), 1)
              ])
            ]),
            createVNode("p", { class: "text-muted text-sm mt-4" }, "Forecast: ~$" + toDisplayString(((_b = _ctx.usage.forecast_usd) != null ? _b : _ctx.usage.total_usd).toFixed(2)), 1),
            !_ctx.stripeConnected ? (openBlock(), createBlock(_component_AppButton, {
              key: 0,
              class: "mt-4",
              variant: "secondary",
              disabled: _ctx.settingUp,
              onClick: _ctx.setupCustomer
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(_ctx.settingUp ? "Setting up\u2026" : "Connect Stripe for billing"), 1)
              ]),
              _: 1
            }, 8, ["disabled", "onClick"])) : createCommentVNode("", true)
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(ssrRenderComponent(_component_AppCard, null, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<h3 class="app-section-title mb-4"${_scopeId}>Invoices</h3>`);
          if (_ctx.invoices.length) {
            _push2(`<ul class="space-y-2 text-sm"${_scopeId}><!--[-->`);
            ssrRenderList(_ctx.invoices, (inv) => {
              _push2(`<li class="flex justify-between"${_scopeId}><span${_scopeId}>${ssrInterpolate(inv.id)}</span><span${_scopeId}>$${ssrInterpolate(inv.amount_usd.toFixed(2))}</span><span${_scopeId}>${ssrInterpolate(inv.status)}</span></li>`);
            });
            _push2(`<!--]--></ul>`);
          } else {
            _push2(`<p class="text-muted-foreground text-sm"${_scopeId}>No invoices yet.</p>`);
          }
        } else {
          return [
            createVNode("h3", { class: "app-section-title mb-4" }, "Invoices"),
            _ctx.invoices.length ? (openBlock(), createBlock("ul", {
              key: 0,
              class: "space-y-2 text-sm"
            }, [
              (openBlock(true), createBlock(Fragment, null, renderList(_ctx.invoices, (inv) => {
                return openBlock(), createBlock("li", {
                  key: inv.id,
                  class: "flex justify-between"
                }, [
                  createVNode("span", null, toDisplayString(inv.id), 1),
                  createVNode("span", null, "$" + toDisplayString(inv.amount_usd.toFixed(2)), 1),
                  createVNode("span", null, toDisplayString(inv.status), 1)
                ]);
              }), 128))
            ])) : (openBlock(), createBlock("p", {
              key: 1,
              class: "text-muted-foreground text-sm"
            }, "No invoices yet."))
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(`<!--]-->`);
  }
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/billing.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const billing = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { billing as default };
//# sourceMappingURL=billing-DwNK-DkQ.mjs.map
