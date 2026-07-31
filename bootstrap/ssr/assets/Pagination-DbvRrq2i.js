import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
import { Link } from "@inertiajs/vue3";
import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
//#region resources/js/Components/Pagination.vue
var _sfc_main = {
	components: { Link },
	props: { links: Array }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	const _component_Link = resolveComponent("Link");
	if ($props.links.length > 3) {
		_push(`<div${ssrRenderAttrs(_attrs)}><div class="flex flex-wrap -mb-1"><!--[-->`);
		ssrRenderList($props.links, (link, k) => {
			_push(`<!--[-->`);
			if (link.url === null) _push(`<div class="mr-1 mb-1 px-4 py-3 text-sm leading-4 text-gray-400 border rounded">${link.label ?? ""}</div>`);
			else _push(ssrRenderComponent(_component_Link, {
				href: link.url,
				class: ["mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded hover:bg-white focus:border-indigo-500 focus:text-indigo-500 win95-btn", { "bg-blue-700 text-white": link.active }]
			}, null, _parent));
			_push(`<!--]-->`);
		});
		_push(`<!--]--></div></div>`);
	} else _push(`<!---->`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Pagination.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Pagination_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { Pagination_default as t };
