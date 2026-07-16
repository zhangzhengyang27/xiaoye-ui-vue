import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class SpinnerIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    SpinnerIcon: DefineComponent<SpinnerIcon>;
  }
}

export default SpinnerIcon;
