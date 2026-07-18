import type { App, Plugin } from 'vue';
import SplitButton from './SplitButton';
import { splitButtonProps } from './splitButtonTypes';
import { registerComponent } from '../_util/registerComponent';

export { splitButtonProps };
export type {
  SplitButtonProps,
  SplitButtonType,
  SplitButtonTrigger,
  SplitButtonPlacement,
  SplitButtonItem,
} from './splitButtonTypes';

const XYSplitButton = SplitButton as typeof SplitButton & Plugin;

/* istanbul ignore next */
XYSplitButton.install = function (app: App) {
  registerComponent(app, SplitButton);
  return app;
};

export default XYSplitButton;
