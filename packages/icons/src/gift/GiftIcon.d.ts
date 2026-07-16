import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class GiftIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    GiftIcon: DefineComponent<GiftIcon>;
  }
}

export default GiftIcon;
