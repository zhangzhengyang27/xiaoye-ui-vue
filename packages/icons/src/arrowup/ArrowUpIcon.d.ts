import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class ArrowUpIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    ArrowUpIcon: DefineComponent<ArrowUpIcon>;
  }
}

export default ArrowUpIcon;
