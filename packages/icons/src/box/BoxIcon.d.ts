import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class BoxIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    BoxIcon: DefineComponent<BoxIcon>;
  }
}

export default BoxIcon;
