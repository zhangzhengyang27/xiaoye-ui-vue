import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class IdCardIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    IdCardIcon: DefineComponent<IdCardIcon>;
  }
}

export default IdCardIcon;
