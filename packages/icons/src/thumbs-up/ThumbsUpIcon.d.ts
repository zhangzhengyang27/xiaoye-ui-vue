import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class ThumbsUpIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    ThumbsUpIcon: DefineComponent<ThumbsUpIcon>;
  }
}

export default ThumbsUpIcon;
