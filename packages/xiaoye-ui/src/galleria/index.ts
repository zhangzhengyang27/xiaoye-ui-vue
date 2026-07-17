import type { App, Plugin } from 'vue';
import Galleria from './Galleria';
import { registerComponent } from '../_util/registerComponent';

export { default as galleriaProps } from './galleriaTypes';
export type {
  GalleriaProps,
  GalleriaPositionType,
  GalleriaResponsiveOptions,
} from './galleriaTypes';

/* istanbul ignore next */
Galleria.install = function (app: App) {
  registerComponent(app, Galleria);
  return app;
};

export default Galleria as typeof Galleria & Plugin;
