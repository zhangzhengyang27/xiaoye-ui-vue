import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class ThLargeIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    ThLargeIcon: DefineComponent<ThLargeIcon>;
  }
}

export default ThLargeIcon;
