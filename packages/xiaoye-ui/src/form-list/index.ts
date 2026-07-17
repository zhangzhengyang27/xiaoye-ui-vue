import type { App, Plugin } from 'vue';
import FormList from './FormList';
import { registerComponent } from '../_util/registerComponent';

export { default as formListProps } from './formListTypes';
export type { FormListProps, FormListField, FormListOperation } from './formListTypes';

/* istanbul ignore next */
FormList.install = function (app: App) {
  registerComponent(app, FormList);
  return app;
};

export default FormList as typeof FormList & Plugin;
