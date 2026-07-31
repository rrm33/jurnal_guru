import { t as _sfc_main$1 } from "./AuthenticatedLayout-C1P-b31-.js";
import { t as Pagination_default } from "./Pagination-DbvRrq2i.js";
import { Head, Link, router } from "@inertiajs/vue3";
import { Fragment, createBlock, createCommentVNode, createSlots, createTextVNode, createVNode, onMounted, openBlock, ref, renderList, toDisplayString, unref, useSSRContext, withCtx, withModifiers } from "vue";
import { ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
//#region resources/js/Pages/Rpp/Index.vue
var _sfc_main = {
	__name: "Index",
	__ssrInlineRender: true,
	props: { rpps: {
		type: Object,
		required: true
	} },
	setup(__props) {
		const props = __props;
		const currentTheme = ref("win98");
		const expandedRpps = ref([]);
		onMounted(() => {
			currentTheme.value = localStorage.getItem("app-theme") || "win98";
		});
		const deleteRpp = (id) => {
			if (confirm("Apakah Anda yakin ingin menghapus RPP ini?")) router.delete(route("rpp.destroy", id));
		};
		const toggleExpand = (id) => {
			if (expandedRpps.value.includes(id)) expandedRpps.value = expandedRpps.value.filter((i) => i !== id);
			else expandedRpps.value.push(id);
		};
		const expandAll = () => {
			if (expandedRpps.value.length === props.rpps.data.length) expandedRpps.value = [];
			else expandedRpps.value = props.rpps.data.map((item) => item.id);
		};
		const toggleSelesai = (rpp) => {
			router.put(route("rpp.update", rpp.id), {
				topik: rpp.topik,
				tujuan_pembelajaran: rpp.tujuan_pembelajaran,
				aktifitas_pembelajaran: rpp.aktifitas_pembelajaran,
				alat_bahan: rpp.alat_bahan,
				tugas: rpp.tugas,
				tenggat_waktu: rpp.tenggat_waktu,
				kelas_ids: rpp.kelas.map((k) => k.id),
				status_selesai: !rpp.status_selesai
			}, { preserveScroll: true });
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Manajemen RPP" }, null, _parent));
			_push(ssrRenderComponent(_sfc_main$1, null, createSlots({
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) if (currentTheme.value === "modern") {
						_push(`<div class="font-[&#39;Inter&#39;,_sans-serif]"${_scopeId}><div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6 flex justify-between items-center"${_scopeId}><div class="flex items-center space-x-4"${_scopeId}><div class="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 text-gray-500"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"${_scopeId}></path></svg></div><div${_scopeId}><h2 class="font-bold text-gray-800 text-lg"${_scopeId}>Rencana Pelaksanaan Pembelajaran (RPP)</h2><p class="text-sm text-gray-500"${_scopeId}>Simpan silabus dan aktivitas pembelajaran per minggu selama 1 semester.</p></div></div><div class="flex space-x-3"${_scopeId}><button class="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 flex items-center space-x-2"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"${_scopeId}></path></svg><span${_scopeId}>${ssrInterpolate(expandedRpps.value.length === __props.rpps.data.length ? "Tutup Semua" : "Buka Semua")}</span></button><select class="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg border-none focus:ring-0 cursor-pointer hover:bg-gray-200 outline-none appearance-none pr-8 relative"${_scopeId}><option${_scopeId}>Semua Kelas</option></select>`);
						_push(ssrRenderComponent(unref(Link), {
							href: _ctx.route("rpp.create"),
							class: "px-4 py-2 bg-[#2C4C3B] text-white text-sm font-semibold rounded-lg hover:bg-[#1f372a] shadow-sm flex items-center space-x-2"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"${_scopeId}></path></svg><span${_scopeId}>RPP Baru</span>`);
								else return [(openBlock(), createBlock("svg", {
									xmlns: "http://www.w3.org/2000/svg",
									class: "h-4 w-4",
									fill: "none",
									viewBox: "0 0 24 24",
									stroke: "currentColor"
								}, [createVNode("path", {
									"stroke-linecap": "round",
									"stroke-linejoin": "round",
									"stroke-width": "2",
									d: "M12 4v16m8-8H4"
								})])), createVNode("span", null, "RPP Baru")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div></div><div class="space-y-4"${_scopeId}><!--[-->`);
						ssrRenderList(__props.rpps.data, (item, index) => {
							_push(`<div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"${_scopeId}><div class="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"${_scopeId}><div class="flex items-center space-x-4"${_scopeId}><div class="w-11 h-11 bg-[#f4f7f6] rounded-full flex flex-col items-center justify-center border border-gray-200"${_scopeId}><span class="text-[9px] text-gray-400 font-bold leading-none tracking-wider uppercase mb-0.5"${_scopeId}>WK</span><span class="text-sm font-bold text-gray-700 leading-none"${_scopeId}>${ssrInterpolate(index + 1)}</span></div><div${_scopeId}><div class="flex items-center space-x-2 mb-1.5 flex-wrap"${_scopeId}><span class="bg-gray-100 text-gray-700 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider"${_scopeId}>${ssrInterpolate(item.kelas.length ? item.kelas.map((k) => k.nama_kelas).join(", ") : "Belum ada kelas")}</span><span class="bg-gray-100 text-gray-700 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider"${_scopeId}>Sen. 1</span><span class="text-[#2C4C3B] text-[11px] font-semibold flex items-center space-x-1"${_scopeId}><span class="text-gray-300 mx-1"${_scopeId}>•</span> <span${_scopeId}>Mata Pelajaran RPL Terpadu</span></span>`);
							if (item.materi_file) _push(`<span class="bg-green-50 text-green-700 border border-green-200 text-[10px] px-2 py-0.5 rounded font-bold flex items-center space-x-1 ml-2"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"${_scopeId}></path></svg><span${_scopeId}>File</span></span>`);
							else _push(`<!---->`);
							if (item.tugas) _push(`<span class="bg-orange-50 text-orange-700 border border-orange-200 text-[10px] px-2 py-0.5 rounded font-bold flex items-center space-x-1 ml-1"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"${_scopeId}></path></svg><span${_scopeId}>Tugas</span></span>`);
							else _push(`<!---->`);
							_push(`</div><h3 class="font-bold text-gray-800 text-lg leading-tight"${_scopeId}>${ssrInterpolate(item.topik)}</h3></div></div><div class="flex items-center space-x-2"${_scopeId}>`);
							_push(ssrRenderComponent(unref(Link), {
								href: _ctx.route("rpp.show", item.id),
								class: "px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold rounded hover:bg-gray-100 flex items-center space-x-1 transition-colors"
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"${_scopeId}></path></svg><span${_scopeId}>Presensi</span>`);
									else return [(openBlock(), createBlock("svg", {
										xmlns: "http://www.w3.org/2000/svg",
										class: "h-3.5 w-3.5 text-gray-400",
										fill: "none",
										viewBox: "0 0 24 24",
										stroke: "currentColor"
									}, [createVNode("path", {
										"stroke-linecap": "round",
										"stroke-linejoin": "round",
										"stroke-width": "2",
										d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
									})])), createVNode("span", null, "Presensi")];
								}),
								_: 2
							}, _parent, _scopeId));
							_push(ssrRenderComponent(unref(Link), {
								href: _ctx.route("rpp.show", item.id),
								class: "px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold rounded hover:bg-gray-100 flex items-center space-x-1 transition-colors"
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"${_scopeId}></path></svg><span${_scopeId}>Penilaian</span>`);
									else return [(openBlock(), createBlock("svg", {
										xmlns: "http://www.w3.org/2000/svg",
										class: "h-3.5 w-3.5 text-gray-400",
										fill: "none",
										viewBox: "0 0 24 24",
										stroke: "currentColor"
									}, [createVNode("path", {
										"stroke-linecap": "round",
										"stroke-linejoin": "round",
										"stroke-width": "2",
										d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
									})])), createVNode("span", null, "Penilaian")];
								}),
								_: 2
							}, _parent, _scopeId));
							_push(`<button class="${ssrRenderClass([item.status_selesai ? "bg-green-50 border-green-200 text-green-700" : "bg-gray-50 border-gray-200 text-gray-700", "px-3 py-1.5 border text-xs font-semibold rounded hover:bg-opacity-75 flex items-center space-x-1 transition-colors"])}"${_scopeId}>`);
							if (item.status_selesai) _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-green-600" viewBox="0 0 20 20" fill="currentColor"${_scopeId}><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"${_scopeId}></path></svg>`);
							else _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"${_scopeId}></path></svg>`);
							_push(`<span${_scopeId}>Selesai</span></button><div class="h-6 w-px bg-gray-200 mx-1"${_scopeId}></div>`);
							_push(ssrRenderComponent(unref(Link), {
								href: _ctx.route("rpp.edit", item.id),
								class: "text-gray-400 hover:text-blue-500 p-1.5 rounded hover:bg-gray-100 transition-colors"
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"${_scopeId}></path></svg>`);
									else return [(openBlock(), createBlock("svg", {
										xmlns: "http://www.w3.org/2000/svg",
										class: "h-4 w-4",
										fill: "none",
										viewBox: "0 0 24 24",
										stroke: "currentColor"
									}, [createVNode("path", {
										"stroke-linecap": "round",
										"stroke-linejoin": "round",
										"stroke-width": "2",
										d: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
									})]))];
								}),
								_: 2
							}, _parent, _scopeId));
							_push(`<button class="text-gray-400 hover:text-red-500 p-1.5 rounded hover:bg-gray-100 transition-colors"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"${_scopeId}></path></svg></button><button class="text-gray-400 hover:text-gray-600 p-1.5 rounded hover:bg-gray-100 transition-colors ml-1"${_scopeId}><svg class="${ssrRenderClass([{ "rotate-180": expandedRpps.value.includes(item.id) }, "h-5 w-5 transition-transform duration-200"])}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"${_scopeId}></path></svg></button></div></div>`);
							if (expandedRpps.value.includes(item.id)) {
								_push(`<div class="border-t border-gray-100 p-6 bg-[#fcfdfd]"${_scopeId}><div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"${_scopeId}><div${_scopeId}><div class="text-[10px] font-bold text-blue-400 mb-2 tracking-widest uppercase"${_scopeId}>Tujuan Pembelajaran (ATP)</div><div class="bg-white p-4 rounded-lg border border-gray-100 shadow-sm text-sm text-gray-700 h-full whitespace-pre-wrap leading-relaxed"${_scopeId}>${ssrInterpolate(item.tujuan_pembelajaran || "-")}</div></div><div${_scopeId}><div class="text-[10px] font-bold text-blue-400 mb-2 tracking-widest uppercase"${_scopeId}>Aktivitas Pembelajaran</div><div class="bg-white p-4 rounded-lg border border-gray-100 shadow-sm text-sm text-gray-700 h-full whitespace-pre-wrap leading-relaxed"${_scopeId}>${ssrInterpolate(item.aktifitas_pembelajaran || "-")}</div></div><div${_scopeId}><div class="text-[10px] font-bold text-blue-400 mb-2 tracking-widest uppercase"${_scopeId}>Alat, Bahan &amp; Sumber</div><div class="bg-white p-4 rounded-lg border border-gray-100 shadow-sm text-sm text-gray-700 h-full whitespace-pre-wrap leading-relaxed"${_scopeId}>${ssrInterpolate(item.alat_bahan || "-")}</div></div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-6"${_scopeId}><div class="bg-white rounded-lg border border-gray-100 shadow-sm p-5"${_scopeId}><div class="flex items-center space-x-2 mb-4"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"${_scopeId}></path></svg><span class="text-xs font-bold text-gray-600"${_scopeId}>Materi Terintegrasi</span></div>`);
								if (item.materi_file) _push(`<div class="bg-gray-50 rounded-lg p-3 flex items-center justify-between border border-gray-100 hover:border-gray-200 transition-colors"${_scopeId}><div class="flex items-center space-x-3 overflow-hidden"${_scopeId}><div class="p-2 bg-white rounded border border-gray-100 shadow-sm"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"${_scopeId}></path></svg></div><div class="truncate"${_scopeId}><div class="text-sm font-bold text-gray-700 truncate"${_scopeId}>Materi_${ssrInterpolate(item.topik.substring(0, 15))}...</div><div class="text-[10px] text-gray-400 font-bold"${_scopeId}>1.2 MB</div></div></div><a${ssrRenderAttr("href", "/storage/" + item.materi_file)} target="_blank" class="w-8 h-8 shrink-0 bg-[#2C4C3B] rounded-full flex items-center justify-center text-white hover:bg-[#1f372a] shadow-sm transition-colors"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"${_scopeId}></path></svg></a></div>`);
								else _push(`<div class="text-sm text-gray-400 italic"${_scopeId}>Tidak ada materi yang diunggah.</div>`);
								_push(`</div><div class="bg-white rounded-lg border border-gray-100 shadow-sm p-5"${_scopeId}><div class="flex items-center space-x-2 mb-4"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"${_scopeId}></path></svg><span class="text-xs font-bold text-gray-600"${_scopeId}>Penugasan Terintegrasi</span></div>`);
								if (item.tugas) _push(`<div${_scopeId}><span class="bg-green-50 text-green-700 border border-green-200 text-[10px] px-2 py-0.5 rounded font-bold tracking-wider uppercase mb-2 inline-block"${_scopeId}>TUGAS</span><div class="text-sm font-bold text-gray-700 whitespace-pre-wrap leading-relaxed"${_scopeId}>${ssrInterpolate(item.tugas)}</div><div class="flex flex-wrap gap-4 mt-4 bg-gray-50 p-3 rounded-lg border border-gray-100"${_scopeId}><div class="flex items-center space-x-1.5 text-xs text-gray-500 font-semibold"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"${_scopeId}></path></svg><span${_scopeId}>Nilai Maks: 100</span></div><div class="flex items-center space-x-1.5 text-xs text-gray-500 font-semibold"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"${_scopeId}></path></svg><span${_scopeId}>Batas: ${ssrInterpolate(item.tenggat_waktu ? new Date(item.tenggat_waktu).toLocaleDateString() : "-")}</span></div></div></div>`);
								else _push(`<div class="text-sm text-gray-400 italic"${_scopeId}>Tidak ada penugasan.</div>`);
								_push(`</div></div></div>`);
							} else _push(`<!---->`);
							_push(`</div>`);
						});
						_push(`<!--]-->`);
						if (__props.rpps.data.length === 0) {
							_push(`<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center justify-center"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"${_scopeId}></path></svg><p class="text-gray-500 font-semibold mb-4"${_scopeId}>Belum ada data Rencana Pelaksanaan Pembelajaran.</p>`);
							_push(ssrRenderComponent(unref(Link), {
								href: _ctx.route("rpp.create"),
								class: "px-4 py-2 bg-[#2C4C3B] text-white text-sm font-semibold rounded-lg hover:bg-[#1f372a] shadow-sm"
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(` Buat RPP Pertama `);
									else return [createTextVNode(" Buat RPP Pertama ")];
								}),
								_: 1
							}, _parent, _scopeId));
							_push(`</div>`);
						} else _push(`<!---->`);
						_push(ssrRenderComponent(Pagination_default, {
							class: "mt-4",
							links: __props.rpps.links
						}, null, _parent, _scopeId));
						_push(`</div></div>`);
					} else {
						_push(`<div class="p-2"${_scopeId}><div${_scopeId}><div class="mb-4"${_scopeId}><div class="flex justify-between items-end mb-2 border-b border-[var(--border-dark)] pb-2"${_scopeId}><h3 class="text-md font-bold theme-text"${_scopeId}>Daftar RPP</h3>`);
						_push(ssrRenderComponent(unref(Link), {
							href: _ctx.route("rpp.create"),
							class: "win95-btn font-bold"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Tambah RPP `);
								else return [createTextVNode(" Tambah RPP ")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div>`);
						if (_ctx.$page.props.flash?.success) _push(`<div class="win95-panel !p-2 mb-4 bg-[#008080] text-white font-bold"${_scopeId}>${ssrInterpolate(_ctx.$page.props.flash.success)}</div>`);
						else _push(`<!---->`);
						_push(`<div class="mb-2 theme-text text-sm"${_scopeId}> Total: ${ssrInterpolate(__props.rpps.total)} RPP </div><div class="win95-panel !p-0 overflow-x-auto"${_scopeId}><table class="w-full text-sm text-left border-collapse"${_scopeId}><thead class="bg-[var(--bg-window)] theme-text border-b border-[var(--border-dark)]"${_scopeId}><tr${_scopeId}><th scope="col" class="px-2 py-1 border-r border-[var(--border-dark)]"${_scopeId}>Topik / Pertemuan</th><th scope="col" class="px-2 py-1 border-r border-[var(--border-dark)]"${_scopeId}>Tenggat Waktu</th><th scope="col" class="px-2 py-1 border-r border-[var(--border-dark)]"${_scopeId}>Kelas Terpilih</th><th scope="col" class="px-2 py-1"${_scopeId}>Aksi</th></tr></thead><tbody${_scopeId}><!--[-->`);
						ssrRenderList(__props.rpps.data, (item) => {
							_push(`<tr class="bg-[var(--bg-panel)] theme-text hover:bg-[#000080] hover:text-white group"${_scopeId}><td class="px-2 py-1 border-r border-[var(--border-light)] font-bold"${_scopeId}>${ssrInterpolate(item.topik)}</td><td class="px-2 py-1 border-r border-[var(--border-light)]"${_scopeId}>${ssrInterpolate(item.tenggat_waktu ? new Date(item.tenggat_waktu).toLocaleString() : "-")}</td><td class="px-2 py-1 border-r border-[var(--border-light)]"${_scopeId}><div class="flex flex-wrap gap-1"${_scopeId}><!--[-->`);
							ssrRenderList(item.kelas, (k) => {
								_push(`<span class="bg-gray-200 text-black px-1 text-xs border border-gray-400"${_scopeId}>${ssrInterpolate(k.nama_kelas)}</span>`);
							});
							_push(`<!--]-->`);
							if (!item.kelas.length) _push(`<span class="text-gray-500 italic"${_scopeId}>Belum ada kelas</span>`);
							else _push(`<!---->`);
							_push(`</div></td><td class="px-2 py-1 flex space-x-2 items-center h-full pt-2"${_scopeId}>`);
							_push(ssrRenderComponent(unref(Link), {
								href: _ctx.route("rpp.show", item.id),
								class: "win95-btn !px-2 group-hover:text-black"
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(` Lihat Detail `);
									else return [createTextVNode(" Lihat Detail ")];
								}),
								_: 2
							}, _parent, _scopeId));
							_push(ssrRenderComponent(unref(Link), {
								href: _ctx.route("rpp.edit", item.id),
								class: "win95-btn !px-2 group-hover:text-black"
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(` Edit `);
									else return [createTextVNode(" Edit ")];
								}),
								_: 2
							}, _parent, _scopeId));
							_push(`<button class="win95-btn !px-2 group-hover:text-black"${_scopeId}> Hapus </button></td></tr>`);
						});
						_push(`<!--]-->`);
						if (__props.rpps.data.length === 0) _push(`<tr${_scopeId}><td colspan="4" class="px-2 py-4 text-center text-gray-500 theme-text bg-[var(--bg-panel)]"${_scopeId}> Belum ada data RPP. </td></tr>`);
						else _push(`<!---->`);
						_push(`</tbody></table></div>`);
						_push(ssrRenderComponent(Pagination_default, {
							class: "mt-4",
							links: __props.rpps.links
						}, null, _parent, _scopeId));
						_push(`</div></div></div>`);
					}
					else return [currentTheme.value === "modern" ? (openBlock(), createBlock("div", {
						key: 0,
						class: "font-['Inter',_sans-serif]"
					}, [createVNode("div", { class: "bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6 flex justify-between items-center" }, [createVNode("div", { class: "flex items-center space-x-4" }, [createVNode("div", { class: "w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 text-gray-500" }, [(openBlock(), createBlock("svg", {
						xmlns: "http://www.w3.org/2000/svg",
						class: "h-6 w-6",
						fill: "none",
						viewBox: "0 0 24 24",
						stroke: "currentColor"
					}, [createVNode("path", {
						"stroke-linecap": "round",
						"stroke-linejoin": "round",
						"stroke-width": "2",
						d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
					})]))]), createVNode("div", null, [createVNode("h2", { class: "font-bold text-gray-800 text-lg" }, "Rencana Pelaksanaan Pembelajaran (RPP)"), createVNode("p", { class: "text-sm text-gray-500" }, "Simpan silabus dan aktivitas pembelajaran per minggu selama 1 semester.")])]), createVNode("div", { class: "flex space-x-3" }, [
						createVNode("button", {
							onClick: expandAll,
							class: "px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 flex items-center space-x-2"
						}, [(openBlock(), createBlock("svg", {
							xmlns: "http://www.w3.org/2000/svg",
							class: "h-4 w-4",
							fill: "none",
							viewBox: "0 0 24 24",
							stroke: "currentColor"
						}, [createVNode("path", {
							"stroke-linecap": "round",
							"stroke-linejoin": "round",
							"stroke-width": "2",
							d: "M8 9l4-4 4 4m0 6l-4 4-4-4"
						})])), createVNode("span", null, toDisplayString(expandedRpps.value.length === __props.rpps.data.length ? "Tutup Semua" : "Buka Semua"), 1)]),
						createVNode("select", { class: "px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg border-none focus:ring-0 cursor-pointer hover:bg-gray-200 outline-none appearance-none pr-8 relative" }, [createVNode("option", null, "Semua Kelas")]),
						createVNode(unref(Link), {
							href: _ctx.route("rpp.create"),
							class: "px-4 py-2 bg-[#2C4C3B] text-white text-sm font-semibold rounded-lg hover:bg-[#1f372a] shadow-sm flex items-center space-x-2"
						}, {
							default: withCtx(() => [(openBlock(), createBlock("svg", {
								xmlns: "http://www.w3.org/2000/svg",
								class: "h-4 w-4",
								fill: "none",
								viewBox: "0 0 24 24",
								stroke: "currentColor"
							}, [createVNode("path", {
								"stroke-linecap": "round",
								"stroke-linejoin": "round",
								"stroke-width": "2",
								d: "M12 4v16m8-8H4"
							})])), createVNode("span", null, "RPP Baru")]),
							_: 1
						}, 8, ["href"])
					])]), createVNode("div", { class: "space-y-4" }, [
						(openBlock(true), createBlock(Fragment, null, renderList(__props.rpps.data, (item, index) => {
							return openBlock(), createBlock("div", {
								key: item.id,
								class: "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
							}, [createVNode("div", {
								class: "p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors",
								onClick: ($event) => toggleExpand(item.id)
							}, [createVNode("div", { class: "flex items-center space-x-4" }, [createVNode("div", { class: "w-11 h-11 bg-[#f4f7f6] rounded-full flex flex-col items-center justify-center border border-gray-200" }, [createVNode("span", { class: "text-[9px] text-gray-400 font-bold leading-none tracking-wider uppercase mb-0.5" }, "WK"), createVNode("span", { class: "text-sm font-bold text-gray-700 leading-none" }, toDisplayString(index + 1), 1)]), createVNode("div", null, [createVNode("div", { class: "flex items-center space-x-2 mb-1.5 flex-wrap" }, [
								createVNode("span", { class: "bg-gray-100 text-gray-700 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider" }, toDisplayString(item.kelas.length ? item.kelas.map((k) => k.nama_kelas).join(", ") : "Belum ada kelas"), 1),
								createVNode("span", { class: "bg-gray-100 text-gray-700 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider" }, "Sen. 1"),
								createVNode("span", { class: "text-[#2C4C3B] text-[11px] font-semibold flex items-center space-x-1" }, [
									createVNode("span", { class: "text-gray-300 mx-1" }, "•"),
									createTextVNode(),
									createVNode("span", null, "Mata Pelajaran RPL Terpadu")
								]),
								item.materi_file ? (openBlock(), createBlock("span", {
									key: 0,
									class: "bg-green-50 text-green-700 border border-green-200 text-[10px] px-2 py-0.5 rounded font-bold flex items-center space-x-1 ml-2"
								}, [(openBlock(), createBlock("svg", {
									xmlns: "http://www.w3.org/2000/svg",
									class: "h-3 w-3",
									fill: "none",
									viewBox: "0 0 24 24",
									stroke: "currentColor"
								}, [createVNode("path", {
									"stroke-linecap": "round",
									"stroke-linejoin": "round",
									"stroke-width": "2",
									d: "M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
								})])), createVNode("span", null, "File")])) : createCommentVNode("", true),
								item.tugas ? (openBlock(), createBlock("span", {
									key: 1,
									class: "bg-orange-50 text-orange-700 border border-orange-200 text-[10px] px-2 py-0.5 rounded font-bold flex items-center space-x-1 ml-1"
								}, [(openBlock(), createBlock("svg", {
									xmlns: "http://www.w3.org/2000/svg",
									class: "h-3 w-3",
									fill: "none",
									viewBox: "0 0 24 24",
									stroke: "currentColor"
								}, [createVNode("path", {
									"stroke-linecap": "round",
									"stroke-linejoin": "round",
									"stroke-width": "2",
									d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
								})])), createVNode("span", null, "Tugas")])) : createCommentVNode("", true)
							]), createVNode("h3", { class: "font-bold text-gray-800 text-lg leading-tight" }, toDisplayString(item.topik), 1)])]), createVNode("div", {
								class: "flex items-center space-x-2",
								onClick: withModifiers(() => {}, ["stop"])
							}, [
								createVNode(unref(Link), {
									href: _ctx.route("rpp.show", item.id),
									class: "px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold rounded hover:bg-gray-100 flex items-center space-x-1 transition-colors"
								}, {
									default: withCtx(() => [(openBlock(), createBlock("svg", {
										xmlns: "http://www.w3.org/2000/svg",
										class: "h-3.5 w-3.5 text-gray-400",
										fill: "none",
										viewBox: "0 0 24 24",
										stroke: "currentColor"
									}, [createVNode("path", {
										"stroke-linecap": "round",
										"stroke-linejoin": "round",
										"stroke-width": "2",
										d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
									})])), createVNode("span", null, "Presensi")]),
									_: 1
								}, 8, ["href"]),
								createVNode(unref(Link), {
									href: _ctx.route("rpp.show", item.id),
									class: "px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold rounded hover:bg-gray-100 flex items-center space-x-1 transition-colors"
								}, {
									default: withCtx(() => [(openBlock(), createBlock("svg", {
										xmlns: "http://www.w3.org/2000/svg",
										class: "h-3.5 w-3.5 text-gray-400",
										fill: "none",
										viewBox: "0 0 24 24",
										stroke: "currentColor"
									}, [createVNode("path", {
										"stroke-linecap": "round",
										"stroke-linejoin": "round",
										"stroke-width": "2",
										d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
									})])), createVNode("span", null, "Penilaian")]),
									_: 1
								}, 8, ["href"]),
								createVNode("button", {
									onClick: ($event) => toggleSelesai(item),
									class: [item.status_selesai ? "bg-green-50 border-green-200 text-green-700" : "bg-gray-50 border-gray-200 text-gray-700", "px-3 py-1.5 border text-xs font-semibold rounded hover:bg-opacity-75 flex items-center space-x-1 transition-colors"]
								}, [item.status_selesai ? (openBlock(), createBlock("svg", {
									key: 0,
									xmlns: "http://www.w3.org/2000/svg",
									class: "h-3.5 w-3.5 text-green-600",
									viewBox: "0 0 20 20",
									fill: "currentColor"
								}, [createVNode("path", {
									"fill-rule": "evenodd",
									d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
									"clip-rule": "evenodd"
								})])) : (openBlock(), createBlock("svg", {
									key: 1,
									xmlns: "http://www.w3.org/2000/svg",
									class: "h-3.5 w-3.5 text-gray-400",
									fill: "none",
									viewBox: "0 0 24 24",
									stroke: "currentColor"
								}, [createVNode("path", {
									"stroke-linecap": "round",
									"stroke-linejoin": "round",
									"stroke-width": "2",
									d: "M5 13l4 4L19 7"
								})])), createVNode("span", null, "Selesai")], 10, ["onClick"]),
								createVNode("div", { class: "h-6 w-px bg-gray-200 mx-1" }),
								createVNode(unref(Link), {
									href: _ctx.route("rpp.edit", item.id),
									class: "text-gray-400 hover:text-blue-500 p-1.5 rounded hover:bg-gray-100 transition-colors"
								}, {
									default: withCtx(() => [(openBlock(), createBlock("svg", {
										xmlns: "http://www.w3.org/2000/svg",
										class: "h-4 w-4",
										fill: "none",
										viewBox: "0 0 24 24",
										stroke: "currentColor"
									}, [createVNode("path", {
										"stroke-linecap": "round",
										"stroke-linejoin": "round",
										"stroke-width": "2",
										d: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
									})]))]),
									_: 1
								}, 8, ["href"]),
								createVNode("button", {
									onClick: ($event) => deleteRpp(item.id),
									class: "text-gray-400 hover:text-red-500 p-1.5 rounded hover:bg-gray-100 transition-colors"
								}, [(openBlock(), createBlock("svg", {
									xmlns: "http://www.w3.org/2000/svg",
									class: "h-4 w-4",
									fill: "none",
									viewBox: "0 0 24 24",
									stroke: "currentColor"
								}, [createVNode("path", {
									"stroke-linecap": "round",
									"stroke-linejoin": "round",
									"stroke-width": "2",
									d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
								})]))], 8, ["onClick"]),
								createVNode("button", {
									onClick: ($event) => toggleExpand(item.id),
									class: "text-gray-400 hover:text-gray-600 p-1.5 rounded hover:bg-gray-100 transition-colors ml-1"
								}, [(openBlock(), createBlock("svg", {
									class: [{ "rotate-180": expandedRpps.value.includes(item.id) }, "h-5 w-5 transition-transform duration-200"],
									xmlns: "http://www.w3.org/2000/svg",
									fill: "none",
									viewBox: "0 0 24 24",
									stroke: "currentColor"
								}, [createVNode("path", {
									"stroke-linecap": "round",
									"stroke-linejoin": "round",
									"stroke-width": "2",
									d: "M19 9l-7 7-7-7"
								})], 2))], 8, ["onClick"])
							], 8, ["onClick"])], 8, ["onClick"]), expandedRpps.value.includes(item.id) ? (openBlock(), createBlock("div", {
								key: 0,
								class: "border-t border-gray-100 p-6 bg-[#fcfdfd]"
							}, [createVNode("div", { class: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-6" }, [
								createVNode("div", null, [createVNode("div", { class: "text-[10px] font-bold text-blue-400 mb-2 tracking-widest uppercase" }, "Tujuan Pembelajaran (ATP)"), createVNode("div", { class: "bg-white p-4 rounded-lg border border-gray-100 shadow-sm text-sm text-gray-700 h-full whitespace-pre-wrap leading-relaxed" }, toDisplayString(item.tujuan_pembelajaran || "-"), 1)]),
								createVNode("div", null, [createVNode("div", { class: "text-[10px] font-bold text-blue-400 mb-2 tracking-widest uppercase" }, "Aktivitas Pembelajaran"), createVNode("div", { class: "bg-white p-4 rounded-lg border border-gray-100 shadow-sm text-sm text-gray-700 h-full whitespace-pre-wrap leading-relaxed" }, toDisplayString(item.aktifitas_pembelajaran || "-"), 1)]),
								createVNode("div", null, [createVNode("div", { class: "text-[10px] font-bold text-blue-400 mb-2 tracking-widest uppercase" }, "Alat, Bahan & Sumber"), createVNode("div", { class: "bg-white p-4 rounded-lg border border-gray-100 shadow-sm text-sm text-gray-700 h-full whitespace-pre-wrap leading-relaxed" }, toDisplayString(item.alat_bahan || "-"), 1)])
							]), createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-6" }, [createVNode("div", { class: "bg-white rounded-lg border border-gray-100 shadow-sm p-5" }, [createVNode("div", { class: "flex items-center space-x-2 mb-4" }, [(openBlock(), createBlock("svg", {
								xmlns: "http://www.w3.org/2000/svg",
								class: "h-4 w-4 text-gray-400",
								fill: "none",
								viewBox: "0 0 24 24",
								stroke: "currentColor"
							}, [createVNode("path", {
								"stroke-linecap": "round",
								"stroke-linejoin": "round",
								"stroke-width": "2",
								d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							})])), createVNode("span", { class: "text-xs font-bold text-gray-600" }, "Materi Terintegrasi")]), item.materi_file ? (openBlock(), createBlock("div", {
								key: 0,
								class: "bg-gray-50 rounded-lg p-3 flex items-center justify-between border border-gray-100 hover:border-gray-200 transition-colors"
							}, [createVNode("div", { class: "flex items-center space-x-3 overflow-hidden" }, [createVNode("div", { class: "p-2 bg-white rounded border border-gray-100 shadow-sm" }, [(openBlock(), createBlock("svg", {
								xmlns: "http://www.w3.org/2000/svg",
								class: "h-6 w-6 text-green-600",
								fill: "none",
								viewBox: "0 0 24 24",
								stroke: "currentColor"
							}, [createVNode("path", {
								"stroke-linecap": "round",
								"stroke-linejoin": "round",
								"stroke-width": "2",
								d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
							})]))]), createVNode("div", { class: "truncate" }, [createVNode("div", { class: "text-sm font-bold text-gray-700 truncate" }, "Materi_" + toDisplayString(item.topik.substring(0, 15)) + "...", 1), createVNode("div", { class: "text-[10px] text-gray-400 font-bold" }, "1.2 MB")])]), createVNode("a", {
								href: "/storage/" + item.materi_file,
								target: "_blank",
								class: "w-8 h-8 shrink-0 bg-[#2C4C3B] rounded-full flex items-center justify-center text-white hover:bg-[#1f372a] shadow-sm transition-colors"
							}, [(openBlock(), createBlock("svg", {
								xmlns: "http://www.w3.org/2000/svg",
								class: "h-4 w-4",
								fill: "none",
								viewBox: "0 0 24 24",
								stroke: "currentColor"
							}, [createVNode("path", {
								"stroke-linecap": "round",
								"stroke-linejoin": "round",
								"stroke-width": "2",
								d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
							})]))], 8, ["href"])])) : (openBlock(), createBlock("div", {
								key: 1,
								class: "text-sm text-gray-400 italic"
							}, "Tidak ada materi yang diunggah."))]), createVNode("div", { class: "bg-white rounded-lg border border-gray-100 shadow-sm p-5" }, [createVNode("div", { class: "flex items-center space-x-2 mb-4" }, [(openBlock(), createBlock("svg", {
								xmlns: "http://www.w3.org/2000/svg",
								class: "h-4 w-4 text-gray-400",
								fill: "none",
								viewBox: "0 0 24 24",
								stroke: "currentColor"
							}, [createVNode("path", {
								"stroke-linecap": "round",
								"stroke-linejoin": "round",
								"stroke-width": "2",
								d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
							})])), createVNode("span", { class: "text-xs font-bold text-gray-600" }, "Penugasan Terintegrasi")]), item.tugas ? (openBlock(), createBlock("div", { key: 0 }, [
								createVNode("span", { class: "bg-green-50 text-green-700 border border-green-200 text-[10px] px-2 py-0.5 rounded font-bold tracking-wider uppercase mb-2 inline-block" }, "TUGAS"),
								createVNode("div", { class: "text-sm font-bold text-gray-700 whitespace-pre-wrap leading-relaxed" }, toDisplayString(item.tugas), 1),
								createVNode("div", { class: "flex flex-wrap gap-4 mt-4 bg-gray-50 p-3 rounded-lg border border-gray-100" }, [createVNode("div", { class: "flex items-center space-x-1.5 text-xs text-gray-500 font-semibold" }, [(openBlock(), createBlock("svg", {
									xmlns: "http://www.w3.org/2000/svg",
									class: "h-3.5 w-3.5 text-gray-400",
									fill: "none",
									viewBox: "0 0 24 24",
									stroke: "currentColor"
								}, [createVNode("path", {
									"stroke-linecap": "round",
									"stroke-linejoin": "round",
									"stroke-width": "2",
									d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								})])), createVNode("span", null, "Nilai Maks: 100")]), createVNode("div", { class: "flex items-center space-x-1.5 text-xs text-gray-500 font-semibold" }, [(openBlock(), createBlock("svg", {
									xmlns: "http://www.w3.org/2000/svg",
									class: "h-3.5 w-3.5 text-gray-400",
									fill: "none",
									viewBox: "0 0 24 24",
									stroke: "currentColor"
								}, [createVNode("path", {
									"stroke-linecap": "round",
									"stroke-linejoin": "round",
									"stroke-width": "2",
									d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								})])), createVNode("span", null, "Batas: " + toDisplayString(item.tenggat_waktu ? new Date(item.tenggat_waktu).toLocaleDateString() : "-"), 1)])])
							])) : (openBlock(), createBlock("div", {
								key: 1,
								class: "text-sm text-gray-400 italic"
							}, "Tidak ada penugasan."))])])])) : createCommentVNode("", true)]);
						}), 128)),
						__props.rpps.data.length === 0 ? (openBlock(), createBlock("div", {
							key: 0,
							class: "bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center justify-center"
						}, [
							(openBlock(), createBlock("svg", {
								xmlns: "http://www.w3.org/2000/svg",
								class: "h-12 w-12 text-gray-300 mb-3",
								fill: "none",
								viewBox: "0 0 24 24",
								stroke: "currentColor"
							}, [createVNode("path", {
								"stroke-linecap": "round",
								"stroke-linejoin": "round",
								"stroke-width": "2",
								d: "M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							})])),
							createVNode("p", { class: "text-gray-500 font-semibold mb-4" }, "Belum ada data Rencana Pelaksanaan Pembelajaran."),
							createVNode(unref(Link), {
								href: _ctx.route("rpp.create"),
								class: "px-4 py-2 bg-[#2C4C3B] text-white text-sm font-semibold rounded-lg hover:bg-[#1f372a] shadow-sm"
							}, {
								default: withCtx(() => [createTextVNode(" Buat RPP Pertama ")]),
								_: 1
							}, 8, ["href"])
						])) : createCommentVNode("", true),
						createVNode(Pagination_default, {
							class: "mt-4",
							links: __props.rpps.links
						}, null, 8, ["links"])
					])])) : (openBlock(), createBlock("div", {
						key: 1,
						class: "p-2"
					}, [createVNode("div", null, [createVNode("div", { class: "mb-4" }, [
						createVNode("div", { class: "flex justify-between items-end mb-2 border-b border-[var(--border-dark)] pb-2" }, [createVNode("h3", { class: "text-md font-bold theme-text" }, "Daftar RPP"), createVNode(unref(Link), {
							href: _ctx.route("rpp.create"),
							class: "win95-btn font-bold"
						}, {
							default: withCtx(() => [createTextVNode(" Tambah RPP ")]),
							_: 1
						}, 8, ["href"])]),
						_ctx.$page.props.flash?.success ? (openBlock(), createBlock("div", {
							key: 0,
							class: "win95-panel !p-2 mb-4 bg-[#008080] text-white font-bold"
						}, toDisplayString(_ctx.$page.props.flash.success), 1)) : createCommentVNode("", true),
						createVNode("div", { class: "mb-2 theme-text text-sm" }, " Total: " + toDisplayString(__props.rpps.total) + " RPP ", 1),
						createVNode("div", { class: "win95-panel !p-0 overflow-x-auto" }, [createVNode("table", { class: "w-full text-sm text-left border-collapse" }, [createVNode("thead", { class: "bg-[var(--bg-window)] theme-text border-b border-[var(--border-dark)]" }, [createVNode("tr", null, [
							createVNode("th", {
								scope: "col",
								class: "px-2 py-1 border-r border-[var(--border-dark)]"
							}, "Topik / Pertemuan"),
							createVNode("th", {
								scope: "col",
								class: "px-2 py-1 border-r border-[var(--border-dark)]"
							}, "Tenggat Waktu"),
							createVNode("th", {
								scope: "col",
								class: "px-2 py-1 border-r border-[var(--border-dark)]"
							}, "Kelas Terpilih"),
							createVNode("th", {
								scope: "col",
								class: "px-2 py-1"
							}, "Aksi")
						])]), createVNode("tbody", null, [(openBlock(true), createBlock(Fragment, null, renderList(__props.rpps.data, (item) => {
							return openBlock(), createBlock("tr", {
								key: item.id,
								class: "bg-[var(--bg-panel)] theme-text hover:bg-[#000080] hover:text-white group"
							}, [
								createVNode("td", { class: "px-2 py-1 border-r border-[var(--border-light)] font-bold" }, toDisplayString(item.topik), 1),
								createVNode("td", { class: "px-2 py-1 border-r border-[var(--border-light)]" }, toDisplayString(item.tenggat_waktu ? new Date(item.tenggat_waktu).toLocaleString() : "-"), 1),
								createVNode("td", { class: "px-2 py-1 border-r border-[var(--border-light)]" }, [createVNode("div", { class: "flex flex-wrap gap-1" }, [(openBlock(true), createBlock(Fragment, null, renderList(item.kelas, (k) => {
									return openBlock(), createBlock("span", {
										key: k.id,
										class: "bg-gray-200 text-black px-1 text-xs border border-gray-400"
									}, toDisplayString(k.nama_kelas), 1);
								}), 128)), !item.kelas.length ? (openBlock(), createBlock("span", {
									key: 0,
									class: "text-gray-500 italic"
								}, "Belum ada kelas")) : createCommentVNode("", true)])]),
								createVNode("td", { class: "px-2 py-1 flex space-x-2 items-center h-full pt-2" }, [
									createVNode(unref(Link), {
										href: _ctx.route("rpp.show", item.id),
										class: "win95-btn !px-2 group-hover:text-black"
									}, {
										default: withCtx(() => [createTextVNode(" Lihat Detail ")]),
										_: 1
									}, 8, ["href"]),
									createVNode(unref(Link), {
										href: _ctx.route("rpp.edit", item.id),
										class: "win95-btn !px-2 group-hover:text-black"
									}, {
										default: withCtx(() => [createTextVNode(" Edit ")]),
										_: 1
									}, 8, ["href"]),
									createVNode("button", {
										onClick: ($event) => deleteRpp(item.id),
										class: "win95-btn !px-2 group-hover:text-black"
									}, " Hapus ", 8, ["onClick"])
								])
							]);
						}), 128)), __props.rpps.data.length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [createVNode("td", {
							colspan: "4",
							class: "px-2 py-4 text-center text-gray-500 theme-text bg-[var(--bg-panel)]"
						}, " Belum ada data RPP. ")])) : createCommentVNode("", true)])])]),
						createVNode(Pagination_default, {
							class: "mt-4",
							links: __props.rpps.links
						}, null, 8, ["links"])
					])])]))];
				}),
				_: 2
			}, [currentTheme.value !== "modern" ? {
				name: "header",
				fn: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<h2 class="font-bold text-lg theme-text"${_scopeId}>Perencanaan Pembelajaran (RPP)</h2>`);
					else return [createVNode("h2", { class: "font-bold text-lg theme-text" }, "Perencanaan Pembelajaran (RPP)")];
				}),
				key: "0"
			} : void 0]), _parent));
			_push(`<!--]-->`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Rpp/Index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
export { _sfc_main as default };
