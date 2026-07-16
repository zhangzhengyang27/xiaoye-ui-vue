import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class SquareMinusIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    SquareMinusIcon: DefineComponent<SquareMinusIcon>;
  }
}

export default SquareMinusIcon;
