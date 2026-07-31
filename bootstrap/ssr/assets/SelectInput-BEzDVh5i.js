import { mergeModels, mergeProps, onMounted, ref, useModel, useSSRContext } from "vue";
import { ssrIncludeBooleanAttr, ssrInterpolate, ssrLooseContain, ssrLooseEqual, ssrRenderAttr, ssrRenderAttrs, ssrRenderList } from "vue/server-renderer";
//#region resources/js/Components/SelectInput.vue
var _sfc_main = {
	__name: "SelectInput",
	__ssrInlineRender: true,
	props: /*@__PURE__*/ mergeModels({ options: {
		type: Array,
		required: true
	} }, {
		"modelValue": {
			type: String,
			required: true
		},
		"modelModifiers": {}
	}),
	emits: ["update:modelValue"],
	setup(__props, { expose: __expose }) {
		const model = useModel(__props, "modelValue");
		const input = ref(null);
		onMounted(() => {
			if (input.value.hasAttribute("autofocus")) input.value.focus();
		});
		__expose({ focus: () => input.value.focus() });
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<select${ssrRenderAttrs(mergeProps({
				class: "border border-[var(--border-dark)] bg-[var(--bg-panel)] shadow-[inset_1px_1px_0_var(--border-darker),inset_-1px_-1px_0_var(--border-light)] text-[var(--text-color)] p-1 focus:outline-none",
				ref_key: "input",
				ref: input
			}, _attrs))}><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(model.value) ? ssrLooseContain(model.value, "") : ssrLooseEqual(model.value, "")) ? " selected" : ""}>Pilih salah satu</option><!--[-->`);
			ssrRenderList(__props.options, (option) => {
				_push(`<option${ssrRenderAttr("value", option.value || option)}${ssrIncludeBooleanAttr(Array.isArray(model.value) ? ssrLooseContain(model.value, option.value || option) : ssrLooseEqual(model.value, option.value || option)) ? " selected" : ""}>${ssrInterpolate(option.label || option)}</option>`);
			});
			_push(`<!--]--></select>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/SelectInput.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
export { _sfc_main as t };
