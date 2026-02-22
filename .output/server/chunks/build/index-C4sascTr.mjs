import { _ as __nuxt_component_0 } from './AppPageHeader-CFOue3Zn.mjs';
import { _ as __nuxt_component_0$1 } from './AppButton-oAgfFzQm.mjs';
import { _ as __nuxt_component_0$2 } from './nuxt-link-D0qNmuHi.mjs';
import { mergeProps, withCtx, createTextVNode, createVNode, defineComponent, useSSRContext } from 'vue';
import { u as useAployApi } from './useAployApi-BEdJYRuf.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
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
  name: "ProjectsList",
  data() {
    return {
      projects: [],
      loading: true,
      error: ""
    };
  },
  setup() {
    const { apiFetch, environment } = useAployApi();
    return { apiFetch, environment };
  },
  async mounted() {
    await this.loadProjects();
  },
  methods: {
    async loadProjects() {
      this.loading = true;
      this.error = "";
      try {
        const data = await this.apiFetch("/api/projects");
        this.projects = data.projects || [];
      } catch (e) {
        this.error = e.message || "Failed to load projects";
      } finally {
        this.loading = false;
      }
    },
    formatDate(created_at) {
      if (!created_at) return "";
      try {
        const d = new Date(created_at);
        return d.toLocaleDateString();
      } catch {
        return created_at;
      }
    }
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_AppPageHeader = __nuxt_component_0;
  const _component_AppButton = __nuxt_component_0$1;
  const _component_NuxtLink = __nuxt_component_0$2;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "app-page" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_AppPageHeader, { title: "Projects" }, {
    actions: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_AppButton, { to: "/app/projects/new" }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`Create project`);
            } else {
              return [
                createTextVNode("Create project")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_AppButton, { to: "/app/projects/new" }, {
            default: withCtx(() => [
              createTextVNode("Create project")
            ]),
            _: 1
          })
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
    _push(`<div class="app-table-wrap"><table class="app-table"><thead><tr><th>Name</th><th>Base model</th><th>Objective</th><th>Created</th><th></th></tr></thead><tbody><!--[-->`);
    ssrRenderList(_ctx.projects, (p) => {
      _push(`<tr><td class="font-medium text-zinc-900">${ssrInterpolate(p.name)}</td><td class="text-muted-foreground">${ssrInterpolate(p.base_model)}</td><td class="text-muted-foreground">${ssrInterpolate(p.objective)}</td><td class="text-muted text-sm">${ssrInterpolate(_ctx.formatDate(p.created_at))}</td><td>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/app/projects/${p.id}`,
        class: "text-accent hover:text-accent-hover text-sm transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Open `);
          } else {
            return [
              createTextVNode(" Open ")
            ];
          }
        }),
        _: 2
      }, _parent));
      _push(`</td></tr>`);
    });
    _push(`<!--]--></tbody></table>`);
    if (!_ctx.loading && !_ctx.error && _ctx.projects.length === 0) {
      _push(`<p class="app-empty"> No projects yet. Create one to get started. </p>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div>`);
  }
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/projects/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { index as default };
//# sourceMappingURL=index-C4sascTr.mjs.map
