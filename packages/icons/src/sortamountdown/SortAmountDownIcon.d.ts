import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class SortAmountDownIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    SortAmountDownIcon: DefineComponent<SortAmountDownIcon>;
  }
}

export default SortAmountDownIcon;
