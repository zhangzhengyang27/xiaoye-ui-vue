import { defineComponent } from 'vue';
import { message, Button } from 'xiaoye-ui';
import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    const info = () => {
      message.info('This is an info message');
    };

    return () => <Button onClick={info}>Info</Button>;
  },
});
const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorInfo'],
  key: 'info',
};

export default componentDemo;
