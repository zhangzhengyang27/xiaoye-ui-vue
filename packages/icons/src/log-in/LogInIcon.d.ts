import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class LogInIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    LogInIcon: DefineComponent<LogInIcon>;
  }
}

export default LogInIcon;
