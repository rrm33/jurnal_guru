import { t as _sfc_main$1 } from "./GuestLayout-CNxczFJO.js";
import { n as _sfc_main$2, r as _sfc_main$4, t as _sfc_main$3 } from "./TextInput-5ggN7aMT.js";
import { t as PrimaryButton_default } from "./PrimaryButton-C9i0DqMF.js";
import { Head, Link, useForm } from "@inertiajs/vue3";
import { createTextVNode, createVNode, unref, useSSRContext, withCtx, withModifiers } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
//#region resources/js/Pages/Auth/Register.vue
var _sfc_main = {
	__name: "Register",
	__ssrInlineRender: true,
	setup(__props) {
		const form = useForm({
			name: "",
			email: "",
			password: "",
			password_confirmation: ""
		});
		const submit = () => {
			form.post(route("register"), { onFinish: () => form.reset("password", "password_confirmation") });
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(_sfc_main$1, _attrs, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(unref(Head), { title: "Register" }, null, _parent, _scopeId));
						_push(`<form${_scopeId}><div${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$2, {
							for: "name",
							value: "Name"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$3, {
							id: "name",
							type: "text",
							class: "mt-1 block w-full",
							modelValue: unref(form).name,
							"onUpdate:modelValue": ($event) => unref(form).name = $event,
							required: "",
							autofocus: "",
							autocomplete: "name"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$4, {
							class: "mt-2",
							message: unref(form).errors.name
						}, null, _parent, _scopeId));
						_push(`</div><div class="mt-4"${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$2, {
							for: "email",
							value: "Email"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$3, {
							id: "email",
							type: "email",
							class: "mt-1 block w-full",
							modelValue: unref(form).email,
							"onUpdate:modelValue": ($event) => unref(form).email = $event,
							required: "",
							autocomplete: "username"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$4, {
							class: "mt-2",
							message: unref(form).errors.email
						}, null, _parent, _scopeId));
						_push(`</div><div class="mt-4"${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$2, {
							for: "password",
							value: "Password"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$3, {
							id: "password",
							type: "password",
							class: "mt-1 block w-full",
							modelValue: unref(form).password,
							"onUpdate:modelValue": ($event) => unref(form).password = $event,
							required: "",
							autocomplete: "new-password"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$4, {
							class: "mt-2",
							message: unref(form).errors.password
						}, null, _parent, _scopeId));
						_push(`</div><div class="mt-4"${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$2, {
							for: "password_confirmation",
							value: "Confirm Password"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$3, {
							id: "password_confirmation",
							type: "password",
							class: "mt-1 block w-full",
							modelValue: unref(form).password_confirmation,
							"onUpdate:modelValue": ($event) => unref(form).password_confirmation = $event,
							required: "",
							autocomplete: "new-password"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$4, {
							class: "mt-2",
							message: unref(form).errors.password_confirmation
						}, null, _parent, _scopeId));
						_push(`</div><div class="mt-4 flex items-center justify-end"${_scopeId}>`);
						_push(ssrRenderComponent(unref(Link), {
							href: _ctx.route("login"),
							class: "rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Already registered? `);
								else return [createTextVNode(" Already registered? ")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(PrimaryButton_default, {
							class: ["ms-4", { "opacity-25": unref(form).processing }],
							disabled: unref(form).processing
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Register `);
								else return [createTextVNode(" Register ")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div></form>`);
					} else return [createVNode(unref(Head), { title: "Register" }), createVNode("form", { onSubmit: withModifiers(submit, ["prevent"]) }, [
						createVNode("div", null, [
							createVNode(_sfc_main$2, {
								for: "name",
								value: "Name"
							}),
							createVNode(_sfc_main$3, {
								id: "name",
								type: "text",
								class: "mt-1 block w-full",
								modelValue: unref(form).name,
								"onUpdate:modelValue": ($event) => unref(form).name = $event,
								required: "",
								autofocus: "",
								autocomplete: "name"
							}, null, 8, ["modelValue", "onUpdate:modelValue"]),
							createVNode(_sfc_main$4, {
								class: "mt-2",
								message: unref(form).errors.name
							}, null, 8, ["message"])
						]),
						createVNode("div", { class: "mt-4" }, [
							createVNode(_sfc_main$2, {
								for: "email",
								value: "Email"
							}),
							createVNode(_sfc_main$3, {
								id: "email",
								type: "email",
								class: "mt-1 block w-full",
								modelValue: unref(form).email,
								"onUpdate:modelValue": ($event) => unref(form).email = $event,
								required: "",
								autocomplete: "username"
							}, null, 8, ["modelValue", "onUpdate:modelValue"]),
							createVNode(_sfc_main$4, {
								class: "mt-2",
								message: unref(form).errors.email
							}, null, 8, ["message"])
						]),
						createVNode("div", { class: "mt-4" }, [
							createVNode(_sfc_main$2, {
								for: "password",
								value: "Password"
							}),
							createVNode(_sfc_main$3, {
								id: "password",
								type: "password",
								class: "mt-1 block w-full",
								modelValue: unref(form).password,
								"onUpdate:modelValue": ($event) => unref(form).password = $event,
								required: "",
								autocomplete: "new-password"
							}, null, 8, ["modelValue", "onUpdate:modelValue"]),
							createVNode(_sfc_main$4, {
								class: "mt-2",
								message: unref(form).errors.password
							}, null, 8, ["message"])
						]),
						createVNode("div", { class: "mt-4" }, [
							createVNode(_sfc_main$2, {
								for: "password_confirmation",
								value: "Confirm Password"
							}),
							createVNode(_sfc_main$3, {
								id: "password_confirmation",
								type: "password",
								class: "mt-1 block w-full",
								modelValue: unref(form).password_confirmation,
								"onUpdate:modelValue": ($event) => unref(form).password_confirmation = $event,
								required: "",
								autocomplete: "new-password"
							}, null, 8, ["modelValue", "onUpdate:modelValue"]),
							createVNode(_sfc_main$4, {
								class: "mt-2",
								message: unref(form).errors.password_confirmation
							}, null, 8, ["message"])
						]),
						createVNode("div", { class: "mt-4 flex items-center justify-end" }, [createVNode(unref(Link), {
							href: _ctx.route("login"),
							class: "rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
						}, {
							default: withCtx(() => [createTextVNode(" Already registered? ")]),
							_: 1
						}, 8, ["href"]), createVNode(PrimaryButton_default, {
							class: ["ms-4", { "opacity-25": unref(form).processing }],
							disabled: unref(form).processing
						}, {
							default: withCtx(() => [createTextVNode(" Register ")]),
							_: 1
						}, 8, ["class", "disabled"])])
					], 32)];
				}),
				_: 1
			}, _parent));
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Auth/Register.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
export { _sfc_main as default };
