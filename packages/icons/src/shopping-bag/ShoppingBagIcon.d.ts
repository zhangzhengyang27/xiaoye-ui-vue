import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class ShoppingBagIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    ShoppingBagIcon: DefineComponent<ShoppingBagIcon>;
  }
}

export default ShoppingBagIcon;
