import type { App, Plugin } from 'vue';
import Rating from './Rating';
import { registerComponent } from '../_util/registerComponent';

export type { RatingProps } from './interface';

const XYRating = Rating as any;

XYRating.install = (app: App) => {
  registerComponent(app, Rating);
  return app;
};

export default XYRating as typeof Rating & Plugin;
