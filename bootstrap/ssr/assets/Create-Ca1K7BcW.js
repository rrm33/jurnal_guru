import { n as _sfc_main$1, r as _sfc_main$3, t as _sfc_main$2 } from "./TextInput-5ggN7aMT.js";
import { t as PrimaryButton_default } from "./PrimaryButton-C9i0DqMF.js";
import { t as _sfc_main$4 } from "./AuthenticatedLayout-C1P-b31-.js";
import { t as _sfc_main$5 } from "./SelectInput-BEzDVh5i.js";
import { Head, Link, useForm } from "@inertiajs/vue3";
import { createTextVNode, createVNode, unref, useSSRContext, withCtx, withModifiers } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
//#region resources/js/Pages/Kelas/Create.vue
var _sfc_main = {
	__name: "Create",
	__ssrInlineRender: true,
	setup(__props) {
		const tahunAjaranOptions = [
			"2026/2027",
			"2027/2028",
			"2028/2029",
			"2029/2030"
		];
		const form = useForm({
			nama_kelas: "",
			tahun_ajaran: ""
		});
		const submit = () => {
			form.post(route("kelas.store"));
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Tambah Kelas" }, null, _parent));
			_push(ssrRenderComponent(_sfc_main$4, null, {
				header: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<h2 class="font-bold text-lg theme-text"${_scopeId}>Tambah Kelas Baru</h2>`);
					else return [createVNode("h2", { class: "font-bold text-lg theme-text" }, "Tambah Kelas Baru")];
				}),
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="p-2"${_scopeId}><div class="w-full max-w-lg"${_scopeId}><div class="win95-panel"${_scopeId}><form class="space-y-6"${_scopeId}><div${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$1, {
							for: "nama_kelas",
							value: "Nama Kelas (Contoh: X IPA 1)"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$2, {
							id: "nama_kelas",
							type: "text",
							class: "mt-1 block w-full",
							modelValue: unref(form).nama_kelas,
							"onUpdate:modelValue": ($event) => unref(form).nama_kelas = $event,
							required: "",
							autofocus: ""
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$3, {
							class: "mt-2",
							message: unref(form).errors.nama_kelas
						}, null, _parent, _scopeId));
						_push(`</div><div${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$1, {
							for: "tahun_ajaran",
							value: "Tahun Ajaran"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$5, {
							id: "tahun_ajaran",
							class: "mt-1 block w-full",
							modelValue: unref(form).tahun_ajaran,
							"onUpdate:modelValue": ($event) => unref(form).tahun_ajaran = $event,
							options: tahunAjaranOptions
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$3, {
							class: "mt-2",
							message: unref(form).errors.tahun_ajaran
						}, null, _parent, _scopeId));
						_push(`</div><div class="flex items-center justify-end mt-4 pt-4 border-t border-[var(--border-dark)]"${_scopeId}>`);
						_push(ssrRenderComponent(unref(Link), {
							href: _ctx.route("kelas.index"),
							class: "win95-btn mr-2 !px-4 hover:text-black"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Batal `);
								else return [createTextVNode(" Batal ")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(PrimaryButton_default, {
							class: { "opacity-25": unref(form).processing },
							disabled: unref(form).processing
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Simpan `);
								else return [createTextVNode(" Simpan ")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div></form></div></div></div>`);
					} else return [createVNode("div", { class: "p-2" }, [createVNode("div", { class: "w-full max-w-lg" }, [createVNode("div", { class: "win95-panel" }, [createVNode("form", {
						onSubmit: withModifiers(submit, ["prevent"]),
						class: "space-y-6"
					}, [
						createVNode("div", null, [
							createVNode(_sfc_main$1, {
								for: "nama_kelas",
								value: "Nama Kelas (Contoh: X IPA 1)"
							}),
							createVNode(_sfc_main$2, {
								id: "nama_kelas",
								type: "text",
								class: "mt-1 block w-full",
								modelValue: unref(form).nama_kelas,
								"onUpdate:modelValue": ($event) => unref(form).nama_kelas = $event,
								required: "",
								autofocus: ""
							}, null, 8, ["modelValue", "onUpdate:modelValue"]),
							createVNode(_sfc_main$3, {
								class: "mt-2",
								message: unref(form).errors.nama_kelas
							}, null, 8, ["message"])
						]),
						createVNode("div", null, [
							createVNode(_sfc_main$1, {
								for: "tahun_ajaran",
								value: "Tahun Ajaran"
							}),
							createVNode(_sfc_main$5, {
								id: "tahun_ajaran",
								class: "mt-1 block w-full",
								modelValue: unref(form).tahun_ajaran,
								"onUpdate:modelValue": ($event) => unref(form).tahun_ajaran = $event,
								options: tahunAjaranOptions
							}, null, 8, ["modelValue", "onUpdate:modelValue"]),
							createVNode(_sfc_main$3, {
								class: "mt-2",
								message: unref(form).errors.tahun_ajaran
							}, null, 8, ["message"])
						]),
						createVNode("div", { class: "flex items-center justify-end mt-4 pt-4 border-t border-[var(--border-dark)]" }, [createVNode(unref(Link), {
							href: _ctx.route("kelas.index"),
							class: "win95-btn mr-2 !px-4 hover:text-black"
						}, {
							default: withCtx(() => [createTextVNode(" Batal ")]),
							_: 1
						}, 8, ["href"]), createVNode(PrimaryButton_default, {
							class: { "opacity-25": unref(form).processing },
							disabled: unref(form).processing
						}, {
							default: withCtx(() => [createTextVNode(" Simpan ")]),
							_: 1
						}, 8, ["class", "disabled"])])
					], 32)])])])];
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Kelas/Create.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
export { _sfc_main as default };
