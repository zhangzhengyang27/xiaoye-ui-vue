import { defineComponent, ref } from 'vue';
import { Switch } from 'xiaoye-ui';

import type { ComponentDemo } from '../../interface';

function onChange() {}
const Demo = defineComponent({
  setup() {
    const checked = ref(true);
    return () => <Switch v-model={[checked.value, 'checked']} onChange={onChange} />;
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorPrimary', 'controlOutline', 'colorBgContainer'],
  key: 'default',
};

export default componentDemo;
