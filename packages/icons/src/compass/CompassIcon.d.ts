import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class CompassIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    CompassIcon: DefineComponent<CompassIcon>;
  }
}

export default CompassIcon;
