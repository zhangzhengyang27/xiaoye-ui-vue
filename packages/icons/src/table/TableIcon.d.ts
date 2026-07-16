import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class TableIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    TableIcon: DefineComponent<TableIcon>;
  }
}

export default TableIcon;
