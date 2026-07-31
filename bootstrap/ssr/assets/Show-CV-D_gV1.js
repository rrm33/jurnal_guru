import { t as _sfc_main$1 } from "./AuthenticatedLayout-C1P-b31-.js";
import { Head, Link } from "@inertiajs/vue3";
import { Fragment, createBlock, createCommentVNode, createTextVNode, createVNode, openBlock, renderList, toDisplayString, unref, useSSRContext, withCtx } from "vue";
import { ssrInterpolate, ssrRenderAttr, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
//#region resources/js/Pages/Rpp/Show.vue
var _sfc_main = {
	__name: "Show",
	__ssrInlineRender: true,
	props: { rpp: {
		type: Object,
		required: true
	} },
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Detail RPP: " + __props.rpp.topik }, null, _parent));
			_push(ssrRenderComponent(_sfc_main$1, null, {
				header: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<h2 class="font-bold text-lg theme-text"${_scopeId}>Detail RPP: ${ssrInterpolate(__props.rpp.topik)}</h2>`);
					else return [createVNode("h2", { class: "font-bold text-lg theme-text" }, "Detail RPP: " + toDisplayString(__props.rpp.topik), 1)];
				}),
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="p-2 flex flex-col md:flex-row gap-4"${_scopeId}><div class="flex-1"${_scopeId}><div class="win95-panel p-4 mb-4"${_scopeId}><h3 class="font-bold theme-text mb-4 border-b border-[var(--border-dark)] pb-1"${_scopeId}>Informasi Perencanaan</h3><div class="space-y-3 theme-text"${_scopeId}><div${_scopeId}><span class="font-bold block"${_scopeId}>Tujuan Pembelajaran:</span><div class="whitespace-pre-wrap"${_scopeId}>${ssrInterpolate(__props.rpp.tujuan_pembelajaran || "-")}</div></div><div${_scopeId}><span class="font-bold block"${_scopeId}>Aktifitas Pembelajaran:</span><div class="whitespace-pre-wrap"${_scopeId}>${ssrInterpolate(__props.rpp.aktifitas_pembelajaran || "-")}</div></div><div${_scopeId}><span class="font-bold block"${_scopeId}>Alat dan Bahan:</span><div class="whitespace-pre-wrap"${_scopeId}>${ssrInterpolate(__props.rpp.alat_bahan || "-")}</div></div><div${_scopeId}><span class="font-bold block"${_scopeId}>Materi File:</span>`);
						if (__props.rpp.materi_file) _push(`<div${_scopeId}><a${ssrRenderAttr("href", "/storage/" + __props.rpp.materi_file)} target="_blank" class="text-blue-600 underline"${_scopeId}>Unduh/Lihat Materi</a></div>`);
						else _push(`<div${_scopeId}>-</div>`);
						_push(`</div><div${_scopeId}><span class="font-bold block"${_scopeId}>Tugas:</span><div class="whitespace-pre-wrap"${_scopeId}>${ssrInterpolate(__props.rpp.tugas || "-")}</div></div><div${_scopeId}><span class="font-bold block"${_scopeId}>Tenggat Waktu:</span><div${_scopeId}>${ssrInterpolate(__props.rpp.tenggat_waktu ? new Date(__props.rpp.tenggat_waktu).toLocaleString() : "-")}</div></div></div><div class="mt-4 pt-4 border-t border-[var(--border-dark)]"${_scopeId}>`);
						_push(ssrRenderComponent(unref(Link), {
							href: _ctx.route("rpp.index"),
							class: "win95-btn mr-2 !px-4"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Kembali `);
								else return [createTextVNode(" Kembali ")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(unref(Link), {
							href: _ctx.route("rpp.edit", __props.rpp.id),
							class: "win95-btn !px-4 font-bold"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Edit RPP `);
								else return [createTextVNode(" Edit RPP ")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div></div></div><div class="w-full md:w-1/3"${_scopeId}><div class="win95-panel p-4"${_scopeId}><h3 class="font-bold theme-text mb-4 border-b border-[var(--border-dark)] pb-1"${_scopeId}>Kelas Terkait</h3>`);
						if (_ctx.$page.props.flash?.success) _push(`<div class="win95-panel !p-2 mb-4 bg-[#008080] text-white font-bold text-sm"${_scopeId}>${ssrInterpolate(_ctx.$page.props.flash.success)}</div>`);
						else _push(`<!---->`);
						if (__props.rpp.kelas && __props.rpp.kelas.length > 0) {
							_push(`<div class="space-y-4"${_scopeId}><!--[-->`);
							ssrRenderList(__props.rpp.kelas, (k) => {
								_push(`<div class="win95-panel p-2 bg-[var(--bg-panel)]"${_scopeId}><h4 class="font-bold theme-text text-md mb-2"${_scopeId}>${ssrInterpolate(k.nama_kelas)} (${ssrInterpolate(k.tahun_ajaran)})</h4><div class="flex flex-col space-y-2"${_scopeId}>`);
								_push(ssrRenderComponent(unref(Link), {
									href: _ctx.route("presensi.index", {
										rpp: __props.rpp.id,
										kelas: k.id
									}),
									class: "win95-btn w-full text-center flex items-center justify-center space-x-2"
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(`<img src="https://win98icons.alexmeub.com/icons/png/users-1.png" class="w-4 h-4"${_scopeId}><span${_scopeId}>Presensi Kelas</span>`);
										else return [createVNode("img", {
											src: "https://win98icons.alexmeub.com/icons/png/users-1.png",
											class: "w-4 h-4"
										}), createVNode("span", null, "Presensi Kelas")];
									}),
									_: 2
								}, _parent, _scopeId));
								_push(ssrRenderComponent(unref(Link), {
									href: _ctx.route("penilaian.index", {
										rpp: __props.rpp.id,
										kelas: k.id
									}),
									class: "win95-btn w-full text-center flex items-center justify-center space-x-2"
								}, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) _push(`<img src="https://win98icons.alexmeub.com/icons/png/notepad_file-0.png" class="w-4 h-4"${_scopeId}><span${_scopeId}>Koreksi Tugas</span>`);
										else return [createVNode("img", {
											src: "https://win98icons.alexmeub.com/icons/png/notepad_file-0.png",
											class: "w-4 h-4"
										}), createVNode("span", null, "Koreksi Tugas")];
									}),
									_: 2
								}, _parent, _scopeId));
								_push(`</div></div>`);
							});
							_push(`<!--]--></div>`);
						} else _push(`<div class="text-gray-500 text-sm theme-text"${_scopeId}> RPP ini belum ditautkan ke kelas manapun. Silakan edit RPP untuk memilih kelas. </div>`);
						_push(`</div></div></div>`);
					} else return [createVNode("div", { class: "p-2 flex flex-col md:flex-row gap-4" }, [createVNode("div", { class: "flex-1" }, [createVNode("div", { class: "win95-panel p-4 mb-4" }, [
						createVNode("h3", { class: "font-bold theme-text mb-4 border-b border-[var(--border-dark)] pb-1" }, "Informasi Perencanaan"),
						createVNode("div", { class: "space-y-3 theme-text" }, [
							createVNode("div", null, [createVNode("span", { class: "font-bold block" }, "Tujuan Pembelajaran:"), createVNode("div", { class: "whitespace-pre-wrap" }, toDisplayString(__props.rpp.tujuan_pembelajaran || "-"), 1)]),
							createVNode("div", null, [createVNode("span", { class: "font-bold block" }, "Aktifitas Pembelajaran:"), createVNode("div", { class: "whitespace-pre-wrap" }, toDisplayString(__props.rpp.aktifitas_pembelajaran || "-"), 1)]),
							createVNode("div", null, [createVNode("span", { class: "font-bold block" }, "Alat dan Bahan:"), createVNode("div", { class: "whitespace-pre-wrap" }, toDisplayString(__props.rpp.alat_bahan || "-"), 1)]),
							createVNode("div", null, [createVNode("span", { class: "font-bold block" }, "Materi File:"), __props.rpp.materi_file ? (openBlock(), createBlock("div", { key: 0 }, [createVNode("a", {
								href: "/storage/" + __props.rpp.materi_file,
								target: "_blank",
								class: "text-blue-600 underline"
							}, "Unduh/Lihat Materi", 8, ["href"])])) : (openBlock(), createBlock("div", { key: 1 }, "-"))]),
							createVNode("div", null, [createVNode("span", { class: "font-bold block" }, "Tugas:"), createVNode("div", { class: "whitespace-pre-wrap" }, toDisplayString(__props.rpp.tugas || "-"), 1)]),
							createVNode("div", null, [createVNode("span", { class: "font-bold block" }, "Tenggat Waktu:"), createVNode("div", null, toDisplayString(__props.rpp.tenggat_waktu ? new Date(__props.rpp.tenggat_waktu).toLocaleString() : "-"), 1)])
						]),
						createVNode("div", { class: "mt-4 pt-4 border-t border-[var(--border-dark)]" }, [createVNode(unref(Link), {
							href: _ctx.route("rpp.index"),
							class: "win95-btn mr-2 !px-4"
						}, {
							default: withCtx(() => [createTextVNode(" Kembali ")]),
							_: 1
						}, 8, ["href"]), createVNode(unref(Link), {
							href: _ctx.route("rpp.edit", __props.rpp.id),
							class: "win95-btn !px-4 font-bold"
						}, {
							default: withCtx(() => [createTextVNode(" Edit RPP ")]),
							_: 1
						}, 8, ["href"])])
					])]), createVNode("div", { class: "w-full md:w-1/3" }, [createVNode("div", { class: "win95-panel p-4" }, [
						createVNode("h3", { class: "font-bold theme-text mb-4 border-b border-[var(--border-dark)] pb-1" }, "Kelas Terkait"),
						_ctx.$page.props.flash?.success ? (openBlock(), createBlock("div", {
							key: 0,
							class: "win95-panel !p-2 mb-4 bg-[#008080] text-white font-bold text-sm"
						}, toDisplayString(_ctx.$page.props.flash.success), 1)) : createCommentVNode("", true),
						__props.rpp.kelas && __props.rpp.kelas.length > 0 ? (openBlock(), createBlock("div", {
							key: 1,
							class: "space-y-4"
						}, [(openBlock(true), createBlock(Fragment, null, renderList(__props.rpp.kelas, (k) => {
							return openBlock(), createBlock("div", {
								key: k.id,
								class: "win95-panel p-2 bg-[var(--bg-panel)]"
							}, [createVNode("h4", { class: "font-bold theme-text text-md mb-2" }, toDisplayString(k.nama_kelas) + " (" + toDisplayString(k.tahun_ajaran) + ")", 1), createVNode("div", { class: "flex flex-col space-y-2" }, [createVNode(unref(Link), {
								href: _ctx.route("presensi.index", {
									rpp: __props.rpp.id,
									kelas: k.id
								}),
								class: "win95-btn w-full text-center flex items-center justify-center space-x-2"
							}, {
								default: withCtx(() => [createVNode("img", {
									src: "https://win98icons.alexmeub.com/icons/png/users-1.png",
									class: "w-4 h-4"
								}), createVNode("span", null, "Presensi Kelas")]),
								_: 1
							}, 8, ["href"]), createVNode(unref(Link), {
								href: _ctx.route("penilaian.index", {
									rpp: __props.rpp.id,
									kelas: k.id
								}),
								class: "win95-btn w-full text-center flex items-center justify-center space-x-2"
							}, {
								default: withCtx(() => [createVNode("img", {
									src: "https://win98icons.alexmeub.com/icons/png/notepad_file-0.png",
									class: "w-4 h-4"
								}), createVNode("span", null, "Koreksi Tugas")]),
								_: 1
							}, 8, ["href"])])]);
						}), 128))])) : (openBlock(), createBlock("div", {
							key: 2,
							class: "text-gray-500 text-sm theme-text"
						}, " RPP ini belum ditautkan ke kelas manapun. Silakan edit RPP untuk memilih kelas. "))
					])])])];
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Rpp/Show.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
export { _sfc_main as default };
