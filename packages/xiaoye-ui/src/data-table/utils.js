import { getVNodeProp } from '@xiaoye-ui/core/utils';

const booleanColumnProps = new Set([
  'sortable',
  'showFilterMenu',
  'showFilterOperator',
  'showClearButton',
  'showApplyButton',
  'showFilterMatchModes',
  'showAddButton',
  'excludeGlobalFilter',
  'expander',
  'rowReorder',
  'reorderableColumn',
  'rowEditor',
  'frozen',
  'exportable',
  'hidden',
]);

export function getColumnProp(column, prop) {
  const value = getVNodeProp(column, prop);

  return booleanColumnProps.has(prop) && value === '' ? true : value;
}
