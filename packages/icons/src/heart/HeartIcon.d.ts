import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class HeartIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    HeartIcon: DefineComponent<HeartIcon>;
  }
}

export default HeartIcon;
