import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class ArrowRightIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    ArrowRightIcon: DefineComponent<ArrowRightIcon>;
  }
}

export default ArrowRightIcon;
