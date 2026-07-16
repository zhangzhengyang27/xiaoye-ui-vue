import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class MinimizeIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    MinimizeIcon: DefineComponent<MinimizeIcon>;
  }
}

export default MinimizeIcon;
