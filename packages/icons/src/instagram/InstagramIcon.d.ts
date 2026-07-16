import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class InstagramIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    InstagramIcon: DefineComponent<InstagramIcon>;
  }
}

export default InstagramIcon;
