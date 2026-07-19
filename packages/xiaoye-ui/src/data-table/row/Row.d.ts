/**
 *
 * Row is used to separate contents.
 *
 * [Live Demo](https://xiaoye-ui/row)
 *
 * @module row
 *
 */
import type { DefineComponent, EmitFn } from '@xiaoye-ui/core';
import type { CSSProperties, VNode } from 'vue';

/**
 * Defines valid properties in Row component.
 */
export interface RowProps {
  /**
   * Vertical alignment.
   */
  align?: 'top' | 'middle' | 'bottom' | 'stretch' | string | undefined;
  /**
   * Spacing between grids.
   */
  gutter?: number | [number, number] | undefined;
  /**
   * Horizontal arrangement.
   * @defaultValue start
   */
  justify?:
    | 'start'
    | 'end'
    | 'center'
    | 'space-around'
    | 'space-between'
    | 'space-evenly'
    | string
    | undefined;
  /**
   * Auto wrap.
   * @defaultValue true
   */
  wrap?: boolean | undefined;
  /**
   * Style class of the component.
   */
  class?: any;
  /**
   * Inline style of the component.
   */
  style?: CSSProperties | string | undefined;
}

/**
 * Defines valid slots in Row component.
 */
export interface RowSlots {
  /**
   * Default content slot.
   */
  default(): VNode[];
}

export interface RowEmitsOptions {}

export declare type RowEmits = EmitFn<RowEmitsOptions>;

/**
 * **XiaoyeUI - Row**
 *
 * _Row is used to separate contents._
 *
 * [Live Demo](https://xiaoye-ui/row)
 * --- ---
 *
 * @group Component
 *
 */
declare const Row: DefineComponent<RowProps, RowSlots, RowEmits>;

declare module 'vue' {
  export interface GlobalComponents {
    Row: DefineComponent<RowProps, RowSlots, RowEmits>;
  }
}

export default Row;
