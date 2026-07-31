import { t as _sfc_main$1 } from "./AuthenticatedLayout-C1P-b31-.js";
import { Head } from "@inertiajs/vue3";
import { Fragment, createBlock, createVNode, onMounted, openBlock, ref, renderList, toDisplayString, unref, useSSRContext, vModelRadio, withCtx, withDirectives } from "vue";
import { ssrIncludeBooleanAttr, ssrInterpolate, ssrLooseEqual, ssrRenderAttr, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
//#region resources/js/Pages/Settings/Theme.vue
var _sfc_main = {
	__name: "Theme",
	__ssrInlineRender: true,
	setup(__props) {
		const themes = [
			{
				id: "win98",
				name: "Classic Windows 98"
			},
			{
				id: "winxp",
				name: "Windows XP"
			},
			{
				id: "win7",
				name: "Windows 7"
			},
			{
				id: "macos",
				name: "Mac OS"
			},
			{
				id: "linux",
				name: "Linux"
			},
			{
				id: "modern",
				name: "Modern (Minimalist)"
			}
		];
		const selectedTheme = ref("win98");
		onMounted(() => {
			const savedTheme = localStorage.getItem("app-theme");
			if (savedTheme && themes.find((t) => t.id === savedTheme)) selectedTheme.value = savedTheme;
		});
		const applyTheme = (themeId) => {
			selectedTheme.value = themeId;
			localStorage.setItem("app-theme", themeId);
			document.body.className = "";
			document.body.classList.add(`theme-${themeId}`);
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(unref(Head), { title: "Pengaturan Tema" }, null, _parent));
			_push(ssrRenderComponent(_sfc_main$1, null, {
				header: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<h2 class="font-bold text-lg text-black theme-text"${_scopeId}>Pengaturan Tema</h2>`);
					else return [createVNode("h2", { class: "font-bold text-lg text-black theme-text" }, "Pengaturan Tema")];
				}),
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="p-2"${_scopeId}><div class="win95-panel theme-panel p-4"${_scopeId}><h3 class="font-bold mb-4 theme-text"${_scopeId}>Pilih Tema Aplikasi</h3><div class="space-y-2"${_scopeId}><!--[-->`);
						ssrRenderList(themes, (theme) => {
							_push(`<div class="flex items-center"${_scopeId}><input type="radio"${ssrRenderAttr("id", theme.id)}${ssrRenderAttr("value", theme.id)}${ssrIncludeBooleanAttr(ssrLooseEqual(selectedTheme.value, theme.id)) ? " checked" : ""} class="mr-2 cursor-pointer"${_scopeId}><label${ssrRenderAttr("for", theme.id)} class="cursor-pointer theme-text"${_scopeId}>${ssrInterpolate(theme.name)}</label></div>`);
						});
						_push(`<!--]--></div><div class="mt-4 text-sm text-gray-600 theme-text-muted"${_scopeId}> Tema yang dipilih akan tersimpan di browser ini. </div></div></div>`);
					} else return [createVNode("div", { class: "p-2" }, [createVNode("div", { class: "win95-panel theme-panel p-4" }, [
						createVNode("h3", { class: "font-bold mb-4 theme-text" }, "Pilih Tema Aplikasi"),
						createVNode("div", { class: "space-y-2" }, [(openBlock(), createBlock(Fragment, null, renderList(themes, (theme) => {
							return createVNode("div", {
								key: theme.id,
								class: "flex items-center"
							}, [withDirectives(createVNode("input", {
								type: "radio",
								id: theme.id,
								value: theme.id,
								"onUpdate:modelValue": ($event) => selectedTheme.value = $event,
								onChange: ($event) => applyTheme(theme.id),
								class: "mr-2 cursor-pointer"
							}, null, 40, [
								"id",
								"value",
								"onUpdate:modelValue",
								"onChange"
							]), [[vModelRadio, selectedTheme.value]]), createVNode("label", {
								for: theme.id,
								class: "cursor-pointer theme-text"
							}, toDisplayString(theme.name), 9, ["for"])]);
						}), 64))]),
						createVNode("div", { class: "mt-4 text-sm text-gray-600 theme-text-muted" }, " Tema yang dipilih akan tersimpan di browser ini. ")
					])])];
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Settings/Theme.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
export { _sfc_main as default };
