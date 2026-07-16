import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class VolumeXIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    VolumeXIcon: DefineComponent<VolumeXIcon>;
  }
}

export default VolumeXIcon;
