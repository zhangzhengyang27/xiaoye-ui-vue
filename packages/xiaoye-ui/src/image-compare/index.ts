import type { App, Plugin } from 'vue';
import ImageCompare from './ImageCompare';
import { registerComponent } from '../_util/registerComponent';

export type { ImageCompareProps } from './interface';

const XYImageCompare = ImageCompare as any;

XYImageCompare.install = (app: App) => {
  registerComponent(app, ImageCompare);
  return app;
};

export default XYImageCompare as typeof ImageCompare & Plugin;
