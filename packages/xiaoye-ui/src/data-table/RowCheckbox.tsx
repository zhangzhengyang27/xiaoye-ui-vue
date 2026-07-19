/// <reference types="vue/jsx" />
import { computed, defineComponent, inject, type PropType } from 'vue';
import Checkbox from 'xiaoye-ui/checkbox';

const RowCheckbox = defineComponent({
  name: 'XYRowCheckbox',
  inheritAttrs: false,
  props: {
    value: { type: null as any, default: undefined },
    checked: { type: null as any, default: undefined },
    column: { type: null as any, default: undefined },
    rowCheckboxIconTemplate: { type: Function as PropType<Function | null>, default: null },
    index: { type: [Number, null] as any, default: null },
    disabled: { type: Boolean, default: false },
    onChange: { type: Function as any },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const $xiaoyeUI = inject<any>('$xiaoyeUI', {} as any);

    function onChange(event: any) {
      if (!props.disabled) {
        emit('change', {
          originalEvent: event,
          data: props.value,
        });
      }
    }

    const checkboxAriaLabel = computed(() => {
      return $xiaoyeUI?.config?.locale?.aria
        ? props.checked
          ? $xiaoyeUI.config.locale.aria.selectRow
          : $xiaoyeUI.config.locale.aria.unselectRow
        : undefined;
    });

    return () => {
      const iconSlot = props.rowCheckboxIconTemplate
        ? {
            default: () => {
              const iconFn = props.rowCheckboxIconTemplate as any;
              return iconFn({ checked: props.checked });
            },
          }
        : undefined;

      return (
        <Checkbox
          checked={props.checked}
          disabled={props.disabled}
          aria-label={checkboxAriaLabel.value}
          onChange={onChange}
          v-slots={iconSlot || undefined}
        ></Checkbox>
      );
    };
  },
});

export default RowCheckbox;
