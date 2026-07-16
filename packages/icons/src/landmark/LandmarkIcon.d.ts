import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class LandmarkIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    LandmarkIcon: DefineComponent<LandmarkIcon>;
  }
}

export default LandmarkIcon;
