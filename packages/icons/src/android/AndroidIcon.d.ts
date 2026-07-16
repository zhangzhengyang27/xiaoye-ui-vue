import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class AndroidIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    AndroidIcon: DefineComponent<AndroidIcon>;
  }
}

export default AndroidIcon;
