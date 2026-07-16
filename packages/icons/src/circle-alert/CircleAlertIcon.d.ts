import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class CircleAlertIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    CircleAlertIcon: DefineComponent<CircleAlertIcon>;
  }
}

export default CircleAlertIcon;
