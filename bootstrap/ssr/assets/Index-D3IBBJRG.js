import { t as PrimaryButton_default } from "./PrimaryButton-C9i0DqMF.js";
import { t as _sfc_main$1 } from "./AuthenticatedLayout-C1P-b31-.js";
import { Head, Link, useForm } from "@inertiajs/vue3";
import { Fragment, createBlock, createCommentVNode, createTextVNode, createVNode, openBlock, renderList, toDisplayString, unref, useSSRContext, vModelText, withCtx, withDirectives, withModifiers } from "vue";
import { ssrInterpolate, ssrRenderAttr, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
//#region resources/js/Pages/Penilaian/Index.vue
var _sfc_main = {
	__name: "Index",
	__ssrInlineRender: true,
	props: {
		rpp: {
			type: Object,
			required: true
		},
		kelas: {
			type: Object,
			required: true
		},
		siswas: {
			type: Array,
			required: true
		}
	},
	setup(__props) {
		const props = __props;
		const form = useForm({ penilaian: props.siswas.map((siswa) => ({
			siswa_id: siswa.id,
			nilai: siswa.penilaian.nilai,
			feedback: siswa.penilaian.feedback
		})) });
		const submit = () => {
			form.post(route("penilaian.store", {
				rpp: props.rpp.id,
				kelas: props.kelas.id
			}));
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Koreksi Tugas: " + __props.kelas.nama_kelas }, null, _parent));
			_push(ssrRenderComponent(_sfc_main$1, null, {
				header: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<h2 class="font-bold text-lg theme-text"${_scopeId}>Koreksi Tugas Kelas ${ssrInterpolate(__props.kelas.nama_kelas)}</h2><div class="text-sm theme-text"${_scopeId}>RPP: ${ssrInterpolate(__props.rpp.topik)}</div><div class="text-sm theme-text text-gray-600 mt-1"${_scopeId}>Tugas: ${ssrInterpolate(__props.rpp.tugas || "-")}</div>`);
					else return [
						createVNode("h2", { class: "font-bold text-lg theme-text" }, "Koreksi Tugas Kelas " + toDisplayString(__props.kelas.nama_kelas), 1),
						createVNode("div", { class: "text-sm theme-text" }, "RPP: " + toDisplayString(__props.rpp.topik), 1),
						createVNode("div", { class: "text-sm theme-text text-gray-600 mt-1" }, "Tugas: " + toDisplayString(__props.rpp.tugas || "-"), 1)
					];
				}),
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="p-2"${_scopeId}><div class="w-full"${_scopeId}><div class="win95-panel p-4"${_scopeId}><div class="flex justify-between items-end mb-4 border-b border-[var(--border-dark)] pb-2"${_scopeId}><h3 class="text-md font-bold theme-text"${_scopeId}>Daftar Siswa &amp; Penilaian</h3>`);
						_push(ssrRenderComponent(unref(Link), {
							href: _ctx.route("rpp.show", __props.rpp.id),
							class: "win95-btn font-bold"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Kembali ke RPP `);
								else return [createTextVNode(" Kembali ke RPP ")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div><form${_scopeId}><div class="overflow-x-auto"${_scopeId}><table class="w-full text-sm text-left border-collapse mb-4"${_scopeId}><thead class="bg-[var(--bg-window)] theme-text border-b border-[var(--border-dark)]"${_scopeId}><tr${_scopeId}><th scope="col" class="px-2 py-1 border-r border-[var(--border-dark)] w-10"${_scopeId}>No</th><th scope="col" class="px-2 py-1 border-r border-[var(--border-dark)]"${_scopeId}>Nama Siswa</th><th scope="col" class="px-2 py-1 border-r border-[var(--border-dark)] w-32 text-center"${_scopeId}>Nilai (0-100)</th><th scope="col" class="px-2 py-1"${_scopeId}>Feedback / Catatan Guru</th></tr></thead><tbody${_scopeId}><!--[-->`);
						ssrRenderList(__props.siswas, (siswa, index) => {
							_push(`<tr class="bg-[var(--bg-panel)] theme-text border-b border-[var(--border-light)] hover:bg-[#000080] hover:text-white group"${_scopeId}><td class="px-2 py-2 border-r border-[var(--border-light)] text-center"${_scopeId}>${ssrInterpolate(index + 1)}</td><td class="px-2 py-2 border-r border-[var(--border-light)] font-bold"${_scopeId}>${ssrInterpolate(siswa.nama)} <span class="text-xs font-normal opacity-75"${_scopeId}>(${ssrInterpolate(siswa.nis)})</span></td><td class="px-2 py-2 border-r border-[var(--border-light)]"${_scopeId}><input type="number" min="0" max="100"${ssrRenderAttr("value", unref(form).penilaian[index].nilai)} class="border border-[var(--border-dark)] bg-[var(--bg-window)] text-[var(--text-color)] px-1 py-1 w-full focus:outline-none text-center group-hover:text-black" placeholder="Kosong"${_scopeId}></td><td class="px-2 py-2"${_scopeId}><input type="text"${ssrRenderAttr("value", unref(form).penilaian[index].feedback)} class="border border-[var(--border-dark)] bg-[var(--bg-window)] text-[var(--text-color)] px-2 py-1 w-full focus:outline-none group-hover:text-black" placeholder="Tuliskan catatan untuk siswa ini..."${_scopeId}></td></tr>`);
						});
						_push(`<!--]-->`);
						if (__props.siswas.length === 0) _push(`<tr${_scopeId}><td colspan="4" class="px-2 py-4 text-center text-gray-500 theme-text"${_scopeId}> Belum ada siswa di kelas ini. </td></tr>`);
						else _push(`<!---->`);
						_push(`</tbody></table></div><div class="flex justify-end mt-4 pt-4 border-t border-[var(--border-dark)]"${_scopeId}>`);
						_push(ssrRenderComponent(PrimaryButton_default, {
							class: [{ "opacity-25": unref(form).processing }, "win95-btn !px-6 py-2 text-lg"],
							disabled: unref(form).processing
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Simpan Penilaian `);
								else return [createTextVNode(" Simpan Penilaian ")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div></form></div></div></div>`);
					} else return [createVNode("div", { class: "p-2" }, [createVNode("div", { class: "w-full" }, [createVNode("div", { class: "win95-panel p-4" }, [createVNode("div", { class: "flex justify-between items-end mb-4 border-b border-[var(--border-dark)] pb-2" }, [createVNode("h3", { class: "text-md font-bold theme-text" }, "Daftar Siswa & Penilaian"), createVNode(unref(Link), {
						href: _ctx.route("rpp.show", __props.rpp.id),
						class: "win95-btn font-bold"
					}, {
						default: withCtx(() => [createTextVNode(" Kembali ke RPP ")]),
						_: 1
					}, 8, ["href"])]), createVNode("form", { onSubmit: withModifiers(submit, ["prevent"]) }, [createVNode("div", { class: "overflow-x-auto" }, [createVNode("table", { class: "w-full text-sm text-left border-collapse mb-4" }, [createVNode("thead", { class: "bg-[var(--bg-window)] theme-text border-b border-[var(--border-dark)]" }, [createVNode("tr", null, [
						createVNode("th", {
							scope: "col",
							class: "px-2 py-1 border-r border-[var(--border-dark)] w-10"
						}, "No"),
						createVNode("th", {
							scope: "col",
							class: "px-2 py-1 border-r border-[var(--border-dark)]"
						}, "Nama Siswa"),
						createVNode("th", {
							scope: "col",
							class: "px-2 py-1 border-r border-[var(--border-dark)] w-32 text-center"
						}, "Nilai (0-100)"),
						createVNode("th", {
							scope: "col",
							class: "px-2 py-1"
						}, "Feedback / Catatan Guru")
					])]), createVNode("tbody", null, [(openBlock(true), createBlock(Fragment, null, renderList(__props.siswas, (siswa, index) => {
						return openBlock(), createBlock("tr", {
							key: siswa.id,
							class: "bg-[var(--bg-panel)] theme-text border-b border-[var(--border-light)] hover:bg-[#000080] hover:text-white group"
						}, [
							createVNode("td", { class: "px-2 py-2 border-r border-[var(--border-light)] text-center" }, toDisplayString(index + 1), 1),
							createVNode("td", { class: "px-2 py-2 border-r border-[var(--border-light)] font-bold" }, [createTextVNode(toDisplayString(siswa.nama) + " ", 1), createVNode("span", { class: "text-xs font-normal opacity-75" }, "(" + toDisplayString(siswa.nis) + ")", 1)]),
							createVNode("td", { class: "px-2 py-2 border-r border-[var(--border-light)]" }, [withDirectives(createVNode("input", {
								type: "number",
								min: "0",
								max: "100",
								"onUpdate:modelValue": ($event) => unref(form).penilaian[index].nilai = $event,
								class: "border border-[var(--border-dark)] bg-[var(--bg-window)] text-[var(--text-color)] px-1 py-1 w-full focus:outline-none text-center group-hover:text-black",
								placeholder: "Kosong"
							}, null, 8, ["onUpdate:modelValue"]), [[vModelText, unref(form).penilaian[index].nilai]])]),
							createVNode("td", { class: "px-2 py-2" }, [withDirectives(createVNode("input", {
								type: "text",
								"onUpdate:modelValue": ($event) => unref(form).penilaian[index].feedback = $event,
								class: "border border-[var(--border-dark)] bg-[var(--bg-window)] text-[var(--text-color)] px-2 py-1 w-full focus:outline-none group-hover:text-black",
								placeholder: "Tuliskan catatan untuk siswa ini..."
							}, null, 8, ["onUpdate:modelValue"]), [[vModelText, unref(form).penilaian[index].feedback]])])
						]);
					}), 128)), __props.siswas.length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [createVNode("td", {
						colspan: "4",
						class: "px-2 py-4 text-center text-gray-500 theme-text"
					}, " Belum ada siswa di kelas ini. ")])) : createCommentVNode("", true)])])]), createVNode("div", { class: "flex justify-end mt-4 pt-4 border-t border-[var(--border-dark)]" }, [createVNode(PrimaryButton_default, {
						class: [{ "opacity-25": unref(form).processing }, "win95-btn !px-6 py-2 text-lg"],
						disabled: unref(form).processing
					}, {
						default: withCtx(() => [createTextVNode(" Simpan Penilaian ")]),
						_: 1
					}, 8, ["class", "disabled"])])], 32)])])])];
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Penilaian/Index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
export { _sfc_main as default };
