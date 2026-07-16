import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class DirectionsAltIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    DirectionsAltIcon: DefineComponent<DirectionsAltIcon>;
  }
}

export default DirectionsAltIcon;
