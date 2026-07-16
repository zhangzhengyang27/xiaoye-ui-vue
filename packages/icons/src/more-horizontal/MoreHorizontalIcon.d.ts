import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class MoreHorizontalIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    MoreHorizontalIcon: DefineComponent<MoreHorizontalIcon>;
  }
}

export default MoreHorizontalIcon;
