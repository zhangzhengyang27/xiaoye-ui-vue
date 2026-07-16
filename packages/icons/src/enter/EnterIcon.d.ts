import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class EnterIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    EnterIcon: DefineComponent<EnterIcon>;
  }
}

export default EnterIcon;
