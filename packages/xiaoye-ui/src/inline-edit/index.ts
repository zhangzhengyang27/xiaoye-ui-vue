import type { App, Plugin } from 'vue';
import InlineEdit from './InlineEdit';
import { registerComponent } from '../_util/registerComponent';

export { inlineEditProps } from './inlineEditTypes';
export type { InlineEditProps, InlineEditType } from './inlineEditTypes';

/* istanbul ignore next */
InlineEdit.install = function (app: App) {
  registerComponent(app, InlineEdit);
  return app;
};

export default InlineEdit as typeof InlineEdit & Plugin;
