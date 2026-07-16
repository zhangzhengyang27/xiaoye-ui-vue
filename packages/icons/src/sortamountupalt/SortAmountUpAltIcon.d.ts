import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class SortAmountUpAltIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    SortAmountUpAltIcon: DefineComponent<SortAmountUpAltIcon>;
  }
}

export default SortAmountUpAltIcon;
