import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class ClockIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    ClockIcon: DefineComponent<ClockIcon>;
  }
}

export default ClockIcon;
