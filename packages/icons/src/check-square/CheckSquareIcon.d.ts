import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class CheckSquareIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    CheckSquareIcon: DefineComponent<CheckSquareIcon>;
  }
}

export default CheckSquareIcon;
