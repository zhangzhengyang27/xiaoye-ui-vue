/// <reference types="vue/jsx" />
import { computed, defineComponent, inject, type PropType } from 'vue';
import Checkbox from 'xiaoye-ui/checkbox';

const HeaderCheckbox = defineComponent({
  name: 'XYHeaderCheckbox',
  inheritAttrs: false,
  props: {
    checked: { type: null as any, default: undefined },
    disabled: { type: null as any, default: undefined },
    column: { type: null as any, default: undefined },
    headerCheckboxIconTemplate: { type: Function as PropType<Function | null>, default: null },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const $xiaoyeUI = inject<any>('$xiaoyeUI', {} as any);

    function onChange(event: any) {
      emit('change', {
        originalEvent: event,
        checked: !props.checked,
      });
    }

    const headerCheckboxAriaLabel = computed(() => {
      return $xiaoyeUI?.config?.locale?.aria
        ? props.checked
          ? $xiaoyeUI.config.locale.aria.selectAll
          : $xiaoyeUI.config.locale.aria.unselectAll
        : undefined;
    });

    return () => {
      const iconSlot = props.headerCheckboxIconTemplate
        ? {
            default: () => {
              const iconFn = props.headerCheckboxIconTemplate as any;
              return iconFn({});
            },
          }
        : undefined;

      return (
        <Checkbox
          checked={props.checked}
          disabled={props.disabled}
          aria-label={headerCheckboxAriaLabel.value}
          onChange={onChange}
          v-slots={iconSlot || undefined}
        ></Checkbox>
      );
    };
  },
});

export default HeaderCheckbox;
