import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class BlankIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    BlankIcon: DefineComponent<BlankIcon>;
  }
}

export default BlankIcon;
