import { _ as __nuxt_component_0 } from './AppPageHeader-3vaz4YvC.mjs';
import { _ as __nuxt_component_1 } from './AppCard-T_GiUAp6.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-T1BgcM6o.mjs';
import { _ as __nuxt_component_0$2 } from './AppButton-DJM0cog_.mjs';
import { mergeProps, withCtx, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, Fragment, renderList, defineComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
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

const _sfc_main = defineComponent({
  name: "AppDashboard",
  data() {
    return {
      journeySteps: [
        { step: 1, title: "Create a project", desc: "Define base model + objective.", href: "/app/projects/new", label: "Create project" },
        { step: 2, title: "Add a dataset", desc: "Upload or connect S3/GCS.", href: "/app/datasets/new", label: "Add dataset" },
        { step: 3, title: "Preview & version data", desc: "Quality, dedupe, create version.", href: "/app/datasets", label: "Datasets" },
        { step: 4, title: "Start a run", desc: "Pick dataset + config, start training.", href: "/app/training/new", label: "Start training" },
        { step: 5, title: "Watch run & evaluations", desc: "Metrics, logs, compare baseline vs tuned.", href: "/app/runs", label: "Runs" },
        { step: 6, title: "Deploy or export", desc: "Live API or export weights.", href: "/app/deployments/new", label: "Deploy" }
      ],
      stats: [
        { label: "Projects", value: "1", href: "/app/projects" },
        { label: "Datasets", value: "1", href: "/app/datasets" },
        { label: "Runs", value: "2", href: "/app/runs" }
      ]
    };
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_AppPageHeader = __nuxt_component_0;
  const _component_AppCard = __nuxt_component_1;
  const _component_NuxtLink = __nuxt_component_0$1;
  const _component_AppButton = __nuxt_component_0$2;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "app-page" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_AppPageHeader, {
    title: "Dashboard",
    description: "Welcome to Aploy. Follow the journey: project \u2192 data \u2192 run \u2192 evaluate \u2192 deploy."
  }, null, _parent));
  _push(ssrRenderComponent(_component_AppCard, { class: "mb-section" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<h2 class="app-section-title"${_scopeId}>Your journey (start \u2192 finish)</h2><p class="app-section-description mb-6"${_scopeId}>Do these in order.</p><ol class="space-y-4"${_scopeId}><!--[-->`);
        ssrRenderList(_ctx.journeySteps, (step) => {
          _push2(`<li class="flex gap-4 items-start"${_scopeId}><span class="flex-shrink-0 w-8 h-8 rounded-app bg-accent/90 text-white text-sm font-medium flex items-center justify-center"${_scopeId}>${ssrInterpolate(step.step)}</span><div class="flex-1 min-w-0"${_scopeId}><p class="font-medium text-white"${_scopeId}>${ssrInterpolate(step.title)}</p><p class="text-muted-foreground text-sm mt-0.5"${_scopeId}>${ssrInterpolate(step.desc)}</p>`);
          _push2(ssrRenderComponent(_component_NuxtLink, {
            to: step.href,
            class: "text-accent hover:text-accent-hover text-sm mt-1 inline-block transition-colors"
          }, {
            default: withCtx((_2, _push3, _parent3, _scopeId2) => {
              if (_push3) {
                _push3(`${ssrInterpolate(step.label)} \u2192 `);
              } else {
                return [
                  createTextVNode(toDisplayString(step.label) + " \u2192 ", 1)
                ];
              }
            }),
            _: 2
          }, _parent2, _scopeId));
          _push2(`</div></li>`);
        });
        _push2(`<!--]--></ol>`);
      } else {
        return [
          createVNode("h2", { class: "app-section-title" }, "Your journey (start \u2192 finish)"),
          createVNode("p", { class: "app-section-description mb-6" }, "Do these in order."),
          createVNode("ol", { class: "space-y-4" }, [
            (openBlock(true), createBlock(Fragment, null, renderList(_ctx.journeySteps, (step) => {
              return openBlock(), createBlock("li", {
                key: step.step,
                class: "flex gap-4 items-start"
              }, [
                createVNode("span", { class: "flex-shrink-0 w-8 h-8 rounded-app bg-accent/90 text-white text-sm font-medium flex items-center justify-center" }, toDisplayString(step.step), 1),
                createVNode("div", { class: "flex-1 min-w-0" }, [
                  createVNode("p", { class: "font-medium text-white" }, toDisplayString(step.title), 1),
                  createVNode("p", { class: "text-muted-foreground text-sm mt-0.5" }, toDisplayString(step.desc), 1),
                  createVNode(_component_NuxtLink, {
                    to: step.href,
                    class: "text-accent hover:text-accent-hover text-sm mt-1 inline-block transition-colors"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(step.label) + " \u2192 ", 1)
                    ]),
                    _: 2
                  }, 1032, ["to"])
                ])
              ]);
            }), 128))
          ])
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-section"><!--[-->`);
  ssrRenderList(_ctx.stats, (stat) => {
    _push(ssrRenderComponent(_component_AppCard, {
      key: stat.label,
      class: "p-5"
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<h3 class="app-section-title"${_scopeId}>${ssrInterpolate(stat.label)}</h3><p class="text-xl font-semibold text-white mt-1"${_scopeId}>${ssrInterpolate(stat.value)}</p>`);
          _push2(ssrRenderComponent(_component_NuxtLink, {
            to: stat.href,
            class: "text-sm text-accent hover:text-accent-hover mt-2 inline-block transition-colors"
          }, {
            default: withCtx((_2, _push3, _parent3, _scopeId2) => {
              if (_push3) {
                _push3(` View all `);
              } else {
                return [
                  createTextVNode(" View all ")
                ];
              }
            }),
            _: 2
          }, _parent2, _scopeId));
        } else {
          return [
            createVNode("h3", { class: "app-section-title" }, toDisplayString(stat.label), 1),
            createVNode("p", { class: "text-xl font-semibold text-white mt-1" }, toDisplayString(stat.value), 1),
            createVNode(_component_NuxtLink, {
              to: stat.href,
              class: "text-sm text-accent hover:text-accent-hover mt-2 inline-block transition-colors"
            }, {
              default: withCtx(() => [
                createTextVNode(" View all ")
              ]),
              _: 1
            }, 8, ["to"])
          ];
        }
      }),
      _: 2
    }, _parent));
  });
  _push(`<!--]--></div>`);
  _push(ssrRenderComponent(_component_AppButton, { to: "/app/projects/new" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Create project`);
      } else {
        return [
          createTextVNode("Create project")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { index as default };
//# sourceMappingURL=index-Cw5Sw8aU.mjs.map
