import { n as _sfc_main$1, r as _sfc_main$3, t as _sfc_main$2 } from "./TextInput-5ggN7aMT.js";
import { t as PrimaryButton_default } from "./PrimaryButton-C9i0DqMF.js";
import { t as _sfc_main$4 } from "./AuthenticatedLayout-C1P-b31-.js";
import "./SelectInput-BEzDVh5i.js";
import { Head, Link, useForm } from "@inertiajs/vue3";
import { Fragment, createBlock, createTextVNode, createVNode, openBlock, renderList, toDisplayString, unref, useSSRContext, vModelSelect, withCtx, withDirectives, withModifiers } from "vue";
import { ssrIncludeBooleanAttr, ssrInterpolate, ssrLooseContain, ssrLooseEqual, ssrRenderAttr, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
//#region resources/js/Pages/Siswa/Create.vue
var _sfc_main = {
	__name: "Create",
	__ssrInlineRender: true,
	props: { kelas: {
		type: Array,
		required: true
	} },
	setup(__props) {
		const form = useForm({
			kelas_id: "",
			nis: "",
			nama: "",
			wa: "",
			wa_ortu: "",
			foto: null
		});
		const submit = () => {
			form.post(route("siswa.store"));
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Tambah Siswa" }, null, _parent));
			_push(ssrRenderComponent(_sfc_main$4, null, {
				header: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<h2 class="font-bold text-lg theme-text"${_scopeId}>Tambah Siswa Baru</h2>`);
					else return [createVNode("h2", { class: "font-bold text-lg theme-text" }, "Tambah Siswa Baru")];
				}),
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="p-2"${_scopeId}><div class="w-full max-w-lg"${_scopeId}><div class="win95-panel p-4"${_scopeId}><form class="space-y-4"${_scopeId}><div${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$1, {
							for: "nis",
							value: "NIS",
							class: "theme-text"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$2, {
							id: "nis",
							type: "text",
							class: "mt-1 block w-full",
							modelValue: unref(form).nis,
							"onUpdate:modelValue": ($event) => unref(form).nis = $event,
							required: "",
							autofocus: ""
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$3, {
							class: "mt-2",
							message: unref(form).errors.nis
						}, null, _parent, _scopeId));
						_push(`</div><div${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$1, {
							for: "nama",
							value: "Nama Lengkap",
							class: "theme-text"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$2, {
							id: "nama",
							type: "text",
							class: "mt-1 block w-full",
							modelValue: unref(form).nama,
							"onUpdate:modelValue": ($event) => unref(form).nama = $event,
							required: ""
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$3, {
							class: "mt-2",
							message: unref(form).errors.nama
						}, null, _parent, _scopeId));
						_push(`</div><div${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$1, {
							for: "kelas_id",
							value: "Kelas",
							class: "theme-text"
						}, null, _parent, _scopeId));
						_push(`<select id="kelas_id" class="border border-[var(--border-dark)] bg-[var(--bg-panel)] shadow-[inset_1px_1px_0_var(--border-darker),inset_-1px_-1px_0_var(--border-light)] text-[var(--text-color)] p-1 mt-1 block w-full focus:outline-none" required${_scopeId}><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(unref(form).kelas_id) ? ssrLooseContain(unref(form).kelas_id, "") : ssrLooseEqual(unref(form).kelas_id, "")) ? " selected" : ""}${_scopeId}>Pilih Kelas</option><!--[-->`);
						ssrRenderList(__props.kelas, (k) => {
							_push(`<option${ssrRenderAttr("value", k.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).kelas_id) ? ssrLooseContain(unref(form).kelas_id, k.id) : ssrLooseEqual(unref(form).kelas_id, k.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(k.nama_kelas)}</option>`);
						});
						_push(`<!--]--></select>`);
						_push(ssrRenderComponent(_sfc_main$3, {
							class: "mt-2",
							message: unref(form).errors.kelas_id
						}, null, _parent, _scopeId));
						_push(`</div><div${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$1, {
							for: "wa",
							value: "No WhatsApp Siswa",
							class: "theme-text"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$2, {
							id: "wa",
							type: "text",
							class: "mt-1 block w-full",
							modelValue: unref(form).wa,
							"onUpdate:modelValue": ($event) => unref(form).wa = $event
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$3, {
							class: "mt-2",
							message: unref(form).errors.wa
						}, null, _parent, _scopeId));
						_push(`</div><div${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$1, {
							for: "wa_ortu",
							value: "No WhatsApp Orang Tua",
							class: "theme-text"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$2, {
							id: "wa_ortu",
							type: "text",
							class: "mt-1 block w-full",
							modelValue: unref(form).wa_ortu,
							"onUpdate:modelValue": ($event) => unref(form).wa_ortu = $event
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$3, {
							class: "mt-2",
							message: unref(form).errors.wa_ortu
						}, null, _parent, _scopeId));
						_push(`</div><div${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$1, {
							for: "foto",
							value: "Foto (Opsional)",
							class: "theme-text"
						}, null, _parent, _scopeId));
						_push(`<input id="foto" type="file" class="mt-1 block w-full theme-text" accept="image/*"${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$3, {
							class: "mt-2",
							message: unref(form).errors.foto
						}, null, _parent, _scopeId));
						_push(`</div><div class="flex items-center justify-end mt-4 pt-4 border-t border-[var(--border-dark)]"${_scopeId}>`);
						_push(ssrRenderComponent(unref(Link), {
							href: _ctx.route("siswa.index"),
							class: "win95-btn mr-2 !px-4 hover:text-black theme-text"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Batal `);
								else return [createTextVNode(" Batal ")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(PrimaryButton_default, {
							class: [{ "opacity-25": unref(form).processing }, "win95-btn !px-4"],
							disabled: unref(form).processing
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Simpan `);
								else return [createTextVNode(" Simpan ")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div></form></div></div></div>`);
					} else return [createVNode("div", { class: "p-2" }, [createVNode("div", { class: "w-full max-w-lg" }, [createVNode("div", { class: "win95-panel p-4" }, [createVNode("form", {
						onSubmit: withModifiers(submit, ["prevent"]),
						class: "space-y-4"
					}, [
						createVNode("div", null, [
							createVNode(_sfc_main$1, {
								for: "nis",
								value: "NIS",
								class: "theme-text"
							}),
							createVNode(_sfc_main$2, {
								id: "nis",
								type: "text",
								class: "mt-1 block w-full",
								modelValue: unref(form).nis,
								"onUpdate:modelValue": ($event) => unref(form).nis = $event,
								required: "",
								autofocus: ""
							}, null, 8, ["modelValue", "onUpdate:modelValue"]),
							createVNode(_sfc_main$3, {
								class: "mt-2",
								message: unref(form).errors.nis
							}, null, 8, ["message"])
						]),
						createVNode("div", null, [
							createVNode(_sfc_main$1, {
								for: "nama",
								value: "Nama Lengkap",
								class: "theme-text"
							}),
							createVNode(_sfc_main$2, {
								id: "nama",
								type: "text",
								class: "mt-1 block w-full",
								modelValue: unref(form).nama,
								"onUpdate:modelValue": ($event) => unref(form).nama = $event,
								required: ""
							}, null, 8, ["modelValue", "onUpdate:modelValue"]),
							createVNode(_sfc_main$3, {
								class: "mt-2",
								message: unref(form).errors.nama
							}, null, 8, ["message"])
						]),
						createVNode("div", null, [
							createVNode(_sfc_main$1, {
								for: "kelas_id",
								value: "Kelas",
								class: "theme-text"
							}),
							withDirectives(createVNode("select", {
								id: "kelas_id",
								class: "border border-[var(--border-dark)] bg-[var(--bg-panel)] shadow-[inset_1px_1px_0_var(--border-darker),inset_-1px_-1px_0_var(--border-light)] text-[var(--text-color)] p-1 mt-1 block w-full focus:outline-none",
								"onUpdate:modelValue": ($event) => unref(form).kelas_id = $event,
								required: ""
							}, [createVNode("option", {
								value: "",
								disabled: ""
							}, "Pilih Kelas"), (openBlock(true), createBlock(Fragment, null, renderList(__props.kelas, (k) => {
								return openBlock(), createBlock("option", {
									key: k.id,
									value: k.id
								}, toDisplayString(k.nama_kelas), 9, ["value"]);
							}), 128))], 8, ["onUpdate:modelValue"]), [[vModelSelect, unref(form).kelas_id]]),
							createVNode(_sfc_main$3, {
								class: "mt-2",
								message: unref(form).errors.kelas_id
							}, null, 8, ["message"])
						]),
						createVNode("div", null, [
							createVNode(_sfc_main$1, {
								for: "wa",
								value: "No WhatsApp Siswa",
								class: "theme-text"
							}),
							createVNode(_sfc_main$2, {
								id: "wa",
								type: "text",
								class: "mt-1 block w-full",
								modelValue: unref(form).wa,
								"onUpdate:modelValue": ($event) => unref(form).wa = $event
							}, null, 8, ["modelValue", "onUpdate:modelValue"]),
							createVNode(_sfc_main$3, {
								class: "mt-2",
								message: unref(form).errors.wa
							}, null, 8, ["message"])
						]),
						createVNode("div", null, [
							createVNode(_sfc_main$1, {
								for: "wa_ortu",
								value: "No WhatsApp Orang Tua",
								class: "theme-text"
							}),
							createVNode(_sfc_main$2, {
								id: "wa_ortu",
								type: "text",
								class: "mt-1 block w-full",
								modelValue: unref(form).wa_ortu,
								"onUpdate:modelValue": ($event) => unref(form).wa_ortu = $event
							}, null, 8, ["modelValue", "onUpdate:modelValue"]),
							createVNode(_sfc_main$3, {
								class: "mt-2",
								message: unref(form).errors.wa_ortu
							}, null, 8, ["message"])
						]),
						createVNode("div", null, [
							createVNode(_sfc_main$1, {
								for: "foto",
								value: "Foto (Opsional)",
								class: "theme-text"
							}),
							createVNode("input", {
								id: "foto",
								type: "file",
								class: "mt-1 block w-full theme-text",
								onInput: ($event) => unref(form).foto = $event.target.files[0],
								accept: "image/*"
							}, null, 40, ["onInput"]),
							createVNode(_sfc_main$3, {
								class: "mt-2",
								message: unref(form).errors.foto
							}, null, 8, ["message"])
						]),
						createVNode("div", { class: "flex items-center justify-end mt-4 pt-4 border-t border-[var(--border-dark)]" }, [createVNode(unref(Link), {
							href: _ctx.route("siswa.index"),
							class: "win95-btn mr-2 !px-4 hover:text-black theme-text"
						}, {
							default: withCtx(() => [createTextVNode(" Batal ")]),
							_: 1
						}, 8, ["href"]), createVNode(PrimaryButton_default, {
							class: [{ "opacity-25": unref(form).processing }, "win95-btn !px-4"],
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Siswa/Create.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
export { _sfc_main as default };
