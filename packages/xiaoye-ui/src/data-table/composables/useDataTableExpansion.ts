import { resolveFieldData } from '@xiaoye-ui/utils/object';
import type { DataTableContext } from './types';

export function useDataTableExpansion(ctx: DataTableContext) {
  const { props, emit, equalsData } = ctx;

  function toggleRow(event: any) {
    const { expanded, ...rest } = event;
    const rowData = event.data;
    let expandedRows;

    if (props.dataKey) {
      const value = resolveFieldData(rowData, props.dataKey);

      expandedRows = props.expandedRows ? { ...props.expandedRows } : {};
      expanded ? (expandedRows[value] = true) : delete expandedRows[value];
    } else {
      expandedRows = props.expandedRows ? [...(props.expandedRows as any[])] : [];
      expanded
        ? expandedRows.push(rowData)
        : (expandedRows = expandedRows.filter((d: any) => !equalsData(rowData, d)));
    }

    emit('update:expandedRows', expandedRows);
    expanded ? emit('row-expand', rest) : emit('row-collapse', rest);
  }

  function toggleRowGroup(e: any) {
    const event = e.originalEvent;
    const data = e.data;
    const groupFieldValue = resolveFieldData(data, props.groupRowsBy);
    let _expandedRowGroups = props.expandedRowGroups ? [...props.expandedRowGroups] : [];

    if (isRowGroupExpanded(data)) {
      _expandedRowGroups = _expandedRowGroups.filter(group => group !== groupFieldValue);
      emit('update:expandedRowGroups', _expandedRowGroups);
      emit('rowgroup-collapse', { originalEvent: event, data: groupFieldValue });
    } else {
      _expandedRowGroups.push(groupFieldValue);
      emit('update:expandedRowGroups', _expandedRowGroups);
      emit('rowgroup-expand', { originalEvent: event, data: groupFieldValue });
    }
  }

  function isRowGroupExpanded(rowData: any): boolean {
    if (props.expandableRowGroups && props.expandedRowGroups) {
      const groupFieldValue = resolveFieldData(rowData, props.groupRowsBy);

      return props.expandedRowGroups.indexOf(groupFieldValue) > -1;
    }

    return false;
  }

  return { toggleRow, toggleRowGroup, isRowGroupExpanded };
}
