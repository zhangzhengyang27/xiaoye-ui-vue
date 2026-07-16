import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class HeadingIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    HeadingIcon: DefineComponent<HeadingIcon>;
  }
}

export default HeadingIcon;
