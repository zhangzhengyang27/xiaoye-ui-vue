/// <reference types="vue/jsx" />
import { computed, defineComponent, ref } from 'vue';
import { initDefaultProps } from '../_util/props-util';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { useInjectForm } from '../form/context';
import { getNamePath } from '../form/utils/valueUtil';
import formListProps from './formListTypes';
import type { FormListField, FormListOperation } from './formListTypes';
import useStyle from './style';

export default defineComponent({
  name: 'XYFormList',
  inheritAttrs: false,
  __XY_FORM_LIST: true,
  props: initDefaultProps(formListProps(), {}),
  setup(props, { slots }) {
    const { prefixCls } = useConfigInject('formlist', props);
    // 调用 useStyle 以维持组件样式 hook 链路一致；FormList 无根元素，不直接使用返回值
    useStyle(prefixCls);

    const formContext = useInjectForm();

    const normalizedName = computed(() => getNamePath(props.name ?? null));

    const keyCounter = ref(0);
    const internalValue = ref<any[]>([...(props.initialValue || [])]);
    const keys = ref<string[]>([]);

    const ensureKeys = (length: number) => {
      while (keys.value.length < length) {
        keys.value.push(`list_${keyCounter.value++}`);
      }
      if (keys.value.length > length) {
        keys.value.splice(length);
      }
    };

    ensureKeys(internalValue.value.length);

    const fields = computed<FormListField[]>(() => {
      const len = internalValue.value.length;
      ensureKeys(len);
      return Array.from({ length: len }, (_, i) => ({
        key: keys.value[i],
        name: i,
        isListField: true,
      }));
    });

    const syncToForm = () => {
      const path = normalizedName.value;
      if (!path || !path.length) return;
      const model = formContext.model?.value;
      if (!model) return;

      if (path.length === 1) {
        model[path[0]] = internalValue.value;
      } else {
        let obj = model;
        for (let i = 0; i < path.length - 1; i++) {
          if (!obj[path[i]]) obj[path[i]] = {};
          obj = obj[path[i]];
        }
        obj[path[path.length - 1]] = internalValue.value;
      }
    };

    // 初始化时同步初始值到 form model（替代源项目的 registerList）
    syncToForm();

    const add: FormListOperation['add'] = (defaultValue, insertIndex) => {
      const arr = [...internalValue.value];
      const index = insertIndex !== undefined ? insertIndex : arr.length;
      arr.splice(index, 0, defaultValue);
      keys.value.splice(index, 0, `list_${keyCounter.value++}`);
      internalValue.value = arr;
      syncToForm();
    };

    const remove: FormListOperation['remove'] = index => {
      const arr = [...internalValue.value];
      arr.splice(index, 1);
      keys.value.splice(index, 1);
      internalValue.value = arr;
      syncToForm();
    };

    const move: FormListOperation['move'] = (from, to) => {
      const arr = [...internalValue.value];
      if (from < 0 || from >= arr.length || to < 0 || to >= arr.length) return;
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      const [key] = keys.value.splice(from, 1);
      keys.value.splice(to, 0, key);
      internalValue.value = arr;
      syncToForm();
    };

    return () => slots.default?.({ fields: fields.value, add, remove, move });
  },
});
