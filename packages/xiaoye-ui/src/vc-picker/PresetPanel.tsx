import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PresetPanel',
  props: {
    prefixCls: String,
    presets: {
      type: Array,
      default: () => [],
    },
    onClick: Function,
    onHover: Function,
  },
  emits: ['click', 'hover'],
  setup(props, { emit }) {
    const callEvent = (fn: any, ...args: any[]) => {
      if (Array.isArray(fn)) {
        fn.forEach(f => f?.(...args));
      } else {
        fn?.(...args);
      }
    };
    return () => {
      if (!props.presets.length) {
        return null;
      }
      return (
        <div class={`${props.prefixCls}-presets`}>
          <ul>
            {props.presets.map(({ label, value }, index) => (
              <li
                key={index}
                onClick={e => {
                  e.stopPropagation();
                  emit('click', value);
                  callEvent(props.onClick, value);
                }}
                onMouseenter={() => {
                  emit('hover', value);
                  callEvent(props.onHover, value);
                }}
                onMouseleave={() => {
                  emit('hover', null);
                  callEvent(props.onHover, null);
                }}
              >
                {label}
              </li>
            ))}
          </ul>
        </div>
      );
    };
  },
});
