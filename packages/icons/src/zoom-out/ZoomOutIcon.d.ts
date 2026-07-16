import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class ZoomOutIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    ZoomOutIcon: DefineComponent<ZoomOutIcon>;
  }
}

export default ZoomOutIcon;
