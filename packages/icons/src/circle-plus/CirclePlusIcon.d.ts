import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class CirclePlusIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    CirclePlusIcon: DefineComponent<CirclePlusIcon>;
  }
}

export default CirclePlusIcon;
