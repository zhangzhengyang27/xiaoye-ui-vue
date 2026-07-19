import type { DataTableContext } from './types';

export function useDataTableEditing(ctx: DataTableContext) {
  const { props, emit, d_editingMeta } = ctx;

  function onCellEditInit(event: any) {
    emit('cell-edit-init', event);
  }

  function onCellEditComplete(event: any) {
    emit('cell-edit-complete', event);
  }

  function onCellEditCancel(event: any) {
    emit('cell-edit-cancel', event);
  }

  function onRowEditInit(event: any) {
    const _editingRows = props.editingRows ? [...props.editingRows] : [];

    _editingRows.push(event.data);
    emit('update:editingRows', _editingRows);
    emit('row-edit-init', event);
  }

  function onRowEditSave(event: any) {
    const _editingRows = [...(props.editingRows as any[])];

    _editingRows.splice(ctx.findIndex(event.data, _editingRows), 1);
    emit('update:editingRows', _editingRows);
    emit('row-edit-save', event);
  }

  function onRowEditCancel(event: any) {
    const _editingRows = [...(props.editingRows as any[])];

    _editingRows.splice(ctx.findIndex(event.data, _editingRows), 1);
    emit('update:editingRows', _editingRows);
    emit('row-edit-cancel', event);
  }

  function onEditingMetaChange(event: any) {
    const { data, field, index, editing } = event;
    const editingMeta = { ...d_editingMeta.value };
    let meta = editingMeta[index];

    if (editing) {
      !meta && (meta = editingMeta[index] = { data: { ...data }, fields: [] });
      meta['fields'].push(field);
    } else if (meta) {
      const fields = meta['fields'].filter((f: string) => f !== field);

      !fields.length ? delete editingMeta[index] : (meta['fields'] = fields);
    }

    d_editingMeta.value = editingMeta;
  }

  function clearEditingMetaData() {
    if (props.editMode) {
      d_editingMeta.value = {};
    }
  }

  return {
    onCellEditInit,
    onCellEditComplete,
    onCellEditCancel,
    onRowEditInit,
    onRowEditSave,
    onRowEditCancel,
    onEditingMetaChange,
    clearEditingMetaData,
  };
}
