/// <reference types="vue/jsx" />
import { defineComponent } from 'vue';
import Radio from 'xiaoye-ui/radio';

const RowRadioButton = defineComponent({
  name: 'XYRowRadioButton',
  inheritAttrs: false,
  props: {
    value: { type: null as any, default: undefined },
    checked: { type: null as any, default: undefined },
    name: { type: null as any, default: undefined },
    column: { type: null as any, default: undefined },
    index: { type: [Number, null] as any, default: null },
    disabled: { type: Boolean, default: false },
    onChange: { type: Function as any },
  },
  emits: ['change'],
  setup(props, { emit }) {
    function onChange(event: any) {
      if (!props.disabled) {
        emit('change', {
          originalEvent: event,
          data: props.value,
        });
      }
    }

    return () => {
      return (
        <Radio
          checked={props.checked}
          disabled={props.disabled}
          name={props.name}
          onChange={onChange}
        />
      );
    };
  },
});

export default RowRadioButton;
