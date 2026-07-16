import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class CloudIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    CloudIcon: DefineComponent<CloudIcon>;
  }
}

export default CloudIcon;
