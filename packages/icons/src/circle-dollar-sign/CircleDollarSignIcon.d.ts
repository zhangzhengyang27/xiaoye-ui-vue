import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class CircleDollarSignIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    CircleDollarSignIcon: DefineComponent<CircleDollarSignIcon>;
  }
}

export default CircleDollarSignIcon;
