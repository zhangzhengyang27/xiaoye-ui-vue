import { defineComponent } from 'vue';
import { message, Button } from 'xiaoye-ui';
import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    const success = () => {
      message.success('This is an success message');
    };

    return () => <Button onClick={success}>Success</Button>;
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorSuccess'],
  key: 'success',
};

export default componentDemo;
