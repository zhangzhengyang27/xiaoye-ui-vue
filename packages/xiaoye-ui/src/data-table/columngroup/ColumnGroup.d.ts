/**
 *
 * Columns can be grouped at header and footer sections by defining a ColumnGroup component.
 * It is a helper component for DataTable.
 *
 * [Live Demo](https://www.xiaoye-ui/datatable/)
 * @module columngroup
 *
 */
import type { DefineComponent, EmitFn, HintedString } from '@xiaoye-ui/core';

/**
 * Defines valid properties in ColumnGroup component.
 */
export interface ColumnGroupProps {
  /**
   * Type of column group
   */
  type?: HintedString<'header' | 'footer'> | undefined;
}

/**
 * Defines valid slots in ColumnGroup component.
 */
export interface ColumnGroupSlots {}

/**
 * Defines valid emits in ColumnGroup component.
 */
export interface ColumnGroupEmitsOptions {}

export declare type ColumnGroupEmits = EmitFn<ColumnGroupEmitsOptions>;

/**
 * **XiaoyeUI - ColumnGroup**
 *
 * _It is a helper component for DataTable._
 *
 * [Live Demo](https://www.xiaoye-ui/datatable/)
 * --- ---
 * ![XiaoyeUI](https://primefaces.org/cdn/primevue/images/logo-100.png)
 *
 * @group Component
 *
 */
declare const ColumnGroup: DefineComponent<ColumnGroupProps, ColumnGroupSlots, ColumnGroupEmits>;

declare module 'vue' {
  export interface GlobalComponents {
    ColumnGroup: DefineComponent<ColumnGroupProps, ColumnGroupSlots, ColumnGroupEmits>;
  }
}

export default ColumnGroup;
