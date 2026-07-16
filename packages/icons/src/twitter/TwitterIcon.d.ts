import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class TwitterIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    TwitterIcon: DefineComponent<TwitterIcon>;
  }
}

export default TwitterIcon;
