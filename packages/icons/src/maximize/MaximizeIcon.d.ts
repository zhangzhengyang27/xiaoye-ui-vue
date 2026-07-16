import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class MaximizeIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    MaximizeIcon: DefineComponent<MaximizeIcon>;
  }
}

export default MaximizeIcon;
