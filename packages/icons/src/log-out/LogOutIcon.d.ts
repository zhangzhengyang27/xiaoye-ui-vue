import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class LogOutIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    LogOutIcon: DefineComponent<LogOutIcon>;
  }
}

export default LogOutIcon;
