import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class ZoomInIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    ZoomInIcon: DefineComponent<ZoomInIcon>;
  }
}

export default ZoomInIcon;
