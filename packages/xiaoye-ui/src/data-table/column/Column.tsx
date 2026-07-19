import { defineComponent, getCurrentInstance, inject, onMounted, onUnmounted } from 'vue';
import './style';

export default defineComponent({
  name: 'XYColumn',
  inheritAttrs: false,
  props: {
    columnKey: { type: String, default: undefined },
    field: { type: [String, Function], default: undefined },
    sortField: { type: [String, Function], default: undefined },
    filterField: { type: [String, Function], default: undefined },
    dataType: { type: String, default: undefined },
    sortable: { type: Boolean, default: false },
    header: { type: String, default: undefined },
    footer: { type: String, default: undefined },
    style: { type: null, default: undefined },
    class: { type: null, default: undefined },
    headerStyle: { type: null, default: undefined },
    headerClass: { type: null, default: undefined },
    bodyStyle: { type: null, default: undefined },
    bodyClass: { type: null, default: undefined },
    footerStyle: { type: null, default: undefined },
    footerClass: { type: null, default: undefined },
    showFilterMenu: { type: Boolean, default: true },
    showFilterOperator: { type: Boolean, default: true },
    showClearButton: { type: Boolean, default: false },
    showApplyButton: { type: Boolean, default: true },
    showFilterMatchModes: { type: Boolean, default: true },
    showAddButton: { type: Boolean, default: true },
    filterMatchModeOptions: { type: Array, default: undefined },
    maxConstraints: { type: Number, default: 2 },
    excludeGlobalFilter: { type: Boolean, default: false },
    filterHeaderStyle: { type: null, default: undefined },
    filterHeaderClass: { type: null, default: undefined },
    filterMenuStyle: { type: null, default: undefined },
    filterMenuClass: { type: null, default: undefined },
    selectionMode: { type: String, default: undefined },
    hideSelectAll: { type: Boolean, default: false },
    expander: { type: Boolean, default: false },
    colspan: { type: Number, default: undefined },
    rowspan: { type: Number, default: undefined },
    rowReorder: { type: Boolean, default: false },
    rowReorderIcon: { type: String, default: undefined },
    reorderableColumn: { type: Boolean, default: false },
    rowEditor: { type: Boolean, default: false },
    frozen: { type: Boolean, default: false },
    alignFrozen: { type: String, default: 'left' },
    exportable: { type: Boolean, default: true },
    exportHeader: { type: String, default: undefined },
    exportFooter: { type: String, default: undefined },
    filterMatchMode: { type: String, default: undefined },
    hidden: { type: Boolean, default: false },
    getCellProps: { type: Function, default: undefined },
  },
  setup(_props, { slots }) {
    const instance = getCurrentInstance();
    const columns = inject<Set<any>>('$columns', undefined);

    onMounted(() => {
      instance && columns?.add(instance);
    });

    onUnmounted(() => {
      instance && columns?.delete(instance);
    });

    return () => slots.default?.();
  },
});
