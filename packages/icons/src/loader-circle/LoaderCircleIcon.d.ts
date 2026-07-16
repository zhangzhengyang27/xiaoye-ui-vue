import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class LoaderCircleIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    LoaderCircleIcon: DefineComponent<LoaderCircleIcon>;
  }
}

export default LoaderCircleIcon;
