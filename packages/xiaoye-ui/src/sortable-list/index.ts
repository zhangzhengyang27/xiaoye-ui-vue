import type { App, Plugin } from 'vue';
import SortableList from './SortableList';
import SortableItem from './SortableItem';
import { registerComponent } from '../_util/registerComponent';

export { default as sortableListProps } from './sortableListTypes';
export { sortableItemProps } from './sortableListTypes';
export type {
  SortableListProps,
  SortableItemProps,
  SortableAxis,
  SortableListItem,
  SortableListUpdateEvent,
  SortableListDragEvent,
} from './sortableListTypes';

/* istanbul ignore next */
SortableList.install = function (app: App) {
  registerComponent(app, SortableList);
  registerComponent(app, SortableItem);
  return app;
};

export default SortableList as typeof SortableList & Plugin;
export { SortableItem };
