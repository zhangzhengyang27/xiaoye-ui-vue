import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class RotateCcwIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    RotateCcwIcon: DefineComponent<RotateCcwIcon>;
  }
}

export default RotateCcwIcon;
