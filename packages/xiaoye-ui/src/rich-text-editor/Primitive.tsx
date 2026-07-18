/// <reference types="vue/jsx" />
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'XYPrimitive',
  inheritAttrs: true,
  props: {
    as: { type: [String, Object] as PropType<string | object>, default: 'div' },
  },
  setup(props, { attrs, slots }) {
    return () => {
      const As = props.as as any;
      return <As {...attrs}>{slots.default?.()}</As>;
    };
  },
});
