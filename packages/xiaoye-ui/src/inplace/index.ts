import type { App, Plugin } from 'vue';
import Inplace from './Inplace';
import InplaceDisplay from './InplaceDisplay';
import InplaceContent from './InplaceContent';
import { registerComponent } from '../_util/registerComponent';

export { inplaceProps } from './inplaceTypes';
export { inplaceDisplayProps, inplaceContentProps } from './inplaceTypes';
export type {
  InplaceProps,
  InplaceDisplayProps,
  InplaceContentProps,
  DisplayToggleCallback,
} from './inplaceTypes';

Inplace.Display = InplaceDisplay;
Inplace.Content = InplaceContent;

/* istanbul ignore next */
Inplace.install = function (app: App) {
  registerComponent(app, Inplace);
  registerComponent(app, InplaceDisplay);
  registerComponent(app, InplaceContent);
  return app;
};

export { InplaceDisplay, InplaceContent };
export default Inplace as typeof Inplace &
  Plugin & {
    readonly Display: typeof InplaceDisplay;
    readonly Content: typeof InplaceContent;
  };
