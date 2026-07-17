import { defineComponent } from 'vue';
import type { ColumnGroupProps } from '../vc-table/sugar/ColumnGroup';
import type { CustomSlotsType } from '../_util/type';

export default defineComponent<ColumnGroupProps<any>>({
  name: 'XYTableColumnGroup',
  slots: Object as CustomSlotsType<{
    title?: any;
    default?: any;
  }>,
  __XY_TABLE_COLUMN_GROUP: true,
  render() {
    return null;
  },
});
