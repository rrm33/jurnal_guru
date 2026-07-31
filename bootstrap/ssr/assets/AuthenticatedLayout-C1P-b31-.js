import { Link } from "@inertiajs/vue3";
import { createBlock, createVNode, mergeProps, onMounted, openBlock, ref, unref, useSSRContext, withCtx } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot } from "vue/server-renderer";
//#region resources/js/Layouts/AuthenticatedLayout.vue
var _sfc_main = {
	__name: "AuthenticatedLayout",
	__ssrInlineRender: true,
	setup(__props) {
		const currentTheme = ref("win98");
		onMounted(() => {
			const savedTheme = localStorage.getItem("app-theme") || "win98";
			currentTheme.value = savedTheme;
			document.body.className = "";
			document.body.classList.add(`theme-${savedTheme}`);
		});
		return (_ctx, _push, _parent, _attrs) => {
			if (currentTheme.value === "modern") {
				_push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[var(--bg-desktop)] flex flex-col font-['Inter',_sans-serif]" }, _attrs))}><nav class="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm"><div class="flex items-center space-x-3"><div class="w-10 h-10 bg-[#2C4C3B] rounded flex items-center justify-center text-white"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg></div><div><h1 class="font-bold text-gray-800 leading-tight">Jurnal Mapel RPL</h1><p class="text-[10px] text-gray-500 font-semibold tracking-wider uppercase">SMKN 6 JEMBER • RPL</p></div></div><div class="flex space-x-1 bg-gray-100 p-1 rounded-full"><button class="bg-[#2C4C3B] text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm">Guru</button><button class="text-gray-600 px-4 py-1.5 rounded-full text-xs font-semibold hover:bg-gray-200 transition-colors">Siswa Portal</button></div><div class="flex items-center space-x-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors"><div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 overflow-hidden"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg></div><div class="text-sm pr-2"><div class="font-bold text-gray-800 leading-none">${ssrInterpolate(_ctx.$page.props.auth.user.name)}</div><div class="text-[10px] text-gray-500 mt-1">Admin / Guru</div></div></div></nav><div class="flex flex-1 overflow-hidden"><aside class="w-64 bg-[#2C4C3B] text-white shrink-0 overflow-y-auto"><div class="px-6 py-6"><div class="text-[10px] font-semibold text-gray-400 mb-4 uppercase tracking-widest">Navigasi Utama</div><ul class="space-y-1 text-sm"><li>`);
				_push(ssrRenderComponent(unref(Link), {
					href: _ctx.route("dashboard"),
					class: ["flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors", _ctx.route().current("dashboard") ? "bg-[#365340] text-white font-semibold" : "text-gray-300 hover:bg-[#365340] hover:text-white"]
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"${_scopeId}></path></svg><span${_scopeId}>Dashboard Analitik</span>`);
						else return [(openBlock(), createBlock("svg", {
							xmlns: "http://www.w3.org/2000/svg",
							class: "h-5 w-5 opacity-75",
							fill: "none",
							viewBox: "0 0 24 24",
							stroke: "currentColor"
						}, [createVNode("path", {
							"stroke-linecap": "round",
							"stroke-linejoin": "round",
							"stroke-width": "2",
							d: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
						})])), createVNode("span", null, "Dashboard Analitik")];
					}),
					_: 1
				}, _parent));
				_push(`</li><li>`);
				_push(ssrRenderComponent(unref(Link), {
					href: _ctx.route("rpp.index"),
					class: ["flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors", _ctx.route().current("rpp.*") || _ctx.route().current("presensi.*") || _ctx.route().current("penilaian.*") ? "bg-[#365340] text-white font-semibold shadow-inner" : "text-gray-300 hover:bg-[#365340] hover:text-white"]
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"${_scopeId}></path></svg><span${_scopeId}>Rencana Semester (RPP)</span>`);
						else return [(openBlock(), createBlock("svg", {
							xmlns: "http://www.w3.org/2000/svg",
							class: "h-5 w-5 opacity-75",
							fill: "none",
							viewBox: "0 0 24 24",
							stroke: "currentColor"
						}, [createVNode("path", {
							"stroke-linecap": "round",
							"stroke-linejoin": "round",
							"stroke-width": "2",
							d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
						})])), createVNode("span", null, "Rencana Semester (RPP)")];
					}),
					_: 1
				}, _parent));
				_push(`</li><li>`);
				_push(ssrRenderComponent(unref(Link), {
					href: _ctx.route("kelas.index"),
					class: ["flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors", _ctx.route().current("kelas.*") ? "bg-[#365340] text-white font-semibold" : "text-gray-300 hover:bg-[#365340] hover:text-white"]
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"${_scopeId}></path></svg><span${_scopeId}>Kelola Kelas</span>`);
						else return [(openBlock(), createBlock("svg", {
							xmlns: "http://www.w3.org/2000/svg",
							class: "h-5 w-5 opacity-75",
							fill: "none",
							viewBox: "0 0 24 24",
							stroke: "currentColor"
						}, [createVNode("path", {
							"stroke-linecap": "round",
							"stroke-linejoin": "round",
							"stroke-width": "2",
							d: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
						})])), createVNode("span", null, "Kelola Kelas")];
					}),
					_: 1
				}, _parent));
				_push(`</li><li>`);
				_push(ssrRenderComponent(unref(Link), {
					href: _ctx.route("siswa.index"),
					class: ["flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors", _ctx.route().current("siswa.*") ? "bg-[#365340] text-white font-semibold" : "text-gray-300 hover:bg-[#365340] hover:text-white"]
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"${_scopeId}></path></svg><span${_scopeId}>Kelola Data Siswa</span>`);
						else return [(openBlock(), createBlock("svg", {
							xmlns: "http://www.w3.org/2000/svg",
							class: "h-5 w-5 opacity-75",
							fill: "none",
							viewBox: "0 0 24 24",
							stroke: "currentColor"
						}, [createVNode("path", {
							"stroke-linecap": "round",
							"stroke-linejoin": "round",
							"stroke-width": "2",
							d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
						})])), createVNode("span", null, "Kelola Data Siswa")];
					}),
					_: 1
				}, _parent));
				_push(`</li><div class="pt-6 pb-2"><div class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Sistem</div></div><li>`);
				_push(ssrRenderComponent(unref(Link), {
					href: _ctx.route("settings.theme"),
					class: ["flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors", _ctx.route().current("settings.theme") ? "bg-[#365340] text-white font-semibold" : "text-gray-300 hover:bg-[#365340] hover:text-white"]
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"${_scopeId}></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"${_scopeId}></path></svg><span${_scopeId}>Pengaturan Tema</span>`);
						else return [(openBlock(), createBlock("svg", {
							xmlns: "http://www.w3.org/2000/svg",
							class: "h-5 w-5 opacity-75",
							fill: "none",
							viewBox: "0 0 24 24",
							stroke: "currentColor"
						}, [createVNode("path", {
							"stroke-linecap": "round",
							"stroke-linejoin": "round",
							"stroke-width": "2",
							d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
						}), createVNode("path", {
							"stroke-linecap": "round",
							"stroke-linejoin": "round",
							"stroke-width": "2",
							d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
						})])), createVNode("span", null, "Pengaturan Tema")];
					}),
					_: 1
				}, _parent));
				_push(`</li><li><button class="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-[#365340] hover:text-white transition-colors"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg><span>Keluar</span></button></li></ul></div></aside><main class="flex-1 overflow-y-auto bg-[var(--bg-desktop)]"><div class="max-w-7xl mx-auto px-8 py-8">`);
				if (_ctx.$slots.header) {
					_push(`<header class="mb-6">`);
					ssrRenderSlot(_ctx.$slots, "header", {}, null, _push, _parent);
					_push(`</header>`);
				} else _push(`<!---->`);
				ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
				_push(`</div></main></div></div>`);
			} else {
				_push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen p-4 flex flex-col font-['MS_Sans_Serif',_sans-serif] app-container" }, _attrs))}><div class="win95-window flex-1 flex flex-col"><div class="win95-titlebar"><div class="flex items-center space-x-2"><img src="https://win98icons.alexmeub.com/icons/png/computer_explorer-5.png" class="w-4 h-4" alt="icon"><span>Jurnal Guru Admin</span></div><div class="flex space-x-1 fake-window-controls"><button class="win95-btn !px-1 !py-0 font-bold">_</button><button class="win95-btn !px-1 !py-0 font-bold">□</button><button class="win95-btn !px-1 !py-0 font-bold">X</button></div></div><div class="flex px-2 py-1 space-x-4 border-b border-[var(--border-dark)] bg-[var(--bg-window)] mb-2 shadow-[0_1px_0_var(--border-light)] fake-menubar"><span class="hover:bg-blue-800 hover:text-white px-2 cursor-default theme-text">File</span><span class="hover:bg-blue-800 hover:text-white px-2 cursor-default theme-text">Edit</span><span class="hover:bg-blue-800 hover:text-white px-2 cursor-default theme-text">View</span><span class="hover:bg-blue-800 hover:text-white px-2 cursor-default theme-text">Help</span></div><div class="flex flex-1 overflow-hidden p-2"><aside class="w-48 win95-sidebar p-2 mr-2 flex flex-col"><div class="win95-panel flex-1 p-2"><ul class="space-y-2"><li>`);
				_push(ssrRenderComponent(unref(Link), {
					href: _ctx.route("dashboard"),
					class: ["flex items-center space-x-2 p-1 hover:bg-[#000080] hover:text-white cursor-default theme-text", { "bg-[#000080] !text-white": _ctx.route().current("dashboard") }]
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`<img src="https://win98icons.alexmeub.com/icons/png/computer_explorer-4.png" class="w-4 h-4" alt="icon"${_scopeId}><span${_scopeId}>Dashboard</span>`);
						else return [createVNode("img", {
							src: "https://win98icons.alexmeub.com/icons/png/computer_explorer-4.png",
							class: "w-4 h-4",
							alt: "icon"
						}), createVNode("span", null, "Dashboard")];
					}),
					_: 1
				}, _parent));
				_push(`</li><li>`);
				_push(ssrRenderComponent(unref(Link), {
					href: _ctx.route("kelas.index"),
					class: ["flex items-center space-x-2 p-1 hover:bg-[#000080] hover:text-white cursor-default theme-text", { "bg-[#000080] !text-white": _ctx.route().current("kelas.*") }]
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`<img src="https://win98icons.alexmeub.com/icons/png/directory_open_file_mydocs-4.png" class="w-4 h-4" alt="icon"${_scopeId}><span${_scopeId}>Kelas</span>`);
						else return [createVNode("img", {
							src: "https://win98icons.alexmeub.com/icons/png/directory_open_file_mydocs-4.png",
							class: "w-4 h-4",
							alt: "icon"
						}), createVNode("span", null, "Kelas")];
					}),
					_: 1
				}, _parent));
				_push(`</li><li>`);
				_push(ssrRenderComponent(unref(Link), {
					href: _ctx.route("siswa.index"),
					class: ["flex items-center space-x-2 p-1 hover:bg-[#000080] hover:text-white cursor-default theme-text", { "bg-[#000080] !text-white": _ctx.route().current("siswa.*") }]
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`<img src="https://win98icons.alexmeub.com/icons/png/users-1.png" class="w-4 h-4" alt="icon"${_scopeId}><span${_scopeId}>Siswa</span>`);
						else return [createVNode("img", {
							src: "https://win98icons.alexmeub.com/icons/png/users-1.png",
							class: "w-4 h-4",
							alt: "icon"
						}), createVNode("span", null, "Siswa")];
					}),
					_: 1
				}, _parent));
				_push(`</li><li>`);
				_push(ssrRenderComponent(unref(Link), {
					href: _ctx.route("rpp.index"),
					class: ["flex items-center space-x-2 p-1 hover:bg-[#000080] hover:text-white cursor-default theme-text", { "bg-[#000080] !text-white": _ctx.route().current("rpp.*") || _ctx.route().current("presensi.*") || _ctx.route().current("penilaian.*") }]
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`<img src="https://win98icons.alexmeub.com/icons/png/notepad_file-0.png" class="w-4 h-4" alt="icon"${_scopeId}><span${_scopeId}>Perencanaan (RPP)</span>`);
						else return [createVNode("img", {
							src: "https://win98icons.alexmeub.com/icons/png/notepad_file-0.png",
							class: "w-4 h-4",
							alt: "icon"
						}), createVNode("span", null, "Perencanaan (RPP)")];
					}),
					_: 1
				}, _parent));
				_push(`</li><li>`);
				_push(ssrRenderComponent(unref(Link), {
					href: _ctx.route("profile.edit"),
					class: ["flex items-center space-x-2 p-1 hover:bg-[#000080] hover:text-white cursor-default theme-text", { "bg-[#000080] !text-white": _ctx.route().current("profile.*") }]
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`<img src="https://win98icons.alexmeub.com/icons/png/user_computer-0.png" class="w-4 h-4" alt="icon"${_scopeId}><span${_scopeId}>Profil</span>`);
						else return [createVNode("img", {
							src: "https://win98icons.alexmeub.com/icons/png/user_computer-0.png",
							class: "w-4 h-4",
							alt: "icon"
						}), createVNode("span", null, "Profil")];
					}),
					_: 1
				}, _parent));
				_push(`</li><li>`);
				_push(ssrRenderComponent(unref(Link), {
					href: _ctx.route("settings.theme"),
					class: ["flex items-center space-x-2 p-1 hover:bg-[#000080] hover:text-white cursor-default theme-text", { "bg-[#000080] !text-white": _ctx.route().current("settings.theme") }]
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`<img src="https://win98icons.alexmeub.com/icons/png/display_properties-2.png" class="w-4 h-4" alt="icon"${_scopeId}><span${_scopeId}>Pengaturan Tema</span>`);
						else return [createVNode("img", {
							src: "https://win98icons.alexmeub.com/icons/png/display_properties-2.png",
							class: "w-4 h-4",
							alt: "icon"
						}), createVNode("span", null, "Pengaturan Tema")];
					}),
					_: 1
				}, _parent));
				_push(`</li><li class="pt-4 border-t border-[var(--border-dark)] mt-4 shadow-[0_-1px_0_var(--border-light)]"><button class="flex items-center space-x-2 p-1 hover:bg-[#000080] hover:text-white cursor-default w-full text-left theme-text"><img src="https://win98icons.alexmeub.com/icons/png/shut_down_normal-2.png" class="w-4 h-4" alt="icon"><span>Log Out</span></button></li></ul></div></aside><main class="flex-1 flex flex-col overflow-auto win95-panel bg-[var(--bg-window)]">`);
				if (_ctx.$slots.header) {
					_push(`<header class="border-b border-[var(--border-dark)] shadow-[0_1px_0_var(--border-light)] p-2 bg-[var(--bg-window)]">`);
					ssrRenderSlot(_ctx.$slots, "header", {}, null, _push, _parent);
					_push(`</header>`);
				} else _push(`<!---->`);
				_push(`<div class="p-4 bg-[var(--bg-panel)] flex-1 win95-panel m-2">`);
				ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
				_push(`</div></main></div><div class="flex items-center p-1 mt-1 border-t border-[var(--border-light)] shadow-[inset_0_1px_0_var(--border-dark)] fake-statusbar"><div class="win95-panel flex-1 !p-1 text-xs px-2 shadow-[inset_1px_1px_0_var(--border-dark),inset_-1px_-1px_0_var(--border-light)] bg-[var(--bg-window)] border-none theme-text"> Ready </div><div class="win95-panel w-32 !p-1 text-xs px-2 mx-1 shadow-[inset_1px_1px_0_var(--border-dark),inset_-1px_-1px_0_var(--border-light)] bg-[var(--bg-window)] border-none theme-text">${ssrInterpolate(_ctx.$page.props.auth.user.name)}</div><div class="win95-panel w-16 !p-1 text-xs px-2 shadow-[inset_1px_1px_0_var(--border-dark),inset_-1px_-1px_0_var(--border-light)] bg-[var(--bg-window)] border-none theme-text"> Admin </div></div></div></div>`);
			}
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Layouts/AuthenticatedLayout.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
export { _sfc_main as t };
