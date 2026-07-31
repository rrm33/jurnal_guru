import { t as _sfc_main$1 } from "./AuthenticatedLayout-C1P-b31-.js";
import _sfc_main$2 from "./DeleteUserForm-C-hAyS6K.js";
import _sfc_main$3 from "./UpdatePasswordForm-D-AXVQSh.js";
import _sfc_main$4 from "./UpdateProfileInformationForm-Dpzt9wBZ.js";
import { Head } from "@inertiajs/vue3";
import { createVNode, unref, useSSRContext, withCtx } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
//#region resources/js/Pages/Profile/Edit.vue
var _sfc_main = {
	__name: "Edit",
	__ssrInlineRender: true,
	props: {
		mustVerifyEmail: { type: Boolean },
		status: { type: String }
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Profile" }, null, _parent));
			_push(ssrRenderComponent(_sfc_main$1, null, {
				header: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<h2 class="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200"${_scopeId}> Profile </h2>`);
					else return [createVNode("h2", { class: "text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200" }, " Profile ")];
				}),
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="py-12"${_scopeId}><div class="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8"${_scopeId}><div class="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800"${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$4, {
							"must-verify-email": __props.mustVerifyEmail,
							status: __props.status,
							class: "max-w-xl"
						}, null, _parent, _scopeId));
						_push(`</div><div class="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800"${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$3, { class: "max-w-xl" }, null, _parent, _scopeId));
						_push(`</div><div class="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800"${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$2, { class: "max-w-xl" }, null, _parent, _scopeId));
						_push(`</div></div></div>`);
					} else return [createVNode("div", { class: "py-12" }, [createVNode("div", { class: "mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8" }, [
						createVNode("div", { class: "bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800" }, [createVNode(_sfc_main$4, {
							"must-verify-email": __props.mustVerifyEmail,
							status: __props.status,
							class: "max-w-xl"
						}, null, 8, ["must-verify-email", "status"])]),
						createVNode("div", { class: "bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800" }, [createVNode(_sfc_main$3, { class: "max-w-xl" })]),
						createVNode("div", { class: "bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800" }, [createVNode(_sfc_main$2, { class: "max-w-xl" })])
					])])];
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Profile/Edit.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
export { _sfc_main as default };
