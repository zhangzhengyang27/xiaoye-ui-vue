import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class CheckIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    CheckIcon: DefineComponent<CheckIcon>;
  }
}

export default CheckIcon;
