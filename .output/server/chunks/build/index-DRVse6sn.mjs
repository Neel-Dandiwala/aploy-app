import { _ as __nuxt_component_0 } from './AppPageHeader-CFOue3Zn.mjs';
import { _ as __nuxt_component_0$1 } from './AppButton-oAgfFzQm.mjs';
import { _ as __nuxt_component_0$2 } from './nuxt-link-D0qNmuHi.mjs';
import { mergeProps, withCtx, createTextVNode, createVNode, defineComponent, useSSRContext } from 'vue';
import { u as useAployApi } from './useAployApi-BEdJYRuf.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
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
  name: "KnowledgeBasesList",
  data() {
    return {
      knowledgeBases: [],
      loading: true,
      error: ""
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
      this.loading = true;
      this.error = "";
      try {
        const data = await this.apiFetch("/api/knowledge-bases");
        this.knowledgeBases = data.knowledge_bases || [];
      } catch (e) {
        this.error = e.message || "Failed to load knowledge bases";
      } finally {
        this.loading = false;
      }
    },
    statusClass(status) {
      if (status === "ready") return "text-emerald-500";
      if (status === "failed") return "text-destructive";
      if (status === "ingesting") return "text-amber-500";
      return "text-muted-foreground";
    }
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_AppPageHeader = __nuxt_component_0;
  const _component_AppButton = __nuxt_component_0$1;
  const _component_NuxtLink = __nuxt_component_0$2;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "app-page" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_AppPageHeader, { title: "Knowledge bases" }, {
    actions: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_AppButton, { to: "/app/knowledge-bases/new" }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`Add knowledge base`);
            } else {
              return [
                createTextVNode("Add knowledge base")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_AppButton, { to: "/app/knowledge-bases/new" }, {
            default: withCtx(() => [
              createTextVNode("Add knowledge base")
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
    _push(`<div class="app-table-wrap"><table class="app-table"><thead><tr><th>Name</th><th>Status</th><th>Chunks</th><th></th></tr></thead><tbody><!--[-->`);
    ssrRenderList(_ctx.knowledgeBases, (kb) => {
      var _a;
      _push(`<tr><td class="font-medium text-zinc-900">${ssrInterpolate(kb.name)}</td><td class="${ssrRenderClass(_ctx.statusClass(kb.status))}">${ssrInterpolate(kb.status)}</td><td class="text-muted-foreground">${ssrInterpolate((_a = kb.chunk_count) != null ? _a : "\u2014")}</td><td>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/app/knowledge-bases/${kb.id}`,
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
    if (!_ctx.loading && !_ctx.error && _ctx.knowledgeBases.length === 0) {
      _push(`<p class="app-empty"> No knowledge bases yet. Add one to get started. </p>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/app/knowledge-bases/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { index as default };
//# sourceMappingURL=index-DRVse6sn.mjs.map
