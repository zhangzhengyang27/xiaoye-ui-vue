import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class AlignLeftIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    AlignLeftIcon: DefineComponent<AlignLeftIcon>;
  }
}

export default AlignLeftIcon;
