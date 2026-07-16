import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class StarFillIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    StarFillIcon: DefineComponent<StarFillIcon>;
  }
}

export default StarFillIcon;
