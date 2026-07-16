import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class ThumbsDownFillIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    ThumbsDownFillIcon: DefineComponent<ThumbsDownFillIcon>;
  }
}

export default ThumbsDownFillIcon;
