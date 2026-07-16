import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class LinkedinIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    LinkedinIcon: DefineComponent<LinkedinIcon>;
  }
}

export default LinkedinIcon;
