import { TimePicker } from 'xiaoye-ui';
import type { ComponentDemo } from '../../interface';

const Demo = () => <TimePicker />;

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorPrimary'],
  key: 'default',
};

export default componentDemo;
