import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class SwapIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    SwapIcon: DefineComponent<SwapIcon>;
  }
}

export default SwapIcon;
