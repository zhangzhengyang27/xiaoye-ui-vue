import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class FacebookIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    FacebookIcon: DefineComponent<FacebookIcon>;
  }
}

export default FacebookIcon;
