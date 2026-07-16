import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class GlobeIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    GlobeIcon: DefineComponent<GlobeIcon>;
  }
}

export default GlobeIcon;
