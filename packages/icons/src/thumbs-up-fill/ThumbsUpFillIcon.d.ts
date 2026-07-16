import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class ThumbsUpFillIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    ThumbsUpFillIcon: DefineComponent<ThumbsUpFillIcon>;
  }
}

export default ThumbsUpFillIcon;
