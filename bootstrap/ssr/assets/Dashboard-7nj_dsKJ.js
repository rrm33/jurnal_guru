import { t as _sfc_main$1 } from "./AuthenticatedLayout-C1P-b31-.js";
import { Head } from "@inertiajs/vue3";
import { createVNode, unref, useSSRContext, withCtx } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
//#region resources/js/Pages/Dashboard.vue
var _sfc_main = {
	__name: "Dashboard",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Dashboard" }, null, _parent));
			_push(ssrRenderComponent(_sfc_main$1, null, {
				header: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<h2 class="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200"${_scopeId}> Dashboard </h2>`);
					else return [createVNode("h2", { class: "text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200" }, " Dashboard ")];
				}),
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<div class="py-12"${_scopeId}><div class="mx-auto max-w-7xl sm:px-6 lg:px-8"${_scopeId}><div class="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800"${_scopeId}><div class="p-6 text-gray-900 dark:text-gray-100"${_scopeId}> You&#39;re logged in! </div></div></div></div>`);
					else return [createVNode("div", { class: "py-12" }, [createVNode("div", { class: "mx-auto max-w-7xl sm:px-6 lg:px-8" }, [createVNode("div", { class: "overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800" }, [createVNode("div", { class: "p-6 text-gray-900 dark:text-gray-100" }, " You're logged in! ")])])])];
				}),
				_: 1
			}, _parent));
			_push(`<!--]-->`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Dashboard.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
export { _sfc_main as default };
