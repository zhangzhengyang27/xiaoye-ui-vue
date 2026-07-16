import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class CirclePauseIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    CirclePauseIcon: DefineComponent<CirclePauseIcon>;
  }
}

export default CirclePauseIcon;
