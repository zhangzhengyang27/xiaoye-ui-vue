import type { DefineComponent } from '@xiaoye-ui/core';
import type { Icon } from '@xiaoye-ui/icons/baseicon';

declare class AngleRightIcon extends Icon {}

declare module 'vue' {
  export interface GlobalComponents {
    AngleRightIcon: DefineComponent<AngleRightIcon>;
  }
}

export default AngleRightIcon;
