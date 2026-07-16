import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class BarsIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    BarsIcon: DefineComponent<BarsIcon>;
  }
}

export default BarsIcon;
