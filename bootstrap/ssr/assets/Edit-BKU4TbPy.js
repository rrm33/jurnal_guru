import { n as _sfc_main$1, r as _sfc_main$3, t as _sfc_main$2 } from "./TextInput-5ggN7aMT.js";
import { t as PrimaryButton_default } from "./PrimaryButton-C9i0DqMF.js";
import { t as _sfc_main$4 } from "./AuthenticatedLayout-C1P-b31-.js";
import { Head, Link, useForm } from "@inertiajs/vue3";
import { Fragment, createBlock, createCommentVNode, createTextVNode, createVNode, openBlock, renderList, toDisplayString, unref, useSSRContext, vModelCheckbox, vModelText, withCtx, withDirectives, withModifiers } from "vue";
import { ssrIncludeBooleanAttr, ssrInterpolate, ssrLooseContain, ssrRenderAttr, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
//#region resources/js/Pages/Rpp/Edit.vue
var _sfc_main = {
	__name: "Edit",
	__ssrInlineRender: true,
	props: {
		rpp: {
			type: Object,
			required: true
		},
		kelas: {
			type: Array,
			required: true
		}
	},
	setup(__props) {
		const props = __props;
		const form = useForm({
			topik: props.rpp.topik,
			tujuan_pembelajaran: props.rpp.tujuan_pembelajaran || "",
			aktifitas_pembelajaran: props.rpp.aktifitas_pembelajaran || "",
			alat_bahan: props.rpp.alat_bahan || "",
			tugas: props.rpp.tugas || "",
			tenggat_waktu: props.rpp.tenggat_waktu ? props.rpp.tenggat_waktu.slice(0, 16) : "",
			kelas_ids: props.rpp.kelas_ids || [],
			materi_file: null,
			_method: "put"
		});
		const submit = () => {
			form.post(route("rpp.update", props.rpp.id));
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Edit RPP" }, null, _parent));
			_push(ssrRenderComponent(_sfc_main$4, null, {
				header: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<h2 class="font-bold text-lg theme-text"${_scopeId}>Edit RPP</h2>`);
					else return [createVNode("h2", { class: "font-bold text-lg theme-text" }, "Edit RPP")];
				}),
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="p-2"${_scopeId}><div class="w-full max-w-2xl"${_scopeId}><div class="win95-panel p-4"${_scopeId}><form class="space-y-4"${_scopeId}><div${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$1, {
							for: "topik",
							value: "Topik / Pertemuan Ke-",
							class: "theme-text"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$2, {
							id: "topik",
							type: "text",
							class: "mt-1 block w-full",
							modelValue: unref(form).topik,
							"onUpdate:modelValue": ($event) => unref(form).topik = $event,
							required: "",
							autofocus: ""
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_sfc_main$3, {
							class: "mt-2",
							message: unref(form).errors.topik
						}, null, _parent, _scopeId));
						_push(`</div><div${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$1, {
							value: "Kelas yang Diajar (Pilih minimal satu)",
							class: "theme-text mb-1 block"
						}, null, _parent, _scopeId));
						_push(`<div class="win95-panel !p-2 bg-[var(--bg-panel)] h-32 overflow-y-auto"${_scopeId}><!--[-->`);
						ssrRenderList(__props.kelas, (k) => {
							_push(`<div class="flex items-center mb-1"${_scopeId}><input type="checkbox"${ssrRenderAttr("id", "kelas_" + k.id)}${ssrRenderAttr("value", k.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).kelas_ids) ? ssrLooseContain(unref(form).kelas_ids, k.id) : unref(form).kelas_ids) ? " checked" : ""} class="mr-2"${_scopeId}><label${ssrRenderAttr("for", "kelas_" + k.id)} class="theme-text"${_scopeId}>${ssrInterpolate(k.nama_kelas)} (${ssrInterpolate(k.tahun_ajaran)})</label></div>`);
						});
						_push(`<!--]--></div>`);
						_push(ssrRenderComponent(_sfc_main$3, {
							class: "mt-2",
							message: unref(form).errors.kelas_ids
						}, null, _parent, _scopeId));
						_push(`</div><div${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$1, {
							for: "tujuan_pembelajaran",
							value: "Tujuan Pembelajaran",
							class: "theme-text"
						}, null, _parent, _scopeId));
						_push(`<textarea id="tujuan_pembelajaran" class="border border-[var(--border-dark)] bg-[var(--bg-panel)] shadow-[inset_1px_1px_0_var(--border-darker),inset_-1px_-1px_0_var(--border-light)] text-[var(--text-color)] p-1 mt-1 block w-full focus:outline-none h-20"${_scopeId}>${ssrInterpolate(unref(form).tujuan_pembelajaran)}</textarea>`);
						_push(ssrRenderComponent(_sfc_main$3, {
							class: "mt-2",
							message: unref(form).errors.tujuan_pembelajaran
						}, null, _parent, _scopeId));
						_push(`</div><div${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$1, {
							for: "aktifitas_pembelajaran",
							value: "Aktifitas Pembelajaran",
							class: "theme-text"
						}, null, _parent, _scopeId));
						_push(`<textarea id="aktifitas_pembelajaran" class="border border-[var(--border-dark)] bg-[var(--bg-panel)] shadow-[inset_1px_1px_0_var(--border-darker),inset_-1px_-1px_0_var(--border-light)] text-[var(--text-color)] p-1 mt-1 block w-full focus:outline-none h-20"${_scopeId}>${ssrInterpolate(unref(form).aktifitas_pembelajaran)}</textarea>`);
						_push(ssrRenderComponent(_sfc_main$3, {
							class: "mt-2",
							message: unref(form).errors.aktifitas_pembelajaran
						}, null, _parent, _scopeId));
						_push(`</div><div${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$1, {
							for: "alat_bahan",
							value: "Alat dan Bahan",
							class: "theme-text"
						}, null, _parent, _scopeId));
						_push(`<textarea id="alat_bahan" class="border border-[var(--border-dark)] bg-[var(--bg-panel)] shadow-[inset_1px_1px_0_var(--border-darker),inset_-1px_-1px_0_var(--border-light)] text-[var(--text-color)] p-1 mt-1 block w-full focus:outline-none h-16"${_scopeId}>${ssrInterpolate(unref(form).alat_bahan)}</textarea>`);
						_push(ssrRenderComponent(_sfc_main$3, {
							class: "mt-2",
							message: unref(form).errors.alat_bahan
						}, null, _parent, _scopeId));
						_push(`</div><div${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$1, {
							for: "tugas",
							value: "Tugas Siswa",
							class: "theme-text"
						}, null, _parent, _scopeId));
						_push(`<textarea id="tugas" class="border border-[var(--border-dark)] bg-[var(--bg-panel)] shadow-[inset_1px_1px_0_var(--border-darker),inset_-1px_-1px_0_var(--border-light)] text-[var(--text-color)] p-1 mt-1 block w-full focus:outline-none h-16"${_scopeId}>${ssrInterpolate(unref(form).tugas)}</textarea>`);
						_push(ssrRenderComponent(_sfc_main$3, {
							class: "mt-2",
							message: unref(form).errors.tugas
						}, null, _parent, _scopeId));
						_push(`</div><div${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$1, {
							for: "tenggat_waktu",
							value: "Tenggat Waktu Tugas",
							class: "theme-text"
						}, null, _parent, _scopeId));
						_push(`<input id="tenggat_waktu" type="datetime-local" class="border border-[var(--border-dark)] bg-[var(--bg-panel)] shadow-[inset_1px_1px_0_var(--border-darker),inset_-1px_-1px_0_var(--border-light)] text-[var(--text-color)] p-1 mt-1 block w-full focus:outline-none"${ssrRenderAttr("value", unref(form).tenggat_waktu)}${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$3, {
							class: "mt-2",
							message: unref(form).errors.tenggat_waktu
						}, null, _parent, _scopeId));
						_push(`</div><div${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$1, {
							for: "materi_file",
							value: "File Materi Baru (PDF, DOCX, XLSX, PPTX)",
							class: "theme-text"
						}, null, _parent, _scopeId));
						_push(`<input id="materi_file" type="file" class="mt-1 block w-full theme-text"${_scopeId}>`);
						_push(ssrRenderComponent(_sfc_main$3, {
							class: "mt-2",
							message: unref(form).errors.materi_file
						}, null, _parent, _scopeId));
						if (__props.rpp.materi_file) _push(`<div class="mt-2 theme-text text-sm"${_scopeId}> File saat ini: <a${ssrRenderAttr("href", "/storage/" + __props.rpp.materi_file)} target="_blank" class="text-blue-600 underline"${_scopeId}>Lihat File</a></div>`);
						else _push(`<!---->`);
						_push(`</div><div class="flex items-center justify-end mt-4 pt-4 border-t border-[var(--border-dark)]"${_scopeId}>`);
						_push(ssrRenderComponent(unref(Link), {
							href: _ctx.route("rpp.index"),
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
								if (_push) _push(` Simpan Perubahan `);
								else return [createTextVNode(" Simpan Perubahan ")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div></form></div></div></div>`);
					} else return [createVNode("div", { class: "p-2" }, [createVNode("div", { class: "w-full max-w-2xl" }, [createVNode("div", { class: "win95-panel p-4" }, [createVNode("form", {
						onSubmit: withModifiers(submit, ["prevent"]),
						class: "space-y-4"
					}, [
						createVNode("div", null, [
							createVNode(_sfc_main$1, {
								for: "topik",
								value: "Topik / Pertemuan Ke-",
								class: "theme-text"
							}),
							createVNode(_sfc_main$2, {
								id: "topik",
								type: "text",
								class: "mt-1 block w-full",
								modelValue: unref(form).topik,
								"onUpdate:modelValue": ($event) => unref(form).topik = $event,
								required: "",
								autofocus: ""
							}, null, 8, ["modelValue", "onUpdate:modelValue"]),
							createVNode(_sfc_main$3, {
								class: "mt-2",
								message: unref(form).errors.topik
							}, null, 8, ["message"])
						]),
						createVNode("div", null, [
							createVNode(_sfc_main$1, {
								value: "Kelas yang Diajar (Pilih minimal satu)",
								class: "theme-text mb-1 block"
							}),
							createVNode("div", { class: "win95-panel !p-2 bg-[var(--bg-panel)] h-32 overflow-y-auto" }, [(openBlock(true), createBlock(Fragment, null, renderList(__props.kelas, (k) => {
								return openBlock(), createBlock("div", {
									key: k.id,
									class: "flex items-center mb-1"
								}, [withDirectives(createVNode("input", {
									type: "checkbox",
									id: "kelas_" + k.id,
									value: k.id,
									"onUpdate:modelValue": ($event) => unref(form).kelas_ids = $event,
									class: "mr-2"
								}, null, 8, [
									"id",
									"value",
									"onUpdate:modelValue"
								]), [[vModelCheckbox, unref(form).kelas_ids]]), createVNode("label", {
									for: "kelas_" + k.id,
									class: "theme-text"
								}, toDisplayString(k.nama_kelas) + " (" + toDisplayString(k.tahun_ajaran) + ")", 9, ["for"])]);
							}), 128))]),
							createVNode(_sfc_main$3, {
								class: "mt-2",
								message: unref(form).errors.kelas_ids
							}, null, 8, ["message"])
						]),
						createVNode("div", null, [
							createVNode(_sfc_main$1, {
								for: "tujuan_pembelajaran",
								value: "Tujuan Pembelajaran",
								class: "theme-text"
							}),
							withDirectives(createVNode("textarea", {
								id: "tujuan_pembelajaran",
								class: "border border-[var(--border-dark)] bg-[var(--bg-panel)] shadow-[inset_1px_1px_0_var(--border-darker),inset_-1px_-1px_0_var(--border-light)] text-[var(--text-color)] p-1 mt-1 block w-full focus:outline-none h-20",
								"onUpdate:modelValue": ($event) => unref(form).tujuan_pembelajaran = $event
							}, null, 8, ["onUpdate:modelValue"]), [[vModelText, unref(form).tujuan_pembelajaran]]),
							createVNode(_sfc_main$3, {
								class: "mt-2",
								message: unref(form).errors.tujuan_pembelajaran
							}, null, 8, ["message"])
						]),
						createVNode("div", null, [
							createVNode(_sfc_main$1, {
								for: "aktifitas_pembelajaran",
								value: "Aktifitas Pembelajaran",
								class: "theme-text"
							}),
							withDirectives(createVNode("textarea", {
								id: "aktifitas_pembelajaran",
								class: "border border-[var(--border-dark)] bg-[var(--bg-panel)] shadow-[inset_1px_1px_0_var(--border-darker),inset_-1px_-1px_0_var(--border-light)] text-[var(--text-color)] p-1 mt-1 block w-full focus:outline-none h-20",
								"onUpdate:modelValue": ($event) => unref(form).aktifitas_pembelajaran = $event
							}, null, 8, ["onUpdate:modelValue"]), [[vModelText, unref(form).aktifitas_pembelajaran]]),
							createVNode(_sfc_main$3, {
								class: "mt-2",
								message: unref(form).errors.aktifitas_pembelajaran
							}, null, 8, ["message"])
						]),
						createVNode("div", null, [
							createVNode(_sfc_main$1, {
								for: "alat_bahan",
								value: "Alat dan Bahan",
								class: "theme-text"
							}),
							withDirectives(createVNode("textarea", {
								id: "alat_bahan",
								class: "border border-[var(--border-dark)] bg-[var(--bg-panel)] shadow-[inset_1px_1px_0_var(--border-darker),inset_-1px_-1px_0_var(--border-light)] text-[var(--text-color)] p-1 mt-1 block w-full focus:outline-none h-16",
								"onUpdate:modelValue": ($event) => unref(form).alat_bahan = $event
							}, null, 8, ["onUpdate:modelValue"]), [[vModelText, unref(form).alat_bahan]]),
							createVNode(_sfc_main$3, {
								class: "mt-2",
								message: unref(form).errors.alat_bahan
							}, null, 8, ["message"])
						]),
						createVNode("div", null, [
							createVNode(_sfc_main$1, {
								for: "tugas",
								value: "Tugas Siswa",
								class: "theme-text"
							}),
							withDirectives(createVNode("textarea", {
								id: "tugas",
								class: "border border-[var(--border-dark)] bg-[var(--bg-panel)] shadow-[inset_1px_1px_0_var(--border-darker),inset_-1px_-1px_0_var(--border-light)] text-[var(--text-color)] p-1 mt-1 block w-full focus:outline-none h-16",
								"onUpdate:modelValue": ($event) => unref(form).tugas = $event
							}, null, 8, ["onUpdate:modelValue"]), [[vModelText, unref(form).tugas]]),
							createVNode(_sfc_main$3, {
								class: "mt-2",
								message: unref(form).errors.tugas
							}, null, 8, ["message"])
						]),
						createVNode("div", null, [
							createVNode(_sfc_main$1, {
								for: "tenggat_waktu",
								value: "Tenggat Waktu Tugas",
								class: "theme-text"
							}),
							withDirectives(createVNode("input", {
								id: "tenggat_waktu",
								type: "datetime-local",
								class: "border border-[var(--border-dark)] bg-[var(--bg-panel)] shadow-[inset_1px_1px_0_var(--border-darker),inset_-1px_-1px_0_var(--border-light)] text-[var(--text-color)] p-1 mt-1 block w-full focus:outline-none",
								"onUpdate:modelValue": ($event) => unref(form).tenggat_waktu = $event
							}, null, 8, ["onUpdate:modelValue"]), [[vModelText, unref(form).tenggat_waktu]]),
							createVNode(_sfc_main$3, {
								class: "mt-2",
								message: unref(form).errors.tenggat_waktu
							}, null, 8, ["message"])
						]),
						createVNode("div", null, [
							createVNode(_sfc_main$1, {
								for: "materi_file",
								value: "File Materi Baru (PDF, DOCX, XLSX, PPTX)",
								class: "theme-text"
							}),
							createVNode("input", {
								id: "materi_file",
								type: "file",
								class: "mt-1 block w-full theme-text",
								onInput: ($event) => unref(form).materi_file = $event.target.files[0]
							}, null, 40, ["onInput"]),
							createVNode(_sfc_main$3, {
								class: "mt-2",
								message: unref(form).errors.materi_file
							}, null, 8, ["message"]),
							__props.rpp.materi_file ? (openBlock(), createBlock("div", {
								key: 0,
								class: "mt-2 theme-text text-sm"
							}, [createTextVNode(" File saat ini: "), createVNode("a", {
								href: "/storage/" + __props.rpp.materi_file,
								target: "_blank",
								class: "text-blue-600 underline"
							}, "Lihat File", 8, ["href"])])) : createCommentVNode("", true)
						]),
						createVNode("div", { class: "flex items-center justify-end mt-4 pt-4 border-t border-[var(--border-dark)]" }, [createVNode(unref(Link), {
							href: _ctx.route("rpp.index"),
							class: "win95-btn mr-2 !px-4 hover:text-black theme-text"
						}, {
							default: withCtx(() => [createTextVNode(" Batal ")]),
							_: 1
						}, 8, ["href"]), createVNode(PrimaryButton_default, {
							class: [{ "opacity-25": unref(form).processing }, "win95-btn !px-4"],
							disabled: unref(form).processing
						}, {
							default: withCtx(() => [createTextVNode(" Simpan Perubahan ")]),
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Rpp/Edit.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
export { _sfc_main as default };
