import { Empty } from 'xiaoye-ui';
import type { ComponentDemo } from '../../interface';

const Demo = () => <Empty />;

const componentDemo: ComponentDemo = {
  demo: <Demo />,
  tokens: ['colorTextDisabled'],
  key: 'default',
};

export default componentDemo;
