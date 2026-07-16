import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class MenuIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    MenuIcon: DefineComponent<MenuIcon>;
  }
}

export default MenuIcon;
