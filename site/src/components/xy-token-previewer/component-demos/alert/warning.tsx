import { defineComponent } from 'vue';
import { Alert, Space } from 'xiaoye-ui';
import type { ComponentDemo } from '../../interface';

const Demo = defineComponent({
  setup() {
    return () => (
      <Space direction={'vertical'}>
        <Alert message="Warning" type="warning" showIcon closable />
        <Alert
          message="Warning"
          description="This is a warning notice about copywriting."
          type="warning"
          showIcon
          closable
        />
      </Space>
    );
  },
});

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorWarning', 'colorWarningBorder', 'colorWarningBg'],
  key: 'warning',
};

export default componentDemo;
