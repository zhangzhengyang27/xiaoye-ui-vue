import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class StarIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    StarIcon: DefineComponent<StarIcon>;
  }
}

export default StarIcon;
