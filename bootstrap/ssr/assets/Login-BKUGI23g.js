import { t as _sfc_main$2 } from "./GuestLayout-CNxczFJO.js";
import { n as _sfc_main$3, r as _sfc_main$5, t as _sfc_main$4 } from "./TextInput-5ggN7aMT.js";
import { t as PrimaryButton_default } from "./PrimaryButton-C9i0DqMF.js";
import { Head, Link, useForm } from "@inertiajs/vue3";
import { computed, createBlock, createCommentVNode, createTextVNode, createVNode, mergeProps, openBlock, toDisplayString, unref, useSSRContext, withCtx, withModifiers } from "vue";
import { ssrGetDynamicModelProps, ssrInterpolate, ssrLooseContain, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
//#region resources/js/Components/Checkbox.vue
var _sfc_main$1 = {
	__name: "Checkbox",
	__ssrInlineRender: true,
	props: {
		checked: {
			type: [Array, Boolean],
			required: true
		},
		value: { default: null }
	},
	emits: ["update:checked"],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		const props = __props;
		const proxyChecked = computed({
			get() {
				return props.checked;
			},
			set(val) {
				emit("update:checked", val);
			}
		});
		return (_ctx, _push, _parent, _attrs) => {
			let _temp0;
			_push(`<input${ssrRenderAttrs((_temp0 = mergeProps({
				type: "checkbox",
				value: __props.value,
				checked: Array.isArray(proxyChecked.value) ? ssrLooseContain(proxyChecked.value, __props.value) : proxyChecked.value,
				class: "rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:focus:ring-indigo-600 dark:focus:ring-offset-gray-800"
			}, _attrs), mergeProps(_temp0, ssrGetDynamicModelProps(_temp0, proxyChecked.value))))}>`);
		};
	}
};
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Checkbox.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
//#endregion
//#region resources/js/Pages/Auth/Login.vue
var _sfc_main = {
	__name: "Login",
	__ssrInlineRender: true,
	props: {
		canResetPassword: { type: Boolean },
		status: { type: String }
	},
	setup(__props) {
		const form = useForm({
			email: "",
			password: "",
			remember: false
		});
		const submit = () => {
			form.post(route("login"), { onFinish: () => form.reset("password") });
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(_sfc_main$2, _attrs, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(unref(Head), { title: "Log in" }, null, _parent, _scopeId));
						if (__props.status) _push(`<div class="mb-4 text-sm font-medium text-green-600"${_scopeId}>${ssrInterpolate(__props.status)}</div>`);
						else _push(`<!---->`);
						_push(`<form${_scopeId}><div${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$3, {
							for: "email",
							value: "Email"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$4, {
							id: "email",
							type: "email",
							class: "mt-1 block w-full",
							modelValue: unref(form).email,
							"onUpdate:modelValue": ($event) => unref(form).email = $event,
							required: "",
							autofocus: "",
							autocomplete: "username"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$5, {
							class: "mt-2",
							message: unref(form).errors.email
						}, null, _parent, _scopeId));
						_push(`</div><div class="mt-4"${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$3, {
							for: "password",
							value: "Password"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$4, {
							id: "password",
							type: "password",
							class: "mt-1 block w-full",
							modelValue: unref(form).password,
							"onUpdate:modelValue": ($event) => unref(form).password = $event,
							required: "",
							autocomplete: "current-password"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$5, {
							class: "mt-2",
							message: unref(form).errors.password
						}, null, _parent, _scopeId));
						_push(`</div><div class="mt-4 block"${_scopeId}><label class="flex items-center"${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$1, {
							name: "remember",
							checked: unref(form).remember,
							"onUpdate:checked": ($event) => unref(form).remember = $event
						}, null, _parent, _scopeId));
						_push(`<span class="ms-2 text-sm text-gray-600 dark:text-gray-400"${_scopeId}>Remember me</span></label></div><div class="mt-4 flex items-center justify-end"${_scopeId}>`);
						if (__props.canResetPassword) _push(ssrRenderComponent(unref(Link), {
							href: _ctx.route("password.request"),
							class: "rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Forgot your password? `);
								else return [createTextVNode(" Forgot your password? ")];
							}),
							_: 1
						}, _parent, _scopeId));
						else _push(`<!---->`);
						_push(ssrRenderComponent(PrimaryButton_default, {
							class: ["ms-4", { "opacity-25": unref(form).processing }],
							disabled: unref(form).processing
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Log in `);
								else return [createTextVNode(" Log in ")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div></form>`);
					} else return [
						createVNode(unref(Head), { title: "Log in" }),
						__props.status ? (openBlock(), createBlock("div", {
							key: 0,
							class: "mb-4 text-sm font-medium text-green-600"
						}, toDisplayString(__props.status), 1)) : createCommentVNode("", true),
						createVNode("form", { onSubmit: withModifiers(submit, ["prevent"]) }, [
							createVNode("div", null, [
								createVNode(_sfc_main$3, {
									for: "email",
									value: "Email"
								}),
								createVNode(_sfc_main$4, {
									id: "email",
									type: "email",
									class: "mt-1 block w-full",
									modelValue: unref(form).email,
									"onUpdate:modelValue": ($event) => unref(form).email = $event,
									required: "",
									autofocus: "",
									autocomplete: "username"
								}, null, 8, ["modelValue", "onUpdate:modelValue"]),
								createVNode(_sfc_main$5, {
									class: "mt-2",
									message: unref(form).errors.email
								}, null, 8, ["message"])
							]),
							createVNode("div", { class: "mt-4" }, [
								createVNode(_sfc_main$3, {
									for: "password",
									value: "Password"
								}),
								createVNode(_sfc_main$4, {
									id: "password",
									type: "password",
									class: "mt-1 block w-full",
									modelValue: unref(form).password,
									"onUpdate:modelValue": ($event) => unref(form).password = $event,
									required: "",
									autocomplete: "current-password"
								}, null, 8, ["modelValue", "onUpdate:modelValue"]),
								createVNode(_sfc_main$5, {
									class: "mt-2",
									message: unref(form).errors.password
								}, null, 8, ["message"])
							]),
							createVNode("div", { class: "mt-4 block" }, [createVNode("label", { class: "flex items-center" }, [createVNode(_sfc_main$1, {
								name: "remember",
								checked: unref(form).remember,
								"onUpdate:checked": ($event) => unref(form).remember = $event
							}, null, 8, ["checked", "onUpdate:checked"]), createVNode("span", { class: "ms-2 text-sm text-gray-600 dark:text-gray-400" }, "Remember me")])]),
							createVNode("div", { class: "mt-4 flex items-center justify-end" }, [__props.canResetPassword ? (openBlock(), createBlock(unref(Link), {
								key: 0,
								href: _ctx.route("password.request"),
								class: "rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
							}, {
								default: withCtx(() => [createTextVNode(" Forgot your password? ")]),
								_: 1
							}, 8, ["href"])) : createCommentVNode("", true), createVNode(PrimaryButton_default, {
								class: ["ms-4", { "opacity-25": unref(form).processing }],
								disabled: unref(form).processing
							}, {
								default: withCtx(() => [createTextVNode(" Log in ")]),
								_: 1
							}, 8, ["class", "disabled"])])
						], 32)
					];
				}),
				_: 1
			}, _parent));
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Auth/Login.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
export { _sfc_main as default };
