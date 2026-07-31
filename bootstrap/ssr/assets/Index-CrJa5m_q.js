import { t as _sfc_main$1 } from "./AuthenticatedLayout-C1P-b31-.js";
import { t as Pagination_default } from "./Pagination-DbvRrq2i.js";
import { Head, Link, useForm } from "@inertiajs/vue3";
import { Fragment, createBlock, createCommentVNode, createTextVNode, createVNode, openBlock, renderList, toDisplayString, unref, useSSRContext, withCtx } from "vue";
import { ssrInterpolate, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
//#region resources/js/Pages/Kelas/Index.vue
var _sfc_main = {
	__name: "Index",
	__ssrInlineRender: true,
	props: { kelas: {
		type: Object,
		required: true
	} },
	setup(__props) {
		const form = useForm({});
		const deleteKelas = (id) => {
			if (confirm("Apakah Anda yakin ingin menghapus kelas ini?")) form.delete(route("kelas.destroy", id));
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Manajemen Kelas" }, null, _parent));
			_push(ssrRenderComponent(_sfc_main$1, null, {
				header: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<h2 class="font-bold text-lg theme-text"${_scopeId}>Manajemen Kelas</h2>`);
					else return [createVNode("h2", { class: "font-bold text-lg theme-text" }, "Manajemen Kelas")];
				}),
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="p-2"${_scopeId}><div${_scopeId}><div class="mb-4"${_scopeId}><div class="flex justify-between items-end mb-2 border-b border-[var(--border-dark)] pb-2"${_scopeId}><h3 class="text-md font-bold theme-text"${_scopeId}>Daftar Kelas</h3>`);
						_push(ssrRenderComponent(unref(Link), {
							href: _ctx.route("kelas.create"),
							class: "win95-btn"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Tambah Kelas `);
								else return [createTextVNode(" Tambah Kelas ")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div><div class="mb-4 text-sm text-gray-700 font-bold dark:text-gray-300"${_scopeId}> Total: ${ssrInterpolate(__props.kelas.total)} Kelas </div><div class="win95-panel !p-0 overflow-x-auto"${_scopeId}><table class="w-full text-sm text-left border-collapse"${_scopeId}><thead class="bg-[var(--bg-window)] theme-text border-b border-[var(--border-dark)]"${_scopeId}><tr${_scopeId}><th scope="col" class="px-2 py-1 border-r border-[var(--border-dark)]"${_scopeId}>Nama Kelas</th><th scope="col" class="px-2 py-1 border-r border-[var(--border-dark)]"${_scopeId}>Tahun Ajaran</th><th scope="col" class="px-2 py-1"${_scopeId}>Aksi</th></tr></thead><tbody${_scopeId}><!--[-->`);
						ssrRenderList(__props.kelas.data, (item) => {
							_push(`<tr class="bg-[var(--bg-panel)] theme-text hover:bg-[#000080] hover:text-white group"${_scopeId}><td class="px-2 py-1 border-r border-[var(--border-light)]"${_scopeId}>${ssrInterpolate(item.nama_kelas)}</td><td class="px-2 py-1 border-r border-[var(--border-light)]"${_scopeId}>${ssrInterpolate(item.tahun_ajaran || "-")}</td><td class="px-2 py-1 flex space-x-2"${_scopeId}>`);
							_push(ssrRenderComponent(unref(Link), {
								href: _ctx.route("kelas.edit", item.id),
								class: "win95-btn !px-2 !py-0 group-hover:text-black"
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(`Edit`);
									else return [createTextVNode("Edit")];
								}),
								_: 2
							}, _parent, _scopeId));
							_push(`<button class="win95-btn !px-2 !py-0 group-hover:text-black"${_scopeId}>Hapus</button></td></tr>`);
						});
						_push(`<!--]-->`);
						if (__props.kelas.data.length === 0) _push(`<tr${_scopeId}><td colspan="3" class="px-2 py-2 text-center text-gray-600"${_scopeId}> Belum ada data kelas. </td></tr>`);
						else _push(`<!---->`);
						_push(`</tbody></table></div><div class="mt-6"${_scopeId}>`);
						_push(ssrRenderComponent(Pagination_default, { links: __props.kelas.links }, null, _parent, _scopeId));
						_push(`</div></div></div></div>`);
					} else return [createVNode("div", { class: "p-2" }, [createVNode("div", null, [createVNode("div", { class: "mb-4" }, [
						createVNode("div", { class: "flex justify-between items-end mb-2 border-b border-[var(--border-dark)] pb-2" }, [createVNode("h3", { class: "text-md font-bold theme-text" }, "Daftar Kelas"), createVNode(unref(Link), {
							href: _ctx.route("kelas.create"),
							class: "win95-btn"
						}, {
							default: withCtx(() => [createTextVNode(" Tambah Kelas ")]),
							_: 1
						}, 8, ["href"])]),
						createVNode("div", { class: "mb-4 text-sm text-gray-700 font-bold dark:text-gray-300" }, " Total: " + toDisplayString(__props.kelas.total) + " Kelas ", 1),
						createVNode("div", { class: "win95-panel !p-0 overflow-x-auto" }, [createVNode("table", { class: "w-full text-sm text-left border-collapse" }, [createVNode("thead", { class: "bg-[var(--bg-window)] theme-text border-b border-[var(--border-dark)]" }, [createVNode("tr", null, [
							createVNode("th", {
								scope: "col",
								class: "px-2 py-1 border-r border-[var(--border-dark)]"
							}, "Nama Kelas"),
							createVNode("th", {
								scope: "col",
								class: "px-2 py-1 border-r border-[var(--border-dark)]"
							}, "Tahun Ajaran"),
							createVNode("th", {
								scope: "col",
								class: "px-2 py-1"
							}, "Aksi")
						])]), createVNode("tbody", null, [(openBlock(true), createBlock(Fragment, null, renderList(__props.kelas.data, (item) => {
							return openBlock(), createBlock("tr", {
								key: item.id,
								class: "bg-[var(--bg-panel)] theme-text hover:bg-[#000080] hover:text-white group"
							}, [
								createVNode("td", { class: "px-2 py-1 border-r border-[var(--border-light)]" }, toDisplayString(item.nama_kelas), 1),
								createVNode("td", { class: "px-2 py-1 border-r border-[var(--border-light)]" }, toDisplayString(item.tahun_ajaran || "-"), 1),
								createVNode("td", { class: "px-2 py-1 flex space-x-2" }, [createVNode(unref(Link), {
									href: _ctx.route("kelas.edit", item.id),
									class: "win95-btn !px-2 !py-0 group-hover:text-black"
								}, {
									default: withCtx(() => [createTextVNode("Edit")]),
									_: 1
								}, 8, ["href"]), createVNode("button", {
									onClick: ($event) => deleteKelas(item.id),
									class: "win95-btn !px-2 !py-0 group-hover:text-black"
								}, "Hapus", 8, ["onClick"])])
							]);
						}), 128)), __props.kelas.data.length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [createVNode("td", {
							colspan: "3",
							class: "px-2 py-2 text-center text-gray-600"
						}, " Belum ada data kelas. ")])) : createCommentVNode("", true)])])]),
						createVNode("div", { class: "mt-6" }, [createVNode(Pagination_default, { links: __props.kelas.links }, null, 8, ["links"])])
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Kelas/Index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
export { _sfc_main as default };
