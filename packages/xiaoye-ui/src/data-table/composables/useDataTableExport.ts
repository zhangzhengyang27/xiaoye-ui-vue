import { exportCSV } from '@xiaoye-ui/utils/dom';
import { resolveFieldData } from '@xiaoye-ui/utils/object';
import type { DataTableContext } from './types';

export function useDataTableExport(ctx: DataTableContext) {
  const { props, columns, processedData, columnProp } = ctx;

  function generateCSV(options: any, data?: any[]): string {
    let csv = '﻿';

    if (!data) {
      data = processedData.value;

      if (options && options.selectionOnly) data = (props.selection as any[]) || [];
      else if (props.frozenValue) data = data ? [...props.frozenValue, ...data] : props.frozenValue;
    }

    //headers
    let headerInitiated = false;

    for (let i = 0; i < columns.value.length; i++) {
      const column = columns.value[i];

      if (columnProp(column, 'exportable') !== false && columnProp(column, 'field')) {
        if (headerInitiated) csv += props.csvSeparator;
        else headerInitiated = true;

        csv +=
          '"' +
          (columnProp(column, 'exportHeader') ||
            columnProp(column, 'header') ||
            columnProp(column, 'field')) +
          '"';
      }
    }

    //body
    if (data) {
      data.forEach(record => {
        csv += '\n';
        let rowInitiated = false;

        for (let i = 0; i < columns.value.length; i++) {
          const column = columns.value[i];

          if (columnProp(column, 'exportable') !== false && columnProp(column, 'field')) {
            if (rowInitiated) csv += props.csvSeparator;
            else rowInitiated = true;

            let cellData = resolveFieldData(record, columnProp(column, 'field'));

            if (cellData != null) {
              if (props.exportFunction) {
                cellData = props.exportFunction({
                  data: cellData,
                  field: columnProp(column, 'field'),
                });
              } else cellData = String(cellData).replace(/"/g, '""');
            } else cellData = '';

            csv += '"' + cellData + '"';
          }
        }
      });
    }

    //footers
    let footerInitiated = false;

    for (let i = 0; i < columns.value.length; i++) {
      const column = columns.value[i];

      if (i === 0) csv += '\n';

      if (columnProp(column, 'exportable') !== false && columnProp(column, 'exportFooter')) {
        if (footerInitiated) csv += props.csvSeparator;
        else footerInitiated = true;

        csv +=
          '"' +
          (columnProp(column, 'exportFooter') ||
            columnProp(column, 'footer') ||
            columnProp(column, 'field')) +
          '"';
      }
    }

    return csv;
  }

  function exportCSVFunc(options?: any, data?: any[]) {
    const csv = generateCSV(options, data);
    exportCSV(csv, props.exportFilename);
  }

  return { generateCSV, exportCSVFunc };
}
