import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class PoundSterlingIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    PoundSterlingIcon: DefineComponent<PoundSterlingIcon>;
  }
}

export default PoundSterlingIcon;
