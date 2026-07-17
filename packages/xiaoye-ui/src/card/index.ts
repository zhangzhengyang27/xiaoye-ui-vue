import type { App, Plugin } from 'vue';
import Card from './Card';
import Meta from './Meta';
import Grid from './Grid';
import { registerComponent } from '../_util/registerComponent';

export type { CardProps } from './Card';

Card.Meta = Meta;
Card.Grid = Grid;

/* istanbul ignore next */
Card.install = function (app: App) {
  registerComponent(app, Card);
  registerComponent(app, Meta);
  registerComponent(app, Grid);
  return app;
};

export { Meta as CardMeta, Grid as CardGrid };

export default Card as typeof Card &
  Plugin & {
    readonly Meta: typeof Meta;
    readonly Grid: typeof Grid;
  };
