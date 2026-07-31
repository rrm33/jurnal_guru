import { t as PrimaryButton_default } from "./PrimaryButton-C9i0DqMF.js";
import { t as _sfc_main$1 } from "./AuthenticatedLayout-C1P-b31-.js";
import { Head, Link, useForm } from "@inertiajs/vue3";
import { Fragment, createBlock, createCommentVNode, createTextVNode, createVNode, openBlock, renderList, toDisplayString, unref, useSSRContext, vModelRadio, vModelText, withCtx, withDirectives, withModifiers } from "vue";
import { ssrIncludeBooleanAttr, ssrInterpolate, ssrLooseEqual, ssrRenderAttr, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
//#region resources/js/Pages/Presensi/Index.vue
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
		const form = useForm({ presensi: props.siswas.map((siswa) => ({
			siswa_id: siswa.id,
			status: siswa.presensi.status,
			alasan: siswa.presensi.alasan
		})) });
		const submit = () => {
			form.post(route("presensi.store", {
				rpp: props.rpp.id,
				kelas: props.kelas.id
			}));
		};
		const setAllStatus = (status) => {
			form.presensi.forEach((p) => {
				p.status = status;
				if (status === "hadir") p.alasan = "";
			});
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Presensi: " + __props.kelas.nama_kelas }, null, _parent));
			_push(ssrRenderComponent(_sfc_main$1, null, {
				header: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<h2 class="font-bold text-lg theme-text"${_scopeId}>Presensi Kelas ${ssrInterpolate(__props.kelas.nama_kelas)}</h2><div class="text-sm theme-text"${_scopeId}>RPP: ${ssrInterpolate(__props.rpp.topik)}</div>`);
					else return [createVNode("h2", { class: "font-bold text-lg theme-text" }, "Presensi Kelas " + toDisplayString(__props.kelas.nama_kelas), 1), createVNode("div", { class: "text-sm theme-text" }, "RPP: " + toDisplayString(__props.rpp.topik), 1)];
				}),
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="p-2"${_scopeId}><div class="w-full"${_scopeId}><div class="win95-panel p-4"${_scopeId}><div class="flex justify-between items-end mb-4 border-b border-[var(--border-dark)] pb-2"${_scopeId}><h3 class="text-md font-bold theme-text"${_scopeId}>Daftar Siswa</h3><div class="flex space-x-2"${_scopeId}><button type="button" class="win95-btn !px-2"${_scopeId}>Hadir Semua</button>`);
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
						_push(`</div></div><form${_scopeId}><div class="overflow-x-auto"${_scopeId}><table class="w-full text-sm text-left border-collapse mb-4"${_scopeId}><thead class="bg-[var(--bg-window)] theme-text border-b border-[var(--border-dark)]"${_scopeId}><tr${_scopeId}><th scope="col" class="px-2 py-1 border-r border-[var(--border-dark)] w-10"${_scopeId}>No</th><th scope="col" class="px-2 py-1 border-r border-[var(--border-dark)]"${_scopeId}>Nama Siswa</th><th scope="col" class="px-2 py-1 border-r border-[var(--border-dark)] w-48 text-center"${_scopeId}>Status</th><th scope="col" class="px-2 py-1"${_scopeId}>Keterangan / Alasan</th></tr></thead><tbody${_scopeId}><!--[-->`);
						ssrRenderList(__props.siswas, (siswa, index) => {
							_push(`<tr class="bg-[var(--bg-panel)] theme-text border-b border-[var(--border-light)]"${_scopeId}><td class="px-2 py-1 border-r border-[var(--border-light)] text-center"${_scopeId}>${ssrInterpolate(index + 1)}</td><td class="px-2 py-1 border-r border-[var(--border-light)] font-bold"${_scopeId}>${ssrInterpolate(siswa.nama)} <span class="text-xs font-normal text-gray-500"${_scopeId}>(${ssrInterpolate(siswa.nis)})</span></td><td class="px-2 py-1 border-r border-[var(--border-light)]"${_scopeId}><div class="flex items-center justify-center space-x-3"${_scopeId}><label class="flex items-center space-x-1 cursor-pointer"${_scopeId}><input type="radio"${ssrRenderAttr("name", "status_" + siswa.id)} value="hadir"${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).presensi[index].status, "hadir")) ? " checked" : ""}${_scopeId}><span${_scopeId}>H</span></label><label class="flex items-center space-x-1 cursor-pointer"${_scopeId}><input type="radio"${ssrRenderAttr("name", "status_" + siswa.id)} value="sakit"${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).presensi[index].status, "sakit")) ? " checked" : ""}${_scopeId}><span${_scopeId}>S</span></label><label class="flex items-center space-x-1 cursor-pointer"${_scopeId}><input type="radio"${ssrRenderAttr("name", "status_" + siswa.id)} value="izin"${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).presensi[index].status, "izin")) ? " checked" : ""}${_scopeId}><span${_scopeId}>I</span></label><label class="flex items-center space-x-1 cursor-pointer"${_scopeId}><input type="radio"${ssrRenderAttr("name", "status_" + siswa.id)} value="alpa"${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).presensi[index].status, "alpa")) ? " checked" : ""}${_scopeId}><span${_scopeId}>A</span></label></div></td><td class="px-2 py-1"${_scopeId}><input type="text"${ssrRenderAttr("value", unref(form).presensi[index].alasan)} class="border border-[var(--border-dark)] bg-[var(--bg-window)] text-[var(--text-color)] px-1 w-full focus:outline-none"${ssrIncludeBooleanAttr(unref(form).presensi[index].status === "hadir") ? " disabled" : ""} placeholder="Alasan..."${_scopeId}></td></tr>`);
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
								if (_push) _push(` Simpan Presensi `);
								else return [createTextVNode(" Simpan Presensi ")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div></form></div></div></div>`);
					} else return [createVNode("div", { class: "p-2" }, [createVNode("div", { class: "w-full" }, [createVNode("div", { class: "win95-panel p-4" }, [createVNode("div", { class: "flex justify-between items-end mb-4 border-b border-[var(--border-dark)] pb-2" }, [createVNode("h3", { class: "text-md font-bold theme-text" }, "Daftar Siswa"), createVNode("div", { class: "flex space-x-2" }, [createVNode("button", {
						onClick: ($event) => setAllStatus("hadir"),
						type: "button",
						class: "win95-btn !px-2"
					}, "Hadir Semua", 8, ["onClick"]), createVNode(unref(Link), {
						href: _ctx.route("rpp.show", __props.rpp.id),
						class: "win95-btn font-bold"
					}, {
						default: withCtx(() => [createTextVNode(" Kembali ke RPP ")]),
						_: 1
					}, 8, ["href"])])]), createVNode("form", { onSubmit: withModifiers(submit, ["prevent"]) }, [createVNode("div", { class: "overflow-x-auto" }, [createVNode("table", { class: "w-full text-sm text-left border-collapse mb-4" }, [createVNode("thead", { class: "bg-[var(--bg-window)] theme-text border-b border-[var(--border-dark)]" }, [createVNode("tr", null, [
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
							class: "px-2 py-1 border-r border-[var(--border-dark)] w-48 text-center"
						}, "Status"),
						createVNode("th", {
							scope: "col",
							class: "px-2 py-1"
						}, "Keterangan / Alasan")
					])]), createVNode("tbody", null, [(openBlock(true), createBlock(Fragment, null, renderList(__props.siswas, (siswa, index) => {
						return openBlock(), createBlock("tr", {
							key: siswa.id,
							class: "bg-[var(--bg-panel)] theme-text border-b border-[var(--border-light)]"
						}, [
							createVNode("td", { class: "px-2 py-1 border-r border-[var(--border-light)] text-center" }, toDisplayString(index + 1), 1),
							createVNode("td", { class: "px-2 py-1 border-r border-[var(--border-light)] font-bold" }, [createTextVNode(toDisplayString(siswa.nama) + " ", 1), createVNode("span", { class: "text-xs font-normal text-gray-500" }, "(" + toDisplayString(siswa.nis) + ")", 1)]),
							createVNode("td", { class: "px-2 py-1 border-r border-[var(--border-light)]" }, [createVNode("div", { class: "flex items-center justify-center space-x-3" }, [
								createVNode("label", { class: "flex items-center space-x-1 cursor-pointer" }, [withDirectives(createVNode("input", {
									type: "radio",
									name: "status_" + siswa.id,
									value: "hadir",
									"onUpdate:modelValue": ($event) => unref(form).presensi[index].status = $event
								}, null, 8, ["name", "onUpdate:modelValue"]), [[vModelRadio, unref(form).presensi[index].status]]), createVNode("span", null, "H")]),
								createVNode("label", { class: "flex items-center space-x-1 cursor-pointer" }, [withDirectives(createVNode("input", {
									type: "radio",
									name: "status_" + siswa.id,
									value: "sakit",
									"onUpdate:modelValue": ($event) => unref(form).presensi[index].status = $event
								}, null, 8, ["name", "onUpdate:modelValue"]), [[vModelRadio, unref(form).presensi[index].status]]), createVNode("span", null, "S")]),
								createVNode("label", { class: "flex items-center space-x-1 cursor-pointer" }, [withDirectives(createVNode("input", {
									type: "radio",
									name: "status_" + siswa.id,
									value: "izin",
									"onUpdate:modelValue": ($event) => unref(form).presensi[index].status = $event
								}, null, 8, ["name", "onUpdate:modelValue"]), [[vModelRadio, unref(form).presensi[index].status]]), createVNode("span", null, "I")]),
								createVNode("label", { class: "flex items-center space-x-1 cursor-pointer" }, [withDirectives(createVNode("input", {
									type: "radio",
									name: "status_" + siswa.id,
									value: "alpa",
									"onUpdate:modelValue": ($event) => unref(form).presensi[index].status = $event
								}, null, 8, ["name", "onUpdate:modelValue"]), [[vModelRadio, unref(form).presensi[index].status]]), createVNode("span", null, "A")])
							])]),
							createVNode("td", { class: "px-2 py-1" }, [withDirectives(createVNode("input", {
								type: "text",
								"onUpdate:modelValue": ($event) => unref(form).presensi[index].alasan = $event,
								class: "border border-[var(--border-dark)] bg-[var(--bg-window)] text-[var(--text-color)] px-1 w-full focus:outline-none",
								disabled: unref(form).presensi[index].status === "hadir",
								placeholder: "Alasan..."
							}, null, 8, ["onUpdate:modelValue", "disabled"]), [[vModelText, unref(form).presensi[index].alasan]])])
						]);
					}), 128)), __props.siswas.length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [createVNode("td", {
						colspan: "4",
						class: "px-2 py-4 text-center text-gray-500 theme-text"
					}, " Belum ada siswa di kelas ini. ")])) : createCommentVNode("", true)])])]), createVNode("div", { class: "flex justify-end mt-4 pt-4 border-t border-[var(--border-dark)]" }, [createVNode(PrimaryButton_default, {
						class: [{ "opacity-25": unref(form).processing }, "win95-btn !px-6 py-2 text-lg"],
						disabled: unref(form).processing
					}, {
						default: withCtx(() => [createTextVNode(" Simpan Presensi ")]),
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Presensi/Index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
export { _sfc_main as default };
