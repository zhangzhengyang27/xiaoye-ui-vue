import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class WindowMaximizeIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    WindowMaximizeIcon: DefineComponent<WindowMaximizeIcon>;
  }
}

export default WindowMaximizeIcon;
