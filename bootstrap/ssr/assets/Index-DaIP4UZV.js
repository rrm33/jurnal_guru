import { t as _sfc_main$1 } from "./AuthenticatedLayout-C1P-b31-.js";
import { t as Pagination_default } from "./Pagination-DbvRrq2i.js";
import { Head, Link, router, useForm } from "@inertiajs/vue3";
import { Fragment, createBlock, createCommentVNode, createTextVNode, createVNode, openBlock, ref, renderList, toDisplayString, unref, useSSRContext, withCtx } from "vue";
import { ssrInterpolate, ssrRenderAttr, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
//#region resources/js/Pages/Siswa/Index.vue
var _sfc_main = {
	__name: "Index",
	__ssrInlineRender: true,
	props: { siswas: {
		type: Object,
		required: true
	} },
	setup(__props) {
		const deleteSiswa = (id) => {
			if (confirm("Apakah Anda yakin ingin menghapus data siswa ini?")) router.delete(route("siswa.destroy", id));
		};
		const fileInput = ref(null);
		const importForm = useForm({ file: null });
		const handleFileUpload = (e) => {
			importForm.file = e.target.files[0];
			if (importForm.file) if (confirm("File dipilih. Mulai proses import? Pastikan nama kelas di file sesuai dengan data kelas di sistem.")) importForm.post(route("siswa.import"), { onSuccess: () => {
				fileInput.value.value = null;
			} });
			else fileInput.value.value = null;
		};
		const triggerFileInput = () => {
			fileInput.value.click();
		};
		const downloadTemplate = () => {
			window.location.href = route("siswa.template");
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Manajemen Siswa" }, null, _parent));
			_push(ssrRenderComponent(_sfc_main$1, null, {
				header: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<h2 class="font-bold text-lg theme-text"${_scopeId}>Manajemen Siswa</h2>`);
					else return [createVNode("h2", { class: "font-bold text-lg theme-text" }, "Manajemen Siswa")];
				}),
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="p-2"${_scopeId}><div${_scopeId}><div class="mb-4"${_scopeId}><div class="flex justify-between items-end mb-2 border-b border-[var(--border-dark)] pb-2"${_scopeId}><h3 class="text-md font-bold theme-text"${_scopeId}>Daftar Siswa</h3><div class="flex space-x-2"${_scopeId}><button class="win95-btn"${_scopeId}> Unduh Template </button><button class="win95-btn flex items-center"${_scopeId}> Import Excel `);
						if (unref(importForm).processing) _push(`<span class="ml-2 text-xs"${_scopeId}>(Loading...)</span>`);
						else _push(`<!---->`);
						_push(`</button><input type="file" class="hidden" accept=".xlsx"${_scopeId}>`);
						_push(ssrRenderComponent(unref(Link), {
							href: _ctx.route("siswa.create"),
							class: "win95-btn font-bold"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Tambah Siswa `);
								else return [createTextVNode(" Tambah Siswa ")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div></div>`);
						if (_ctx.$page.props.flash?.success) _push(`<div class="win95-panel !p-2 mb-4 bg-[#008080] text-white font-bold"${_scopeId}>${ssrInterpolate(_ctx.$page.props.flash.success)}</div>`);
						else _push(`<!---->`);
						if (_ctx.$page.props.errors?.file) _push(`<div class="win95-panel !p-2 mb-4 bg-red-600 text-white font-bold"${_scopeId}>${ssrInterpolate(_ctx.$page.props.errors.file)}</div>`);
						else _push(`<!---->`);
						_push(`<div class="mb-2 theme-text text-sm"${_scopeId}> Total: ${ssrInterpolate(__props.siswas.total)} Siswa </div><div class="win95-panel !p-0 overflow-x-auto"${_scopeId}><table class="w-full text-sm text-left border-collapse"${_scopeId}><thead class="bg-[var(--bg-window)] theme-text border-b border-[var(--border-dark)]"${_scopeId}><tr${_scopeId}><th scope="col" class="px-2 py-1 border-r border-[var(--border-dark)] w-16"${_scopeId}>Foto</th><th scope="col" class="px-2 py-1 border-r border-[var(--border-dark)]"${_scopeId}>NIS</th><th scope="col" class="px-2 py-1 border-r border-[var(--border-dark)]"${_scopeId}>Nama Siswa</th><th scope="col" class="px-2 py-1 border-r border-[var(--border-dark)]"${_scopeId}>Kelas</th><th scope="col" class="px-2 py-1 border-r border-[var(--border-dark)]"${_scopeId}>No WA</th><th scope="col" class="px-2 py-1"${_scopeId}>Aksi</th></tr></thead><tbody${_scopeId}><!--[-->`);
						ssrRenderList(__props.siswas.data, (item) => {
							_push(`<tr class="bg-[var(--bg-panel)] theme-text hover:bg-[#000080] hover:text-white group"${_scopeId}><td class="px-2 py-1 border-r border-[var(--border-light)] text-center"${_scopeId}>`);
							if (item.foto) _push(`<img${ssrRenderAttr("src", "/storage/" + item.foto)} class="w-10 h-10 object-cover border border-gray-400 mx-auto"${_scopeId}>`);
							else _push(`<div class="w-10 h-10 bg-gray-200 border border-gray-400 mx-auto flex items-center justify-center text-gray-500 text-xs"${_scopeId}>No</div>`);
							_push(`</td><td class="px-2 py-1 border-r border-[var(--border-light)]"${_scopeId}>${ssrInterpolate(item.nis)}</td><td class="px-2 py-1 border-r border-[var(--border-light)]"${_scopeId}>${ssrInterpolate(item.nama)}</td><td class="px-2 py-1 border-r border-[var(--border-light)]"${_scopeId}>${ssrInterpolate(item.kelas?.nama_kelas || "-")}</td><td class="px-2 py-1 border-r border-[var(--border-light)]"${_scopeId}>${ssrInterpolate(item.wa || "-")}</td><td class="px-2 py-1 flex space-x-2 items-center h-full pt-3"${_scopeId}>`);
							_push(ssrRenderComponent(unref(Link), {
								href: _ctx.route("siswa.edit", item.id),
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
						if (__props.siswas.data.length === 0) _push(`<tr${_scopeId}><td colspan="6" class="px-2 py-4 text-center text-gray-500 theme-text bg-[var(--bg-panel)]"${_scopeId}> Belum ada data siswa. </td></tr>`);
						else _push(`<!---->`);
						_push(`</tbody></table></div>`);
						_push(ssrRenderComponent(Pagination_default, {
							class: "mt-4",
							links: __props.siswas.links
						}, null, _parent, _scopeId));
						_push(`</div></div></div>`);
					} else return [createVNode("div", { class: "p-2" }, [createVNode("div", null, [createVNode("div", { class: "mb-4" }, [
						createVNode("div", { class: "flex justify-between items-end mb-2 border-b border-[var(--border-dark)] pb-2" }, [createVNode("h3", { class: "text-md font-bold theme-text" }, "Daftar Siswa"), createVNode("div", { class: "flex space-x-2" }, [
							createVNode("button", {
								onClick: downloadTemplate,
								class: "win95-btn"
							}, " Unduh Template "),
							createVNode("button", {
								onClick: triggerFileInput,
								class: "win95-btn flex items-center"
							}, [createTextVNode(" Import Excel "), unref(importForm).processing ? (openBlock(), createBlock("span", {
								key: 0,
								class: "ml-2 text-xs"
							}, "(Loading...)")) : createCommentVNode("", true)]),
							createVNode("input", {
								type: "file",
								ref_key: "fileInput",
								ref: fileInput,
								class: "hidden",
								accept: ".xlsx",
								onChange: handleFileUpload
							}, null, 544),
							createVNode(unref(Link), {
								href: _ctx.route("siswa.create"),
								class: "win95-btn font-bold"
							}, {
								default: withCtx(() => [createTextVNode(" Tambah Siswa ")]),
								_: 1
							}, 8, ["href"])
						])]),
						_ctx.$page.props.flash?.success ? (openBlock(), createBlock("div", {
							key: 0,
							class: "win95-panel !p-2 mb-4 bg-[#008080] text-white font-bold"
						}, toDisplayString(_ctx.$page.props.flash.success), 1)) : createCommentVNode("", true),
						_ctx.$page.props.errors?.file ? (openBlock(), createBlock("div", {
							key: 1,
							class: "win95-panel !p-2 mb-4 bg-red-600 text-white font-bold"
						}, toDisplayString(_ctx.$page.props.errors.file), 1)) : createCommentVNode("", true),
						createVNode("div", { class: "mb-2 theme-text text-sm" }, " Total: " + toDisplayString(__props.siswas.total) + " Siswa ", 1),
						createVNode("div", { class: "win95-panel !p-0 overflow-x-auto" }, [createVNode("table", { class: "w-full text-sm text-left border-collapse" }, [createVNode("thead", { class: "bg-[var(--bg-window)] theme-text border-b border-[var(--border-dark)]" }, [createVNode("tr", null, [
							createVNode("th", {
								scope: "col",
								class: "px-2 py-1 border-r border-[var(--border-dark)] w-16"
							}, "Foto"),
							createVNode("th", {
								scope: "col",
								class: "px-2 py-1 border-r border-[var(--border-dark)]"
							}, "NIS"),
							createVNode("th", {
								scope: "col",
								class: "px-2 py-1 border-r border-[var(--border-dark)]"
							}, "Nama Siswa"),
							createVNode("th", {
								scope: "col",
								class: "px-2 py-1 border-r border-[var(--border-dark)]"
							}, "Kelas"),
							createVNode("th", {
								scope: "col",
								class: "px-2 py-1 border-r border-[var(--border-dark)]"
							}, "No WA"),
							createVNode("th", {
								scope: "col",
								class: "px-2 py-1"
							}, "Aksi")
						])]), createVNode("tbody", null, [(openBlock(true), createBlock(Fragment, null, renderList(__props.siswas.data, (item) => {
							return openBlock(), createBlock("tr", {
								key: item.id,
								class: "bg-[var(--bg-panel)] theme-text hover:bg-[#000080] hover:text-white group"
							}, [
								createVNode("td", { class: "px-2 py-1 border-r border-[var(--border-light)] text-center" }, [item.foto ? (openBlock(), createBlock("img", {
									key: 0,
									src: "/storage/" + item.foto,
									class: "w-10 h-10 object-cover border border-gray-400 mx-auto"
								}, null, 8, ["src"])) : (openBlock(), createBlock("div", {
									key: 1,
									class: "w-10 h-10 bg-gray-200 border border-gray-400 mx-auto flex items-center justify-center text-gray-500 text-xs"
								}, "No"))]),
								createVNode("td", { class: "px-2 py-1 border-r border-[var(--border-light)]" }, toDisplayString(item.nis), 1),
								createVNode("td", { class: "px-2 py-1 border-r border-[var(--border-light)]" }, toDisplayString(item.nama), 1),
								createVNode("td", { class: "px-2 py-1 border-r border-[var(--border-light)]" }, toDisplayString(item.kelas?.nama_kelas || "-"), 1),
								createVNode("td", { class: "px-2 py-1 border-r border-[var(--border-light)]" }, toDisplayString(item.wa || "-"), 1),
								createVNode("td", { class: "px-2 py-1 flex space-x-2 items-center h-full pt-3" }, [createVNode(unref(Link), {
									href: _ctx.route("siswa.edit", item.id),
									class: "win95-btn !px-2 group-hover:text-black"
								}, {
									default: withCtx(() => [createTextVNode(" Edit ")]),
									_: 1
								}, 8, ["href"]), createVNode("button", {
									onClick: ($event) => deleteSiswa(item.id),
									class: "win95-btn !px-2 group-hover:text-black"
								}, " Hapus ", 8, ["onClick"])])
							]);
						}), 128)), __props.siswas.data.length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [createVNode("td", {
							colspan: "6",
							class: "px-2 py-4 text-center text-gray-500 theme-text bg-[var(--bg-panel)]"
						}, " Belum ada data siswa. ")])) : createCommentVNode("", true)])])]),
						createVNode(Pagination_default, {
							class: "mt-4",
							links: __props.siswas.links
						}, null, 8, ["links"])
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Siswa/Index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
export { _sfc_main as default };
