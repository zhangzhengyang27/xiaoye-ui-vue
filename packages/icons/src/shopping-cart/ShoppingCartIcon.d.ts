import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class ShoppingCartIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    ShoppingCartIcon: DefineComponent<ShoppingCartIcon>;
  }
}

export default ShoppingCartIcon;
