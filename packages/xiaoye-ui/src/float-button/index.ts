import type { App, Plugin } from 'vue';
import FloatButton from './FloatButton';
import FloatButtonGroup from './FloatButtonGroup';
import BackTop from './BackTop';
import { registerComponent } from '../_util/registerComponent';

import type {
  FloatButtonProps,
  FloatButtonShape,
  FloatButtonType,
  FloatButtonGroupProps,
  BackTopProps,
} from './interface';

import type { SizeType as FloatButtonSize } from '../config-provider';

export type {
  FloatButtonProps,
  FloatButtonShape,
  FloatButtonType,
  FloatButtonGroupProps,
  BackTopProps,
  FloatButtonSize,
};

FloatButton.Group = FloatButtonGroup;
FloatButton.BackTop = BackTop;

/* istanbul ignore next */
FloatButton.install = function (app: App) {
  registerComponent(app, FloatButton);
  registerComponent(app, FloatButtonGroup);
  registerComponent(app, BackTop);
  return app;
};

export { FloatButtonGroup, BackTop };

export default FloatButton as typeof FloatButton &
  Plugin & {
    readonly Group: typeof FloatButtonGroup;
    readonly BackTop: typeof BackTop;
  };
