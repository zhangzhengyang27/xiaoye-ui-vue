import { defineComponent } from 'vue';
import { message, Button } from 'xiaoye-ui';
import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    const info = () => {
      message.info('Hello, Xiaoye UI!');
    };

    return () => <Button onClick={info}>Info</Button>;
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorText', 'colorBgElevated'],
  key: 'message',
};

export default componentDemo;
