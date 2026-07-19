import { defineComponent, getCurrentInstance, inject, onMounted, onUnmounted } from 'vue';
import './style';

export default defineComponent({
  name: 'XYColumnGroup',
  inheritAttrs: false,
  props: {
    type: { type: String as () => 'header' | 'footer', default: undefined },
  },
  setup(_, { slots }) {
    const instance = getCurrentInstance();
    const columnGroups = inject<Set<any>>('$columnGroups', undefined);

    onMounted(() => {
      instance && columnGroups?.add(instance);
    });

    onUnmounted(() => {
      instance && columnGroups?.delete(instance);
    });

    return () => slots.default?.();
  },
});
